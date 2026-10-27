/**
 * Content for the landing page experiments under /lab.
 *
 * Every number here was checked on 2026-10-26 and carries its source. Copy
 * that only the client can give us (what we built for most partners,
 * outcomes, testimonials, partner photos) is `TBD`, which the pages render as
 * a visible placeholder rather than filling the gap with invented blurb, the
 * same convention as src/data/training.ts.
 *
 * Photos in src/assets/landing/ are CS17's own, already published on
 * cs17.org (source repo NagariaHussain/foss_academy): cs17-students.jpg is
 * src/assets/landing/hero.png, cs17-ai-presentation.jpg is
 * posts/_assets/week-13/team-presentation-1.jpg, cs17-teaching.jpg is
 * posts/_assets/week-1/internet-lecture.png and cs17-planning.jpg is
 * posts/_assets/05/blackboard.jpg. Resized only. Confirm consent before the
 * page goes public.
 */
export { TBD } from './training';
import { TBD } from './training';

export const CHECKED_ON = '2026-10-26';

export const HEADLINE = {
	title: 'Problem Solving, for Problem Solvers.',
	lede: "You're changing lives. We turn the Excel sheets, Google Forms and duct-taped scripts slowing you down into one system your team owns.",
};

export const CTA = {
	primary: 'Tell us the problem',
	secondary: 'Book a call',
	meetHref: '/meet',
};

export const LEGAL_NAME = 'BWH Technologies';
export const HOME_TOWN = 'Jagdalpur, Chhattisgarh';

/** Merged pull requests in `frappe/*` repositories by the bwhtech team. */
export const CONTRIBUTIONS = {
	total: 1043,
	source: 'GitHub search: merged PRs in frappe/* by members of github.com/bwhtech',
	byRepo: [
		{ repo: 'Frappe Framework', slug: 'frappe', count: 488 },
		{ repo: 'Wiki', slug: 'wiki', count: 220 },
		{ repo: 'Press (Frappe Cloud)', slug: 'press', count: 115 },
		{ repo: 'Changemakers', slug: 'changemakers', count: 56 },
		{ repo: 'LMS', slug: 'lms', count: 29 },
		{ repo: 'ERPNext', slug: 'erpnext', count: 25 },
		{ repo: 'Print Designer', slug: 'print_designer', count: 23 },
		{ repo: 'Frappe UI', slug: 'frappe-ui', count: 14 },
	],
	byYear: [
		{ year: '2021', count: 96 },
		{ year: '2022', count: 54 },
		{ year: '2023', count: 87 },
		{ year: '2024', count: 23 },
		{ year: '2025', count: 111 },
		{ year: '2026', count: 672 },
	],
};

export const YOUTUBE = {
	subscribers: '10.9K',
	videos: 241,
	views: '1.02M',
	href: 'https://www.youtube.com/@BuildWithHussain',
};

export const OPEN_SOURCE = {
	repos: 48,
	href: 'https://github.com/bwhtech',
	highlights: ['Buzz', 'Nano Press', 'Commera', 'Forms Pro', 'Batwara'],
};

/**
 * Frappe School courses taught by Hussain. `learners` is the enrolment count
 * the school shows: call it enrolments on the page, and never add them up,
 * since one person can take several courses.
 */
export const COURSES = [
	{ title: 'Full-stack App Development with Frappe Framework', learners: 18608 },
	{ title: 'VueJS, TailwindCSS & FrappeUI', learners: 1996 },
	{ title: 'SQL Querying Essentials', learners: 1504 },
	{ title: 'Frappe Framework and Apps for Everyone (Hindi)', learners: 540 },
];

export const STACK = [
	{ label: 'Frappe Framework', src: '/media/train-your-team/logos/framework.svg' },
	{ label: 'ERPNext', src: '/media/train-your-team/logos/erpnext.svg' },
	{ label: 'Frappe HR', src: '/media/train-your-team/logos/hr.svg' },
	{ label: 'Frappe Insights', src: '/media/train-your-team/logos/insights.svg' },
	{ label: 'Frappe UI', src: '/media/train-your-team/logos/frappe-ui.svg' },
];

export type PinKey = 'jagdalpur' | 'bengaluru' | 'chennai' | 'ernakulam' | 'bhuj' | 'gurugram';

