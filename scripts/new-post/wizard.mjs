import * as p from '@clack/prompts';

import { NewPost, slugify, splitList } from './blog.mjs';

/**
 * Walks through a new post one question at a time. Anything already passed
 * as a flag is offered as the starting answer, not skipped, so it can still
 * be changed.
 */
export class Wizard {
	constructor(blog, defaults) {
		this.blog = blog;
		this.defaults = defaults;
	}

	async run() {
		p.intro('New blog post');

		const category = await this.askCategory();
		const title = await this.askTitle();
		const slug = await this.askSlug(category, title);
		const description = await this.askDescription();
		const authors = await this.askAuthors();
		const tags = await this.askTags(category);
		const mdx = await this.askFormat();

		const post = new NewPost({ category, title, slug, description, authors, tags, mdx });
		p.note(`${post.relativeFile}\n\n${post.frontmatter()}`, 'Ready to create');
		if (!(await ask(p.confirm({ message: 'Create this post?' })))) stop('Nothing was created.');

		return post;
	}

	askCategory() {
		const { categories } = this.blog;
		return ask(
			p.select({
				message: 'Category',
				initialValue: this.defaults.category in categories ? this.defaults.category : undefined,
				options: Object.entries(categories).map(([value, label]) => ({
					value,
					label,
					hint: plural(this.blog.postCount(value), 'post'),
				})),
			}),
		);
	}

	askTitle() {
		return ask(
			p.text({
				message: 'Title',
				placeholder: 'Webhooks in Frappe',
				initialValue: this.defaults.title,
				validate: (value) => (value?.trim() ? undefined : 'A post needs a title.'),
			}),
		).then((title) => title.trim());
	}

	askSlug(category, title) {
		return ask(
			p.text({
				message: 'Folder name',
				initialValue: this.defaults.slug ?? slugify(title),
				validate: (value = '') => {
					if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(value)) return 'Use lowercase letters, digits and single dashes.';
					if (this.blog.hasPost(category, value)) return `${category}/${value} already exists.`;
				},
			}),
		);
	}

	askDescription() {
		return ask(
			p.text({
				message: 'Description',
				placeholder: 'One sentence for the post list and search results. Leave blank to write it later.',
			}),
		).then((description = '') => description.trim());
	}

	async askAuthors() {
		const picked = await ask(
			p.multiselect({
				message: 'Authors',
				options: this.blog.authors.map((author) => ({ value: author.id, label: author.name, hint: author.role })),
				initialValues: this.defaults.authors,
				required: true,
			}),
		);
		return this.askBylineOrder(picked);
	}

	/** The multiselect shows picks in list order, so the byline order is asked for outright. */
	async askBylineOrder(remaining) {
		const byline = [];
		while (remaining.length > 1) {
			const next = await ask(
				p.select({
					message: byline.length ? 'Who comes next?' : 'Who comes first in the byline?',
					options: remaining.map((id) => ({ value: id, label: this.authorName(id) })),
				}),
			);
			byline.push(next);
			remaining = remaining.filter((id) => id !== next);
		}
		return [...byline, ...remaining];
	}

	authorName(id) {
		return this.blog.authors.find((author) => author.id === id).name;
	}

	async askTags(category) {
		const preselected = this.defaults.tags ?? [this.blog.categories[category]];
		const counts = new Map(this.blog.tagsByUse());
		// Preselected tags go first: below the fold, nobody would see they are already ticked.
		const tags = [...new Set([...preselected, ...counts.keys()])];

		const picked = await ask(
			p.multiselect({
				message: 'Tags',
				options: tags.map((tag) => ({ value: tag, label: tag, hint: plural(counts.get(tag) ?? 0, 'post') })),
				initialValues: preselected,
				required: true,
				maxItems: 10,
			}),
		);
		const added = await ask(
			p.text({ message: 'New tags, comma-separated', placeholder: 'Leave blank for none' }),
		);

		return [...new Set([...picked, ...splitList(added ?? '')])];
	}

	askFormat() {
		return ask(
			p.select({
				message: 'Format',
				initialValue: this.defaults.mdx,
				options: [
					{ value: false, label: 'Markdown', hint: 'index.md' },
					{ value: true, label: 'MDX', hint: 'index.mdx, for a post that mounts a component' },
				],
			}),
		);
	}
}

/** Every prompt resolves to a cancel symbol on Ctrl+C; stop there rather than carry on. */
async function ask(prompt) {
	const answer = await prompt;
	if (p.isCancel(answer)) stop('Cancelled. Nothing was created.');
	return answer;
}

/** Closes the wizard's frame with where the post went. */
export function finish(post) {
	p.outro(`Created ${post.relativeFile}\n   Remove \`draft: true\` to publish it at ${post.url}`);
}

function stop(message) {
	p.cancel(message);
	process.exit(0);
}

function plural(count, word) {
	return `${count} ${word}${count === 1 ? '' : 's'}`;
}
