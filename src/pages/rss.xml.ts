import rss from '@astrojs/rss';
import type { APIContext } from 'astro';

import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { getCategoryLabel, getPostHref, getPublishedPosts } from '../utils/posts';

export async function GET(context: APIContext) {
	const posts = await getPublishedPosts();

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		// `context.site` comes from `site` in astro.config.mjs.
		site: context.site!,
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate,
			link: getPostHref(post),
			categories: [...new Set([getCategoryLabel(post), ...post.data.tags])],
		})),
	});
}
