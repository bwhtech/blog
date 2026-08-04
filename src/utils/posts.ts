import { getCollection } from 'astro:content';

export async function getPublishedPosts() {
	const posts = await getCollection('blog', ({ data }) => !data.draft);

	return posts.sort((first, second) => second.data.pubDate.valueOf() - first.data.pubDate.valueOf());
}
