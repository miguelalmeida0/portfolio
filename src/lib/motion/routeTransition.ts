import { beforeNavigate, goto, onNavigate, preloadData, pushState } from '$app/navigation';
import { onDestroy, tick } from 'svelte';
import { writable } from 'svelte/store';
import { motionSnapshot } from './policy';
import { resetScrollMotion, scrollToElement, syncScrollPosition } from './smooth-scroll';
import { easing } from './tokens';

/**
 * Progressive-enhancement route continuity built on the native View Transitions API.
 *
 * Deliberate limits, all of them checked against the real content:
 * - Shared media participation is explicitly limited by SHARED_MEDIA_SLUGS.
 *   The current F24, Leu and Flow links use ordinary route navigation; mobile
 *   continuity still uses this owner’s paper veil.
 * - The tile and the case-study hero do not use the same asset, so this carries the
 *   *frame*, not a claim of identical media. Contents cross-fade inside the box.
 * - Exactly one element may hold `--vt-project-media` per document. The case study
 *   assigns it statically (one hero per page); the grid assigns it to the tile being
 *   opened and clears it afterwards.
 * - The desktop native transition does not delay navigation for an animation.
 *   Mobile menu/history navigation uses the same owner's opaque paper veil;
 *   external links, downloads and modified clicks retain browser behavior.
 */

export const SHARED_MEDIA_SLUGS = ['ghostwriter'] as const;

export const PROJECT_MEDIA_TRANSITION_NAME = 'project-media';
type StartViewTransition = (callback: () => Promise<void> | void) => {
  finished: Promise<void>;
  ready: Promise<void>;
  updateCallbackDone: Promise<void>;
  skipTransition: () => void;
};

function viewTransitionsSupported(): boolean {
  return typeof document !== 'undefined' && 'startViewTransition' in document;
}

