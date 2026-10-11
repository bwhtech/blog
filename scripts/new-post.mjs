/**
 * Starts a post: the folder, an index.md with frontmatter, and a one-line
 * placeholder body. The post starts as a draft, so it can be committed before
 * it is ready without showing up on the site.
 *
 *   npm run new                         # asks for everything, step by step
 *   npm run new -- <category> "<title>" # no questions, for scripts
 *   npm run new -- tutorial "Webhooks in Frappe" --tags "Frappe Framework, Webhooks"
 *
 * Options (with a category and title they are the answers; without, the
 * wizard starts from them):
 *   --slug <slug>      folder name, if the one made from the title is too long
 *   --author "<a, b>"  ids from src/data/authors.yaml, in byline order
 *                      (default: hussain-nagaria)
 *   --tags "<a, b>"    comma-separated (default: the category's label)
 *   --mdx              write index.mdx, for a post that mounts a component
 */
import { parseArgs } from 'node:util';

import { Blog, NewPost, slugify, splitList } from './new-post/blog.mjs';
import { finish, Wizard } from './new-post/wizard.mjs';

const usage = 'Usage: npm run new [-- <category> "<title>" [--slug s] [--author "a, b"] [--tags "a, b"] [--mdx]]';

const { values, positionals } = parseArgs({
	allowPositionals: true,
	options: {
		slug: { type: 'string' },
		author: { type: 'string', default: 'hussain-nagaria' },
		tags: { type: 'string' },
		mdx: { type: 'boolean', default: false },
	},
});

const blog = new Blog();
const [category, title] = positionals;
const answers = {
	category,
	title,
	slug: values.slug,
	authors: splitList(values.author),
	tags: values.tags && splitList(values.tags),
	mdx: values.mdx,
};

if (category && title) {
	const post = fromFlags(answers);
	post.write();
	console.log(`✓ ${post.relativeFile}`);
	console.log(`  URL: ${post.url} (a draft until you remove \`draft: true\`)`);
} else {
	const post = await fromWizard(answers);
	post.write();
	finish(post);
}

function fromFlags(answers) {
	if (!(answers.category in blog.categories)) {
		fail(`Unknown category "${answers.category}". Pick one of: ${Object.keys(blog.categories).join(', ')}`);
	}
	if (!answers.authors.length) fail('Pass at least one author.');
	const unknown = answers.authors.find((id) => !blog.hasAuthor(id));
	if (unknown) fail(`Unknown author "${unknown}". Pick from: ${blog.authors.map((a) => a.id).join(', ')}`);

	const slug = answers.slug ?? slugify(answers.title);
	if (!slug) fail('The title has no letters or digits to make a slug from. Pass --slug.');
	if (blog.hasPost(answers.category, slug)) fail(`src/content/blog/${answers.category}/${slug} already exists.`);

	return new NewPost({
		...answers,
		slug,
		description: '',
		tags: answers.tags ?? [blog.categories[answers.category]],
	});
}

function fromWizard(answers) {
	// Prompts need a terminal; a script or CI job has to pass the arguments.
	if (!process.stdin.isTTY) fail(usage);
	return new Wizard(blog, { ...answers, authors: answers.authors.filter((id) => blog.hasAuthor(id)) }).run();
}

function fail(message) {
	console.error(message);
	process.exit(1);
}
