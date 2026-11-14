import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';

const guide = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/guide' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    order: z.number(),
    heroImage: image(),
    heroAlt: z.string(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    published: z.coerce.date(),
    updated: z.coerce.date(),
  }),
});

export const collections = { guide };
