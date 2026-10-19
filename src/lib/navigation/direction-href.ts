// Citations use canonical portfolio pages, including those opened from old previews.
export function directionHref(href: string, _pathname: string): string {
  const canonical = href.replace(/^\/hero-lab\/typographic(?=\/|[?#]|$)/, '') || '/';
  return /^[?#]/.test(canonical) ? '/' + canonical : canonical;
}
