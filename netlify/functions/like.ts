import type { Context } from '@netlify/functions';

import { FrappeError, likePost } from '../lib/frappe';
import { badGateway, clientIp, json, methodNotAllowed, rateLimited, readJson, serverError } from '../lib/http';
import { isValidPostId } from '../lib/validate';

/** OS does not say when its window ends. Its like windows are one hour and one day. */
const RETRY_AFTER_SEC = 60 * 60;

/**
 * Likes are one-way. There is deliberately no endpoint that decrements: an
 * anonymous counter that can be driven down is a counter an attacker can zero.
 * The browser remembers what it liked in localStorage, which is a UX
 * affordance, not a control — the per-IP-per-post limit in OS is the control.
 */
export default async (req: Request, context: Context): Promise<Response> => {
	if (req.method !== 'POST') return methodNotAllowed(['POST']);

	const body = await readJson(req);
	if (!body) return json({ error: 'bad_request' }, 400);

	const postId = body.postId;
	if (!isValidPostId(postId)) return json({ error: 'invalid_post_id' }, 400);

	try {
		// Returns the new total so the client can reconcile its optimistic
		// increment against what actually landed.
		const likes = await likePost(postId, clientIp(req, context));
		return json({ postId, likes });
	} catch (error) {
		if (!(error instanceof FrappeError)) return serverError('like:write', error);
		if (error.rateLimited) return rateLimited(RETRY_AFTER_SEC);
		return badGateway('like:frappe', error);
	}
};
