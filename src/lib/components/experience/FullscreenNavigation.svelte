<script lang="ts">
  import { onMount, tick, type Snippet } from 'svelte';
  import { primaryNavigation } from '$lib/content/navigation';
  import { motionState } from '$lib/motion/policy';
  import { duration, easing } from '$lib/motion/tokens';
  import { resetScrollMotion, syncScrollPosition } from '$lib/motion/smooth-scroll';

  let { identity, navigateFromMenu, navigationTransitionActive, story = false,
    onClosed, restoreFocus }: {
    identity: Snippet;
    story?: boolean;
    navigateFromMenu: (event: MouseEvent, close: () => Promise<void>) => Promise<void>;
    navigationTransitionActive: boolean;
    onClosed: () => void;
    restoreFocus: () => void;
  } = $props();

  let dialog: HTMLDialogElement;
  let closeButton: HTMLButtonElement;
  let entered = $state(false);
  let closing = $state(false);
  let closePromise: Promise<void> | undefined;
  let releaseScroll = () => {};
  const animations = new Set<Animation>();

  function animate(node: HTMLElement, frames: Keyframe[], ms: number, delay = 0) {
    if ($motionState.reduced) return Promise.resolve();
    const animation = node.animate(frames, { duration: ms, delay, easing: easing.settle, fill: 'both' });
    animations.add(animation);
    return animation.finished.catch(() => {}).finally(() => { animation.cancel(); animations.delete(animation); });
  }

  // Finish active animations when the visitor changes their motion preference.
  $effect(() => { if ($motionState.reduced) animations.forEach(animation => animation.finish()); });

  export function close(restore = true, immediate = false): Promise<void> {
    if (closePromise) return closePromise;
    const opacity = getComputedStyle(dialog).opacity;
    const rows = Array.from(dialog.querySelectorAll<HTMLElement>('[data-menu-reveal]')).map(node => {
      const style = getComputedStyle(node);
      return { node, opacity: style.opacity, transform: style.transform };
    });
    closing = true;
    entered = false;
    animations.forEach(animation => animation.cancel());
    closePromise = (async () => {
      // Sample before cancelling so a quick reversal starts at the rendered frame.
      if (!immediate) await Promise.all([
        animate(dialog, [{ opacity }, { opacity: 0 }], duration.drawer),
        ...rows.map(row => animate(row.node, [{ opacity: row.opacity, transform: row.transform },
          { opacity: 0, transform: 'translateY(8px)' }], duration.drawer))
      ]);
      releaseScroll();
      dialog.close();
      onClosed();
      await tick();
      if (restore) restoreFocus();
    })();
    return closePromise;
  }

  function cancel(event: Event) {
    event.preventDefault();
    if (!navigationTransitionActive) void close();
  }

  function containFocus(event: KeyboardEvent) {
    if (event.key !== 'Tab') return;
    const controls = Array.from(dialog.querySelectorAll<HTMLElement>('a[href], button:not(:disabled)'));
    const first = controls[0], last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last?.focus({ preventScroll: true });
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first?.focus({ preventScroll: true });
    }
  }

  onMount(() => {
    resetScrollMotion();
    const top = scrollY;
    const body = document.body;
    const root = document.documentElement;
    const properties = ['position', 'top', 'left', 'right', 'padding-right'] as const;
    const saved = properties.map(property => [property, body.style.getPropertyValue(property), body.style.getPropertyPriority(property)]);
    const overflow = root.style.overflow;
    const scrollbar = innerWidth - root.clientWidth;
    const padding = parseFloat(getComputedStyle(body).paddingRight) || 0;
    body.style.position = 'fixed';
    body.style.top = `${-top}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.paddingRight = `${padding + scrollbar}px`;
    root.style.overflow = 'hidden';
    let released = false;
    releaseScroll = () => {
      if (released) return;
      released = true;
      saved.forEach(([property, value, priority]) => body.style.setProperty(property, value, priority));
      root.style.overflow = overflow;
      window.scrollTo({ top, behavior: 'instant' });
      syncScrollPosition();
    };
    // The top layer supplies background inertness, including on case-study routes.
    dialog.showModal();
    closeButton.focus({ preventScroll: true });
    // Escape closes the menu without invoking any page action.
    const shortcut = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.metaKey || event.ctrlKey || event.altKey) return;
      event.preventDefault(); event.stopImmediatePropagation();
      if (closing || navigationTransitionActive) return;
      void close();
    };
    window.addEventListener('keydown', shortcut, true);
    const frame = requestAnimationFrame(() => { entered = true; });
    void animate(dialog, [{ opacity: 0 }, { opacity: 1 }], duration.drawer);
    dialog.querySelectorAll<HTMLElement>('[data-menu-reveal]').forEach((node, index) => {
      void animate(node, [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }], duration.drawer, index * 25);
    });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('keydown', shortcut, true);
      animations.forEach(animation => animation.cancel());
      dialog.close();
      releaseScroll();
    };
  });
</script>

<dialog bind:this={dialog} id="mobile-navigation" aria-label="Portfolio navigation" aria-modal="true"
  aria-busy={navigationTransitionActive} data-entered={entered} data-closing={closing}
  data-reduced={$motionState.reduced} data-scroll-native data-lenis-prevent oncancel={cancel} onkeydown={containFocus}>
  <div class="menu-shell">
    <div class="menu-header">
      {@render identity()}
      <button bind:this={closeButton} class="menu-close" type="button" aria-label="Close"
        aria-expanded="true" aria-controls="mobile-navigation" disabled={navigationTransitionActive || closing} onclick={() => close()}>
        <span aria-hidden="true"><span></span><span></span></span>
      </button>
    </div>
    <nav data-sveltekit-preload-data="hover" aria-label="Fullscreen navigation" data-mobile-menu-content>
      {#each primaryNavigation as link}
        <a href={link.href} aria-current={story && link.href === '/story' ? 'page' : undefined} aria-label={link.label} aria-describedby={`menu-description-${link.label}`} data-mobile-route-link
          data-menu-reveal data-sveltekit-preload-data="tap" aria-disabled={navigationTransitionActive || closing}
          onclick={event => { if (closing || navigationTransitionActive) event.preventDefault(); else void navigateFromMenu(event, () => close(false, true)); }}>
          <span class="menu-label">{link.label}</span>
          <span class="menu-rule" aria-hidden="true"></span>
          <span class="menu-description" id={`menu-description-${link.label}`}>{link.description}</span>
        </a>
      {/each}
    </nav>
  </div>
</dialog>

<style>
  dialog { position: fixed; inset: 0; width: 100%; max-width: none; height: 100dvh; max-height: none; margin: 0; padding: 0; border: 0; border-radius: 0; background: var(--paper); color: var(--ink); font-family: var(--hero-font); overscroll-behavior: contain; overflow: auto; }
  dialog::backdrop { background: var(--paper); }
  dialog[data-closing='true']::backdrop { background: transparent; }
  .menu-shell { --menu-inset: max(var(--page-x), env(safe-area-inset-left), env(safe-area-inset-right)); width: min(calc(100% - 2 * var(--menu-inset)), var(--content-max)); min-height: 100%; margin-inline: auto; display: grid; grid-template-rows: auto 1fr auto; padding-top: env(safe-area-inset-top); padding-bottom: max(var(--s-5), env(safe-area-inset-bottom)); }
  .menu-header { height: var(--header-height); display: flex; align-items: center; justify-content: space-between; gap: var(--s-4); }
  .menu-close { display: grid; place-items: center; flex: 0 0 44px; width: 44px; height: 44px; padding: 0; border: 0; background: transparent; color: inherit; cursor: pointer; }
  .menu-close > span { position: relative; width: 20px; height: 16px; }
  .menu-close > span > span { position: absolute; top: 7px; left: 0; width: 20px; height: 2px; background: currentColor; transform: translateY(-5px); transition: transform var(--motion-drawer) var(--motion-settle); }
  .menu-close > span > span:last-child { transform: translateY(5px); }
  [data-entered='true'] .menu-close > span > span:first-child { transform: rotate(45deg); }
  [data-entered='true'] .menu-close > span > span:last-child { transform: rotate(-45deg); }
  nav { width: min(100%, 760px); align-self: center; justify-self: center; padding-block: var(--s-7); }
  nav a { display: grid; grid-template-columns: minmax(0, 1fr) 40px 160px; align-items: center; gap: var(--s-7); min-height: 88px; padding-block: var(--s-2); color: inherit; text-decoration: none; }
  .menu-label { font-size: clamp(56px, 5.6vw, 80px); line-height: 1.1; letter-spacing: var(--tracking-heading); font-weight: 400; transition: transform var(--motion-indicator) var(--motion-settle), color var(--motion-feedback) ease; }
  .menu-rule { height: 1px; background: var(--rule-ink); transform-origin: left; transition: transform var(--motion-indicator) var(--motion-settle), background var(--motion-feedback) ease; }
  .menu-description { color: var(--muted); font-size: 12px; line-height: 1.4; letter-spacing: .08em; transition: color var(--motion-feedback) ease, transform var(--motion-indicator) var(--motion-settle); }
  nav a:focus-visible .menu-label { transform: translateX(6px); color: var(--plum); }
  nav a:focus-visible .menu-description { color: var(--ink); transform: translateX(3px); }

  dialog :global(:focus-visible) { outline: 2px solid var(--plum); outline-offset: 6px; }
  @media (hover: hover) {
    nav a:hover .menu-label { transform: translateX(6px); color: var(--plum); }
    nav a:hover .menu-rule { transform: scaleX(1.2); background: var(--muted); }
    nav a:hover .menu-description { color: var(--ink); transform: translateX(3px); }
  }
  /* The page uses 80% desktop density. Cancel it only for the top-layer canvas,
     then retain the exact physical size and inset of the existing brand header. */
  @media (min-width: 1024px) {
    dialog { zoom: 1.25; }
    .menu-shell { width: min(calc(100% - 1.6 * var(--page-x)), calc(var(--content-max) * .8)); }
    :global(#portfolio-content[data-homepage]) .menu-shell { width: calc(100% - 1.6 * var(--page-x)); }
    .menu-header { zoom: .8; }
    nav { transform: translateX(-5%); }
  }
  @media (max-width: 767px) {
    nav { padding-block: var(--s-5); }
    nav a { grid-template-columns: minmax(0, 1fr) 24px 100px; gap: var(--s-4); min-height: 82px; }
    .menu-label { font-size: clamp(44px, 12vw, 64px); }
    .menu-description { font-size: 10px; letter-spacing: .06em; }
  }
  @media (max-width: 359px) {
    nav a { grid-template-columns: 1fr; }
    .menu-rule, .menu-description { display: none; }
  }
  @media (max-height: 600px) {
    nav { padding-block: var(--s-2); }
    nav a { min-height: 56px; padding-block: var(--s-1); }
    .menu-label { font-size: clamp(36px, 8dvh, 48px); }

    .menu-shell { padding-bottom: max(var(--s-2), env(safe-area-inset-bottom)); }
  }
  [data-reduced='true'] :is(.menu-label, .menu-rule, .menu-description, .menu-close > span > span) { transition: none; }
  [data-reduced='true'] nav a :is(.menu-label, .menu-rule, .menu-description) { transform: none; }
  @media (prefers-reduced-motion: reduce) { .menu-label, .menu-rule, .menu-description, .menu-close > span > span { transition: none; } }
</style>
