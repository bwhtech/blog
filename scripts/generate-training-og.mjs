/**
 * Renders the Open Graph image for /train-your-team into
 * public/og/train-your-team.jpg.
 *
 * The image is committed, so this only has to run when the hero copy below
 * changes:
 *
 *   npm run generate-og:training
 */
import path from 'node:path';

import { buildDocument, escapeHtml, renderCards, root, toDataUri } from './og-card.mjs';

/** Keep in sync with the hero in src/pages/train-your-team.astro. */
const CREDENTIAL = { before: 'Official ', strong: 'Frappe School', after: ' training partner' };
const HEADLINE = 'Get your team ready for action.';
const TAGLINE =
	'Hands-on training for teams that want to build, run, and get the most out of Frappeverse.';

const logo = toDataUri(path.join(root, 'public/media/train-your-team/frappe-school-logo.png'));
const outFile = path.join(root, 'public/og/train-your-team.jpg');

const css = `
	.training {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		position: relative;
		z-index: 1;
	}

	/* The same pill the page sits above its headline: surface-gray-1 on
	   outline-gray-1, at the dark end of the Espresso scale. Its radius is
	   concentric with the logo's — the logo radius plus the 8px gutter — rather
	   than fully round, which crowded the logo's own corners. */
	.credential {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 8px 22px 8px 8px;
		border: 1px solid #333333;
		border-radius: 16px;
		background: #1f1f1f;
		font-size: 24px;
		color: #afafaf;
	}

	.credential img {
		width: 36px;
		height: 36px;
		border-radius: 8px;
	}

	.credential strong {
		font-weight: 500;
		color: #ededed;
	}

	/* 76px is the largest size that keeps the headline on one line. */
	h1 {
		margin-top: 36px;
		max-width: 1020px;
		font-size: 76px;
		font-weight: 600;
		letter-spacing: -0.03em;
		line-height: 1.05;
	}

	.tagline {
		margin-top: 28px;
		max-width: 720px;
		font-size: 30px;
		line-height: 1.4;
		color: #afafaf;
	}
`;

const body = `	<div class="training">
		<div class="credential">
			<img src="${logo}" />
			<div>${escapeHtml(CREDENTIAL.before)}<strong>${escapeHtml(CREDENTIAL.strong)}</strong>${escapeHtml(CREDENTIAL.after)}</div>
		</div>
		<h1>${escapeHtml(HEADLINE)}</h1>
		<div class="tagline">${escapeHtml(TAGLINE)}</div>
	</div>`;

await renderCards([
	{ label: 'train-your-team', html: buildDocument({ css, body, brand: false, domain: false, disc: false }), outFile },
]);
