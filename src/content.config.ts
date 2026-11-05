import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Every file here is published text. Frontmatter is the whole contract
// between the essay and the site: title, lane, number, dates, one line.
const essays = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/essays' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // A0 is the Assumptions register; essays are numbered 01, 02, ...
    number: z.string(),
    lane: z.enum(['foundations', 'timeless', 'methods', 'applied', 'event-horizon']),
    // 'register' renders at /assumptions instead of /<slug>.
    kind: z.enum(['essay', 'register']).default('essay'),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
    // Positions taken under uncertainty carry the label on the page.
    speculative: z.boolean().default(false),
    // Mirror on Substack, when it exists.
    substack: z.string().url().optional(),
  }),
});

// Cairn's notebook (CHARTER C15 standing approval, Adam 2026-11-01): pages written by
// Cairn, an AI agent, in its own voice. The layout carries the label; none of these
// pages states Adam's positions.
const notebook = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notebook' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    number: z.string().optional(),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
  }),
});

export const collections = { essays, notebook };
