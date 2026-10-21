import { pushState } from '$app/navigation';
import { scrollToElement, smoothScrollInstance } from '$lib/motion/smooth-scroll';
import { askController } from '$lib/ask/state';
import { get } from 'svelte/store';

/** Hold the page still behind a modal menu; returns the release. */
export function lockPage() {
  const lenis = smoothScrollInstance();
  lenis?.stop();
  const html = document.documentElement;
  const previous = html.style.overflow;
  html.style.overflow = 'hidden';
  return () => { html.style.overflow = previous; lenis?.start(); };
}

/**
 * Menu links carry `data-mobile-route-link`, so the global anchor handler leaves
 * them to us: close the menu first, then travel to an in-page destination.
 */
export function followMenuLink(event: MouseEvent, close: () => Promise<void> | void) {
  const link = event.currentTarget as HTMLAnchorElement;
  const url = new URL(link.href, location.href);
  if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) { void close(); return; }
  event.preventDefault();
  let target: HTMLElement | null = null;
  try { target = document.getElementById(decodeURIComponent(url.hash.slice(1))); } catch { /* invalid hash */ }
  void Promise.resolve(close()).then(() => {
    if (!target) return;
    if (location.hash !== url.hash) pushState(url, {});
    scrollToElement(target, { focus: true });
  });
}

/** The header's Ask control, shared by all three navigation systems. */
export function toggleAsk(restoreFocusOnClose = true) {
  get(askController)?.toggle(restoreFocusOnClose);
}
