/**
 * Content for /train-your-team.
 *
 * `TBD` marks copy the training team still owes. The page renders it as a
 * visible placeholder rather than filling the gap with invented blurb, so an
 * unfinished section is obvious on the page instead of only in this file.
 */
export const TBD = 'TBD';

/**
 * Frappe product logos, keyed so a programme can name what it covers without
 * repeating a path. Brand-coloured marks, so they render as `<img>` rather than
 * inline SVG — nothing here should inherit currentColor.
 */
export const PRODUCTS = {
	framework: { label: 'Frappe Framework', src: '/media/train-your-team/logos/framework.svg' },
	'frappe-ui': { label: 'Frappe UI', src: '/media/train-your-team/logos/frappe-ui.svg' },
	cloud: { label: 'Frappe Cloud', src: '/media/train-your-team/logos/cloud.svg' },
	erpnext: { label: 'ERPNext', src: '/media/train-your-team/logos/erpnext.svg' },
	crm: { label: 'Frappe CRM', src: '/media/train-your-team/logos/crm.svg' },
	helpdesk: { label: 'Frappe Helpdesk', src: '/media/train-your-team/logos/helpdesk.svg' },
	hr: { label: 'Frappe HR', src: '/media/train-your-team/logos/hr.svg' },
	builder: { label: 'Frappe Builder', src: '/media/train-your-team/logos/builder.svg' },
	insights: { label: 'Frappe Insights', src: '/media/train-your-team/logos/insights.svg' },
} as const;

export type ProductKey = keyof typeof PRODUCTS;

export interface Program {
	title: string;
	/** One line on what the programme is for. */
	tagline: string;
	/** Duration or shape, rendered as a Badge. */
	format: string;
	/** Who should be in the room. */
	audience?: string;
	/** The headline topics, trimmed — the card shows them as one line. */
	covers: string[];
	/** What the team can do afterwards. */
	outcome?: string;
	/** Label on the card's call to action. */
	cta: string;
	/** Frappe products the programme works in, shown as a logo row. */
	products?: ProductKey[];
}

export interface Track {
	id: string;
	label: string;
	/** A lucide icon name, as frappe-ui's `iconLeft` expects it. */
	icon: string;
	/** Headline for the track. Omitted while the copy is still being written. */
	blurb?: string;
	/** Who the track is for, under the blurb. */
	audience?: string;
	programs: Program[];
	/** Deep-dives that bolt onto a programme rather than standing alone. */
	addOns?: string[];
	pricing: Pricing;
}

export interface Pricing {
	/** Per-seat rate for the smallest band. */
	base: string;
	/** Volume discounts, in the shortest phrasing that still reads. */
	discounts: string[];
	/** Anything else that qualifies the rate. */
	note: string;
}

/**
 * Only the base band carries a number; the larger bands are a discount off it,
 * so a rate change is one edit per track and the ladder cannot drift.
 *
 * PLACEHOLDER RATES — the figures passed in below are stand-ins chosen to see
 * how this reads. Replace them before anyone can hold us to a quote.
 */
function pricing(base: string): Pricing {
	return {
		base,
		discounts: ['10% off from 11 seats', '20% off from 26'],
		note: 'minimum 5 seats · remote or on-site, travel quoted separately',
	};
}