export interface Partner {
	id: string;
	name: string;
	/** Full name when `name` is an acronym. */
	fullName?: string;
	sector: string;
	place: string;
	pins: PinKey[];
	/** What we did with them. `TBD` until the partner confirms the wording. */
	work: string;
	/** Longer case-study fields for drawers and detail views. */
	problem: string;
	outcome: string;
	quote: string;
	kind: 'Build' | 'Training' | 'Network' | TBDKind;
	/** Public evidence of the work, when there is some. */
	link?: { label: string; href: string };
	/** Parts of the system, by the names the app uses. */
	modules?: string[];
}

type TBDKind = typeof TBD;

export const PARTNERS: Partner[] = [
	{
		id: 'apf',
		name: 'Azim Premji Foundation',
		sector: 'Homeless care',
		place: 'Bengaluru and Chennai',
		pins: ['bengaluru', 'chennai'],
		work: 'Frappe Changemakers, which our founder built at Frappe in 2022, before BWH: beneficiary and case management for the homeless care programme. Field workers log rescues, cases, food distribution and shelter admissions. The Foundation also funds CS17.',
		problem: TBD,
		outcome: 'Manages thousands of beneficiaries (BWH blog, July 2025).',
		quote: TBD,
		kind: 'Build',
		link: { label: 'github.com/frappe/changemakers · AGPL-3.0', href: 'https://github.com/frappe/changemakers' },
		modules: ['Beneficiary', 'Case', 'Rescue', 'Food distribution', 'Health camp', 'Shelter admission', 'Family reintegration', 'Entitlement request'],
	},
	{
		id: 'cmid',
		name: 'CMID',
		fullName: 'Centre for Migration and Inclusive Development',
		sector: 'Migration',
		place: 'Ernakulam, Kerala',
		pins: ['ernakulam'],
		work: TBD,
		problem: TBD,
		outcome: TBD,
		quote: TBD,
		kind: TBD,
	},
	{
		id: 'kmvs',
		name: 'KMVS',
		fullName: 'Kutch Mahila Vikas Sangathan',
		sector: "Women's collectives",
		place: 'Bhuj, Gujarat',
		pins: ['bhuj'],
		work: TBD,
		problem: TBD,
		outcome: TBD,
		quote: TBD,
		kind: TBD,
	},
	{
		id: 'asha',
		name: 'ASHA',
		fullName: 'Alliance for Sustainable & Holistic Agriculture',
		sector: 'Agriculture',
		place: 'National network, Kisan Swaraj Sammelan',
		pins: [],
		work: TBD,
		problem: TBD,
		outcome: TBD,
		quote: TBD,
		kind: TBD,
	},
	{
		id: 'ilf',
		name: 'ILF',
		fullName: TBD,
		sector: 'Legal',
		place: TBD,
		pins: [],
		work: TBD,
		problem: TBD,
		outcome: TBD,
		quote: TBD,
		kind: TBD,
	},
	{
		id: 'dhwani',
		name: 'Dhwani RIS',
		fullName: 'Dhwani Rural Information Systems',
		sector: 'Tech for development',
		place: 'Gurugram, Haryana',
		pins: ['gurugram'],
		work: TBD,
		problem: TBD,
		outcome: TBD,
		quote: TBD,
		kind: TBD,
	},
	{
		id: 'oasis',
		name: 'OASIS Network',
		fullName: 'Open-source Alliance for Social Innovation & Sustainability',
		sector: 'Open source',
		place: 'National network',
		pins: [],
		work: 'Partner in the network of organisations putting open-source software to work for social development.',
		problem: TBD,
		outcome: TBD,
		quote: TBD,
		kind: 'Network',
	},
	{
		id: 'tbd',
		name: TBD,
		sector: TBD,
		place: TBD,
		pins: [],
		work: TBD,
		problem: TBD,
		outcome: TBD,
		quote: TBD,
		kind: TBD,
	},
];

/** Our own programme. Facts from cs17.org. */
export const CS17 = {
	name: 'CS17',
	href: 'https://cs17.org',
	place: HOME_TOWN,
	/** Week Zero post on cs17.org. The batch size is not published, so it is not shown. */
	started: 'May 2026',
	facts: [
		'18-month residential programme for young women',
		'100% scholarship, laptops and a monthly stipend',
		'Curriculum based on Harvard’s CS50, then Frappe Framework',
		'BCA degree from IGNOU and a 6-month internship',
	],
	/** Practice worksheets with answer keys, made by our own generators (cs17_material_gen). */
	worksheets: 22,
	partners: 'Campus by Bastar Sevak Mandal, funded by Azim Premji Foundation',
};

export interface Offer {
	id: 'systems' | 'training' | 'ai';
	title: string;
	summary: string;
	items: string[];
}

