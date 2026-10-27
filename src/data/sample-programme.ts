/**
 * Sample data for the dashboard the /lab/sheet scene turns into. It is made up,
 * and the page labels it so. A seeded generator keeps it the same on every
 * load, so the numbers a visitor sees do not change between visits.
 *
 * The seven named people from the sheet come first: they are the rows the
 * scene cleans up, so the list opens on them.
 */

export type Status = 'Visited' | 'Follow up' | 'Due';
export type Beneficiary = {
	name: string;
	village: string;
	kind: string;
	who: string;
	/** Days before TODAY, newest first. */
	visits: number[];
	/** The last visit asked for a follow-up. */
	flagged: boolean;
	/** Came from more than one source and was merged. */
	merged?: boolean;
};

export const VILLAGES = ['Kondagaon', 'Bastar', 'Jagdalpur', 'Dantewada', 'Bijapur'];
export const KINDS = ['Food', 'Shelter', 'Health', 'Rescue'];
export const STATUSES: Status[] = ['Visited', 'Follow up', 'Due'];

/** The last day in the data: the sheet's newest visit. */
export const TODAY = new Date(Date.UTC(2026, 2, 12));

export const RANGES = [
	{ id: '4w', label: 'Last 4 weeks', days: 28, bin: 'day' },
	{ id: '12w', label: 'Last 12 weeks', days: 84, bin: 'week' },
	{ id: '26w', label: 'Last 26 weeks', days: 182, bin: 'week' },
] as const;
export type Range = (typeof RANGES)[number];

const NAMED: Beneficiary[] = [
	{ name: 'Lakshmi Bai', village: 'Kondagaon', kind: 'Food', who: 'PK', visits: [0, 30, 61], flagged: false, merged: true },
	{ name: 'Ramesh Netam', village: 'Kondagaon', kind: 'Food', who: 'RS', visits: [9, 40], flagged: false },
	{ name: 'Sunita Kashyap', village: 'Bastar', kind: 'Shelter', who: 'PK', visits: [8, 22, 50], flagged: false },
	{ name: 'Manoj Baghel', village: 'Jagdalpur', kind: 'Health', who: 'AN', visits: [], flagged: false },
	{ name: 'Devki Mandavi', village: 'Bastar', kind: 'Health', who: 'AN', visits: [7, 35], flagged: true },
	{ name: 'Anil Sori', village: 'Dantewada', kind: 'Rescue', who: 'RS', visits: [6, 33, 70], flagged: false },
	{ name: 'Geeta Poyam', village: 'Bijapur', kind: 'Shelter', who: 'PK', visits: [], flagged: false },
];

const FIRST = ['Kamla', 'Budhram', 'Jayanti', 'Mangli', 'Somaru', 'Phoolmati', 'Sukhram', 'Rajni', 'Lachhu', 'Sarita', 'Hidma', 'Bhagwati', 'Chaitu', 'Pushpa', 'Dashrath', 'Sumitra', 'Mangal', 'Rupa', 'Jogi', 'Kavita'];
const LAST = ['Netam', 'Kashyap', 'Baghel', 'Mandavi', 'Sori', 'Poyam', 'Markam', 'Kawasi', 'Nag', 'Thakur', 'Dhruw', 'Usendi'];
const WHO = ['PK', 'RS', 'AN'];

// mulberry32: small, fast and the same everywhere.
function random(seed: number) {
	return () => {
		seed |= 0;
		seed = (seed + 0x6d2b79f5) | 0;
		let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

function generate(count: number): Beneficiary[] {
	const rand = random(17);
	const pick = <T,>(list: readonly T[], weights?: number[]) => {
		if (!weights) return list[Math.floor(rand() * list.length)];
		let roll = rand() * weights.reduce((sum, w) => sum + w, 0);
		for (let i = 0; i < list.length; i++) if ((roll -= weights[i]) < 0) return list[i];
		return list[list.length - 1];
	};
	const people: Beneficiary[] = [];
	for (let i = 0; i < count; i++) {
		// Walk forward through a year of history. Visits come closer together
		// towards today: the team started using the system.
		const visits: number[] = [];
		if (rand() > 0.1) {
			let day = 363 - Math.floor(rand() * 90);
			while (day >= 0) {
				visits.unshift(day);
				day -= 15 + Math.floor(day / 10) + Math.floor(rand() * 18);
			}
		}
		people.push({
			name: `${pick(FIRST)} ${pick(LAST)}`,
			village: pick(VILLAGES, [5, 4, 3, 2.4, 1.6]),
			kind: pick(KINDS, [4, 3, 3, 1]),
			who: pick(WHO),
			visits,
			flagged: rand() < 0.16,
		});
	}
	return people;
}

export const PEOPLE: Beneficiary[] = [...NAMED, ...generate(241)];

export type Filters = { range: Range['id']; village: string | null; kind: string | null };
export const DEFAULT_FILTERS: Filters = { range: '12w', village: null, kind: null };

export const rangeOf = (id: Range['id']) => RANGES.find((range) => range.id === id) ?? RANGES[1];

/** Status within the range: visited in it, visited and flagged, or still due. */
export function statusOf(person: Beneficiary, days: number): Status {
	const seen = person.visits.some((day) => day < days);
	if (!seen) return 'Due';
	return person.flagged && person.visits[0] < days ? 'Follow up' : 'Visited';
}

export function dateOf(daysAgo: number) {
	return new Date(TODAY.getTime() - daysAgo * 86_400_000);
}

export type Slice = ReturnType<typeof slice>;

/** Everything the dashboard draws, for one set of filters. */
export function slice(filters: Filters) {
	const range = rangeOf(filters.range);
	const people = PEOPLE.filter(
		(person) => (!filters.village || person.village === filters.village) && (!filters.kind || person.kind === filters.kind),
	);
	const status = Object.fromEntries(STATUSES.map((s) => [s, 0])) as Record<Status, number>;
	people.forEach((person) => (status[statusOf(person, range.days)] += 1));

	// Visits per day or per week, oldest first.
	const binDays = range.bin === 'day' ? 1 : 7;
	const bins = Array.from({ length: range.days / binDays }, () => 0);
	const previous = { visits: 0 };
	let visits = 0;
	const byVillage = Object.fromEntries(VILLAGES.map((v) => [v, 0])) as Record<string, number>;
	people.forEach((person) =>
		person.visits.forEach((day) => {
			if (day < range.days) {
				visits += 1;
				byVillage[person.village] += 1;
				bins[bins.length - 1 - Math.floor(day / binDays)] += 1;
			} else if (day < range.days * 2) previous.visits += 1;
		}),
	);
	const series = bins.map((value, index) => ({
		value,
		date: dateOf((bins.length - 1 - index) * binDays + (binDays - 1)),
	}));

	return {
		range,
		people,
		status,
		visited: status.Visited + status['Follow up'],
		visits,
		change: previous.visits ? (visits - previous.visits) / previous.visits : 0,
		series,
		villages: VILLAGES.map((village) => ({ village, value: byVillage[village] })).sort((a, b) => b.value - a.value),
	};
}
