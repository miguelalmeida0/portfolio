import { SITE_ORIGIN } from '$lib/config/site';

/** Portfolio pages stay in this tab; PDFs and external websites open separately. */
export function destinationLink(href: string | undefined, download?: unknown) {
  const value = href?.trim();
  let external = false;
  if (value && /^(https?:)?\/\//i.test(value)) {
    try { external = new URL(value, SITE_ORIGIN).origin !== SITE_ORIGIN; } catch { /* Invalid URLs are not external destinations. */ }
  }
  const pdf = Boolean(value && /\.pdf(?:[?#]|$)/i.test(value));
  if (!pdf && (!external || download)) {
    return { target: undefined, rel: undefined, 'aria-description': undefined };
  }
  return { target: '_blank', rel: 'noopener noreferrer', 'aria-description': 'Opens in a new tab' };
}
