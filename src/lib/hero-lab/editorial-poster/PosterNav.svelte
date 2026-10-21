<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { beforeNavigate } from '$app/navigation';
  import { gsap } from 'gsap';
  import { hero } from '$lib/hero-lab/content';
  import { followMenuLink, lockPage } from '$lib/hero-lab/sheet';
  import { motionState } from '$lib/motion/policy';
  import { curves } from '$lib/hero-lab/runtime';
  import { editionNavigation, editionRoutes, type EditionPage } from '$lib/hero-lab/editions/site';

  let { page = 'home' }: { page?: EditionPage } = $props();
  const links = $derived(editionNavigation('editorial-poster', page));
  const homeHref = $derived(page === 'home' ? '#top' : editionRoutes('editorial-poster').home);

  let dialog = $state<HTMLDialogElement>();
  let trigger = $state<HTMLButtonElement>();
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
    gsap.fromTo(dialog, { clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)', duration: .6, ease: curves.shutter });
    gsap.fromTo(dialog.querySelectorAll('[data-contents-line]'), { yPercent: 110 }, { yPercent: 0, duration: .8, ease: curves.settle, stagger: .05, delay: .2 });
  }
  async function hide() {
    // Hold the element: travelling to another page unmounts this menu while it closes.
    const sheet = dialog;
    if (!sheet?.open) return;
    if (!$motionState.reduced) await gsap.to(sheet, { clipPath: 'inset(0 0 0 100%)', duration: .45, ease: curves.shutter });
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
    // The bar takes paper behind it only once content can pass underneath.
    const update = () => { solid = window.scrollY > 8; };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => { window.removeEventListener('scroll', update); release(); };
  });
</script>

<header class="ep-bar" class:solid data-ep-bar>
  <div class="row">
    <a href={homeHref} class="identity" data-identity-home aria-label={hero.homeLabel} data-arm>
      <span class="name">Miguel Almeida</span>
      <span class="city" >{hero.city}</span>
    </a>
    <nav aria-label="Main navigation" class="links" data-arm>
      {#each links as link}
        <a href={link.href}  aria-current={link.current ? 'page' : undefined}>{link.label}</a>
      {/each}

    </nav>
    <button bind:this={trigger} type="button" class="contents-toggle" aria-haspopup="dialog" aria-expanded={open}
      aria-controls="ep-contents" onclick={show} data-arm>Contents</button>
  </div>
  <span class="hair" data-ep-hair aria-hidden="true"></span>
</header>

<dialog bind:this={dialog} id="ep-contents" class="contents" aria-label="Contents" onclose={closed}
  onclick={event => { if (event.target === dialog) void hide(); }}>
  <div class="contents-inner">
    <div class="contents-top">
      <span class="name">Miguel Almeida</span>
      <button type="button" class="close" onclick={hide}>Close</button>
    </div>
    <ol>
      {#each links as link, index}
        <li>
          <a href={link.href} data-mobile-route-link onclick={travel} aria-current={link.current ? 'page' : undefined}>
            <span class="num" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <span class="mask"><span class="word" data-contents-line>{link.label}</span></span>
          </a>
        </li>
      {/each}
    </ol>

  </div>
</dialog>

<style>
  .ep-bar { position: fixed; inset: 0 0 auto 0; z-index: 50; color: var(--ep-ink); transition: background-color .5s var(--ep-ease); }
  .ep-bar.solid { background: var(--ep-paper); }
  .row { height: 76px; width: min(calc(100% - 2 * var(--page-x)), var(--content-max)); margin-inline: auto; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
  .identity { display: inline-flex; align-items: center; gap: 14px; min-height: calc(44px / var(--lab-zoom, 1)); color: inherit; text-decoration: none; }
  .name { font: 400 26px/1 var(--ep-serif); letter-spacing: -.01em; }
  .city { font: 400 12px/1 var(--ep-mono); letter-spacing: .06em; text-transform: uppercase; }
  .identity:hover .name { font-style: italic; }
  .links { display: flex; align-items: center; gap: 30px; }
  .links a { position: relative; display: inline-flex; align-items: center; justify-content: center; min-height: calc(44px / var(--lab-zoom, 1)); min-width: calc(44px / var(--lab-zoom, 1)); color: inherit; text-decoration: none; font: 400 22px/1 var(--ep-serif); }
  .links a::after { content: ''; position: absolute; left: 0; right: 0; bottom: 8px; height: var(--ep-hair); background: currentColor; transform: scaleX(0); transform-origin: 100% 50%; transition: transform .55s var(--ep-ease); }
  .links a:hover, .links a:focus-visible, .links a[aria-current='page'] { font-style: italic; color: var(--ep-plum); }
  .links a:hover::after, .links a:focus-visible::after, .links a[aria-current='page']::after { transform: scaleX(1); transform-origin: 0 50%; }
  .hair { position: absolute; left: var(--page-x); right: var(--page-x); bottom: 0; height: var(--ep-hair); background: var(--ep-ink); transform-origin: 0 50%; }
  .contents-toggle { display: none; min-height: 44px; min-width: 44px; padding: 0 2px; border: 0; background: none; color: var(--ep-ink); font: italic 400 22px/1 var(--ep-serif); cursor: pointer; }
  @media (max-width: 1023px) {
    .row { height: 64px; }
    .links { display: none; }
    .contents-toggle { display: inline-flex; align-items: center; }
    .name { font-size: 22px; }
  }

  .contents { position: fixed; inset: 0; width: 100%; max-width: none; height: 100dvh; max-height: none; margin: 0; padding: 0; border: 0; background: var(--ep-paper); color: var(--ep-ink); overscroll-behavior: contain; }
  .contents::backdrop { background: transparent; }
  .contents-inner { display: flex; flex-direction: column; height: 100%; overflow-y: auto; padding: 12px 20px max(24px, env(safe-area-inset-bottom)); }
  .contents-top { display: flex; align-items: center; justify-content: space-between; min-height: 56px; border-bottom: 1px solid var(--ep-ink); }
  .close { min-height: 44px; min-width: 44px; border: 0; background: none; color: var(--ep-plum); font: italic 400 22px/1 var(--ep-serif); cursor: pointer; }
  ol { list-style: none; margin: 28px 0 0; padding: 0; }
  li a { display: grid; grid-template-columns: 40px 1fr; align-items: baseline; padding: 10px 0 14px; border-bottom: 1px solid var(--ep-rule); color: inherit; text-decoration: none; }
  .num { font: 400 13px/1 var(--ep-mono); }
  .mask { display: block; overflow: hidden; padding-bottom: .06em; }
  .word { display: block; font: 400 clamp(52px, 15vw, 88px)/1 var(--ep-serif); letter-spacing: -.02em; }
  li a[aria-current='page'] .word, li a:hover .word { font-style: italic; color: var(--ep-plum); }
  @media (prefers-reduced-motion: reduce) { .ep-bar, .links a::after { transition: none; } }
</style>
