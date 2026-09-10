import { ApiError, ApiUnavailableError, call, postJson } from '../http';

export interface SubscribeDraft {
	email: string;
	/** The page the form sat on. Kit records it as the subscriber's referrer. */
	source: string;
	/** Off-screen field a person never sees. Always sent, always empty for humans. */
	hp_url: string;
}

export async function subscribe(draft: SubscribeDraft): Promise<void> {
	try {
		await call<{ ok: true }>('/subscribe', postJson(draft));
	} catch (error) {
		if (import.meta.env.DEV && error instanceof ApiUnavailableError) return stubSubscribe(draft);
		throw error;
	}
}

export function messageOf(error: unknown): string {
	if (error instanceof ApiError) {
		switch (error.payload.error) {
			case 'invalid_email':
				return 'Please enter a valid email address.';
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
async function stubSubscribe(draft: SubscribeDraft): Promise<void> {
	console.info('newsletter: stub subscribe, no Netlify function is running', draft);
	await new Promise((resolve) => setTimeout(resolve, STUB_DELAY_MS));
	if (draft.email.trim().toLowerCase() === STUB_FAILING_EMAIL) {
		throw new ApiError(502, { error: 'upstream_error' });
	}
}