export const OFFERS: Offer[] = [
	{
		id: 'systems',
		title: 'Systems your team owns',
		summary: 'One source of truth instead of fourteen sheets. Built on open source, so there are no per-seat licences.',
		items: [
			'MIS and dashboards',
			'Beneficiary and case management',
			'Field data collection on phones',
			'M&E and donor reports',
			'HR, attendance and payroll with Frappe HR',
			'Accounts, grants and donations with ERPNext',
		],
	},
	{
		id: 'training',
		title: 'Train the trainer',
		summary: 'A few of your people learn to run and change the system, then teach everyone else. We are an official Frappe School partner.',
		items: ['Frappe Framework', 'Frappe HR', 'ERPNext', 'Frappe UI', 'Your own system, hands-on'],
	},
	{
		id: 'ai',
		title: 'AI for education and training',
		summary: 'We build tools that make teaching material, and we teach teams to use AI well. CS17 is where we try it first.',
		items: ['22 CS17 practice worksheets with answer keys, from our own generators', 'Students build with AI tools in class', 'Workshops for your team'],
	},
];

export const PROCESS = [
	{ id: 'listen', title: 'Listen', body: 'You tell us the problem in your words. We sit with the people who fill the sheets.' },
	{ id: 'map', title: 'Map', body: 'Who enters what, who needs to see what, and what the funder asks for.' },
	{ id: 'build', title: 'Build', body: 'On open source, in short cycles you can see and change.' },
	{ id: 'train', title: 'Train', body: 'A few of your people learn to run it, then train everyone else.' },
	{ id: 'handover', title: 'Hand over', body: 'You own the system and the code. Support continues if you want it.' },
];

/** The "what's breaking?" chips, and the part of the system each one adds. */
export const PROBLEMS = [
	{ id: 'sheets', label: 'Our data lives in many Excel sheets', module: 'Beneficiary register', icon: 'register' },
	{ id: 'forms', label: 'The field team uses Google Forms and WhatsApp', module: 'Field app', icon: 'phone' },
	{ id: 'reports', label: 'Donor reports take days to put together', module: 'Reports', icon: 'report' },
	{ id: 'trust', label: 'Nobody trusts the numbers', module: 'Dashboard', icon: 'chart' },
	{ id: 'script', label: 'Someone wrote a script, then left', module: 'Automations', icon: 'bolt' },
	{ id: 'hr', label: 'Attendance and payroll are manual', module: 'Frappe HR', icon: 'people' },
	{ id: 'accounts', label: 'Grants and accounts live in Tally and email', module: 'Accounts and grants', icon: 'ledger' },
	{ id: 'team', label: 'We want our own team to run it', module: 'Training plan', icon: 'teach' },
] as const;

export type ProblemId = (typeof PROBLEMS)[number]['id'];

export const FUNDERS = {
	title: 'Funding a portfolio of grantees?',
	body: 'Give every grantee the same system and see one view across all of them. Azim Premji Foundation funds CS17, our own programme.',
};

export const FAQ = [
	{ q: 'Our data is a mess. Is that a problem?', a: 'It always is. Cleaning and importing the old sheets is part of the work.' },
	{ q: 'Do we need an IT team?', a: 'No. We train a few of your staff to run it. That is the train-the-trainer part.' },
	{ q: 'Who owns the system?', a: 'You do. It runs on open source (Frappe, ERPNext), so there are no per-seat licences and you can take it anywhere.' },
	{ q: 'Will it work for the field team?', a: 'Yes. Field workers fill it in on their phones, and the office sees the same record.' },
	{ q: 'What does it cost?', a: 'It depends on the problem. Tell us the problem and we will send a clear quote.' },
	{ q: 'Can our funder pay for it?', a: 'Often, yes. We can also work with your funder on one system across their grantees.' },
	{ q: 'Is it only Frappe?', a: 'We pick what solves the problem. Most of the time that is an open-source stack such as Frappe and ERPNext.' },
];

export const VARIANTS = [
	{ slug: 'mis', label: 'Impact MIS', blurb: 'The page is a live dashboard.' },
	{ slug: 'sheet', label: 'Sheet → System', blurb: 'A messy spreadsheet scrolls into one clean app.' },
	{ slug: 'theory-of-change', label: 'Theory of change', blurb: 'Our work as the logframe every NGO knows.' },
	{ slug: 'intake', label: 'Intake desk', blurb: 'Tell us what is breaking; watch the system assemble.' },
] as const;

export const isTBD = (value: string) => value === TBD;

/** Partners we can name today; the rest are TBD rows. */
export const NAMED_PARTNERS = PARTNERS.filter((partner) => !isTBD(partner.name));
