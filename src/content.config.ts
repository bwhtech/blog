import { defineCollection, reference } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const authors = defineCollection({
	loader: file('./src/data/authors.yaml'),
	schema: ({ image }) =>
		z.object({
			id: z.string(),
			name: z.string(),
			/** Relative to src/data/, so the avatar goes through the image pipeline. */
			avatar: image(),
			/** Shown above the name on the author page, e.g. "Founder". */
			role: z.string().optional(),
			// Blank lines split the bio into paragraphs on the author page.
			bio: z.string().optional(),
			// Each key renders as an icon on the author page. Adding one means adding
			// an icon to src/components/SocialLinks.astro too.
			social: z
				.object({
					github: z.string().url(),
					instagram: z.string().url(),
					linkedin: z.string().url(),
				})
				.partial()
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
