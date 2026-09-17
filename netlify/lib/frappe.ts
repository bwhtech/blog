/**
 * The BWH OS calls the functions need. OS is a Frappe app; the email list, the
 * likes and the comments live there.
 *
 * Authenticated as a Frappe API user whose only role is `OS Signup API`, so a
 * leaked token can add subscribers, comments and likes, and nothing else.
 * Every write passes the reader's IP, because OS rate-limits by it.
 */
const METHOD_PREFIX = '/api/v2/method/';

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

/**
 * Placements whose form id is fixed here rather than read from the environment.
 * A lead magnet ships with one post and one form, so a variable per post would
 * mean a Netlify change for every post; the id is content, not configuration.
 */
const FORM_ID_FIXED = Object.freeze({
	'upgrade-playbook': 'upgrade-playbook',
});

export type Placement = keyof typeof FORM_ID_ENV | keyof typeof FORM_ID_FIXED;

export interface Signup {
	formId: string;
	email: string;
	firstName?: string;
	sourceUrl?: string;
	utm?: Record<string, string>;
	consentIp: string;
}

/** A visible comment as OS stores it. The email never leaves the functions. */
export interface StoredComment {
	id: number;
	name: string;
	email: string;
	body: string;
	/** Unix seconds. */
	created_at: number;
}

export class FrappeError extends Error {
	constructor(
		readonly status: number,
		/** The Python exception name, e.g. `InvalidEmailAddressError`. */
		readonly type: string,
	) {
		super(`frappe responded with ${status}: ${type || 'no detail'}`);
	}

	/** OS counts requests per reader IP and answers 429 over the limit. */
	get rateLimited(): boolean {
		return this.status === 429;
	}
}

/** Returns the form's success message. */
export async function subscribe(signup: Signup): Promise<string> {
	const data = await post<{ message?: string }>('bwh_os.mailing.api.subscribe', {
		form_id: signup.formId,
		email: signup.email,
		first_name: signup.firstName || null,
		source_url: signup.sourceUrl || null,
		utm: signup.utm ?? null,
		consent_ip: signup.consentIp,
	});
	return data.message ?? '';
}

export function getEngagement(postId: string): Promise<{ likes: number; comments: StoredComment[] }> {
	return get('bwh_os.blog.api.get_engagement', { post_id: postId });
}

export function addComment(comment: {
	postId: string;
	name: string;
	email: string;
	body: string;
	ip: string;
}): Promise<StoredComment> {
	return post('bwh_os.blog.api.add_comment', {
		post_id: comment.postId,
		name: comment.name,
		email: comment.email,
		body: comment.body,
		ip: comment.ip,
	});
}

/** Returns the new like total. */
export function likePost(postId: string, ip: string): Promise<number> {
	return post('bwh_os.blog.api.like_post', { post_id: postId, ip });
}

export function isPlacement(value: unknown): value is Placement {
	return (
		typeof value === 'string' &&
		(Object.hasOwn(FORM_ID_ENV, value) || Object.hasOwn(FORM_ID_FIXED, value))
	);
}

export function formIdFor(placement: Placement): string {
	if (placement in FORM_ID_FIXED) return FORM_ID_FIXED[placement as keyof typeof FORM_ID_FIXED];

	const name = FORM_ID_ENV[placement as keyof typeof FORM_ID_ENV];
	const formId = process.env[name];
	if (!formId) throw new Error(`${name} is not set`);
	return formId;
}

function get<T>(method: string, params: Record<string, string>): Promise<T> {
	return request(`${method}?${new URLSearchParams(params)}`, { method: 'GET' });
}

function post<T>(method: string, body: Record<string, unknown>): Promise<T> {
	return request(method, {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(body),
	});
}

async function request<T>(path: string, init: RequestInit): Promise<T> {
	const { url, token } = config();
	const response = await fetch(`${url}${METHOD_PREFIX}${path}`, {
		...init,
		headers: { ...init.headers, authorization: `token ${token}` },
	});
	if (!response.ok) throw new FrappeError(response.status, await readErrorType(response));
	const payload = (await response.json()) as { data: T };
	return payload.data;
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
