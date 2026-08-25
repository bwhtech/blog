import type { Context } from '@netlify/functions';

import { type AvatarTheme, avatarTheme } from '../lib/avatar';
import { db } from '../lib/db';
import { json, methodNotAllowed, serverError } from '../lib/http';
import { isValidPostId } from '../lib/validate';

/** Generous enough that no real post hits it, low enough to bound the payload. */
const MAX_COMMENTS = 200;

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
async function toPublicComment(row: Record<string, unknown>): Promise<PublicComment> {
	return {
		id: Number(row.id),
		name: String(row.name),
		body: String(row.body),
		createdAt: Number(row.created_at),
		avatarTheme: await avatarTheme(String(row.email)),
	};
}

/**
 * Likes and comments in one request. Cold start dominates the latency budget,
 * so two endpoints would mean two invocations and two Turso round trips for
 * data that is always rendered together.
 */
export default async (req: Request, _context: Context): Promise<Response> => {
	if (req.method !== 'GET') return methodNotAllowed(['GET']);

	const postId = new URL(req.url).searchParams.get('post') ?? '';
	if (!isValidPostId(postId)) return json({ error: 'invalid_post_id' }, 400);

	try {
		const [likeRows, commentRows] = await db().batch(
			[
				{ sql: 'SELECT likes FROM post_likes WHERE post_id = ?', args: [postId] },
				{
					sql: `SELECT id, name, email, body, created_at
					        FROM comments
					       WHERE post_id = ? AND hidden = 0
					    ORDER BY created_at ASC, id ASC
					       LIMIT ?`,
					args: [postId, MAX_COMMENTS],
				},
			],
			'read',
		);

		return json({
			postId,
			likes: Number(likeRows.rows[0]?.likes ?? 0),
			comments: await Promise.all(commentRows.rows.map(toPublicComment)),
		});
	} catch (error) {
		return serverError('engagement:read', error);
	}
};
