import { getCollection, type CollectionEntry } from 'astro:content';

import { CATEGORIES, type CategorySlug } from '../consts';

/** Post ids are `<category>/<slug>`, which is the route under `src/pages/blog/`. */
export function getPostRoute(post: CollectionEntry<'blog'>) {
	return post.id;
}

/** The full site path of a post. Posts live under `/blog/`; the site root is the landing page. */
export function getPostHref(post: CollectionEntry<'blog'>) {
	return `/blog/${getPostRoute(post)}/`;
}

/** The bare slug the post was published under before categories existed. */
export function getLegacySlug(post: CollectionEntry<'blog'>) {
	return post.id.split('/')[1];
}

export function getCategorySlug(post: CollectionEntry<'blog'>) {
	const category = post.id.split('/')[0];

	if (!(category in CATEGORIES)) {
		throw new Error(`Unknown category folder "${category}". Add it to CATEGORIES in consts.ts.`);
	}

	return category as CategorySlug;
}

export function getCategoryLabel(post: CollectionEntry<'blog'>) {
	return CATEGORIES[getCategorySlug(post)];
}

/** Author pages live under `/author/` so they never collide with the avatars in `public/authors/`. */
export function getAuthorRoute(authorId: string) {
	return `/author/${authorId}/`;
}

export async function getPostsByAuthor(authorId: string) {
	const posts = await getPublishedPosts();

	return posts.filter((post) => post.data.author.id === authorId);
}

export async function getPublishedPosts() {
	const posts = await getCollection('blog', ({ data }) => !data.draft);

	posts.forEach(getCategorySlug);

	return posts.sort((first, second) => second.data.pubDate.valueOf() - first.data.pubDate.valueOf());
}
