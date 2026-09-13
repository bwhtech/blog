/**
 * Mirror of CATEGORIES in src/consts.ts. Duplicated rather than imported: a
 * Netlify function is bundled on its own and cannot reach into the Astro source
 * graph. Adding a category means adding it in both places.
 */
const CATEGORIES = Object.freeze([
	'announcements',
	'engineering',
	'stories',
	'thoughts',
	'tips-and-tricks',
	'tutorial',
]);

const POST_ID = /^[a-z0-9][a-z0-9-]*\/[a-z0-9][a-z0-9-]*$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** A BWH OS signup form id, e.g. `blog-post`. OS allows single hyphens only; OS checks again. */
const FORM_ID = /^[a-z0-9][a-z0-9-]{0,59}$/;
const UTM_KEYS = Object.freeze(['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']);
const UTM_VALUE_MAX = 100;
const SOURCE_URL_MAX = 500;
const LINK = /https?:\/\/|www\./i;

const TAB = 9;
const NEWLINE = 10;
const DELETE = 127;
const FIRST_PRINTABLE = 32;

export const NAME_MAX = 60;
export const BODY_MAX = 2000;

/**
 * Drops control characters, which no field has a legitimate use for and which
 * would otherwise let a commenter smuggle invisible content past the length
 * checks. `keepWhitespace` preserves the tabs and newlines a comment body is
 * allowed to contain; single-line fields drop those too.
 */
function stripControl(text: string, keepWhitespace = false): string {
	let output = '';
	for (const character of text) {
		const code = character.codePointAt(0) ?? 0;
		const isControl = code < FIRST_PRINTABLE || code === DELETE;
		const isAllowedWhitespace = keepWhitespace && (code === TAB || code === NEWLINE);
		if (!isControl || isAllowedWhitespace) output += character;
	}
	return output;
}

/**
 * Shape plus a known category, rather than an allowlist generated at build
 * time. A generated list would go stale the moment a post is published without
 * a rebuild, which fails silently and only in production; the worst this can do
 * is admit a junk row keyed by a string that had to name a real category first.
 */
export function isValidPostId(value: unknown): value is string {
	if (typeof value !== 'string' || value.length > 120) return false;
	if (!POST_ID.test(value)) return false;
	return CATEGORIES.includes(value.split('/')[0]);
}

/** Lowercased and stripped of control characters; empty when nothing usable was sent. */
export function normalizeEmail(value: unknown): string {
	return stripControl(String(value ?? '')).trim().toLowerCase();
}

/**
 * Not an RFC 5322 parse on purpose: the address is never displayed, and the
 * one place it is acted on (BWH OS) validates again, so this only has to catch
 * typos and obvious junk.
 */
export function isValidEmail(email: string): boolean {
	return email.length > 0 && email.length <= 254 && EMAIL.test(email);
}

export function isValidFormId(value: unknown): value is string {
	return typeof value === 'string' && FORM_ID.test(value);
}

/** Optional. Empty when nothing usable was sent; a link in place of a name counts as nothing. */
export function normalizeFirstName(value: unknown): string {
	const name = stripControl(String(value ?? '')).trim();
	if (name.length > NAME_MAX || LINK.test(name)) return '';
	return name;
}

/** Only http(s) URLs, without the fragment. Anything else is dropped rather than rejected. */
export function normalizeSourceUrl(value: unknown): string {
	if (typeof value !== 'string' || value.length > SOURCE_URL_MAX) return '';
	try {
		const url = new URL(value);
		if (url.protocol !== 'https:' && url.protocol !== 'http:') return '';
		url.hash = '';
		return url.toString();
	} catch {
		return '';
	}
}

/** Keeps the five standard UTM keys with short string values. Undefined when none are left. */
export function pickUtm(value: unknown): Record<string, string> | undefined {
	if (!value || typeof value !== 'object') return undefined;
	const utm: Record<string, string> = {};
	for (const key of UTM_KEYS) {
		const raw = (value as Record<string, unknown>)[key];
		if (typeof raw !== 'string') continue;
		const cleaned = stripControl(raw).trim().slice(0, UTM_VALUE_MAX);
		if (cleaned) utm[key] = cleaned;
	}
	return Object.keys(utm).length > 0 ? utm : undefined;
}

export interface CommentFields {
	name: string;
	email: string;
	body: string;
}

export type FieldErrors = Partial<Record<keyof CommentFields, string>>;

function countLinks(text: string): number {
	return (text.match(/https?:\/\/|www\./gi) ?? []).length;
}

/**
 * Returns the cleaned fields, or the per-field errors the form renders inline.
 *
 * No HTML sanitising: the body is stored raw and rendered as a Vue text
 * interpolation, which escapes. There is no markdown and no v-html anywhere in
 * this feature, so there is no XSS path to sanitise away.
 */
export function validateComment(input: Record<string, unknown>): {
	fields?: CommentFields;
	errors?: FieldErrors;
} {
	const errors: FieldErrors = {};

	const name = stripControl(String(input.name ?? '')).trim();
	if (name.length < 2) errors.name = 'Please enter your name.';
	else if (name.length > NAME_MAX)
		errors.name = `Please keep your name under ${NAME_MAX} characters.`;
	else if (LINK.test(name)) errors.name = 'Please enter a name, not a link.';

	const email = normalizeEmail(input.email);
	if (!email) errors.email = 'Please enter your email.';
	else if (!isValidEmail(email)) errors.email = 'Please enter a valid email address.';

	const body = stripControl(String(input.body ?? '').replace(/\r\n/g, '\n'), true)
		.replace(/\n{3,}/g, '\n\n')
		.trim();
	if (body.length < 2) errors.body = 'Please write a comment.';
	else if (body.length > BODY_MAX)
		errors.body = `Please keep your comment under ${BODY_MAX} characters.`;
	else if (countLinks(body) > 2) errors.body = 'Please include at most two links.';

	if (Object.keys(errors).length > 0) return { errors };
	return { fields: { name, email, body } };
}
