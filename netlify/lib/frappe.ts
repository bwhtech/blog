/**
 * The BWH OS call a newsletter signup needs. OS is a Frappe app; the list, the
 * forms and their tags live there.
 *
 * Authenticated as a Frappe API user whose only role is `OS Signup API`, so a
 * leaked token can add subscribers and nothing else.
 */
const METHOD = '/api/v2/method/bwh_os.mailing.api.subscribe';

export interface Signup {
	formId: string;
	email: string;
	firstName?: string;
	sourceUrl?: string;
	utm?: Record<string, string>;
	consentIp: string;
}

export class FrappeError extends Error {
	constructor(
		readonly status: number,
		/** The Python exception name, e.g. `InvalidEmailAddressError`. */
		readonly type: string,
	) {
		super(`frappe responded with ${status}: ${type || 'no detail'}`);
	}
}

/** Returns the form's success message. */
export async function subscribe(signup: Signup): Promise<string> {
	const { url, token } = config();
	const response = await fetch(`${url}${METHOD}`, {
		method: 'POST',
		headers: { 'content-type': 'application/json', authorization: `token ${token}` },
		body: JSON.stringify({
			form_id: signup.formId,
			email: signup.email,
			first_name: signup.firstName || null,
			source_url: signup.sourceUrl || null,
			utm: signup.utm ?? null,
			consent_ip: signup.consentIp,
		}),
	});
	if (!response.ok) throw new FrappeError(response.status, await readErrorType(response));
	const payload = (await response.json()) as { data?: { message?: string } };
	return payload.data?.message ?? '';
}

function config(): { url: string; token: string } {
	const url = process.env.FRAPPE_URL;
	const token = process.env.FRAPPE_API_TOKEN;
	if (!url || !token) throw new Error('FRAPPE_URL and FRAPPE_API_TOKEN are not set');
	return { url: url.replace(/\/+$/, ''), token };
}

/** Frappe's v2 error body is `{ errors: [{ type, message }] }`; the token never appears in it. */
async function readErrorType(response: Response): Promise<string> {
	try {
		const payload = (await response.json()) as { errors?: { type?: string }[] };
		return payload.errors?.[0]?.type ?? '';
	} catch {
		return '';
	}
}
