/**
 * Renders the Open Graph image for the landing page into public/og/home.jpg.
 *
 * The image is committed, so this only has to run when the landing page copy
 * below changes:
 *
 *   npm run generate-og:home
 */
import path from 'node:path';

import { buildDocument, escapeHtml, renderCards, root } from './og-card.mjs';

/** Keep in sync with the headline and tagline in src/pages/index.astro. */
const HEADLINE = 'Bunch of Problem Solvers.';
const TAGLINE = 'We solve it, with Frappe.';

const outFile = path.join(root, 'public/og/home.jpg');

/** The line-dot-line rule the landing page sits under its headline. */
const DIVIDER = `<svg class="divider" width="56" height="12" viewBox="0 0 40 12" fill="none">
			<path d="M0 6H14" stroke="currentColor" stroke-width="1" />
			<path d="M26 6H40" stroke="currentColor" stroke-width="1" />
			<circle cx="20" cy="6" r="2.5" fill="currentColor" />
		</svg>`;

const css = `
	.home {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		position: relative;
		z-index: 1;
	}

	/* 84px is the largest size that keeps the headline on one line. */
	h1 {
		max-width: 1020px;
		font-size: 84px;
		font-weight: 600;
		letter-spacing: -0.03em;
		line-height: 1.05;
	}

	.divider {
		margin: 40px 0;
		color: #7a7a7a;
	}

	.tagline {
		font-size: 32px;
		line-height: 1.4;
		color: #afafaf;
	}
`;

const body = `	<div class="home">
		<h1>${escapeHtml(HEADLINE)}</h1>
		${DIVIDER}
		<div class="tagline">${escapeHtml(TAGLINE)}</div>
	</div>`;

await renderCards([{ label: 'home', html: buildDocument({ css, body }), outFile }]);
