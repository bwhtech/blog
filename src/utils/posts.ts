import { getCollection, type CollectionEntry } from 'astro:content';

export function getPostRoute(post: CollectionEntry<'blog'>) {
	return `${toSlug(post.data.tags[0])}/${post.id}`;
}

export async function getPublishedPosts() {
	const posts = await getCollection('blog', ({ data }) => !data.draft);

	return posts.sort((first, second) => second.data.pubDate.valueOf() - first.data.pubDate.valueOf());
}

function toSlug(value: string) {
	return value
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/&/g, ' and ')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}
