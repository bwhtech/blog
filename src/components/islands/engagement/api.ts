export type AvatarTheme = 'gray' | 'blue' | 'green' | 'amber' | 'red' | 'violet';

export interface PublicComment {
	id: number;
	name: string;
	body: string;
	/** Unix seconds. */
	createdAt: number;
	avatarTheme: AvatarTheme;
}

export interface Engagement {
	postId: string;
	likes: number;
	comments: PublicComment[];
}

export interface CommentDraft {
	postId: string;
	name: string;
	email: string;
	body: string;
	/** Off-screen field a person never sees. Always sent, always empty for humans. */
	hp_url: string;
	/** Milliseconds the form was on screen before submit. */
	elapsedMs: number;
}

/**
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

async function call<T>(path: string, init?: RequestInit): Promise<T> {
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

function postJson(body: unknown): RequestInit {
	return {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(body),
	};
}

/**
 * In-memory stand-in used only under `astro dev`, where there is no function to
 * call. It is behind import.meta.env.DEV, so Vite eliminates it from the
 * production bundle; in production ApiUnavailableError surfaces as the island's
 * error state instead.
 */
const stub = new Map<string, Engagement>();

function stubFor(postId: string): Engagement {
	let entry = stub.get(postId);
	if (!entry) {
		entry = {
			postId,
			likes: 12,
			comments: [
				{
					id: 1,
					name: 'Ada Lovelace',
					body: 'Stub comment, served because no Netlify function is running.\n\nRun `netlify dev` and browse port 8888 to talk to the real backend.',
					createdAt: Math.floor(Date.now() / 1000) - 86400,
					avatarTheme: 'violet',
				},
				{
					id: 2,
					name: 'Grace Hopper',
					body: 'A second one, so list spacing is visible.',
					createdAt: Math.floor(Date.now() / 1000) - 3600,
					avatarTheme: 'green',
				},
			],
		};
		stub.set(postId, entry);
	}
	return entry;
}

export async function fetchEngagement(postId: string): Promise<Engagement> {
	try {
		return await call<Engagement>(`/engagement?post=${encodeURIComponent(postId)}`);
	} catch (error) {
		if (import.meta.env.DEV && error instanceof ApiUnavailableError) return stubFor(postId);
		throw error;
	}
}

export async function likePost(postId: string): Promise<{ postId: string; likes: number }> {
	try {
		return await call('/like', postJson({ postId }));
	} catch (error) {
		if (import.meta.env.DEV && error instanceof ApiUnavailableError) {
			const entry = stubFor(postId);
			entry.likes += 1;
			return { postId, likes: entry.likes };
		}
		throw error;
	}
}

export async function postComment(draft: CommentDraft): Promise<PublicComment> {
	try {
		const result = await call<{ comment: PublicComment }>('/comment', postJson(draft));
		return result.comment;
	} catch (error) {
		if (import.meta.env.DEV && error instanceof ApiUnavailableError) {
			const entry = stubFor(draft.postId);
			const comment: PublicComment = {
				id: Date.now(),
				name: draft.name,
				body: draft.body,
				createdAt: Math.floor(Date.now() / 1000),
				avatarTheme: 'blue',
			};
			entry.comments.push(comment);
			return comment;
		}
		throw error;
	}
}

/** Field errors keyed by field name, as returned by the comment endpoint. */
export type FieldErrors = Partial<Record<'name' | 'email' | 'body', string>>;

export function fieldErrorsOf(error: unknown): FieldErrors | undefined {
	if (error instanceof ApiError && error.payload.error === 'validation_failed') {
		return (error.payload.fields ?? {}) as FieldErrors;
	}
	return undefined;
}

export function messageOf(error: unknown): string {
	if (error instanceof ApiError) {
		if (error.payload.error === 'rate_limited') {
			return 'That is a few too many in a short while. Please try again in a bit.';
		}
		if (error.payload.error === 'invalid_post_id') return 'This post could not be identified.';
	}
	return 'Something went wrong. Please try again.';
}
