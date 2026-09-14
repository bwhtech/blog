import type { Context } from '@netlify/functions';

import { addComment, FrappeError } from '../lib/frappe';
import { badGateway, clientIp, json, methodNotAllowed, rateLimited, readJson, serverError } from '../lib/http';
import { isValidPostId, validateComment } from '../lib/validate';
import { type PublicComment, toPublicComment } from './engagement';

/** A form filled faster than this was not filled by a person reading the post. */
const MIN_ELAPSED_MS = 3000;
/** OS does not say when its window ends. Its shortest comment window is 10 minutes. */
const RETRY_AFTER_SEC = 10 * 60;

/**
 * Checks the two bot signals the form carries: an off-screen field a person
 * never sees, and how long the form was on screen before it was submitted.
 */
function looksAutomated(body: Record<string, unknown>): string | undefined {
	if (typeof body.hp_url === 'string' && body.hp_url.trim() !== '') return 'honeypot';
	const elapsed = Number(body.elapsedMs);
	if (!Number.isFinite(elapsed) || elapsed < MIN_ELAPSED_MS) return 'too_fast';
	return undefined;
}

export default async (req: Request, context: Context): Promise<Response> => {
	if (req.method !== 'POST') return methodNotAllowed(['POST']);

	const body = await readJson(req);
	if (!body) return json({ error: 'bad_request' }, 400);

	const postId = body.postId;
	if (!isValidPostId(postId)) return json({ error: 'invalid_post_id' }, 400);

	// Checked before validation so a bot never learns which field it got wrong.
	const automated = looksAutomated(body);
	if (automated) {
		// Logged, not silent: if this ever fires on real traffic, the function
		// log is the only place that will say so.
		console.warn('comment:rejected', { postId, reason: automated });
		// A 201 with the submitted text echoed back. The bot gets no signal that
		// it failed and no reason to retune, and nothing is written.
		return json(
			{
				comment: {
					id: 0,
					name: String(body.name ?? ''),
					body: String(body.body ?? ''),
					createdAt: Math.floor(Date.now() / 1000),
					avatarTheme: 'gray',
				} satisfies PublicComment,
			},
			201,
		);
	}

	const { fields, errors } = validateComment(body);
	if (!fields) return json({ error: 'validation_failed', fields: errors }, 400);

	try {
		const stored = await addComment({ postId, ...fields, ip: clientIp(req, context) });
		return json({ comment: await toPublicComment(stored) }, 201);
	} catch (error) {
		if (!(error instanceof FrappeError)) return serverError('comment:write', error);
		// Covers the per-IP windows and the cap on comments for one post.
		if (error.rateLimited) return rateLimited(RETRY_AFTER_SEC);
		// OS checks addresses harder than isValidEmail does.
		if (error.type === 'InvalidEmailAddressError') {
			return json(
				{ error: 'validation_failed', fields: { email: 'Please enter a valid email address.' } },
				400,
			);
		}
		return badGateway('comment:frappe', error);
	}
};
