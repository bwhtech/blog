/**
 * Which posts this browser has already liked.
 *
 * This is a UX affordance, not a security control: clearing site data or
 * opening a private window resets it. What actually bounds abuse is the
 * per-IP-per-post window in netlify/lib/rate-limit.ts.
 */
const KEY = 'bwh.liked-posts.v1';

/**
 * Safari in private browsing and cookie-blocking extensions throw on any
 * localStorage access, so every call is guarded. Losing the set degrades to a
 * heart that does not persist across reloads, which is survivable; an
 * uncaught exception would take the whole island down, which is not.
 */
function read(): string[] {
	try {
		const raw = localStorage.getItem(KEY);
		const parsed = raw ? JSON.parse(raw) : [];
		return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : [];
	} catch {
		return [];
	}
}

export function hasLiked(postId: string): boolean {
	return read().includes(postId);
}

export function markLiked(postId: string): void {
	try {
		const liked = read();
		if (liked.includes(postId)) return;
		liked.push(postId);
		localStorage.setItem(KEY, JSON.stringify(liked));
	} catch {
		// See above: a browser that refuses storage still gets a working button.
	}
}

const COMMENTER_KEY = 'bwh.commenter.v1';

export interface Commenter {
	name: string;
	email: string;
}

/** Remembers the last name and email typed, so a repeat commenter need not retype them. */
export function readCommenter(): Commenter {
	try {
		const raw = localStorage.getItem(COMMENTER_KEY);
		const parsed = raw ? JSON.parse(raw) : {};
		return {
			name: typeof parsed.name === 'string' ? parsed.name : '',
			email: typeof parsed.email === 'string' ? parsed.email : '',
		};
	} catch {
		return { name: '', email: '' };
	}
}

export function saveCommenter(commenter: Commenter): void {
	try {
		localStorage.setItem(COMMENTER_KEY, JSON.stringify(commenter));
	} catch {
		// Same as above.
	}
}
