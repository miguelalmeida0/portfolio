import { primaryNavigation } from '$lib/content/navigation';

/** Canonical destinations for the selected typographic portfolio. */
export const d1Routes = {
  home: '/',
  story: '/story',
  cv: '/cv',
  work: '/#work'
} as const;

export type D1Page = keyof typeof d1Routes;

/** Rewrites a production destination to its Direction 01 equivalent. */
export function d1Href(href: string, page: D1Page) {
  if (href === '/#work') return page === 'home' ? '#work' : `${d1Routes.home}#work`;
  if (href === '/') return d1Routes.home;
  if (href === '/story') return d1Routes.story;
  if (href === '/cv') return d1Routes.cv;
  return href;
}

export const d1Navigation = (page: D1Page) => primaryNavigation.map(link => ({
  ...link,
  href: d1Href(link.href, page),
  current: (page === 'story' && link.href === '/story') || (page === 'cv' && link.href === '/cv') || (page === 'work' && link.href === '/#work')
}));

/** In-page destinations shown under the masthead on long pages. */
export type D1Section = { id: string; label: string };
