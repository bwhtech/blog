/**
 * Custom events for One Dollar Stats.
 *
 * The page-view script is the `stonks.js` tag in `BaseHead.astro`; this is the
 * other half — the handful of moments that are worth counting on their own,
 * not just as another view of a page.
 *
 * Two ways in, and this module is the only one that reaches the global:
 *
 *   - declarative: `data-s-event` on a link or a button, which the script
 *     wires itself. Use that for a click, and nothing here is needed — but
 *     mind the prop syntax below, because the attribute form has no types.
 *   - imperative: `track()` for an outcome, where the event is a request
 *     coming back and not a click.
 *
 * Both are best-effort. The tag is `defer`red and a content blocker may drop
 * it altogether, so `window.stonks` is often absent; nothing here waits for
 * it or retries, because an uncounted signup is better than a broken form.
 */

/** Values are strings on the wire either way, and `;` and `=` separate them. */
export type EventProps = Record<string, string>;

declare global {
	interface Window {
		stonks?: { event: (name: string, props?: EventProps) => void };
	}
}

/**
 * Record an event the reader caused. Safe to call before the tag has loaded,
 * during SSR, or with it blocked — all three are no-ops.
 */
export function track(name: string, props?: EventProps) {
	if (typeof window === 'undefined') return;
	try {
		window.stonks?.event(name, props);
	} catch {
		// Analytics never breaks the interaction it is measuring.
	}
}
