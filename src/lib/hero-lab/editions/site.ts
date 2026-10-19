import { primaryNavigation } from '$lib/content/navigation';

/**
 * These directions have their own home pages. Story and CV use the supported
 * typographic edition, whose navigation continues through the complete site.
 */
export type EditionSlug = 'editorial-poster' | 'kinetic-story' | 'experimental';
export type EditionPage = 'home' | 'story' | 'cv';

export function editionRoutes(slug: EditionSlug) {
  const home = `/hero-lab/${slug}`;
  return { home, story: '/hero-lab/typographic/story', cv: '/hero-lab/typographic/cv' } as const;
}

/** Rewrites production destinations to the edition home or supported profile. */
export function editionHref(slug: EditionSlug, page: EditionPage, href: string) {
  const routes = editionRoutes(slug);
  if (href === '/#work') return page === 'home' ? '#work' : `${routes.home}#work`;
  if (href === '/') return routes.home;
  if (href === '/story') return routes.story;
  if (href === '/cv') return routes.cv;
  return href;
}

/** The shared primary navigation (Work, Story, CV, Contact) for one page of a direction. */
export function editionNavigation(slug: EditionSlug, page: EditionPage) {
  return primaryNavigation.map(link => ({
    ...link,
    href: editionHref(slug, page, link.href),
    current: (page === 'story' && link.href === '/story') || (page === 'cv' && link.href === '/cv')
  }));
}

/** Only claim pages rendered inside this edition's persistent layout. */
export function editionPageOf(slug: EditionSlug, pathname: string): EditionPage | undefined {
  const routes = editionRoutes(slug);
  const path = pathname.replace(/\/$/, '');
  if (path === routes.home) return 'home';
  return undefined;
}
