/**
 * The fetch wrapper the islands share for calling `netlify/functions/`.
 *
 * Same-origin and identical in every environment, which is why the raw
 * functions path is used rather than a prettier /api/* rewrite: nothing has to
 * branch on import.meta.env, and the existing `connect-src 'self'` CSP in
 * netlify.toml already allows it.
 */
const BASE = '/.netlify/functions';

/** `astro dev` serves no functions, so the request 404s into an HTML page. */
export class ApiUnavailableError extends Error {}

export class ApiError extends Error {
	constructor(
		readonly status: number,
		readonly payload: Record<string, unknown>,
	) {
		super(`request failed with ${status}`);
	}
}

export async function call<T>(path: string, init?: RequestInit): Promise<T> {
	let response: Response;
	try {
		response = await fetch(`${BASE}${path}`, init);
	} catch {
		throw new ApiUnavailableError('network request failed');
	}

	// Astro's 404 comes back as text/html, so the content type has to be checked
	// before response.json() is trusted.
	if (!response.headers.get('content-type')?.includes('application/json')) {
		throw new ApiUnavailableError('no JSON response; functions are probably not running');
	}

	const payload = (await response.json()) as Record<string, unknown>;
	if (!response.ok) throw new ApiError(response.status, payload);
	return payload as T;
}

export function postJson(body: unknown): RequestInit {
	return {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(body),
	};
}
