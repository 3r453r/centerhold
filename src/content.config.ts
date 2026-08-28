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
    lane: z.enum(['foundations', 'timeless', 'applied', 'event-horizon']),
    // 'register' renders at /assumptions instead of /essays/<slug>.
    kind: z.enum(['essay', 'register']).default('essay'),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
    // Positions taken under uncertainty carry the label on the page.
    speculative: z.boolean().default(false),
    // Mirror on Substack, when it exists.
    substack: z.string().url().optional(),
  }),
});

export const collections = { essays };
