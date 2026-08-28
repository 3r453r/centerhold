import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const essays = (await getCollection('essays')).sort(
    (a, b) => b.data.published.valueOf() - a.data.published.valueOf(),
  );
  return rss({
    title: 'Centrehold',
    description: 'Essays from the quiet part of the river: assumptions stated, opposition steelmanned, statistics read honestly.',
    site: context.site,
    items: essays.map((e) => ({
      title: `${e.data.number} · ${e.data.title}`,
      description: e.data.description,
      pubDate: e.data.published,
      link: e.data.kind === 'register' ? '/assumptions' : `/essays/${e.id}`,
      categories: [e.data.lane],
    })),
    trailingSlash: false,
    customData: '<language>en</language>',
  });
}
