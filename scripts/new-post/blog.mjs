import fs from 'node:fs';
import path from 'node:path';

import { parse as parseYaml } from 'yaml';

import { CATEGORIES } from '../../src/consts.ts';
import { root } from '../og-card.mjs';

const contentDir = path.join(root, 'src/content/blog');

/** What already exists: the categories, authors, tags and post folders a new post must fit in with. */
export class Blog {
	constructor() {
		this.categories = CATEGORIES;
		this.authors = parseYaml(fs.readFileSync(path.join(root, 'src/data/authors.yaml'), 'utf8'));
		this.posts = readPosts();
	}

	postCount(category) {
		return this.posts.filter((post) => post.category === category).length;
	}

	/** Every tag in use, most used first, so the common ones sit at the top of the picker. */
	tagsByUse() {
		const counts = new Map();
		for (const tag of this.posts.flatMap((post) => post.tags)) counts.set(tag, (counts.get(tag) ?? 0) + 1);
		return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
	}

	hasAuthor(id) {
		return this.authors.some((author) => author.id === id);
	}

	hasPost(category, slug) {
		return fs.existsSync(path.join(contentDir, category, slug));
	}
}

export class NewPost {
	constructor({ category, title, slug, description, authors, tags, mdx }) {
		Object.assign(this, { category, title, slug, description, authors, tags, mdx });
	}

	get file() {
		return path.join(contentDir, this.category, this.slug, this.mdx ? 'index.mdx' : 'index.md');
	}

	get relativeFile() {
		return path.relative(root, this.file);
	}

	get url() {
		return `/blog/${this.category}/${this.slug}/`;
	}

	frontmatter() {
		return [
			'---',
			`title: ${JSON.stringify(this.title)}`,
			`description: ${JSON.stringify(this.description || 'TODO')}`,
			`authors: [${this.authors.join(', ')}]`,
			`tags: [${this.tags.map((tag) => JSON.stringify(tag)).join(', ')}]`,
			`pubDate: ${today()}`,
			'draft: true',
			'---',
		].join('\n');
	}

	write() {
		fs.mkdirSync(path.dirname(this.file), { recursive: true });
		fs.writeFileSync(this.file, `${this.frontmatter()}\n\nWrite the post here.\n`);
	}
}

export function slugify(text) {
	return text
		.normalize('NFKD')
		.replace(/\p{M}/gu, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

export function splitList(text) {
	return text.split(',').map((item) => item.trim()).filter(Boolean);
}

function readPosts() {
	return fs.globSync('*/*/index.{md,mdx}', { cwd: contentDir }).map((file) => {
		const source = fs.readFileSync(path.join(contentDir, file), 'utf8');
		const data = parseYaml(source.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '') ?? {};
		return { category: file.split('/')[0], tags: data.tags ?? [] };
	});
}

/** The local date, so a post started late in the evening is not dated tomorrow. */
function today() {
	const d = new Date();
	const pad = (n) => String(n).padStart(2, '0');
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
