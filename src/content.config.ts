import { defineCollection, reference } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const authors = defineCollection({
	loader: file('./src/data/authors.json'),
	schema: z.object({
		id: z.string(),
		name: z.string(),
		avatar: z.string(),
		/** Shown above the name on the author page, e.g. "Founder". */
		role: z.string().optional(),
		// Blank lines split the bio into paragraphs on the author page.
		bio: z.string().optional(),
		links: z
			.array(
				z.object({
					label: z.string(),
					url: z.string().url(),
				}),
			)
			.optional(),
	}),
});

const blog = defineCollection({
	loader: glob({
		base: './src/content/blog',
		pattern: '**/index.md',
		// A post is a folder, so the id is the folder path: `<category>/<slug>`.
		generateId: ({ entry }) => entry.replace(/\/index\.md$/, ''),
	}),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			author: reference('authors'),
			tags: z.array(z.string()).min(1),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			image: image().optional(),
			draft: z.boolean().default(false),
		}),
});

export const collections = { authors, blog };
