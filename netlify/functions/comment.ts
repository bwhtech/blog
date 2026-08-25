import type { Context } from '@netlify/functions';

import { avatarTheme } from '../lib/avatar';
import { db } from '../lib/db';
import { clientIp, json, methodNotAllowed, rateLimited, readJson, serverError } from '../lib/http';
import { consumeAll } from '../lib/rate-limit';
import { isValidPostId, validateComment } from '../lib/validate';
import type { PublicComment } from './engagement';

/** A form filled faster than this was not filled by a person reading the post. */
const MIN_ELAPSED_MS = 3000;
/** Sanity ceiling per post, well above any thread this blog will see. */
const MAX_PER_POST = 500;

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
		const ip = clientIp(req, context);
		const limit = await consumeAll([
			{ ip, action: 'comment', limit: 3, windowSec: 10 * 60 },
			{ ip, action: 'comment', limit: 10, windowSec: 24 * 60 * 60 },
		]);
		if (!limit.allowed) return rateLimited(limit.retryAfter);

		// The cap is part of the INSERT rather than a preceding SELECT, so it
		// cannot be raced and cannot reject a row that was already written:
		// over the cap the SELECT yields no source row, so nothing is inserted
		// and RETURNING comes back empty.
		const insertResult = await db().execute({
			sql: `INSERT INTO comments (post_id, name, email, body)
			      SELECT ?, ?, ?, ?
			       WHERE (SELECT COUNT(*) FROM comments WHERE post_id = ? AND hidden = 0) < ?
			   RETURNING id, created_at`,
			args: [postId, fields.name, fields.email, fields.body, postId, MAX_PER_POST],
		});

		const row = insertResult.rows[0];
		if (!row) return rateLimited(60 * 60);
		return json(
			{
				comment: {
					id: Number(row.id),
					name: fields.name,
					body: fields.body,
					createdAt: Number(row.created_at),
					avatarTheme: await avatarTheme(fields.email),
				} satisfies PublicComment,
			},
			201,
		);
	} catch (error) {
		return serverError('comment:write', error);
	}
};
