import { getCollection, type CollectionEntry } from 'astro:content';

import { CATEGORIES, type CategorySlug } from '../consts';

/** Post ids are `<category>/<slug>`, which is also the post route. */
export function getPostRoute(post: CollectionEntry<'blog'>) {
	return post.id;
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

export async function getPublishedPosts() {
	const posts = await getCollection('blog', ({ data }) => !data.draft);

	posts.forEach(getCategorySlug);

	return posts.sort((first, second) => second.data.pubDate.valueOf() - first.data.pubDate.valueOf());
}
