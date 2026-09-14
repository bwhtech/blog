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
import { FrappeError, formIdFor, isPlacement, subscribe } from '../lib/frappe';
import {
	isValidEmail,
	normalizeEmail,
	normalizeFirstName,
	normalizeSourceUrl,
	pickUtm,
} from '../lib/validate';

/**
 * Newsletter signup. The browser posts an address, the placement of the form,
 * the page it came from and any UTM tags. The placement picks the BWH OS form
 * from the environment, and all of it goes to BWH OS. The reply is
 * `{ ok: true, message }` for a new and a known address alike, so nothing about
 * the list reaches the client.
 */
export default async (req: Request, context: Context): Promise<Response> => {
	if (req.method !== 'POST') return methodNotAllowed(['POST']);

	const body = await readJson(req);
	if (!body) return json({ error: 'bad_request' }, 400);

	const email = normalizeEmail(body.email);
	if (!isValidEmail(email)) return json({ error: 'invalid_email' }, 400);

	const placement = body.placement;
	if (!isPlacement(placement)) return json({ error: 'invalid_form' }, 400);

	// The same off-screen field the comment form carries. A filled one gets the
	// success reply and nothing else, so a bot has no signal to retune against.
	if (typeof body.hp_url === 'string' && body.hp_url.trim() !== '') {
		console.warn('subscribe:rejected', { placement, reason: 'honeypot' });
		return json({ ok: true, message: '' });
	}

	try {
		const message = await subscribe({
			formId: formIdFor(placement),
			email,
			firstName: normalizeFirstName(body.first_name),
			sourceUrl: normalizeSourceUrl(body.source_url),
			utm: pickUtm(body.utm),
			consentIp: clientIp(req, context),
		});
		return json({ ok: true, message });
	} catch (error) {
		if (!(error instanceof FrappeError)) return serverError('subscribe:config', error);
		// OS rate-limits by the consent IP. Its shortest window is 10 minutes.
		if (error.rateLimited) return rateLimited(10 * 60);
		// OS checks addresses harder than isValidEmail does. That rejection is the
		// reader's typo, not an outage, so it is reported as one.
		if (error.type === 'InvalidEmailAddressError') return json({ error: 'invalid_email' }, 400);
		if (error.type === 'FormClosedError') return json({ error: 'form_closed' }, 400);
		return badGateway('subscribe:frappe', error);
	}
};
