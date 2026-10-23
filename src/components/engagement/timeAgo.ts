/**
 * "3 days ago", with the absolute date for the tooltip. Intl rather than dayjs,
 * which needs a bespoke plugin in astro.config.mjs to resolve at build time.
 */
const DIVISIONS: { amount: number; unit: Intl.RelativeTimeFormatUnit }[] = [
	{ amount: 60, unit: 'second' },
	{ amount: 60, unit: 'minute' },
	{ amount: 24, unit: 'hour' },
	{ amount: 7, unit: 'day' },
	{ amount: 4.34524, unit: 'week' },
	{ amount: 12, unit: 'month' },
	{ amount: Number.POSITIVE_INFINITY, unit: 'year' },
];

export function relativeTime(date: Date): string {
	const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
	let duration = (date.getTime() - Date.now()) / 1000;
	for (const division of DIVISIONS) {
		if (Math.abs(duration) < division.amount) return formatter.format(Math.round(duration), division.unit);
		duration /= division.amount;
	}
	return absoluteTime(date);
}

export function absoluteTime(date: Date): string {
	return new Intl.DateTimeFormat('en', {
		dateStyle: 'medium',
		timeStyle: 'short',
	}).format(date);
}
