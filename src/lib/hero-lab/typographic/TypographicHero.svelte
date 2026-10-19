<script lang="ts">
  import { onMount } from 'svelte';
  import { hero } from '$lib/hero-lab/content';
  import { labMotion } from '$lib/hero-lab/runtime';
  import { destinationLink } from '$lib/navigation/destination-link';
  import TypographicNav from './TypographicNav.svelte';
  import { typographicMotion } from './motion';
  import { d1Href } from './site';
  import { createTurntableHeader, DEFAULT_CONTENT, type HeaderContent } from './turntable/src';
  import { renderHeader, renderRoleControls } from './turntable/src/template';
  import './turntable/styles/fonts.css';
  import './turntable/styles/turntable-header.css';

  const assets = {
    front: '/turntable-header/miguel-front-contour.webp',
    back: '/turntable-header/miguel-back-repaired.webp',
    room: '/turntable-header/room.jpg'
  };
  const content: HeaderContent = {
    ...DEFAULT_CONTENT,
    ctas: [
      { ...hero.cv, href: d1Href(hero.cv.href, 'home'), variant: 'primary' },
      { ...hero.contact, variant: 'link' }
    ]
  };
  let root: HTMLDivElement;
  let host: HTMLDivElement;
  let controls: HTMLDivElement;

  onMount(() => {
    // Keep the registered photographs intact. The synthetic WebGL body turn
    // distorts the face between these two poses; use the existing image fade.
    const header = createTurntableHeader(host, { assets, content, controlsContainer: controls, renderer: 'fallback' });
    // Move the same controls, retaining their listeners, role and pause state.
    // Small screens keep a single-row masthead; controls scroll with the hero.
    const navControls = controls.parentElement!;
    const heroControls = host.querySelector<HTMLElement>('.mah-copy')!;
    const compact = window.matchMedia('(max-width: 1279px)');
    const placeControls = () => {
      const focused = controls.contains(document.activeElement) ? document.activeElement as HTMLElement : null;
      controls.classList.toggle('in-hero', compact.matches);
      if (compact.matches) heroControls.prepend(controls);
      else navControls.append(controls);
      focused?.focus({ preventScroll: true });
    };
    placeControls();
    compact.addEventListener('change', placeControls);
    // Retain the portfolio destination policy and Ask targets on the real links.
    host.querySelectorAll<HTMLAnchorElement>('.mah-ctas a').forEach(link => {
      Object.entries(destinationLink(link.getAttribute('href') ?? '')).forEach(([key, value]) => {
        if (value !== undefined) link.setAttribute(key, value);
      });
    });
    // Keep scroll transforms separate from Claude's portrait intro and turn.
    const photo = host.querySelector<HTMLElement>('.mah-photo')!;
    const drift = document.createElement('div');
    drift.className = 'mah-portrait-drift';
    photo.before(drift);
    drift.append(photo);
    const motion = labMotion(root, typographicMotion);
    return () => {
      compact.removeEventListener('change', placeControls);
      navControls.append(controls);
      motion.destroy(); header.destroy();
    };
  });
</script>

<svelte:head>
  <link rel="preload" href="/turntable-header/fonts/big-shoulders-display-latin-800-normal.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
  <link rel="preload" href="/turntable-header/fonts/schibsted-grotesk-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
  <link rel="preload" href="/turntable-header/fonts/schibsted-grotesk-latin-600-normal.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
  <link rel="preload" href="/turntable-header/fonts/big-shoulders-display-latin-900-normal.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
</svelte:head>

