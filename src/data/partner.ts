/**
 * Content for /partner.
 *
 * Prices are in the currency they are invoiced in: INR with GST for India,
 * USD for everyone else. Both are written out rather than converted, so a rate
 * change is one edit and the two never drift.
 */

/** Where every call to action on the page goes. */
export const MEET = '/meet';

/**
 * The headline: a retainer, the way senior open-source maintainers run them.
 * It is the one plan with a term, so it is rendered as its own card rather
 * than as one of three equals.
 */
export const PARTNER_PLAN = {
	title: 'Partner Plan',
	/** Shape of the engagement, rendered as a Badge next to the heading. */
	format: 'Retainer',
	blurb:
		'Senior help on tap for the people building on Frappe: office hours, pull-request review and a private channel to ask.',
	price: { india: '₹30,000 / month', elsewhere: '$750 / month' },
	priceNote: '6-month minimum term, invoiced monthly',
	includes: [
		'Biweekly one-hour office hours with Hussain',
		'Priority async Q&A in a private channel, answered within one business day',
		'Pull-request review, up to 4 PRs a month',
		'2 seats per quarter in any public BWH cohort',
		'Early access to all cohort recordings and the BWH Pro library',
		'Upgrade and migration guidance, v15 to v16 and onward',
	],
	/** Quoted separately; the page links to where. */
	excludes: 'Implementation work, on-call and production incident response are not included.',
	cta: { label: 'Book A Call', href: MEET },
};

export interface Program {
	id: string;
	title: string;
	/** One line on what it is for. */
	tagline: string;
	/** Duration and shape, rendered as a Badge. */
	format: string;
	price: { india: string; elsewhere: string };
	/** Anything that qualifies the rate. */
	priceNote?: string;
	highlights: string[];
	/** A closing line under the list. */
	note?: string;
	cta: { label: string; href: string };
}

/** The two programmes a partner firm buys per seat, under the retainer or on their own. */
export const PROGRAMS: Program[] = [
	{
		id: 'onboarding',
		title: 'New Frappe Hire Onboarding',
		tagline: 'Six weeks, self-paced, for developers new to Frappe.',
		format: 'Self-paced · 6 weeks',
		price: { india: '₹15,000 per seat', elsewhere: '$250 per seat' },
		priceNote: 'Partner Plan members get 2 seats per quarter included',
		highlights: [
			'Prerequisites: Git, Markdown, Flask and SQL',
			'The Frappe core curriculum',
			'A Learning-by-Building project: backend, Tailwind frontend and an integration',
			'Assignment review by BWH',
			'A weekly group office hour',
		],
		note: 'The same track BWH uses to onboard its own engineers, and the curriculum behind the private Zero to Hero batches.',
		cta: { label: 'Onboard a developer', href: MEET },
	},
	{
		id: 'zero-to-hero',
		title: 'Private Zero to Hero Batch',
		tagline: 'Six weeks, live, for your own team.',
		format: 'Live · 6 weeks',
		price: { india: '₹50,000 per seat', elsewhere: '$1,000 per seat' },
		priceNote: 'minimum 5 seats',
		highlights: [
			'Live sessions for a partner’s own team',
			'Assignment review',
			'Certification support',
		],
		cta: { label: 'See the programme', href: '/train-your-team' },
	},
];

export interface Step {
	title: string;
	detail: string;
}

export const STEPS: Step[] = [
	{ title: 'Book a call', detail: 'A 30-minute call to confirm fit and team size.' },
	{
		title: 'Sign and start',
		detail:
			'Sign the 6-month agreement and pay the first invoice. Your private channel is created within two business days.',
	},
	{
		title: 'First office hour',
		detail: 'Scheduled in week one. PR review and Q&A start immediately.',
	},
];

/** Who the page is for, in the order a reader is most likely to be one of them. */
export const AUDIENCE: string[] = [
	'Frappe partner firms onboarding or certifying developers',
	'Product teams building on Frappe who need a senior reviewer',
	'Consultancies taking on ERPNext upgrades',
	'In-house ERPNext teams without a senior Frappe engineer',
];

export interface Faq {
	question: string;
	answer: string;
}

export const FAQS: Faq[] = [
	{
		question: 'Can we pause?',
		answer: 'Yes, once per term, for up to one month, with two weeks notice.',
	},
	{
		question: 'What counts as a PR review?',
		answer:
			'Up to 4 pull requests a month, each under about 500 changed lines, reviewed within two business days with written comments. Larger reviews are quoted.',
	},
	{ question: 'Do office hours roll over?', answer: 'No. Unused hours expire each month.' },
	{
		question: 'Who answers questions?',
		answer: 'Hussain, with BWH senior engineers for coverage during travel or leave.',
	},
	{
		question: 'Is there a certification?',
		answer:
			'The Partner Plan does not include Frappe School certification. It can be added at ₹15,000 per seat through BWH, an official Frappe School training partner.',
	},
	{
		question: 'Which currencies?',
		answer: 'INR invoices with GST for India. USD for everyone else.',
	},
	{
		question: 'Can we start with one month?',
		answer:
			'No. The minimum is six months. The value is the standing relationship, not a one-off call.',
	},
];
