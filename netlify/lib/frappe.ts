/**
 * The BWH OS call a newsletter signup needs. OS is a Frappe app; the list, the
 * forms and their tags live there.
 *
 * Authenticated as a Frappe API user whose only role is `OS Signup API`, so a
 * leaked token can add subscribers and nothing else.
 */
const METHOD = '/api/v2/method/bwh_os.mailing.api.subscribe';

/**
 * Each place the form is mounted, and the environment variable that holds its
 * BWH OS form id. The browser names the placement, never the form, so it cannot
 * sign anyone up to a form the site does not show.
 */
const FORM_ID_ENV = Object.freeze({
	'blog-post': 'OS_FORM_BLOG_POST',
	home: 'OS_FORM_HOME',
	'train-your-team': 'OS_FORM_TRAIN_YOUR_TEAM',
});

export type Placement = keyof typeof FORM_ID_ENV;

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

export function isPlacement(value: unknown): value is Placement {
	return typeof value === 'string' && Object.hasOwn(FORM_ID_ENV, value);
}

export function formIdFor(placement: Placement): string {
	const name = FORM_ID_ENV[placement];
	const formId = process.env[name];
	if (!formId) throw new Error(`${name} is not set`);
	return formId;
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
