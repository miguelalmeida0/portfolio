<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { beforeNavigate } from '$app/navigation';
  import { page } from '$app/stores';
  import { gsap } from 'gsap';
  import { hero } from '$lib/hero-lab/content';
  import { followMenuLink, lockPage, toggleAsk } from '$lib/hero-lab/sheet';
  import { curves } from '$lib/hero-lab/runtime';
  import { askController, askView } from '$lib/ask/state';
  import { motionState } from '$lib/motion/policy';
  import { editionNavigation, editionPageOf, editionRoutes } from '$lib/hero-lab/editions/site';

  // Lives in the direction's layout: it stays put while the strip shutter changes pages.
  const current = $derived(editionPageOf('experimental', $page.url.pathname) ?? 'home');
  const links = $derived(editionNavigation('experimental', current));
  const homeHref = $derived(current === 'home' ? '#top' : editionRoutes('experimental').home);

  let rail = $state<HTMLElement>();
  let dialog = $state<HTMLDialogElement>();
  let trigger = $state<HTMLButtonElement>();
  let open = $state(false);
  let release = () => {};
  let travelling = false;

  async function show() {
    if (!dialog) return;
    open = true;
    await tick();
    dialog.showModal();
    release = lockPage();
    if ($motionState.reduced) return;
    const sheet = dialog;
    gsap.fromTo(sheet.querySelectorAll('[data-sheet-strip]'), { scaleY: 0 }, { scaleY: 1, transformOrigin: '50% 0%', duration: .32, ease: curves.shutter, stagger: .03 });
    gsap.fromTo(sheet.querySelectorAll('[data-sheet-item]'), { yPercent: 110 }, { yPercent: 0, duration: .6, ease: curves.settle, stagger: .05, delay: .2 });
  }
  async function hide() {
    // Hold the element: a link to another page unmounts nothing here, but the
    // layout itself may leave the direction while the sheet animates shut.
    const sheet = dialog;
    if (!sheet?.open) return;
    if (!$motionState.reduced) {
      await gsap.to(sheet.querySelectorAll('[data-sheet-strip]'), { scaleY: 0, transformOrigin: '50% 100%', duration: .26, ease: curves.shutter, stagger: .02 });
    }
    if (sheet.open) sheet.close();
    release(); release = () => {};
  }
  function closed() {
    open = false; release(); release = () => {};
    if (!travelling) trigger?.focus({ preventScroll: true });
    travelling = false;
  }
  function travel(event: MouseEvent) { travelling = true; followMenuLink(event, hide); }
  beforeNavigate(() => { if (dialog?.open) dialog.close(); });

  onMount(() => {
    if (!rail || $motionState.reduced) return;
    // The rail arrives once per visit; page changes inside the direction keep it still.
    const tween = gsap.from(rail, { xPercent: -100, duration: .8, ease: curves.settle, delay: .05 });
    return () => { tween.kill(); release(); };
  });
</script>

