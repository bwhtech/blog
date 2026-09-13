import { ApiError, ApiUnavailableError, call, postJson } from '../http';

export interface SubscribeDraft {
	email: string;
	/** Where the form sits. The function maps it to a BWH OS signup form. */
	placement: Placement;
	first_name: string;
	/** The page the form sat on. */
	source_url: string;
	utm: Record<string, string>;
	/** Off-screen field a person never sees. Always sent, always empty for humans. */
	hp_url: string;
}

export type Placement = 'blog-post' | 'home' | 'train-your-team';

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
const FALLBACK_MESSAGE = 'Thanks for subscribing!';

/** Returns the message to show the reader. */
export async function subscribe(draft: SubscribeDraft): Promise<string> {
	try {
		const reply = await call<{ ok: true; message: string }>('/subscribe', postJson(draft));
		return reply.message || FALLBACK_MESSAGE;
	} catch (error) {
		if (import.meta.env.DEV && error instanceof ApiUnavailableError) return stubSubscribe(draft);
		throw error;
	}
}

/** The page URL and its UTM tags, read at submit time so client-side navigation is covered. */
export function currentPage(): { source_url: string; utm: Record<string, string> } {
	const url = new URL(window.location.href);
	const utm: Record<string, string> = {};
	for (const key of UTM_KEYS) {
		const value = url.searchParams.get(key);
		if (value) utm[key] = value;
	}
	url.hash = '';
	return { source_url: url.toString(), utm };
}

export function messageOf(error: unknown): string {
	if (error instanceof ApiError) {
		switch (error.payload.error) {
			case 'invalid_email':
				return 'Please enter a valid email address.';
			case 'form_closed':
				return 'This signup is closed right now.';
			case 'rate_limited':
				return 'That is a few too many in a short while. Please try again in a bit.';
			case 'upstream_error':
				return 'The newsletter service did not answer. Please try again in a minute.';
		}
	}
	return 'Something went wrong. Please try again.';
}

/** Long enough to see the button's loading state. */
const STUB_DELAY_MS = 800;
/** The one address the stub refuses, so the error state can be seen too. */
const STUB_FAILING_EMAIL = 'fail@example.com';

/**
 * Stand-in used only under `astro dev`, where there is no function to call.
 * Behind import.meta.env.DEV, so Vite drops it from the production bundle; in
 * production ApiUnavailableError surfaces as the form's error state instead.
 */
async function stubSubscribe(draft: SubscribeDraft): Promise<string> {
	console.info('newsletter: stub subscribe, no Netlify function is running', draft);
	await new Promise((resolve) => setTimeout(resolve, STUB_DELAY_MS));
	if (draft.email.trim().toLowerCase() === STUB_FAILING_EMAIL) {
		throw new ApiError(502, { error: 'upstream_error' });
	}
	return FALLBACK_MESSAGE;
}