export const TRACKS: Track[] = [
	{
		id: 'technical',
		label: 'Technical',
		icon: 'lucide-code',
		blurb: 'For developers who need to build and ship on Frappe.',
		programs: [
			{
				title: 'Developer Intensive',
				tagline: 'Get productive with Frappe Framework, fast.',
				format: '3–4 days',
				audience:
					'Developers who already know programming and need to start building with Frappe.',
				covers: [
					'Frappe architecture',
					'Bench and dev environment',
					'DocTypes and data modelling',
					'Controllers',
					'Server-side development',
					'Permissions',
					'REST APIs',
					'AI-assisted development',
				],
				outcome: 'Your team can build and ship a real Frappe application.',
				cta: 'Train my developers',
				products: ['framework', 'frappe-ui', 'cloud'],
			},
			{
				title: 'Developer Zero to Hero',
				tagline: 'From fresher to production-ready Frappe developer.',
				format: '6 weeks',
				audience: 'New hires, freshers, and junior developers.',
				covers: [
					'Structured learning path',
					'Live sessions',
					'Assignments and code reviews',
					'Architecture',
					'API development',
					'Git workflows',
					'Agentic development',
					'Final project',
				],
				outcome: 'Developers who can contribute meaningfully to real Frappe projects.',
				cta: 'Build my Frappe team',
				products: ['framework', 'frappe-ui', 'cloud'],
			},
		],
		addOns: [
			'Integrations',
			'REST APIs',
			'Frappe UI',
			'Advanced Python',
			'Performance',
			'Testing',
			'Deployment',
			'Architecture',
			'Agentic Development',
		],
		pricing: pricing('$450'),
	},
	{
		id: 'business',
		label: 'Business & No-Code',
		icon: 'lucide-briefcase',
		blurb: 'Give your team the power to build without becoming developers.',
		audience:
			'For functional consultants, operations teams, admins, analysts, implementation teams, and business users across the Frappeverse.',
		programs: [
			{
				title: 'Frappe No-Code',
				tagline: 'Build apps and automate work without traditional development.',
				format: 'Flexible',
				audience: 'Business users who want to turn a process into a working application.',
				covers: [
					'DocTypes, fields and forms',
					'Web Forms',
					'Roles and permissions',
					'Workflows and notifications',
					'Reports and dashboards',
					'Frappe Builder',
					'Data imports',
					'AI-assisted building',
				],
				outcome: 'Participants can turn a business process into a working Frappe application.',
				cta: 'Train my business team',
				products: ['framework', 'builder', 'insights'],
			},
			{
				title: 'ERPNext',
				tagline: 'Go beyond using ERPNext. Understand how the business flows through it.',
				format: 'Multi-day or multi-week',
				audience: 'Functional consultants, ERP implementers, and internal ERP teams.',
				covers: [
					'ERPNext Essentials',
					'Accounting & Finance',
					'Selling, Buying & Stock',
					'ERPNext Functional Pro',
				],
				cta: 'Get ERPNext training',
				products: ['erpnext'],
			},
			{
				title: 'Frappe HR',
				tagline: 'Run the employee lifecycle on Frappe HR.',
				format: '2–3 days',
				audience: 'HR and implementation teams.',
				covers: [
					'Employee setup',
					'Leave, attendance and shifts',
					'Expense claims',
					'Payroll and salary structures',
					'Performance',
					'Recruitment',
					'HR reports',
					'Permissions and workflows',
				],
				outcome: 'Your team can configure and operate Frappe HR properly.',
				cta: 'Train my HR team',
				products: ['hr'],
			},
			{
				title: 'Essential Business Apps',
				tagline: 'CRM. Support. Analytics. All on Frappe.',
				format: 'Flexible',
				audience: 'Business teams touring the modern Frappeverse.',
				covers: [
					'Frappe CRM — leads, deals, pipeline',
					'Frappe Helpdesk — tickets, SLAs, knowledge base',
					'Frappe Insights — query builder, dashboards, metrics',
				],
				outcome: 'Win customers, support customers, understand the business.',
				cta: 'Train my team',
				products: ['crm', 'helpdesk', 'insights'],
			},
		],
		addOns: [
			'Accounting & Finance',
			'Selling',
			'Buying',
			'Stock',
			'Payroll',
			'Frappe CRM',
			'Frappe Helpdesk',
			'Frappe Insights',
			'Workflows',
			'Frappe Builder',
		],
		pricing: pricing('$350'),
	},
	{
		id: 'ai',
		label: 'AI & Agentic',
		icon: 'lucide-sparkles',
		blurb: 'Build faster with AI. Much faster.',
		audience:
			'For teams that want to use modern AI and coding agents effectively while building in the Frappeverse.',
		programs: [
			{
				title: 'Agentic Development with Frappe',
				tagline: 'Go from idea to working software with AI-native development workflows.',
				format: 'Flexible',
				audience:
					'Developers, functional consultants, product people, technical founders, and ambitious no-code users.',
				covers: [
					'Agentic development mindset',
					'Giving agents context',
					'Working with an existing codebase',
					'Reviewing AI-generated code',
					'Security and boundaries',
					'Context engineering',
					'Reusable instructions and skills',
					'Production workflows',
				],
				// Deliberately not "learn tool X" — the tools churn, the workflow does not.
				outcome: 'An AI-native workflow that holds up even as the tools change.',
				cta: 'Train my team',
			},
			{
				title: 'Agentic Development for Non-Developers',
				tagline: 'Turn domain knowledge into working software with AI.',
				format: 'Flexible',
				audience: 'Runs as a lighter version of the programme above, or as a section within it.',
				covers: [
					'Explaining processes clearly',
					'Defining data models',
					'Writing requirements',
					'Working with agents',
					'Reviewing output',
					'Testing and iterating',
				],
				outcome: 'Build Frappe applications without becoming a traditional developer.',
				cta: 'Talk to us',
			},
		],
		// Tools are named here and nowhere else: the programmes themselves teach a
		// workflow, not a product, so tool names belong on optional deep-dives.
		addOns: [
			'Spec-driven development',
			'Context engineering',
			'Skills',
			'AGENTS.md',
			'Claude Code',
			'OpenCode',
			'Gemini CLI',
		],
		pricing: pricing('$525'),
	},
];

