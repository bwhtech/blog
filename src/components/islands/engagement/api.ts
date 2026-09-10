import { ApiError, ApiUnavailableError, call, postJson } from '../http';

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
