import type { Context } from '@netlify/functions';

import { type AvatarTheme, avatarTheme } from '../lib/avatar';
import { FrappeError, getEngagement, type StoredComment } from '../lib/frappe';
import { badGateway, json, methodNotAllowed, serverError } from '../lib/http';
import { isValidPostId } from '../lib/validate';

export interface PublicComment {
	id: number;
	name: string;
	body: string;
	/** Unix seconds. Formatted in the browser with Intl.DateTimeFormat. */
	createdAt: number;
	avatarTheme: AvatarTheme;
}

/**
 * The only place a stored comment becomes a public one, and so the only place
 * the email is dropped. Keep it that way: one function to audit.
 */
export async function toPublicComment(comment: StoredComment): Promise<PublicComment> {
	return {
		id: comment.id,
		name: comment.name,
		body: comment.body,
		createdAt: comment.created_at,
		avatarTheme: await avatarTheme(comment.email),
	};
}

/**
 * Likes and comments in one request. Cold start dominates the latency budget,
 * so two endpoints would mean two invocations and two OS round trips for data
 * that is always rendered together.
 */
export default async (req: Request, _context: Context): Promise<Response> => {
	if (req.method !== 'GET') return methodNotAllowed(['GET']);

	const postId = new URL(req.url).searchParams.get('post') ?? '';
	if (!isValidPostId(postId)) return json({ error: 'invalid_post_id' }, 400);

	try {
		const engagement = await getEngagement(postId);
		return json({
			postId,
			likes: engagement.likes,
			comments: await Promise.all(engagement.comments.map(toPublicComment)),
		});
	} catch (error) {
		if (error instanceof FrappeError) return badGateway('engagement:frappe', error);
		return serverError('engagement:read', error);
	}
};
