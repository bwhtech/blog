import { sha256Hex } from './http';

/**
 * frappe-ui Avatar themes. Comments render initials, not Gravatar: an email
 * hash is reversible against a wordlist, so publishing one would hand out a
 * de-anonymising token for every commenter, which sits badly next to the
 * promise that the email is never shown. A colour index gives the same "same
 * person, same look" affordance and leaks three bits.
 */
const THEMES = ['gray', 'blue', 'green', 'amber', 'red', 'violet'] as const;

export type AvatarTheme = (typeof THEMES)[number];

/** Keyed on the email, so a repeat commenter keeps their colour even if they retype their name. */
export async function avatarTheme(email: string): Promise<AvatarTheme> {
	const hash = await sha256Hex(email.trim().toLowerCase());
	return THEMES[Number.parseInt(hash.slice(0, 8), 16) % THEMES.length];
}
