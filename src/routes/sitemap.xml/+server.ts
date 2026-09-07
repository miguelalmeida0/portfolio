import { recruiterCaseStudies } from '$lib/content/case-studies';
import { SITE_ORIGIN } from '$lib/config/site';

const paths = ['/', '/cv', '/story', ...recruiterCaseStudies.map(({ slug }) => `/work/${slug}`)];

export const GET = () => {
  const urls = paths
    .map((path) => `  <url><loc>${SITE_ORIGIN}${path}</loc></url>`)
    .join('\n');

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
    headers: {
      'cache-control': 'public, max-age=3600, stale-while-revalidate=86400',
      'content-type': 'application/xml; charset=utf-8'
    }
  });
};
