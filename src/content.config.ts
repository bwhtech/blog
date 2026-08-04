import { defineCollection, reference } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const authors = defineCollection({
	loader: file('./src/data/authors.json'),
	schema: z.object({
		id: z.string(),
		name: z.string(),
		avatar: z.string(),
		bio: z.string().optional(),
	}),
});

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		author: reference('authors'),
		tags: z.array(z.string()).min(1),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		image: z.string().optional(),
		draft: z.boolean().default(false),
	}),
});

export const collections = { authors, blog };
