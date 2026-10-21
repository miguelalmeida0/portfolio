<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { beforeNavigate } from '$app/navigation';
  import { gsap } from 'gsap';
  import { hero } from '$lib/hero-lab/content';
  import { curves } from '$lib/hero-lab/runtime';
  import { followMenuLink, lockPage, toggleAsk } from '$lib/hero-lab/sheet';
  import { editionNavigation, editionRoutes, type EditionPage } from '$lib/hero-lab/editions/site';
  import { askController, askView } from '$lib/ask/state';
  import { motionState } from '$lib/motion/policy';

  let { page = 'home' }: { page?: EditionPage } = $props();
  const links = $derived(editionNavigation('kinetic-story', page));
  const homeHref = $derived(page === 'home' ? '#top' : editionRoutes('kinetic-story').home);

  let dialog = $state<HTMLDialogElement>();
  let trigger = $state<HTMLButtonElement>();
  let progress = $state<HTMLElement>();
  let open = $state(false);
  let solid = $state(false);
  let release = () => {};
  let travelling = false;

  async function show() {
    if (!dialog) return;
    open = true;
    await tick();
    dialog.showModal();
    release = lockPage();
    if ($motionState.reduced) return;
    gsap.fromTo(dialog, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: .55, ease: curves.shutter });
    gsap.fromTo(dialog.querySelectorAll('[data-menu-char]'), { yPercent: 115 }, { yPercent: 0, duration: .7, ease: curves.settle, stagger: .015, delay: .15 });
  }
  async function hide() {
    // Hold the element: a link to another page can unmount this menu mid-close.
    const sheet = dialog;
    if (!sheet?.open) return;
    if (!$motionState.reduced) await gsap.to(sheet, { clipPath: 'inset(100% 0% 0% 0%)', duration: .42, ease: curves.shutter });
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
    const update = () => {
      solid = scrollY > 8;
      const max = document.documentElement.scrollHeight - innerHeight;
      if (progress) progress.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
    };
    update();
    addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    return () => { removeEventListener('scroll', update); removeEventListener('resize', update); release(); };
  });
</script>