/** True when this href ends on a case study whose hero can accept the shared frame. */
export function hasSharedMediaTarget(href: string): boolean {
  const match = /^\/work\/([^/?#]+)/.exec(href);
  return Boolean(match && (SHARED_MEDIA_SLUGS as readonly string[]).includes(match[1]));
}

/** Marks the frame that should carry into the next view, for this navigation only. */
export function claimProjectMediaFrame(frame: HTMLElement | null | undefined, href: string) {
  if (!frame) return;
  if (!viewTransitionsSupported() || motionSnapshot().reduced) return;
  if (!hasSharedMediaTarget(href)) return;

  releaseClaimedFrames();
  frame.style.viewTransitionName = PROJECT_MEDIA_TRANSITION_NAME;
  frame.dataset.vtClaimed = 'true';
}

function releaseClaimedFrames() {
  if (typeof document === 'undefined') return;
  for (const element of document.querySelectorAll<HTMLElement>('[data-vt-claimed="true"]')) {
    element.style.viewTransitionName = '';
    delete element.dataset.vtClaimed;
  }
}

/**
 * Installs the navigation hook. Call once, from the root layout's component body.
 */
export function installRouteTransitions(getVeil: () => HTMLElement) {
  // Layout-local state: the menu and native view transitions share this owner.
  const mobileState = writable<'idle' | 'covering' | 'covered' | 'revealing'>('idle');
  const navigationError = writable('');
  let active = false;
  let ownedNavigation = false;
  let storyMenuNavigating = false;
  let disposed = false;
  let nativeTransition: ReturnType<StartViewTransition> | undefined;
  const animations = new Set<Animation>();
  const ease = easing.settle;
  const frame = () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()));

  async function animate(node: HTMLElement, frames: Keyframe[], duration: number, delay = 0) {
    if (motionSnapshot().reduced) return;
    const animation = node.animate(frames, { duration, delay, easing: ease, fill: 'both' });
    animations.add(animation);
    try { await animation.finished; } catch { /* Teardown cancels owned animations. */ }
    finally { animation.cancel(); animations.delete(animation); }
  }

  // The opaque veil is reserved for existing mobile fallback paths.
  // Story's enhanced navigation is composed from two page snapshots instead.
  async function cover(menu?: HTMLElement | null) {
    active = true;
    navigationError.set('');
    nativeTransition?.skipTransition();
    releaseClaimedFrames();
    resetScrollMotion();
    mobileState.set('covering');
    const veil = getVeil();
    // Set the final value first; WAAPI owns only the compositor interpolation.
    veil.hidden = false;
    veil.style.opacity = '1';
    await Promise.all([
      animate(veil, [{ opacity: 0 }, { opacity: 1 }], 190),
      menu ? animate(menu, [{ opacity: 1, transform: 'translateY(0)' },
        { opacity: 0, transform: 'translateY(-4px)' }], 120, 70) : Promise.resolve()
    ]);
    mobileState.set('covered');
  }

  function reset() {
    if (disposed) return;
    const veil = getVeil();
    veil.hidden = true;
    veil.style.opacity = '0';
    active = false;
    ownedNavigation = false;
    mobileState.set('idle');
  }

  async function reveal() {
    // goto/navigation.complete has already resolved: DOM, focus and Kit scroll
    // restoration precede this tick and frame. No timer decides route readiness.
    await tick();
    await frame();
    if (disposed) return;
    syncScrollPosition();
    mobileState.set('revealing');
    const veil = getVeil();
    veil.style.opacity = '0';
    await animate(veil, [{ opacity: 1 }, { opacity: 0 }], 260);
    reset();
    await tick();
    // Inert content cannot receive fragment focus until the veil unlocks.
    restoreNavigationFocus();
  }

  function restoreNavigationFocus() {
    if (disposed || document.activeElement !== document.body) return;
    let target = document.getElementById('main');
    try {
      target = document.getElementById(decodeURIComponent(location.hash.slice(1))) ?? target;
    } catch { /* An invalid fragment uses the main landmark. */ }
    if (!target) return;
    const hadTabindex = target.hasAttribute('tabindex');
    if (!hadTabindex) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    if (!hadTabindex) target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
  }

  beforeNavigate(navigation => {
    if (active && !navigation.willUnload) {
      if (ownedNavigation && navigation.type === 'goto') ownedNavigation = false;
      else navigation.cancel();
    }
  });

  async function navigateFromMenu(event: MouseEvent, close: () => void) {
    const link = event.currentTarget as HTMLAnchorElement;
    if (!event.defaultPrevented && link.target === '_blank') { close(); return; }
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey ||
      event.shiftKey || event.altKey || link.download || (link.target && link.target !== '_self')) return;
    const url = new URL(link.href);
    if (url.origin === location.origin && url.pathname === location.pathname && url.search === location.search && url.hash) {
      let target: HTMLElement | null;
      try { target = document.getElementById(decodeURIComponent(url.hash.slice(1))); } catch { return; }
      if (target) {
        event.preventDefault();
        close();
        await tick();
        if (location.hash !== url.hash) pushState(url, {});
        scrollToElement(target, { focus: true });
        return;
      }
    }
    if (url.origin !== location.origin) return;

    // Close the small-screen menu before native page snapshots are taken.
    // An open menu appearing in the outgoing snapshot breaks continuity.
    const storyRoute = url.pathname !== location.pathname &&
      (url.pathname === '/story' || location.pathname === '/story');
    if (storyRoute && viewTransitionsSupported() && !motionSnapshot().reduced &&
        document.visibilityState === 'visible') {
      event.preventDefault();
      if (active || storyMenuNavigating) return;
      storyMenuNavigating = true;
      navigationError.set('');
      link.dataset.selected = 'true';
      close();
      try {
        await tick();
        if (disposed) return;
        await goto(url);
        await tick();
        restoreNavigationFocus();
      } catch {
        navigationError.set('Navigation could not finish. Please try again.');
      } finally {
        storyMenuNavigating = false;
        delete link.dataset.selected;
      }
      return;
    }

    if (!matchMedia('(max-width: 719px)').matches) return;
    event.preventDefault();
    if (active) return;
    link.dataset.selected = 'true';
    // Fetch during the cover, but keep the old menu mounted until fully opaque.
    void preloadData(url.href).catch(() => undefined);
    try {
      // Only the links fade. The menu panel must stay opaque over the old page.
      await cover(link.parentElement);
      if (disposed) return;
      close();
      await tick();
      ownedNavigation = true;
      await goto(url);
      await reveal();
    } catch {
      // A rejected/cancelled navigation must never strand an opaque overlay.
      await reveal();
      navigationError.set('Navigation could not finish. Please try again.');
    } finally {
      delete link.dataset.selected;
    }
  }

  onDestroy(() => {
    disposed = true;
    animations.forEach(animation => animation.cancel());
  });

  onNavigate((navigation) => {
    resetScrollMotion();
    // Never snapshot the outgoing menu/page into a competing native transition.
    if (active) return;
    const from = navigation.from?.url;
    const to = navigation.to?.url;

    // Story transitions share the real old and new compositions, rather than
    // displaying a blank veil between them. Keep both page images overlapping
    // while the persistent site header is captured in its own stable layer.
    const storyRoute = Boolean(from && to && from.pathname !== to.pathname &&
      (from.pathname === '/story' || to.pathname === '/story'));
    if (!storyRoute && navigation.type === 'popstate' && matchMedia('(max-width: 719px)').matches &&
      navigation.from?.url.pathname !== navigation.to?.url.pathname) {
      return cover().then(() => {
        void navigation.complete.then(reveal, reveal);
      });
    }
    if (!viewTransitionsSupported() || document.visibilityState !== 'visible') {
      releaseClaimedFrames();
      return;
    }

    if (motionSnapshot().reduced) {
      releaseClaimedFrames();
      return;
    }

    // A pure hash change on the same page is a scroll, not a route change.
    if (!to || (from && from.pathname === to.pathname)) {
      releaseClaimedFrames();
      return;
    }

    const startViewTransition = (
      document as Document & { startViewTransition?: StartViewTransition }
    ).startViewTransition;

    if (!startViewTransition) {
      releaseClaimedFrames();
      return;
    }

    // Cancel any preceding snapshot before setting this navigation's style
    // flags. An interrupted transition must not erase the successor's marker.
    nativeTransition?.skipTransition();

    // The flag is applied before startViewTransition snapshots the old DOM.
    // It stays on the root until finished, so both image layers use one
    // choreography even if page content or scroll position changes.
    document.documentElement.dataset.routeTransition = 'active';
    document.documentElement.dataset.routeDestination = to.pathname;
    if (storyRoute) {
      document.documentElement.dataset.storyRouteTransition = 'active';
      const header = document.querySelector<HTMLElement>('.wind-header');
      const rect = header?.getBoundingClientRect();
      if (rect && rect.bottom > 0 && rect.top < innerHeight) {
        document.documentElement.dataset.storyNavigationPinned = 'active';
      }
    }

    return new Promise<void>((resolve) => {
      // Navigation must still complete when a background tab or browser policy
      // skips the native transition callback.
      const failSafe = window.setTimeout(resolve, 180);
      let ownedTransition: ReturnType<StartViewTransition> | undefined;
      const cleanup = () => {
        window.clearTimeout(failSafe);
        resolve();
        // An interrupted transition must never delete its successor's state.
        if (ownedTransition && nativeTransition !== ownedTransition) return;
        nativeTransition = undefined;
        delete document.documentElement.dataset.routeTransition;
        delete document.documentElement.dataset.routeDestination;
        delete document.documentElement.dataset.storyRouteTransition;
        delete document.documentElement.dataset.storyNavigationPinned;
        releaseClaimedFrames();
      };
      try {
        const transition = startViewTransition.call(document, async () => {
          window.clearTimeout(failSafe);
          resolve();
          await navigation.complete;
          syncScrollPosition();
        });
        ownedTransition = nativeTransition = transition;
        transition.ready.catch(cleanup);
        // A rapid Back/reload can abort Kit's navigation while the snapshot
        // callback is awaiting it. Each ViewTransition promise rejects
        // independently; own the callback rejection as well as ready/finished.
        transition.updateCallbackDone.catch(cleanup);
        transition.finished.then(cleanup, cleanup);
      } catch { cleanup(); }
    });
  });
  return { mobileState, navigationError, navigateFromMenu };
}
