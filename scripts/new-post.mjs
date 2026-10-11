/**
 * Scaffolds a post: the folder, an index.md with frontmatter, and a one-line
 * placeholder body. The post starts as a draft, so it can be committed before
 * it is ready without showing up on the site.
 *
 *   npm run new -- <category> "<title>"
 *   npm run new -- tutorial "Webhooks in Frappe" --tags "Frappe Framework, Webhooks"
 *
 * Options:
 *   --slug <slug>      folder name, if the one made from the title is too long
 *   --author "<a, b>"  ids from src/data/authors.yaml, in byline order
 *                      (default: hussain-nagaria)
 *   --tags "<a, b>"    comma-separated (default: the category's label)
 *   --mdx              write index.mdx, for a post that mounts a component
 */
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';

import { parse as parseYaml } from 'yaml';

import { CATEGORIES } from '../src/consts.ts';
import { root } from './og-card.mjs';

const usage = 'Usage: npm run new -- <category> "<title>" [--slug s] [--author "a, b"] [--tags "a, b"] [--mdx]';

const { values, positionals } = parseArgs({
	allowPositionals: true,
	options: {
		slug: { type: 'string' },
		author: { type: 'string', default: 'hussain-nagaria' },
		tags: { type: 'string' },
		mdx: { type: 'boolean', default: false },
	},
});

const [category, title] = positionals;
if (!category || !title) fail(usage);
if (!(category in CATEGORIES)) {
	fail(`Unknown category "${category}". Pick one of: ${Object.keys(CATEGORIES).join(', ')}`);
}

const knownAuthors = parseYaml(fs.readFileSync(path.join(root, 'src/data/authors.yaml'), 'utf8'));
const authors = splitList(values.author);
const unknown = authors.find((id) => !knownAuthors.some((a) => a.id === id));
if (!authors.length) fail('Pass at least one author.');
if (unknown) {
	fail(`Unknown author "${unknown}". Pick from: ${knownAuthors.map((a) => a.id).join(', ')}`);
}

const slug = values.slug ?? slugify(title);
if (!slug) fail('The title has no letters or digits to make a slug from. Pass --slug.');

const dir = path.join(root, 'src/content/blog', category, slug);
if (fs.existsSync(dir)) fail(`${path.relative(root, dir)} already exists.`);

const tags = values.tags ? splitList(values.tags) : [CATEGORIES[category]];

const frontmatter = [
	'---',
	`title: ${JSON.stringify(title)}`,
	'description: "TODO"',
	`authors: [${authors.join(', ')}]`,
	`tags: [${tags.map((t) => JSON.stringify(t)).join(', ')}]`,
	`pubDate: ${today()}`,
	'draft: true',
	'---',
].join('\n');

const file = path.join(dir, values.mdx ? 'index.mdx' : 'index.md');
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(file, `${frontmatter}\n\nWrite the post here.\n`);

console.log(`✓ ${path.relative(root, file)}`);
console.log(`  URL: /blog/${category}/${slug}/ (a draft until you remove \`draft: true\`)`);

function splitList(text) {
	return text.split(',').map((item) => item.trim()).filter(Boolean);
}

function slugify(text) {
	return text
		.normalize('NFKD')
		.replace(/\p{M}/gu, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

/** The local date, so a post started late in the evening is not dated tomorrow. */
function today() {
	const d = new Date();
	const pad = (n) => String(n).padStart(2, '0');
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function fail(message) {
	console.error(message);
	process.exit(1);
}