<header class="ks-nav" class:solid data-ks-nav>
  <div class="row">
    <a href={homeHref} class="identity" data-identity-home aria-label={hero.homeLabel} data-arm>
      <span class="name">{hero.name.first} {hero.name.last}</span>
      <span class="city" data-ask-id="city">{hero.city}</span>
    </a>
    <nav aria-label="Main navigation" class="links" data-arm>
      {#each links as link}
        <a href={link.href} data-ask-id={`nav-${link.label.toLowerCase()}`} aria-current={link.current ? 'page' : undefined}>
          <span class="sr-only">{link.label}</span>
          <span class="flip" aria-hidden="true">
            {#each [...link.label] as ch, i}<span class="flip-c" style:--d="{i * 28}ms"><span>{ch}</span><span>{ch}</span></span>{/each}
          </span>
        </a>
      {/each}
      <button type="button" class="ask" data-ask-trigger disabled={!$askController}
        aria-expanded={$askView.state !== 'idle'} onclick={() => toggleAsk(true)}>Ask MiguelLLM</button>
    </nav>
    <button bind:this={trigger} type="button" class="menu-toggle" aria-haspopup="dialog" aria-expanded={open}
      aria-controls="ks-menu" onclick={show} data-arm>Menu</button>
  </div>
  <span class="rule" data-ks-nav-rule aria-hidden="true"><span class="progress" bind:this={progress}></span></span>
</header>

<dialog bind:this={dialog} id="ks-menu" class="menu" aria-label="Site menu" onclose={closed}
  onclick={event => { if (event.target === dialog) void hide(); }}>
  <div class="menu-inner">
    <div class="menu-top">
      <span class="name">{hero.name.first} {hero.name.last}</span>
      <button type="button" class="menu-close" onclick={hide}>Close</button>
    </div>
    <ol class="menu-list">
      {#each links as link, index}
        <li>
          <a href={link.href} data-mobile-route-link onclick={travel} aria-current={link.current ? 'page' : undefined}>
            <span class="menu-num" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <span class="menu-word"><span class="sr-only">{link.label}</span>{#each [...link.label] as ch}<span class="menu-mask" aria-hidden="true"><span data-menu-char>{ch}</span></span>{/each}</span>
          </a>
        </li>
      {/each}
    </ol>
    <button type="button" class="menu-ask" disabled={!$askController}
      onclick={async () => { await hide(); toggleAsk(false); }}>Ask MiguelLLM</button>
  </div>
</dialog>

<style>
  .ks-nav { position: fixed; inset: 0 0 auto 0; z-index: 50; color: var(--lime); background: transparent; transition: background-color .4s cubic-bezier(.16,1,.3,1); }
  .ks-nav.solid { background: var(--forest); }
  .row { height: 80px; width: min(calc(100% - 2 * var(--page-x)), var(--content-max)); margin-inline: auto; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
  .identity { display: inline-flex; align-items: baseline; gap: 14px; min-height: calc(44px / var(--lab-zoom, 1)); align-items: center; color: inherit; text-decoration: none; }
  .name { font: 700 28px/1 'Lab Antonio', 'Arial Narrow', sans-serif; letter-spacing: .02em; }
  .city { font: 400 13px/1 'Lab Mono', monospace; text-transform: uppercase; letter-spacing: .06em; color: var(--paper); }
  .links { display: flex; align-items: center; gap: 26px; }
  .links a { position: relative; display: inline-flex; align-items: center; min-height: calc(44px / var(--lab-zoom, 1)); min-width: calc(44px / var(--lab-zoom, 1)); justify-content: center; color: inherit; text-decoration: none; font: 700 21px/1 'Lab Antonio', 'Arial Narrow', sans-serif; letter-spacing: .05em; text-transform: uppercase; }
  /* Hover: each letter flips to its twin in turn, left to right. */
  .flip { display: inline-flex; }
  .flip-c { display: inline-grid; height: 1.05em; overflow: hidden; }
  .flip-c > span { grid-area: 1 / 1; transition: transform .45s cubic-bezier(.16,1,.3,1) var(--d); }
  .flip-c > span:last-child { transform: translateY(105%); color: var(--paper); }
  @media (hover: hover) {
    .links a:hover .flip-c > span:first-child { transform: translateY(-105%); }
    .links a:hover .flip-c > span:last-child { transform: none; }
  }
  .links a:focus-visible .flip-c > span:first-child { transform: translateY(-105%); }
  .links a:focus-visible .flip-c > span:last-child { transform: none; }
  .links a::after { content: ''; position: absolute; left: 4px; right: 4px; bottom: 7px; height: 3px; background: var(--lime); transform: scaleX(0); transform-origin: left; transition: transform .45s cubic-bezier(.16,1,.3,1); }
  .links a[aria-current='page']::after { transform: scaleX(1); }
  :is(.links a, .identity, .ask, .menu-toggle):focus-visible { outline: 3px solid var(--lime); outline-offset: 3px; }
  .ask { min-height: calc(44px / var(--lab-zoom, 1)); padding: 0 16px; border: 2px solid var(--lime); background: transparent; color: var(--lime); font: 700 15px/1 var(--hero-font); cursor: pointer; transition: background-color .3s, color .3s; }
  .ask:hover, .ask[aria-expanded='true'] { background: var(--lime); color: var(--forest); }
  .ask:disabled { opacity: .5; cursor: default; }
  .rule { position: absolute; left: 0; right: 0; bottom: 0; height: 2px; background: rgb(228 237 191 / .22); }
  .progress { position: absolute; inset: 0; background: var(--lime); transform: scaleX(0); transform-origin: left; }
  .menu-toggle { display: none; min-height: 44px; min-width: 44px; padding: 0 14px; border: 2px solid var(--lime); background: none; color: var(--lime); font: 700 18px/1 'Lab Antonio', 'Arial Narrow', sans-serif; letter-spacing: .06em; text-transform: uppercase; cursor: pointer; }
  @media (max-width: 1023px) {
    .row { height: 64px; }
    .links { display: none; }
    .menu-toggle { display: inline-flex; align-items: center; }
    .name { font-size: 23px; }
    .city { font-size: 11px; }
  }

  .menu { position: fixed; inset: 0; width: 100%; max-width: none; height: 100dvh; max-height: none; margin: 0; padding: 0; border: 0; background: var(--forest); color: var(--lime); overscroll-behavior: contain; }
  .menu::backdrop { background: transparent; }
  .menu-inner { display: flex; flex-direction: column; height: 100%; overflow-y: auto; padding: 10px 20px max(24px, env(safe-area-inset-bottom)); }
  .menu-top { display: flex; align-items: center; justify-content: space-between; min-height: 56px; border-bottom: 2px solid rgb(228 237 191 / .3); }
  .menu-close { min-height: 44px; min-width: 44px; background: none; border: 0; color: var(--paper); font: 700 18px/1 'Lab Antonio', 'Arial Narrow', sans-serif; letter-spacing: .06em; text-transform: uppercase; cursor: pointer; }
  .menu-list { list-style: none; margin: 28px 0 0; padding: 0; display: grid; gap: 4px; }
  .menu-list a { display: flex; align-items: flex-start; gap: 14px; padding: 6px 0 10px; color: inherit; text-decoration: none; border-bottom: 1px solid rgb(228 237 191 / .2); }
  .menu-list a[aria-current='page'] { color: var(--paper); }
  .menu-num { padding-top: 10px; font: 400 13px/1 'Lab Mono', monospace; color: var(--paper); }
  .menu-word { display: inline-flex; font: 700 clamp(58px, 18vw, 104px)/.9 'Lab Antonio', 'Arial Narrow', sans-serif; text-transform: uppercase; }
  .menu-mask { display: inline-block; overflow: hidden; padding-block: .05em; }
  .menu-mask > span { display: inline-block; }
  .menu-list a:focus-visible, .menu-close:focus-visible, .menu-ask:focus-visible { outline: 3px solid var(--lime); outline-offset: 2px; }
  .menu-ask { margin-top: auto; min-height: 52px; border: 0; background: var(--lime); color: var(--forest); font: 700 16px/1 var(--hero-font); cursor: pointer; }
  @media (prefers-reduced-motion: reduce) { .ks-nav, .flip-c > span, .links a::after, .ask { transition: none; } }
</style>
