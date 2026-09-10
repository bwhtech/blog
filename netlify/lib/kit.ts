/**
 * The Kit (kit.com, formerly ConvertKit) API v4 calls a newsletter signup needs.
 *
 * Adding to a form requires the subscriber to exist, so a signup is always two
 * requests: an upsert, then the form. The upsert creates them `inactive`, which
 * makes the form's double opt-in email the thing that activates them — created
 * `active`, the confirmation would be a formality. The upsert never changes the
 * state of a subscriber that already exists, so someone already on the list
 * stays active.
 */
const BASE = 'https://api.kit.com/v4';

export class KitError extends Error {
	constructor(
		readonly status: number,
		readonly errors: string[],
	) {
		super(`kit responded with ${status}: ${errors.join('; ') || 'no detail'}`);
	}
}

/** `referrer` is free text on Kit's side; the page name the form sat on goes there. */
export async function subscribe(email: string, referrer: string): Promise<void> {
	const { apiKey, formId } = config();
	await post('/subscribers', { email_address: email, state: 'inactive' }, apiKey);
	await post(`/forms/${formId}/subscribers`, { email_address: email, referrer }, apiKey);
}

function config(): { apiKey: string; formId: string } {
	const apiKey = process.env.KIT_API_KEY;
	const formId = process.env.KIT_FORM_ID;
	if (!apiKey || !formId) throw new Error('KIT_API_KEY and KIT_FORM_ID are not set');
	return { apiKey, formId: encodeURIComponent(formId) };
}

/** The key travels in the header only; it never appears in an error or a log. */
async function post(path: string, body: unknown, apiKey: string): Promise<void> {
	const response = await fetch(`${BASE}${path}`, {
		method: 'POST',
		headers: { 'content-type': 'application/json', 'x-kit-api-key': apiKey },
		body: JSON.stringify(body),
	});
	if (response.ok) return;
	throw new KitError(response.status, await readErrors(response));
}

/** Kit's error body is `{ errors: string[] }`; anything else is reported by status alone. */
async function readErrors(response: Response): Promise<string[]> {
	try {
		const payload = (await response.json()) as { errors?: unknown };
		return Array.isArray(payload.errors) ? payload.errors.map(String) : [];
	} catch {
		return [];
	}
}