<header class="x-nav" data-x-nav>
  <!-- Desktop: a plum rail on the left edge with the name set vertically. -->
  <div class="x-rail" bind:this={rail} data-x-rail>
    <a href={homeHref} class="x-id" data-identity-home aria-label={hero.homeLabel}>
      <span class="x-name">{hero.name.first} {hero.name.last}</span>
      <span class="x-city" data-ask-id="city">{hero.city}</span>
    </a>
    <nav aria-label="Main navigation" class="x-links">
      {#each links as link}
        <a href={link.href} data-ask-id={`nav-${link.label.toLowerCase()}`} aria-current={link.current ? 'page' : undefined}>
          <span class="x-link-fill" aria-hidden="true"></span><span class="x-link-label">{link.label}</span>
        </a>
      {/each}
    </nav>
    <button type="button" class="x-ask" data-ask-trigger disabled={!$askController}
      aria-expanded={$askView.state !== 'idle'} onclick={() => toggleAsk(true)}><span>Ask MiguelLLM</span></button>
  </div>

  <!-- Compact: a top bar and a full-screen menu. -->
  <div class="x-bar">
    <a href={homeHref} class="x-bar-id" aria-label={hero.homeLabel}>{hero.name.first} {hero.name.last} <span>{hero.city}</span></a>
    <button bind:this={trigger} type="button" class="x-menu-toggle" aria-haspopup="dialog" aria-expanded={open} aria-controls="x-menu" onclick={show}>Menu</button>
  </div>
</header>

<dialog bind:this={dialog} id="x-menu" class="x-sheet" aria-label="Site menu" onclose={closed}>
  <span class="x-sheet-strips" aria-hidden="true">{#each [0, 1, 2, 3, 4, 5] as i}<span data-sheet-strip style:--i={i}></span>{/each}</span>
  <div class="x-sheet-inner">
    <div class="x-sheet-top">
      <span class="x-sheet-name">{hero.name.first} {hero.name.last}</span>
      <button type="button" class="x-sheet-close" onclick={hide}>Close</button>
    </div>
    <ul>
      {#each links as link, index}
        <li>
          <a href={link.href} data-mobile-route-link onclick={travel} aria-current={link.current ? 'page' : undefined}>
            <span class="x-sheet-num" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <span class="x-sheet-mask"><span class="x-sheet-word" data-sheet-item>{link.label}</span></span>
          </a>
        </li>
      {/each}
    </ul>
    <button type="button" class="x-sheet-ask" disabled={!$askController} onclick={async () => { await hide(); toggleAsk(false); }}>Ask MiguelLLM</button>
  </div>
</dialog>

<style>
  .x-nav { --rail: 92px; }
  .x-rail { position: fixed; z-index: 60; top: 0; bottom: 0; left: 0; width: var(--rail); display: flex; flex-direction: column; align-items: stretch; background: var(--plum); color: var(--lime); }
  .x-id { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 26px 0 22px; color: inherit; text-decoration: none; border-bottom: 1px solid rgb(228 237 191 / .3); }
  .x-name { writing-mode: vertical-rl; transform: rotate(180deg); font: 700 30px/1 'Lab Antonio', 'Arial Narrow', sans-serif; letter-spacing: .02em; white-space: nowrap; }
  .x-city { writing-mode: vertical-rl; transform: rotate(180deg); font: 400 13px/1 'Lab Mono', monospace; letter-spacing: .06em; text-transform: uppercase; }
  .x-id:focus-visible { outline: 3px solid var(--lime); outline-offset: -6px; }
  .x-links { display: flex; flex-direction: column; flex: 1; justify-content: center; }
  .x-links a { position: relative; isolation: isolate; display: flex; justify-content: center; align-items: center; flex: 1 1 0; max-height: 170px; min-height: calc(44px / var(--lab-zoom, 1)); padding: 18px 0; color: inherit; text-decoration: none; border-top: 1px solid rgb(228 237 191 / .3); }
  .x-links a:last-child { border-bottom: 1px solid rgb(228 237 191 / .3); }
  .x-link-label { writing-mode: vertical-rl; transform: rotate(180deg); font: 700 21px/1 'Lab Antonio', 'Arial Narrow', sans-serif; letter-spacing: .08em; text-transform: uppercase; transition: color .3s; }
  .x-link-fill { position: absolute; inset: 0; z-index: -1; background: var(--lime); transform: scaleX(0); transform-origin: 0 50%; transition: transform .45s cubic-bezier(.16,1,.3,1); }
  .x-links a:is(:hover, :focus-visible) .x-link-fill, .x-links a[aria-current='page'] .x-link-fill { transform: scaleX(1); }
  .x-links a:is(:hover, :focus-visible), .x-links a[aria-current='page'] { color: var(--plum); }
  .x-links a[aria-current='page']::after { content: ''; position: absolute; right: 0; top: 0; bottom: 0; width: 5px; background: var(--ink); }
  .x-links a:focus-visible { outline: 3px solid var(--ink); outline-offset: -5px; }
  .x-ask { min-height: 168px; padding: 18px 0; border: 0; border-top: 1px solid rgb(228 237 191 / .3); background: transparent; color: var(--lime); cursor: pointer; transition: background-color .3s, color .3s; }
  .x-ask span { display: inline-block; writing-mode: vertical-rl; transform: rotate(180deg); font: 600 15px/1 var(--hero-font); letter-spacing: .02em; }
  .x-ask:hover, .x-ask[aria-expanded='true'] { background: var(--lime); color: var(--plum); }
  .x-ask:focus-visible { outline: 3px solid var(--lime); outline-offset: -6px; }
  .x-ask:disabled { opacity: .5; cursor: default; }

  .x-bar { display: none; }
  @media (max-width: 1023px) {
    .x-rail { display: none; }
    .x-bar { position: fixed; z-index: 60; inset: 0 0 auto 0; height: 60px; display: flex; align-items: center; justify-content: space-between; padding: 0 20px; background: var(--plum); color: var(--lime); }
    .x-bar-id { display: inline-flex; align-items: baseline; gap: 12px; min-height: 44px; align-items: center; color: inherit; text-decoration: none; font: 700 24px/1 'Lab Antonio', 'Arial Narrow', sans-serif; letter-spacing: .02em; }
    .x-bar-id span { font: 400 12px/1 'Lab Mono', monospace; letter-spacing: .06em; text-transform: uppercase; }
    .x-menu-toggle { min-height: 44px; min-width: 64px; padding: 0 14px; border: 2px solid var(--lime); background: transparent; color: var(--lime); font: 700 18px/1 'Lab Antonio', 'Arial Narrow', sans-serif; letter-spacing: .06em; text-transform: uppercase; cursor: pointer; }
    .x-bar-id:focus-visible, .x-menu-toggle:focus-visible { outline: 3px solid var(--lime); outline-offset: 3px; }
  }

  .x-sheet { position: fixed; inset: 0; width: 100%; max-width: none; height: 100dvh; max-height: none; margin: 0; padding: 0; border: 0; background: transparent; color: var(--lime); overscroll-behavior: contain; }
  .x-sheet::backdrop { background: transparent; }
  .x-sheet-strips { position: absolute; inset: 0; display: grid; grid-template-columns: repeat(6, 1fr); }
  .x-sheet-strips span { background: var(--plum); }
  .x-sheet-inner { position: relative; display: flex; flex-direction: column; height: 100%; overflow-y: auto; padding: 8px 20px max(24px, env(safe-area-inset-bottom)); }
  .x-sheet-top { display: flex; align-items: center; justify-content: space-between; min-height: 52px; border-bottom: 2px solid var(--lime); }
  .x-sheet-name { font: 700 24px/1 'Lab Antonio', 'Arial Narrow', sans-serif; }
  .x-sheet-close { min-height: 44px; min-width: 44px; border: 0; background: none; color: var(--lime); font: 700 18px/1 'Lab Antonio', 'Arial Narrow', sans-serif; letter-spacing: .06em; text-transform: uppercase; cursor: pointer; }
  ul { list-style: none; margin: 18px 0 0; padding: 0; }
  li a { display: grid; grid-template-columns: 40px 1fr; align-items: end; padding: 6px 0 10px; border-bottom: 1px solid rgb(228 237 191 / .35); color: inherit; text-decoration: none; }
  li a[aria-current='page'] .x-sheet-word { color: var(--paper); }
  .x-sheet-num { padding-bottom: 12px; font: 400 13px/1 'Lab Mono', monospace; }
  .x-sheet-mask { display: block; overflow: hidden; }
  .x-sheet-word { display: block; font: 700 clamp(60px, 18vw, 104px)/.9 'Lab Antonio', 'Arial Narrow', sans-serif; text-transform: uppercase; }
  li a:focus-visible, .x-sheet-close:focus-visible, .x-sheet-ask:focus-visible { outline: 3px solid var(--lime); outline-offset: 2px; }
  .x-sheet-ask { margin-top: auto; min-height: 52px; border: 2px solid var(--lime); background: var(--lime); color: var(--plum); font: 700 16px/1 var(--hero-font); cursor: pointer; }
  @media (prefers-reduced-motion: reduce) { .x-link-label, .x-link-fill, .x-ask { transition: none; } }

  /* The rail takes the left edge of the whole direction, footer included. */
  @media (min-width: 1024px) {
    :global(#portfolio-content[data-hero-lab]:has([data-x-nav])) { padding-left: 92px; }
  }
</style>
