/**
 * Content for /partner.
 *
 * A first draft. Nothing here has been agreed: every rate and every FAQ answer
 * is `TBD`, rendered as a visible placeholder like on /train-your-team, so an
 * unfinished part is obvious on the page rather than only in this file.
 */
import { TBD } from './training';

export { TBD };

export interface Plan {
	id: string;
	title: string;
	/** One line on what the plan is for. */
	tagline: string;
	/** Shape of the engagement, rendered as a Badge. */
	format: string;
	/** The three things that define the plan. */
	highlights: string[];
	/** How it is charged. `TBD` until a rate is agreed. */
	price: string;
	/** Label on the card's call to action. */
	cta: string;
}

export const PLANS: Plan[] = [
	{
		id: 'engineering',
		title: 'Engineering Partner',
		tagline: 'We build for your clients.',
		format: 'Project or retainer',
		highlights: [
			'Frappe developers on your project, for a week or a year',
			'Custom apps, integrations, upgrades and reviews',
			'Your name in front of the client, ours behind it',
		],
		price: TBD,
		cta: 'Add BWH to my team',
	},
	{
		id: 'training',
		title: 'Training Partner',
		tagline: 'We train your team and your clients.',
		format: 'Per cohort',
		highlights: [
			'Every programme on Train Your Team, under your name or ours',
			'Official Frappe School training partner',
			'Remote or on-site',
		],
		price: TBD,
		cta: 'Train with BWH',
	},
	{
		id: 'referral',
		title: 'Referral Partner',
		tagline: 'Send us work. Earn a share.',
		format: 'No commitment',
		highlights: [
			'Introduce a client, we take it from there',
			'A share of the first engagement, paid when we are paid',
			'No minimums and no exclusivity',
		],
		price: TBD,
		cta: 'Refer a client',
	},
];

export interface Step {
	title: string;
	detail: string;
}

export const STEPS: Step[] = [
	{ title: 'Book a call', detail: 'Tell us what you do and where you need help.' },
	{ title: 'Pick a plan', detail: 'We agree the plan, the scope and the rate in writing.' },
	{ title: 'Start', detail: 'Most engagements start within two weeks of the call.' },
];

/** Who the page is for, in the order a reader is most likely to be one of them. */
export const AUDIENCE: string[] = [
	'Frappe partners with more work than hands',
	'Agencies adding Frappe to their stack',
	'Consultancies that need training delivered',
	'Product companies building on Frappe',
];

export interface Faq {
	question: string;
	answer: string;
}

export const FAQS: Faq[] = [
	{ question: 'Do you work under our brand?', answer: TBD },
	{ question: 'How do you charge?', answer: TBD },
	{ question: 'Where are you based, and do you travel?', answer: TBD },
	{ question: 'Can we start with one project?', answer: TBD },
	{ question: 'How does the referral share work?', answer: TBD },
];