<div bind:this={root} class="d1" id="top" data-lab-root data-direction="typographic">
  <TypographicNav overHero>
    {#snippet roleControl()}
      <div bind:this={controls} class="turntable-switch">
        {@html renderRoleControls(content, 'engineer', true)}
      </div>
    {/snippet}
  </TypographicNav>
  <div bind:this={host} class="turntable-host">
    {@html renderHeader(content, assets, 'engineer', 'lime', false)}
  </div>
</div>

<style>
  /* Preserve the Selected Work boundary and fixed masthead space. */
  .d1 { --turntable-nav-height: 88px; --turntable-nav-field: #12372D; --gap-below: var(--work-offset, 64px); position: relative; margin-bottom: calc(-1 * var(--gap-below)); padding-top: var(--turntable-nav-height); padding-bottom: var(--gap-below); background: var(--forest); color: var(--ink); font-family: var(--hero-font); }
  .d1::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: var(--turntable-nav-height); background: var(--turntable-nav-field); }
  /* Forest anchors both hero states; contrast tokens stay inside the navbar. */
  .d1 :global([data-mast].mast.hero-overlay), .d1 :global([data-mast].mast.hero-overlay::before) { background: var(--turntable-nav-field); }
  .d1 :global([data-mast].mast.hero-overlay) { --ink: #FAF7ED; --plum: #E2EDBA; --paper: #12372D; }
  /* Only the header uses the source's physical pixel geometry. Navbar and
     following sections keep the portfolio's existing desktop density. */
  .turntable-host { zoom: calc(1 / var(--lab-zoom, 1)); }
  .turntable-host :global(.mah) { --mah-offset-top: calc(var(--turntable-nav-height) * var(--lab-zoom, 1)); }
  .turntable-host :global(.mah-word) { z-index: 1; }
  .turntable-host :global(.mah-portrait-drift) { position: absolute; inset: 0; z-index: 2; pointer-events: none; }
  .turntable-switch { --mah-fg: #FAF7ED; --mah-rule: rgb(250 247 237 / .2); --mah-ease: cubic-bezier(.65,0,.35,1); }
  .turntable-switch :global(.mah-tabs) { position: relative; display: flex; align-items: center; gap: 2px; margin: 0; padding: 4px; border: 1px solid rgb(226 237 186 / .24); border-radius: 999px; background: #12372D; }
  .turntable-switch :global(.mah-tab) { min-height: calc(34px / var(--lab-zoom, 1)); padding: 0 12px; border: 0; border-radius: 999px; color: #E2EDBA; opacity: 1; font: 800 16px/1 'Big Shoulders Display', sans-serif; letter-spacing: .02em; text-transform: uppercase; transition: background-color .2s, color .2s; }
  .turntable-switch :global(.mah-tab[aria-pressed='true']) { background: #E2EDBA; color: #12372D; }
  .turntable-switch :global(.mah-tab i) { display: none; }
  .turntable-switch :global(.mah-pause) { flex: none; width: calc(34px / var(--lab-zoom, 1)); height: calc(34px / var(--lab-zoom, 1)); margin: 0; border: 0; border-radius: 50%; color: #E2EDBA; }
  .turntable-switch :global(.mah-pause:hover) { background: rgb(226 237 186 / .12); }
  .turntable-switch :global(.mah-tabs::before), .turntable-switch :global(.mah-tabs::after) { content: ''; position: absolute; left: 12px; right: 12px; bottom: -5px; height: 2px; border-radius: 2px; background: rgb(226 237 186 / .15); pointer-events: none; }
  .turntable-switch :global(.mah-tabs::after) { background: #E2EDBA; transform: scaleX(var(--mah-p, 0)); transform-origin: left; }
  .turntable-switch :global(button:focus-visible) { outline: 2px solid #FAF7ED; outline-offset: 3px; }
  .turntable-switch :global(.mah-tabs.is-reduced .mah-pause), .turntable-switch :global(.mah-tabs.is-reduced::before), .turntable-switch :global(.mah-tabs.is-reduced::after) { display: none; }
  @media (max-width: 1279px) {
    .d1 :global(.mast.has-role-control) { --mast-h: 88px; }
    .d1 :global(.has-role-control .mast-row) { display: flex; }
    .d1 :global(.mast-role-control) { display: none; }
    /* Reserve the compact switch before hydration moves its single live node. */
    .turntable-host :global(.mah[data-layout=auto] .mah-copy:not(:has(.turntable-switch))::before) { content: ''; display: block; grid-column: 1 / -1; height: 44px; margin-bottom: 24px; }
    .turntable-switch:global(.in-hero) { grid-column: 1 / -1; justify-self: center; width: max-content; margin: 0 auto 24px; pointer-events: auto; }
    .turntable-switch:global(.in-hero) :global(.mah-tabs) { padding: 3px; }
    .turntable-switch:global(.in-hero) :global(.mah-tab) { min-height: 36px; padding: 0 10px; font-size: 14px; }
    .turntable-switch:global(.in-hero) :global(.mah-pause) { width: 36px; height: 36px; margin-left: 0; }
    .turntable-switch:global(.in-hero) :global(.mah-icon) { width: 12px; height: 12px; }
  }
  @media (min-width: 560px) and (max-width: 1279px) {
    .turntable-switch:global(.in-hero) { margin-bottom: 0; }
    .turntable-host :global(.mah[data-layout=auto] .mah-copy:not(:has(.turntable-switch))::before) { margin-bottom: 0; }
  }
  @media (max-width: 1023px) {
    .d1 { --turntable-nav-height: 68px; }
    .d1 :global(.mast.has-role-control) { --mast-h: 68px; }
  }
  @media (prefers-reduced-motion: reduce) {
    .turntable-switch :global(.mah-tab) { transition: none; }
    .turntable-switch :global(.mah-pause), .turntable-switch :global(.mah-tabs::before), .turntable-switch :global(.mah-tabs::after) { display: none; }
  }
</style>
