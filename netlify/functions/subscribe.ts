import type { Context } from '@netlify/functions';

import {
	badGateway,
	clientIp,
	json,
	methodNotAllowed,
	rateLimited,
	readJson,
	serverError,
} from '../lib/http';
import { KitError, subscribe } from '../lib/kit';
import { consumeAll } from '../lib/rate-limit';
import { isValidEmail, isValidSource, normalizeEmail } from '../lib/validate';

/**
 * Newsletter signup. The browser posts an address and the page it came from;
 * both go to Kit. The reply is deliberately terse — `{ ok: true }` — so nothing
 * about the list, such as whether the address was already on it, reaches the
 * client.
 */
export default async (req: Request, context: Context): Promise<Response> => {
	if (req.method !== 'POST') return methodNotAllowed(['POST']);

	const body = await readJson(req);
	if (!body) return json({ error: 'bad_request' }, 400);

	const email = normalizeEmail(body.email);
	if (!isValidEmail(email)) return json({ error: 'invalid_email' }, 400);

	const source = body.source;
	if (!isValidSource(source)) return json({ error: 'invalid_source' }, 400);

	// The same off-screen field the comment form carries. A filled one gets the
	// success reply and nothing else, so a bot has no signal to retune against.
	if (typeof body.hp_url === 'string' && body.hp_url.trim() !== '') {
		console.warn('subscribe:rejected', { source, reason: 'honeypot' });
		return json({ ok: true });
	}

	try {
		const ip = clientIp(req, context);
		const limit = await consumeAll([
			{ ip, action: 'subscribe', limit: 5, windowSec: 10 * 60 },
			{ ip, action: 'subscribe', limit: 20, windowSec: 24 * 60 * 60 },
		]);
		if (!limit.allowed) return rateLimited(limit.retryAfter);
	} catch (error) {
		return serverError('subscribe:rate-limit', error);
	}

	try {
		await subscribe(email, source);
		return json({ ok: true });
	} catch (error) {
		if (!(error instanceof KitError)) return serverError('subscribe:config', error);
		// Kit checks addresses harder than isValidEmail does. Its 422 is the
		// reader's typo, not an outage, so it is reported as one.
		if (error.status === 422) return json({ error: 'invalid_email' }, 400);
		return badGateway('subscribe:kit', error);
	}
};
