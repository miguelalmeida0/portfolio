import { destinationLabel } from '$lib/navigation/destination-label';
import { afterNavigate, beforeNavigate, goto, onNavigate, preloadData, pushState } from '$app/navigation';
import { flushSync, onDestroy, onMount, tick } from 'svelte';
import { writable } from 'svelte/store';
import { motionSnapshot, motionState } from './policy';
import { resetScrollMotion, scrollToElement, syncScrollPosition } from './smooth-scroll';
import { easing } from './tokens';

/** Shared-frame metadata remains available for native desktop history.
 * Forward page changes use the named downward shutter below.
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

/** One owner for named forward shutters and native desktop history. */
export function installRouteTransitions(getShutter: () => HTMLElement) {
  const mobileState = writable<'idle' | 'covering' | 'covered' | 'revealing'>('idle');
  const navigationError = writable('');
  const routeLabel = writable('');
  let active = false, ownedNavigation = false, disposed = false;
  let nativeTransition: ReturnType<StartViewTransition> | undefined;
  type Claim = {
    url: URL; history: boolean; column: number; strips: HTMLElement[]; title: HTMLElement | null;
    animations: Set<Animation>; ready: Promise<void>; opaque: Promise<void>;
    safety?: ReturnType<typeof setTimeout>; finish?: Promise<void>; completion?: Promise<void>;
    waits: Set<() => void>; released: boolean; superseded: boolean;
  };
  let claim: Claim | undefined;
  // A shutter may be released before Kit finishes the commit it was gating.
  // Keep that boundary independently so a later route always renders last.
  let pendingCommit: Promise<void> | undefined;
  let queued: { url: URL; close: () => void | Promise<void>; behind?: Promise<void> } | undefined;
  let intent = 0;
  let cancelFragmentAlignment: (() => void) | undefined;
  let press: { href: string; x: number; at: number } | undefined;
  const frame = () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
  const allowed = (url: URL) => url.origin === location.origin && !url.pathname.startsWith('/out/') && url.pathname !== '/cv/pdf';
  // The craft previews keep their navigation continuous. Their page entrances
  // own the motion; a covering shutter would lock rapid mobile history input.
  const decorative = () => !/^\/hero-lab\/(counterform|bearing|throughline)(?:\/|$)/.test(location.pathname)
    && !motionSnapshot().reduced && document.visibilityState === 'visible';
  const changed = (url: URL) => url.pathname !== location.pathname;

  afterNavigate(({ from, to, type }) => {
    cancelFragmentAlignment?.();
    if (!to?.url.hash || type === 'popstate' || from?.url.pathname === to.url.pathname || document.fonts?.status !== 'loading') return;
    // Preserve the test branch's late-font correction, using the shared scroll
    // owner so it cancels an earlier tween instead of competing with it.
    const destination = to.url.href;
    let cancelled = false;
    const inputs = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const;
    const cancel = () => {
      cancelled = true;
      inputs.forEach(name => window.removeEventListener(name, cancel, true));
      if (cancelFragmentAlignment === cancel) cancelFragmentAlignment = undefined;
    };
    cancelFragmentAlignment = cancel;
    inputs.forEach(name => window.addEventListener(name, cancel, { once: true, passive: true, capture: true }));
    void document.fonts.ready.then(frame).then(() => {
      if (cancelled || disposed || location.href !== destination) return;
      try {
        const target = document.getElementById(decodeURIComponent(to.url.hash.slice(1)));
        if (target) scrollToElement(target, { duration: 0 });
      } catch { /* Malformed fragments retain normal browser positioning. */ }
    }).catch(() => {}).finally(cancel);
  });

  function restoreNavigationFocus() {
    if (disposed) return;
    let target = document.getElementById('main');
    try { target = document.getElementById(decodeURIComponent(location.hash.slice(1))) ?? target; } catch {}
    if (!target) return;
    const had = target.hasAttribute('tabindex');
    if (!had) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    if (!had) target.addEventListener('blur', () => target?.removeAttribute('tabindex'), { once: true });
  }
  function release(c: Claim) {
    if (c.released) return;
    c.released = true;
    clearTimeout(c.safety);
    c.waits.forEach(finish => finish()); c.waits.clear();
    c.animations.forEach(animation => animation.cancel()); c.animations.clear();
    [...c.strips, ...(c.title ? [c.title] : [])].forEach(node => { node.style.willChange = ''; });
    if (claim !== c) return;
    const shutter = getShutter();
    shutter.hidden = true;
    try { shutter.hidePopover?.(); } catch {}
    active = false; ownedNavigation = false; claim = undefined;
    mobileState.set('idle');
  }
  function invalidateQueued() { intent++; queued = undefined; }
  function supersedeHistory() {
    invalidateQueued();
    if (claim) { claim.superseded = true; release(claim); }
  }
  function queueLatest(url: URL, close: () => void | Promise<void> = () => {}) {
    const version = ++intent;
    const interrupted = claim;
    queued = { url, close, behind: interrupted?.completion ?? pendingCommit };
    if (interrupted) interrupted.superseded = true;
    void (interrupted?.completion ?? pendingCommit ?? Promise.resolve()).catch(() => {}).then(async () => {
      if (disposed || version !== intent || !queued) return;
      const latest = queued;
      if (claim === interrupted && interrupted) release(interrupted);
      await latest.close();
      if (disposed || version !== intent) return;
      queued = undefined;
      try { await goto(latest.url); }
      catch {
        if (!disposed && version === intent) {
          if (claim?.url.href === latest.url.href) release(claim);
          navigationError.set('Navigation could not finish. Please try again.');
        }
      }
    }).catch(() => { if (!disposed && version === intent) { queued = undefined; navigationError.set('Navigation could not finish. Please try again.'); } });
  }
  function wait(c: Claim, ms: number) {
    return new Promise<void>(resolve => {
      const done = () => { clearTimeout(timer); c.waits.delete(done); resolve(); };
      const timer = setTimeout(done, ms);
      c.waits.add(done);
    });
  }
  function animate(c: Claim, node: HTMLElement, from: string, to: string, ms: number, delay: number, ease: string) {
    node.style.transform = to;
    if (c.released || !decorative()) return Promise.resolve();
    node.style.willChange = 'transform';
    const animation = node.animate([{ transform: from }, { transform: to }], { duration: ms, delay, easing: ease, fill: 'both' });
    c.animations.add(animation);
    return animation.finished.catch(() => {}).finally(() => { animation.cancel(); c.animations.delete(animation); });
  }
  function begin(url: URL, history = false, x = innerWidth / 2): Claim {
    active = true; navigationError.set('');
    nativeTransition?.skipTransition(); releaseClaimedFrames();
    const shutter = getShutter();
    const label = history ? '' : destinationLabel(url) ?? '';
    // Flush the store's text binding before cover without replacing Svelte's text node.
    flushSync(() => routeLabel.set(label));
    const title = shutter.querySelector<HTMLElement>('.route-title-text');
    const strips = [...shutter.querySelectorAll<HTMLElement>('.route-strip')].slice(0, matchMedia('(max-width: 767px)').matches ? 4 : 6);
    const c: Claim = { url, history, column: Math.max(0, Math.min(strips.length - 1, Math.floor(x / innerWidth * strips.length))),
      strips, title, animations: new Set(), ready: Promise.resolve(), opaque: Promise.resolve(), waits: new Set(), released: false, superseded: false };
    claim = c;
    shutter.hidden = false;
    // Native modal menus live in the top layer. The noninteractive popover goes
    // above them, so the menu can remain mounted until the strips are opaque.
    try { shutter.showPopover?.(); } catch {}
    mobileState.set('covering');
    c.safety = setTimeout(() => {
      release(c);
      navigationError.set('Navigation is taking longer than expected. You can try again.');
      void tick().then(() => { if (!disposed && !active) restoreNavigationFocus(); });
    }, 4000);
    c.opaque = Promise.all(strips.map((strip, i) => {
      strip.style.transformOrigin = 'top';
      return animate(c, strip, 'scaleY(0)', 'scaleY(1)', 240, Math.abs(i - c.column) * 16, easing.shutter);
    })).then(() => { if (!c.released) mobileState.set('covered'); });
    const named = label && title ? animate(c, title, 'translateY(110%)', 'translateY(0)', 280, 90, easing.settle)
      .then(() => c.released ? undefined : wait(c, 160)) : Promise.resolve();
    c.ready = Promise.all([c.opaque, named]).then(() => {});
    return c;
  }
  function covered(c: Claim) {
    if (c.released) return;
    resetScrollMotion();
    window.dispatchEvent(new CustomEvent('route:covered'));
  }
  function reveal(c: Claim) {
    if (c.finish) return c.finish;
    c.finish = (async () => {
      await tick(); await frame();
      if (disposed) return;
      if (c.released || claim !== c) {
        if (!active && !c.history && !c.superseded && location.pathname === c.url.pathname) restoreNavigationFocus();
        return;
      }
      if (!c.history && c.url.hash) window.scrollTo({ top: 0, behavior: 'instant' });
      syncScrollPosition();
      mobileState.set('revealing');
      const movements = c.strips.map((strip, i) => {
        strip.style.transformOrigin = 'bottom';
        return animate(c, strip, 'scaleY(1)', 'scaleY(0)', 260, 60 + Math.abs(i - c.column) * 16, easing.shutter);
      });
      if (c.title?.textContent) movements.push(animate(c, c.title, 'translateY(0)', 'translateY(-110%)', 200, 0, easing.shutter));
      if (!c.history && c.url.hash) {
        try { const target = document.getElementById(decodeURIComponent(c.url.hash.slice(1))); if (target) scrollToElement(target, { duration: 500 }); } catch {}
      }
      await Promise.all(movements);
      release(c);
      await tick();
      if (!disposed && !active && !c.history && !c.superseded) restoreNavigationFocus();
    })().catch(() => { release(c); }).finally(() => release(c));
    return c.finish;
  }
  const inputX = (event: MouseEvent, link: HTMLAnchorElement) => {
    const rect = link.getBoundingClientRect();
    return event.detail ? event.clientX : rect.left + rect.width / 2;
  };
  const rememberPress = (event: MouseEvent) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href]');
    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    if (!active && queued && allowed(new URL(link.href))) invalidateQueued();
    // Kit skips beforeNavigate while its initial route load is in progress.
    // Stop a second (including programmatic) link click at the same owner.
    // Kit can push the pending URL before its DOM commit. A link back to that
    // path must still be intercepted, or it can supersede the queued destination.
    if (active && allowed(new URL(link.href))) {
      event.preventDefault(); event.stopImmediatePropagation(); queueLatest(new URL(link.href)); return;
    }
    press = { href: link.href, x: inputX(event, link), at: performance.now() };
  };
  onMount(() => {
    document.addEventListener('click', rememberPress, true);
    window.addEventListener('popstate', supersedeHistory, true);
    const unsubscribe = motionState.subscribe(({ reduced }) => { if (reduced && claim) release(claim); });
    const visibility = () => { if (document.visibilityState !== 'visible' && claim) release(claim); };
    document.addEventListener('visibilitychange', visibility);
    return () => { unsubscribe(); document.removeEventListener('click', rememberPress, true); document.removeEventListener('visibilitychange', visibility); window.removeEventListener('popstate', supersedeHistory, true); };
  });

  beforeNavigate(navigation => {
    cancelFragmentAlignment?.();
    // Browser history must supersede a pending decorative transition. Cancelling
    // popstate after Kit has pushed its URL can leave the old route under that URL.
    if (navigation.type === 'popstate') supersedeHistory();
    if (active && !navigation.willUnload) {
      if (ownedNavigation && navigation.type === 'goto') { ownedNavigation = false; return; }
      navigation.cancel();
      const to = navigation.to?.url;
      if (to && allowed(to)) queueLatest(to);
      return;
    }
    if (queued) invalidateQueued();
    const to = navigation.to?.url;
    if (navigation.type === 'popstate') routeLabel.set('');
    if (!to || navigation.willUnload || navigation.type === 'popstate' || !allowed(to) || !changed(to) || !decorative()) return;
    const x = press?.href === to.href && performance.now() - press.at < 1000 ? press.x : innerWidth / 2;
    const c = begin(to, false, x);
    c.completion = navigation.complete;
    // A later beforeNavigate callback can cancel before onNavigate is reached.
    // Own that rejection at the initial claim, not only after route loading.
    void navigation.complete.catch(() => release(c));
  });

  async function navigateFromMenu(event: MouseEvent, close: () => void | Promise<void>) {
    const link = event.currentTarget as HTMLAnchorElement;
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (link.target && link.target !== '_self') { await close(); return; }
    if (link.hasAttribute('download') || link.download) return;
    const url = new URL(link.href);
    if (!allowed(url)) return;
    if (!active && queued) invalidateQueued();
    if (url.pathname === location.pathname && url.search === location.search && url.hash) {
      let target: HTMLElement | null;
      try { target = document.getElementById(decodeURIComponent(url.hash.slice(1))); } catch { return; }
      if (target) {
        event.preventDefault(); await close(); await tick();
        if (location.hash !== url.hash) pushState(url, {});
        scrollToElement(target, { focus: true }); return;
      }
    }
    event.preventDefault();
    if (active) { queueLatest(url, close); return; }
    if (!changed(url) || !decorative()) {
      await close();
      try { await goto(url); await tick(); restoreNavigationFocus(); }
      catch { navigationError.set('Navigation could not finish. Please try again.'); }
      return;
    }
    void preloadData(url.href).catch(() => undefined);
    const c = begin(url, false, inputX(event, link));
    try {
      await c.opaque;
      if (c.released || disposed) return;
      await close(); await tick();
      if (c.released || disposed) return;
      ownedNavigation = true;
      await goto(url);
      await reveal(c);
    } catch {
      navigationError.set('Navigation could not finish. Please try again.');
      await reveal(c);
    }
  }

  onNavigate(navigation => {
    // Accepted intent may bypass beforeNavigate while Kit is already loading.
    // A queue-owned goto clears its request just before dispatch, so it retains
    // authorization while a genuinely newer navigation cancels older work.
    if (queued && queued.behind !== navigation.complete) invalidateQueued();
    // Kit may skip beforeNavigate during an in-flight route load. Release the
    // cover, then let that obsolete commit settle before history renders its
    // destination; otherwise the delayed forward commit can win the race.
    const previous = pendingCommit;
    pendingCommit = navigation.complete;
    const finished = () => { if (pendingCommit === navigation.complete) pendingCommit = undefined; };
    void navigation.complete.then(finished, finished);
    const prior = previous && previous !== navigation.complete ? previous.catch(() => {}) : Promise.resolve();
    if (navigation.type === 'popstate' && previous && previous !== navigation.complete) {
      supersedeHistory();
      routeLabel.set('');
      return prior.then(() => {
        resetScrollMotion();
        return () => { syncScrollPosition(); if (!disposed) restoreNavigationFocus(); };
      });
    }
    const from = navigation.from?.url, to = navigation.to?.url;
    if (!to || !from || from.pathname === to.pathname || !allowed(to)) return;
    let current = claim;
    if (current?.completion && current.completion !== navigation.complete) {
      current.superseded = true; release(current); current = undefined;
    }
    if (!current && navigation.type !== 'popstate' && decorative()) current = begin(to);
    if (!current && navigation.type === 'popstate' && decorative() && matchMedia('(max-width: 719px)').matches) current = begin(to, true);
    if (current && !current.released) {
      const c = current;
      c.completion = navigation.complete;
      // Own rejections immediately; an abort while waiting for cover is not unhandled.
      void navigation.complete.then(() => c.ready.then(() => reveal(c)), () => c.ready.then(() => reveal(c))).catch(() => {}).finally(() => release(c));
      return Promise.all([prior, c.ready]).then(() => covered(c));
    }
    resetScrollMotion();
    if (!decorative()) return prior.then(() => () => { syncScrollPosition(); if (!disposed && navigation.type !== 'popstate') restoreNavigationFocus(); });
    if (navigation.type !== 'popstate' || !viewTransitionsSupported()) return;
    const start = (document as Document & { startViewTransition?: StartViewTransition }).startViewTransition;
    if (!start) return;
    nativeTransition?.skipTransition();
    return new Promise<void>(resolve => {
      const timer = setTimeout(resolve, 180);
      let owned: ReturnType<StartViewTransition> | undefined;
      const cleanup = () => {
        clearTimeout(timer); resolve();
        if (nativeTransition === owned) { nativeTransition = undefined; releaseClaimedFrames(); }
      };
      try {
        owned = nativeTransition = start.call(document, async () => {
          resolve();
          try { await navigation.complete; } finally { syncScrollPosition(); }
        });
        owned.ready.catch(cleanup); owned.updateCallbackDone.catch(cleanup); owned.finished.then(cleanup, cleanup);
      } catch { cleanup(); }
    });
  });
  onDestroy(() => { disposed = true; cancelFragmentAlignment?.(); intent++; queued = undefined; if (claim) release(claim); nativeTransition?.skipTransition(); });
  return { mobileState, navigationError, routeLabel, navigateFromMenu };
}
