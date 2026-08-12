/**
 * Renders one Open Graph image per author into public/og/author/<id>.png.
 *
 * This runs as part of `npm run build`, so the images are always in step with
 * src/data/authors.yaml and are never committed. Run it on its own with:
 *
 *   npm run generate-og            # every author
 *   npm run generate-og -- <id>    # one author
 *
 * Satori renders a subset of CSS: flexbox only, no pseudo-elements, and every
 * element with more than one child needs an explicit `display: flex`.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import { parse as parseYaml } from 'yaml';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const authorsFile = path.join(root, 'src/data/authors.yaml');
const fontsDir = path.join(root, 'scripts/fonts');
const outDir = path.join(root, 'public/og/author');

const WIDTH = 1200;
const HEIGHT = 630;
const PADDING_X = 90;
const AVATAR = 300;
const GAP = 56;
const TEXT_WIDTH = WIDTH - PADDING_X * 2 - AVATAR - GAP;
/** Rendered at 2x so the card stays sharp on high-density screens. */
const SCALE = 2;

const MIME_TYPES = {
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.png': 'image/png',
	'.webp': 'image/webp',
};

/** Satori has no filesystem access, so the photo goes in as a data URI. */
function toDataUri(filePath) {
	const mime = MIME_TYPES[path.extname(filePath).toLowerCase()];

	if (!mime) throw new Error(`Unsupported image type: ${filePath}`);
	if (!fs.existsSync(filePath)) throw new Error(`Image not found: ${filePath}`);

	return `data:${mime};base64,${fs.readFileSync(filePath).toString('base64')}`;
}

/** Only the first paragraph fits, and a long one is cut at a word boundary. */
function firstLine(bio) {
	if (!bio) return '';

	const paragraph = bio.split(/\n\s*\n/)[0].replace(/\s+/g, ' ').trim();

	if (paragraph.length <= 110) return paragraph;

	return `${paragraph.slice(0, 110).replace(/\s+\S*$/, '')}…`;
}

function el(type, style, children) {
	return { type, props: { style, children } };
}

function text(style, children) {
	return el('div', style, children);
}

const LABEL = {
	fontSize: 22,
	fontWeight: 600,
	letterSpacing: '0.14em',
	textTransform: 'uppercase',
};

function card(author) {
	const bio = firstLine(author.bio);

	return el(
		'div',
		{
			width: WIDTH,
			height: HEIGHT,
			display: 'flex',
			flexDirection: 'column',
			padding: `72px ${PADDING_X}px`,
			background: '#171717',
			color: '#ffffff',
			fontFamily: 'Inter',
		},
		[
			// Faint disc bleeding off the top right corner.
			el('div', {
				position: 'absolute',
				top: -180,
				right: -140,
				width: 620,
				height: 620,
				borderRadius: 310,
				background: '#1f1f1f',
			}),
			el('div', { display: 'flex', justifyContent: 'space-between' }, [
				text({ ...LABEL, color: '#7a7a7a' }, 'BWH Tech'),
				text({ fontSize: 22, color: '#7a7a7a' }, 'blog.bwh.tech'),
			]),
			el('div', { flex: 1, display: 'flex', alignItems: 'center' }, [
				{
					type: 'img',
					props: {
						src: toDataUri(path.join(root, 'public', author.avatar)),
						width: AVATAR,
						height: AVATAR,
						style: {
							borderRadius: AVATAR / 2,
							objectFit: 'cover',
							border: '4px solid #292929',
							marginRight: GAP,
						},
					},
				},
				// Satori will not wrap text against a flex bound, so the column that
				// holds it needs the width left over once the photo is placed.
				el('div', { display: 'flex', flexDirection: 'column', width: TEXT_WIDTH }, [
					author.role ? text({ ...LABEL, color: '#999999', marginBottom: 10 }, author.role) : null,
					text(
						{
							fontSize: author.name.length > 18 ? 60 : 72,
							fontWeight: 600,
							letterSpacing: '-0.03em',
						},
						author.name,
					),
					bio
						? text({ fontSize: 28, lineHeight: 1.4, color: '#afafaf', marginTop: 20 }, bio)
						: null,
				]),
			]),
		],
	);
}

const fonts = [
	{ name: 'Inter', weight: 400, style: 'normal', data: fs.readFileSync(`${fontsDir}/Inter-Regular.ttf`) },
	{ name: 'Inter', weight: 600, style: 'normal', data: fs.readFileSync(`${fontsDir}/Inter-SemiBold.ttf`) },
];

const authors = parseYaml(fs.readFileSync(authorsFile, 'utf-8'));
const wanted = process.argv[2];
const targets = wanted ? authors.filter((author) => author.id === wanted) : authors;

if (!targets.length) {
	console.error(wanted ? `No author with id "${wanted}"` : 'No authors found');
	process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });

for (const author of targets) {
	const svg = await satori(card(author), { width: WIDTH, height: HEIGHT, fonts });
	const png = new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH * SCALE } }).render().asPng();
	const outFile = path.join(outDir, `${author.id}.png`);

	fs.writeFileSync(outFile, png);
	console.log(`✓ ${author.id} → ${path.relative(root, outFile)}`);
}

console.log(`\nGenerated ${targets.length} image(s)`);
