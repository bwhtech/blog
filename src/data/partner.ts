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
		'Senior help on tap for the people building on Frappe: group office hours, pull-request review and a private channel for the confidential parts.',
	/**
	 * Two ways to pay for the same six months. Upfront is listed first and is
	 * the default: it is five months' price for six, and there is nothing to
	 * chase.
	 */
	payment: [
		{
			label: 'Upfront',
			india: '₹1,50,000',
			elsewhere: '$3,750',
			note: 'for the full 6 months, paid before the channel opens',
			featured: true,
		},
		{
			label: 'Monthly',
			india: '₹30,000 / month',
			elsewhere: '$750 / month',
			note: 'on a 6-month agreement, auto-debited',
			featured: false,
		},
	],
	includes: [
		'Two group office hours a month with Hussain, questions submitted ahead, recorded',
		'A private channel for anything client-specific, answered within one business day',
		'Pull-request review, up to 4 PRs a month',
		'2 seats per quarter in any public BWH cohort',
		'Early access to all cohort recordings and the BWH Pro library',
		'Upgrade and migration guidance, v15 to v16 and onward',
	],
	/** Quoted separately; the page links to where. */
	excludes: 'Implementation work, on-call and production incident response are not included.',
	cta: { label: 'Book A Call', href: MEET },
};

/**
 * The upsell: everything above, plus the hour that is yours alone. Rendered as
 * a smaller card under the plan; the base plan stays the headline.
 */
export const PLUS = {
	title: 'Partner Plan Plus',
	format: 'Retainer',
	blurb: 'For teams that want a private hour, not a shared one.',
	payment: [
		{ label: 'Upfront', india: '₹2,50,000', elsewhere: '$6,250', note: 'for the full 6 months' },
		{
			label: 'Monthly',
			india: '₹50,000 / month',
			elsewhere: '$1,250 / month',
			note: 'on a 6-month agreement',
		},
	],
	includes: [
		'Everything in the Partner Plan',
		'One private one-hour call a month with Hussain, yours alone',
		'Pull-request review, up to 8 PRs a month',
	],
	cta: { label: 'Book A Call', href: MEET },
};

export interface Step {
	title: string;
	detail: string;
}

export const STEPS: Step[] = [
	{ title: 'Book a call', detail: 'A 30-minute call to confirm fit and team size.' },
	{
		title: 'Sign and start',
		detail:
			'Sign the 6-month agreement and pay, upfront or the first month. Your private channel is created within two business days.',
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
	{
		question: 'Are office hours private?',
		answer:
			'No. The two monthly calls are shared with the other partners and recorded, so they are for framework questions, upgrades and patterns. Anything about your clients or your code goes through your private channel and PR review, which are yours alone. Partner Plan Plus adds a private hour a month.',
	},
	{
		question: 'When are the office hours?',
		answer:
			'Fixed slots, the second and fourth Wednesday of the month at 4pm IST, so Gulf and European mornings work. Submit questions in your channel beforehand; walk-in questions come after.',
	},
	{
		question: 'Do office hours roll over?',
		answer: 'No. Recordings are shared with every partner, so a missed call is not lost. The private hour on Plus expires each month.',
	},
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
		question: 'How do we pay?',
		answer:
			'Upfront for the six months (₹1,50,000 in India, $3,750 elsewhere) or monthly (₹30,000 or $750) on a six-month agreement. Upfront is five months’ price for six. GST applies on Indian invoices.',
	},
	{
		question: 'Can we switch from monthly to upfront?',
		answer: 'Yes, at any point in the term. What you have already paid is credited against the upfront price.',
	},
	{
		question: 'Can we start with one month?',
		answer:
			'No. The minimum is six months. The value is the standing relationship, not a one-off call.',
	},
	{
		question: 'Are refunds possible?',
		answer: 'No. You can pause once per term instead, and the term extends by the length of the pause.',
	},
];