export interface Trainer {
	name: string;
	role: string;
	avatar: string;
	/** Links to the author page when the trainer has one. */
	href?: string;
}

export const TRAINERS: Trainer[] = [
	{
		name: 'Hussain Nagaria',
		role: TBD,
		avatar: '/authors/hussain-nagaria.jpg',
		href: '/author/hussain-nagaria/',
	},
	{
		name: 'Rahul Agrawal',
		role: TBD,
		avatar: '/authors/rahul-agrawal.jpg',
		href: '/author/rahul-agrawal/',
	},
	{
		name: 'Shivam Ghosh',
		role: TBD,
		avatar: '/authors/shivam-ghosh.jpg',
		href: '/author/shivam-ghosh/',
	},
];

export interface Review {
	name: string;
	/** Role and company. Falls back to a generic learner label when unknown. */
	context?: string;
	quote: string;
	/**
	 * A phrase inside `quote` to set in bold. Kept separate so the quote itself
	 * stays plain text — nothing on this page renders raw HTML.
	 */
	emphasis?: string;
	/** Falls back to an initials circle when absent. */
	avatar?: string;
}

/**
 * Pulled from the BWH school LMS (`LMS Batch Feedback` on school.bwh.tech).
 *
 * Only feedback about the teaching itself is quoted here — the instructor, the
 * pedagogy, the depth. Reviews that are really about one cohort's subject matter
 * are left in the LMS, because this page covers every track, not just that one.
 * Wording and typos are the reviewer's; a `…` marks where a longer review was
 * cut so the cards stay a readable length.
 *
 * Nothing fetches these at build time — the site has no LMS credentials, and
 * feedback lands a few times a year, so a refresh is a manual re-run of
 * `frappectl -s bwh-school doc list "LMS Batch Feedback"`.
 */
export const REVIEWS: Review[] = [
	{
		name: 'Aadhil',
		quote:
			"I've been working with Frappe Framework for years… I always wondered if I was following the right approach or just finding shortcuts. This course gave me that validation.",
		emphasis: 'This course gave me that validation.',
		avatar: '/media/train-your-team/aadhil.png',
	},
	{
		name: 'Raghav Ruia',
		context: 'Product Analyst, Frappe',
		quote:
			'Hussain teaches with utmostly depth & detail by connecting the dots. Such clarity of thought + humour, makes the learning experience a brezze. Thank you for your hard-work.',
		emphasis: 'connecting the dots',
		avatar: '/media/train-your-team/raghav-ruia.jpeg',
	},
	{
		name: 'Milind Lokare',
		quote:
			'Really loved the way you teach, with all the real world issues tackled with precises solutions. Amazed with your knowledge which is so seldom to come across these days…',
		avatar: '/media/train-your-team/milind-lokare.jpg',
	},
	{
		name: 'Mohamed',
		quote:
			'Hussain is an excellent teacher and has a great ability to explain complex concepts in a simple and practical way…',
		avatar: '/media/train-your-team/mohamed.png',
	},
];

export interface Faq {
	question: string;
	answer: string;
}

export const FAQS: Faq[] = [
	{ question: 'Who is this training for?', answer: TBD },
	{ question: 'Is it remote, on-site, or both?', answer: TBD },
	{ question: 'How long does a program run?', answer: TBD },
	{ question: 'How large can a batch be?', answer: TBD },
	{ question: 'What do participants need before day one?', answer: TBD },
	{ question: 'Can you build a program around our own stack?', answer: TBD },
	{ question: 'How much does it cost?', answer: TBD },
];
