/**
 * The look the Open Graph cards under public/og/ share: the dark backdrop, the
 * Inter face, and the BWH / bwh.tech corner rules. A card script supplies only
 * the CSS and markup for its own middle section.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** The size crawlers expect. */
export const WIDTH = 1200;
export const HEIGHT = 630;

const fontFile = path.join(root, 'src/assets/fonts/Inter.var.woff2');

const MIME_TYPES = {
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.png': 'image/png',
	'.webp': 'image/webp',
};

/** Inlined so the page needs no network and no local file access. */
export function toDataUri(filePath) {
	const mime = MIME_TYPES[path.extname(filePath).toLowerCase()];

	if (!mime) throw new Error(`Unsupported image type: ${filePath}`);
	if (!fs.existsSync(filePath)) throw new Error(`Image not found: ${filePath}`);

	return `data:${mime};base64,${fs.readFileSync(filePath).toString('base64')}`;
}

export function escapeHtml(value) {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

let fontUri;

function baseCss() {
	fontUri ??= `data:font/woff2;base64,${fs.readFileSync(fontFile).toString('base64')}`;

	return `
	@font-face {
		font-family: 'InterVar';
		font-weight: 100 900;
		src: url('${fontUri}') format('woff2');
	}

	* { margin: 0; padding: 0; box-sizing: border-box; }

	body {
		width: ${WIDTH}px;
		height: ${HEIGHT}px;
		background: #171717;
		color: #ffffff;
		font-family: 'InterVar', sans-serif;
		font-variation-settings: 'opsz' 32, 'cv11' 1;
		-webkit-font-smoothing: antialiased;
		display: flex;
		flex-direction: column;
		padding: 72px 90px;
		position: relative;
		overflow: hidden;
	}

	/* Faint disc bleeding off the top right corner, on cards that ask for it. */
	body.disc::before {
		content: '';
		position: absolute;
		top: -180px;
		right: -140px;
		width: 620px;
		height: 620px;
		border-radius: 50%;
		background: #1f1f1f;
	}

	.corners {
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: relative;
		z-index: 1;
	}

	.brand {
		font-size: 22px;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: #7a7a7a;
	}

	.domain {
		font-size: 22px;
		font-weight: 500;
		color: #7a7a7a;
	}
`;
}

/**
 * Wraps a card's own CSS and body in the shared frame. `brand` and `domain`
 * are the two corner marks and `disc` the faint circle behind the card; a card
 * can drop any of them, and dropping both marks drops the row with them.
 */
export function buildDocument({ css, body, brand = true, domain = true, disc = true }) {
	const corners =
		brand || domain
			? `	<div class="corners">
		${brand ? '<div class="brand">BWH</div>' : ''}
		${domain ? '<div class="domain">bwh.tech</div>' : ''}
	</div>
`
			: '';

	return `<!doctype html>
<html>
<head>
<style>${baseCss()}${css}</style>
</head>
<body class="${disc ? 'disc' : ''}">
${corners}${body}
</body>
</html>`;
}

/** Screenshots each `{ label, html, outFile }` card through one browser. */
export async function renderCards(cards) {
	// CHROMIUM_PATH is for environments that ship their own build instead of the
	// one `npx playwright install` downloads.
	const browser = await chromium.launch(
		process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
	);
	const page = await browser.newPage({
		viewport: { width: WIDTH, height: HEIGHT },
		deviceScaleFactor: 2,
	});

	for (const card of cards) {
		fs.mkdirSync(path.dirname(card.outFile), { recursive: true });

		await page.setContent(card.html, { waitUntil: 'load' });
		await page.evaluate(() => document.fonts.ready);
		await page.screenshot({ path: card.outFile, type: 'jpeg', quality: 90 });

		console.log(`✓ ${card.label} → ${path.relative(root, card.outFile)}`);
	}

	await browser.close();
	console.log(`\nGenerated ${cards.length} image(s)`);
}
