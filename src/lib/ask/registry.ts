import { areaPlan } from './plan';
import type { AreaId } from './types';

export const rendered = (element: HTMLElement) => element.isConnected && element.getClientRects().length > 0 && getComputedStyle(element).visibility !== 'hidden';
export function sourceElement(id: AreaId): HTMLElement | undefined {
  return [...document.querySelectorAll<HTMLElement>(`[data-ask-id="${id}"]`)].find(rendered);
}
export function sourceText(id: AreaId): string {
  const element = sourceElement(id);
  if (!element) return '';
  // Flags are aria-hidden decorations; they must never become evidence for a quote.
  const flags = [...element.querySelectorAll<HTMLElement>('.ask-flag')];
  flags.forEach(flag => flag.hidden = true);
  const text = element.innerText;
  flags.forEach(flag => flag.hidden = false);
  return text;
}
export function sourceMap() {
  return Object.fromEntries([...document.querySelectorAll<HTMLElement>('[data-ask-id]')].map(el => {
    const id = el.dataset.askId as AreaId; return [id, sourceText(id)];
  }));
}

export function activateRegistry(added: (el: HTMLElement) => void = () => {}) {
  const originals = new Map<HTMLElement, Record<string, string | null>>();
  const identity = document.querySelector<HTMLElement>('[data-identity-home]');
  if (identity) {
    originals.set(identity, Object.fromEntries(['href', 'role', 'tabindex'].map(key => [key, identity.getAttribute(key)])));
    identity.removeAttribute('href'); identity.setAttribute('role', 'group'); identity.tabIndex = -1;
  }
  function update() {
    document.querySelectorAll<HTMLElement>('[data-ask-id]').forEach(el => {
      if (originals.has(el)) return;
      const area = areaPlan(el.dataset.askId!);
      if (!area) return;
      originals.set(el, Object.fromEntries(['role', 'tabindex', 'aria-label', 'data-sveltekit-preload-data', 'data-sveltekit-preload-code'].map(key => [key, el.getAttribute(key)])));
      // Keep native headings in the document outline while their existing
      // click and Enter handlers remain available in Ask mode.
      if (!/^H[1-6]$/.test(el.tagName)) el.setAttribute('role', 'button');
      el.tabIndex = 0;
      // Include the visible label so speech-input users can activate what they see.
      el.setAttribute('aria-label', `Ask: ${area.question} — ${el.innerText.replace(/\s+/g, ' ').trim()}`);
      el.setAttribute('data-sveltekit-preload-data', 'off'); el.setAttribute('data-sveltekit-preload-code', 'off');
      added(el);
    });
  }
  update();
  // Only active while asking: mobile navigation and project stages can mount later.
  const observer = new MutationObserver(update);
  observer.observe(document.querySelector('#portfolio-content')!, { childList: true, subtree: true });
  return () => {
    observer.disconnect();
    originals.forEach((attrs, el) => {
      Object.entries(attrs).forEach(([key, value]) => value === null ? el.removeAttribute(key) : el.setAttribute(key, value));
      el.classList.remove('is-lit', 'is-ebbing', 'is-swaying', 'is-quoted', 'is-asked');
      el.style.removeProperty('--p');
    });
    document.querySelectorAll('.ask-flag').forEach(el => el.remove());
  };
}
