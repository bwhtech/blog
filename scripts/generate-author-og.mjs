/**
 * Renders one Open Graph image per author into public/og/author/<id>.jpg.
 *
 * The images are committed, so this only has to run when an author's name,
 * role, bio, or photo changes:
 *
 *   npm run generate-og            # every author
 *   npm run generate-og -- <id>    # one author
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright';
import { parse as parseYaml } from 'yaml';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const authorsFile = path.join(root, 'src/data/authors.yaml');
const fontFile = path.join(root, 'src/assets/fonts/Inter.var.woff2');
const outDir = path.join(root, 'public/og/author');

const WIDTH = 1200;
const HEIGHT = 630;

const MIME_TYPES = {
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.png': 'image/png',
	'.webp': 'image/webp',
};

/** Inlined so the page needs no network and no local file access. */
function toDataUri(filePath) {
	const mime = MIME_TYPES[path.extname(filePath).toLowerCase()];

	if (!mime) throw new Error(`Unsupported image type: ${filePath}`);
	if (!fs.existsSync(filePath)) throw new Error(`Image not found: ${filePath}`);

	return `data:${mime};base64,${fs.readFileSync(filePath).toString('base64')}`;
}

function escapeHtml(value) {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

/** Only the first paragraph fits, and a long one is cut at a word boundary. */
function firstLine(bio) {
	if (!bio) return '';

	const paragraph = bio.split(/\n\s*\n/)[0].replace(/\s+/g, ' ').trim();

	if (paragraph.length <= 110) return paragraph;

	return `${paragraph.slice(0, 110).replace(/\s+\S*$/, '')}…`;
}

function buildHtml(author, fontUri) {
	const avatar = toDataUri(path.join(root, 'public', author.avatar));
	const bio = firstLine(author.bio);

	return `<!doctype html>
<html>
<head>
<style>
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

	/* Faint disc bleeding off the top right corner. */
	body::before {
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

	.author {
		flex: 1;
		display: flex;
		align-items: center;
		gap: 56px;
		position: relative;
		z-index: 1;
	}

	.avatar {
		width: 300px;
		height: 300px;
		flex: none;
		border-radius: 50%;
		object-fit: cover;
		border: 4px solid #292929;
	}

	.role {
		font-size: 22px;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: #999999;
	}

	h1 {
		font-size: ${author.name.length > 18 ? 60 : 72}px;
		font-weight: 600;
		letter-spacing: -0.03em;
		line-height: 1.05;
	}

	.role + h1 { margin-top: 10px; }

	.bio {
		margin-top: 20px;
		font-size: 28px;
		line-height: 1.4;
		color: #afafaf;
	}
</style>
</head>
<body>
	<div class="corners">
		<div class="brand">BWH Tech</div>
		<div class="domain">blog.bwh.tech</div>
	</div>
	<div class="author">
		<img class="avatar" src="${avatar}" />
		<div>
			${author.role ? `<div class="role">${escapeHtml(author.role)}</div>` : ''}
			<h1>${escapeHtml(author.name)}</h1>
			${bio ? `<div class="bio">${escapeHtml(bio)}</div>` : ''}
		</div>
	</div>
</body>
</html>`;
}

const authors = parseYaml(fs.readFileSync(authorsFile, 'utf-8'));
const wanted = process.argv[2];
const targets = wanted ? authors.filter((author) => author.id === wanted) : authors;

if (!targets.length) {
	console.error(wanted ? `No author with id "${wanted}"` : 'No authors found');
	process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });

const fontUri = `data:font/woff2;base64,${fs.readFileSync(fontFile).toString('base64')}`;
const browser = await chromium.launch();
const page = await browser.newPage({
	viewport: { width: WIDTH, height: HEIGHT },
	deviceScaleFactor: 2,
});

for (const author of targets) {
	const outFile = path.join(outDir, `${author.id}.jpg`);

	await page.setContent(buildHtml(author, fontUri), { waitUntil: 'load' });
	await page.evaluate(() => document.fonts.ready);
	await page.screenshot({ path: outFile, type: 'jpeg', quality: 90 });

	console.log(`✓ ${author.id} → ${path.relative(root, outFile)}`);
}

await browser.close();
console.log(`\nGenerated ${targets.length} image(s)`);
