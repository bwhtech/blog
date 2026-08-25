import type { Context } from '@netlify/functions';

import { db } from '../lib/db';
import { clientIp, json, methodNotAllowed, rateLimited, readJson, serverError } from '../lib/http';
import { consumeAll } from '../lib/rate-limit';
import { isValidPostId } from '../lib/validate';

/**
 * Likes are one-way. There is deliberately no endpoint that decrements: an
 * anonymous counter that can be driven down is a counter an attacker can zero.
 * The browser remembers what it liked in localStorage, which is a UX
 * affordance, not a control — the per-IP-per-post window below is the control.
 */
export default async (req: Request, context: Context): Promise<Response> => {
	if (req.method !== 'POST') return methodNotAllowed(['POST']);

	const body = await readJson(req);
	if (!body) return json({ error: 'bad_request' }, 400);

	const postId = body.postId;
	if (!isValidPostId(postId)) return json({ error: 'invalid_post_id' }, 400);

	try {
		const ip = clientIp(req, context);
		const limit = await consumeAll([
			{ ip, action: 'like', limit: 30, windowSec: 60 * 60 },
			{ ip, action: 'like', extra: postId, limit: 3, windowSec: 24 * 60 * 60 },
		]);
		if (!limit.allowed) return rateLimited(limit.retryAfter);

		// Atomic, and returns the new total so the client can reconcile its
		// optimistic increment against what actually landed.
		const result = await db().execute({
			sql: `INSERT INTO post_likes (post_id, likes, updated_at)
			      VALUES (?, 1, unixepoch())
			      ON CONFLICT(post_id) DO UPDATE
			        SET likes = likes + 1, updated_at = unixepoch()
			      RETURNING likes`,
			args: [postId],
		});

		return json({ postId, likes: Number(result.rows[0]?.likes ?? 0) });
	} catch (error) {
		return serverError('like:write', error);
	}
};
