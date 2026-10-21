<script lang="ts">
  import { getContext, onMount, tick, type Snippet } from 'svelte';
  import { beforeNavigate, pushState } from '$app/navigation';
  import { hero } from '$lib/hero-lab/content';
  import { d1Navigation, d1Routes, type D1Page, type D1Section } from './site';
  import { lockPage } from '$lib/hero-lab/sheet';
  import { scrollToElement } from '$lib/motion/smooth-scroll';
  import { motionState } from '$lib/motion/policy';
  import { gsap } from 'gsap';
  import { curves } from '$lib/hero-lab/runtime';

  const navigateFromMenu = getContext<((event: MouseEvent, close: () => void) => Promise<void>) | undefined>('route-navigation');
  let { page = 'home', sections = [], overHero = false, roleControl }: { page?: D1Page; sections?: D1Section[]; overHero?: boolean; roleControl?: Snippet } = $props();
  let surface = $state(0);
  const links = $derived(d1Navigation(page));
  const homeHref = $derived(page === 'home' ? '#top' : d1Routes.home);

  let dialog = $state<HTMLDialogElement>();
  let trigger = $state<HTMLButtonElement>();
  let open = $state(false);
  let indexReady = $state(false);
  // Long pages: once reading starts, the masthead grows a line of in-page destinations.
  let reading = $state(false);
  let current = $state('');
  let progress = $state<HTMLElement>();
  let row = $state<HTMLElement>();
  let indicator = $state({ left: 0, width: 0, shown: false });
  function place() {
    const link = row?.querySelector<HTMLElement>(`[data-section="${current}"]`);
    // Write only: reading `indicator` here would make the effect below depend on its own output.
    indicator = link ? { left: link.offsetLeft, width: link.offsetWidth, shown: true } : { left: 0, width: 0, shown: false };
  }
  $effect(() => { void current; void reading; place(); });
  let release = () => {};
  let disposed = false;
  let sheetMotion: gsap.core.Timeline | undefined;
  let closing: Promise<boolean> | undefined;
  let resolveClose: ((completed: boolean) => void) | undefined;
  function stopSheetMotion(completed = false) {
    sheetMotion?.kill(); sheetMotion = undefined;
    resolveClose?.(completed); resolveClose = undefined; closing = undefined;
  }
  function unlock() { release(); release = () => {}; }
  function closeNow(completed = false) {
    stopSheetMotion(completed);
    if (dialog?.open) dialog.close();
    open = false;
    unlock();
  }

  async function show() {
    if (!dialog || open || disposed) return;
    stopSheetMotion();
    travelling = false;
    open = true;
    await tick();
    if (disposed || !open) return;
    dialog.showModal();
    release = lockPage();
    const words = dialog.querySelectorAll('[data-sheet-word]');
    const details = dialog.querySelectorAll('.sheet-num, .sheet-desc');
    gsap.set(dialog, { clipPath: 'inset(0 0 0% 0)' });
    gsap.set([...words, ...details], { clearProps: 'transform,opacity' });
    if ($motionState.reduced) return;
    sheetMotion = gsap.timeline()
      .fromTo(dialog, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: .46, ease: curves.shutter }, 0)
      .fromTo(words, { yPercent: 105 }, { yPercent: 0, duration: .62, ease: curves.settle, stagger: .055 }, .12)
      .fromTo(details, { opacity: 0, x: -5 }, { opacity: 1, x: 0, duration: .35, stagger: .025 }, .28);
  }
  function hide(): Promise<boolean> {
    const sheet = dialog;
    if (!sheet?.open) return Promise.resolve(false);
    if (closing) return closing;
    stopSheetMotion();
    if ($motionState.reduced) { closeNow(true); return Promise.resolve(true); }
    closing = new Promise<boolean>(resolve => { resolveClose = resolve; });
    // One owner for opening and closing: Escape/route changes can interrupt safely.
    sheetMotion = gsap.timeline({ onComplete: () => closeNow(true) })
      .to(sheet, { clipPath: 'inset(0 0 100% 0)', duration: .3, ease: curves.shutter });
    return closing;
  }
  let travelling = false;
  function closed() {
    // A queued close from an earlier visit must not release a newly opened menu.
    if (dialog?.open || disposed) return;
    stopSheetMotion();
    open = false; unlock();
    // After a menu link moves focus to its destination, do not pull it back.
    if (!travelling) trigger?.focus({ preventScroll: true });
    travelling = false;
  }
  async function travel(event: MouseEvent) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.currentTarget as HTMLAnchorElement;
    const url = new URL(link.href, location.href);
    travelling = true;
    if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) {
      if (navigateFromMenu) await navigateFromMenu(event, () => closeNow());
      else closeNow();
      return;
    }
    event.preventDefault();
    let target: HTMLElement | null = null;
    try { target = document.getElementById(decodeURIComponent(url.hash.slice(1))); } catch { /* invalid fragment */ }
    if (!await hide() || disposed || !target?.isConnected) return;
    if (location.hash !== url.hash) pushState(url, {});
    scrollToElement(target, { focus: true });
  }
  beforeNavigate(() => { travelling = true; closeNow(); });
  onMount(() => {
    indexReady = true;
    // Only the backdrop changes: mast geometry stays identical in both directions.
    const update = () => {
      if (overHero) surface = $motionState.reduced ? (window.scrollY > 24 ? 1 : 0) : Math.min(1, Math.max(0, (window.scrollY - 24) / 120));
      if (!sections.length) return;
      reading = window.scrollY > window.innerHeight * .6;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progress) progress.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
    };
    let frame = 0;
    const schedule = () => { if (!frame) frame = requestAnimationFrame(() => { frame = 0; update(); }); };
    const resize = () => {
      place(); schedule();
      if (innerWidth >= 1024 && dialog?.open) closeNow();
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', resize);
    const measure = new ResizeObserver(place);
    if (row) measure.observe(row);
    const unsubscribe = motionState.subscribe(({ reduced }) => {
      schedule();
      if (!reduced || !dialog?.open) return;
      if (closing) { closeNow(true); return; }
      stopSheetMotion();
      gsap.set(dialog, { clipPath: 'inset(0 0 0% 0)' });
      gsap.set(dialog.querySelectorAll('[data-sheet-word], .sheet-num, .sheet-desc'), { clearProps: 'transform,opacity' });
    });
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) current = entry.target.id;
    }), { rootMargin: '-35% 0px -60% 0px' });
    sections.forEach(({ id }) => { const target = document.getElementById(id); if (target) observer.observe(target); });
    return () => {
      disposed = true;
      stopSheetMotion(); unlock(); unsubscribe();
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', resize);
      observer.disconnect(); measure.disconnect();
    };
  });
</script>

<header data-sveltekit-preload-data="hover" class="mast" class:reading class:hero-overlay={overHero} class:has-role-control={!!roleControl} style:--mast-surface={surface} data-mast>
  <div class="mast-row">
    <a href={homeHref} class="identity" data-identity-home aria-label={hero.homeLabel} data-nav-arrive>
      <span class="wordmark">{hero.name.first} {hero.name.last}</span>
      <span class="city" >{hero.city}</span>
    </a>
    {#if roleControl}<div class="mast-role-control">{@render roleControl()}</div>{/if}
    <nav aria-label="Main navigation" class="d1-links" data-nav-arrive>
      {#each links as link}
        <a href={link.href}  data-roll aria-current={link.current ? 'page' : undefined}>
          <span class="roll" aria-hidden="true"><span>{link.label}</span><span>{link.label}</span></span>
          <span class="sr-only">{link.label}</span>
        </a>
      {/each}

    </nav>
    <button bind:this={trigger} type="button" class="index-toggle" aria-haspopup="dialog" aria-expanded={open}
      aria-controls="d1-index" disabled={!indexReady} onclick={show} data-nav-arrive>Index</button>
  </div>
  {#if sections.length}
    <div class="mast-sections" inert={!reading}>
      <nav aria-label="On this page" class="sections-row" bind:this={row}>
        {#each sections as section, index}
          <a href={`#${section.id}`} data-section={section.id} aria-current={current === section.id ? 'location' : undefined}>
            <span class="section-num" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{section.label}
          </a>
        {/each}
        <span class="section-mark" class:shown={indicator.shown} style:transform="translateX({indicator.left}px) scaleX({indicator.width})" aria-hidden="true"></span>
      </nav>
    </div>
  {/if}
  <span class="mast-rule" data-mast-rule aria-hidden="true">{#if sections.length}<span class="mast-progress" bind:this={progress}></span>{/if}</span>
</header>

<dialog data-sveltekit-preload-data="hover" bind:this={dialog} id="d1-index" class="sheet" aria-label="Site index" onclose={closed}
  oncancel={event => { event.preventDefault(); void hide(); }}
  onclick={event => { if (event.target === dialog) void hide(); }}>
  <div class="sheet-inner">
    <div class="sheet-top">
      <span class="wordmark">{hero.name.first} {hero.name.last}</span>
      <button type="button" class="sheet-close" onclick={hide}>Close</button>
    </div>
    <ul>
      {#each links as link, index}
        <li>
          <a href={link.href} data-mobile-route-link onclick={travel} aria-current={link.current ? 'page' : undefined}>
            <span class="sheet-num" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <span class="sheet-mask"><span class="sheet-word" data-sheet-word>{link.label}</span></span>
            <span class="sheet-desc">{link.description}</span>
          </a>
        </li>
      {/each}
    </ul>
    {#if sections.length}
      <p class="sheet-label" id="d1-sheet-sections">On this page</p>
      <ul class="sheet-sections" aria-labelledby="d1-sheet-sections">
        {#each sections as section}
          <li><a href={`#${section.id}`} data-mobile-route-link onclick={travel}>{section.label}</a></li>
        {/each}
      </ul>
    {/if}

  </div>
</dialog>

<style>
  /* One stable surface from SSR through scrolling, including dark sections. */
  .mast { --mast-h: 88px; position: fixed; inset: 0 0 auto 0; z-index: 50; isolation: isolate; color: var(--ink); background: var(--lime); }
  .mast.hero-overlay { background: transparent; }
  .mast.hero-overlay::before { content: ''; position: absolute; inset: 0; z-index: -1; background: var(--lime); opacity: var(--mast-surface, 0); pointer-events: none; }
  .mast-row { height: var(--mast-h); width: min(calc(100% - 2 * var(--page-x)), var(--content-max)); margin-inline: auto; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
  .has-role-control .mast-row { display: grid; grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); }
  .mast-role-control { justify-self: center; }
  .has-role-control .d1-links, .has-role-control .index-toggle { justify-self: end; }
  .identity { display: inline-flex; align-items: center; gap: 18px; min-height: calc(44px / var(--lab-zoom, 1)); text-decoration: none; color: inherit; }
  .wordmark { font: 700 30px/1 'Lab Antonio', 'Arial Narrow', sans-serif; letter-spacing: .01em; }
  .city { font: 500 15px/1 var(--hero-font); }
  .d1-links { display: flex; align-items: center; gap: 22px; }
  .d1-links a { position: relative; display: inline-flex; justify-content: center; min-height: calc(44px / var(--lab-zoom, 1)); min-width: calc(44px / var(--lab-zoom, 1)); align-items: center; color: inherit; text-decoration: none; font: 700 21px/1 'Lab Antonio', 'Arial Narrow', sans-serif; letter-spacing: .04em; text-transform: uppercase; }
  .roll { position: relative; display: inline-grid; overflow: hidden; height: 1.05em; }
  .roll > span { grid-area: 1 / 1; transition: transform .5s cubic-bezier(.16,1,.3,1); }
  .roll > span:last-child { transform: translateY(105%); color: var(--plum); }
  .d1-links a::after { content: ''; position: absolute; left: 6px; right: 6px; bottom: 6px; height: 2px; background: var(--plum); transform: scaleX(0); transform-origin: right; transition: transform .5s cubic-bezier(.16,1,.3,1); }
  @media (hover: hover) { .d1-links a:hover .roll > span:first-child { transform: translateY(-105%); } .d1-links a:hover .roll > span:last-child { transform: none; } .d1-links a:hover::after { transform: scaleX(1); transform-origin: left; } }
  .d1-links a:focus-visible .roll > span:first-child { transform: translateY(-105%); }
  .d1-links a:focus-visible .roll > span:last-child { transform: none; }
  .d1-links a:focus-visible { outline: 3px solid var(--plum); }
  /* The page you are on keeps its rule drawn and its plum face up. */
  .d1-links a[aria-current='page'] { color: var(--plum); }
  .d1-links a[aria-current='page']::after { transform: scaleX(1); }
  .mast-rule { position: absolute; inset-inline: 0; width: min(calc(100% - 2 * var(--page-x)), var(--content-max)); margin-inline: auto; bottom: 0; height: 2px; background: var(--ink); transform-origin: left; }
  /* Reading progress runs along the masthead rule in plum. */
  .mast-progress { position: absolute; inset: 0; background: var(--plum); transform: scaleX(0); transform-origin: left; }
  .mast-sections { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .32s cubic-bezier(.22,1,.36,1); }
  .mast.reading .mast-sections { grid-template-rows: 1fr; }
  .sections-row { position: relative; overflow: hidden; min-height: 0; width: min(calc(100% - 2 * var(--page-x)), var(--content-max)); margin-inline: auto; display: flex; align-items: center; gap: 30px; opacity: 0; transform: translateY(-4px); transition: opacity .2s ease, transform .32s cubic-bezier(.22,1,.36,1); }
  .mast.reading .sections-row { opacity: 1; transform: none; }
  .sections-row a { display: inline-flex; align-items: baseline; gap: 8px; min-height: calc(44px / var(--lab-zoom, 1)); align-items: center; color: inherit; text-decoration: none; font: 700 17px/1 'Lab Antonio', 'Arial Narrow', sans-serif; letter-spacing: .05em; text-transform: uppercase; transition: color .3s; }
  .section-num { font: 400 12px/1 'Lab Mono', monospace; letter-spacing: 0; opacity: .7; }
  .sections-row a:hover, .sections-row a[aria-current='location'] { color: var(--plum); }
  .sections-row a:focus-visible { outline: 3px solid var(--plum); }
  .section-mark { position: absolute; left: 0; bottom: 8px; width: 1px; height: 3px; transform-origin: left center; background: var(--plum); opacity: 0; transition: transform .55s cubic-bezier(.16,1,.3,1), opacity .3s; pointer-events: none; }
  .section-mark.shown { opacity: 1; }
  .index-toggle { display: none; min-height: 44px; min-width: 44px; padding: 0 4px; font: 700 20px/1 'Lab Antonio', 'Arial Narrow', sans-serif; letter-spacing: .05em; text-transform: uppercase; color: var(--ink); background: none; border: 0; cursor: pointer; border-bottom: 2px solid var(--plum); }
  @media (max-width: 1023px) {
    .mast { --mast-h: 68px; }
    .d1-links, .mast-sections { display: none; }
    .index-toggle { display: inline-flex; align-items: center; }
    .wordmark { font-size: 24px; }
    .city { font-size: 14px; }
  }
  @media (max-width: 1279px) {
    .mast.has-role-control { --mast-h: 148px; }
    .has-role-control .mast-row { grid-template-columns: minmax(0, 1fr) auto; grid-template-rows: 88px 60px; gap: 0 24px; }
    .mast-role-control { grid-column: 1 / -1; grid-row: 2; }
    .has-role-control .d1-links, .has-role-control .index-toggle { grid-column: 2; grid-row: 1; }
  }
  @media (max-width: 1023px) {
    .mast.has-role-control { --mast-h: 124px; }
    .has-role-control .mast-row { grid-template-rows: 68px 56px; }
  }

  .sheet { position: fixed; inset: 0; width: 100%; max-width: none; height: 100dvh; max-height: none; margin: 0; padding: 0; border: 0; background: var(--lime); color: var(--ink); overscroll-behavior: contain; }
  .sheet::backdrop { background: transparent; }
  .sheet-inner { display: flex; flex-direction: column; height: 100%; overflow-y: auto; padding: 14px 20px max(24px, env(safe-area-inset-bottom)); }
  .sheet-top { display: flex; align-items: center; justify-content: space-between; min-height: 56px; border-bottom: 2px solid var(--ink); }
  .sheet-close { min-height: 44px; min-width: 44px; font: 700 20px/1 'Lab Antonio', 'Arial Narrow', sans-serif; text-transform: uppercase; letter-spacing: .05em; background: none; border: 0; color: var(--plum); cursor: pointer; }
  ul { list-style: none; margin: 24px 0 0; padding: 0; display: grid; gap: 6px; }
  li a { display: grid; grid-template-columns: 34px 1fr; align-items: end; column-gap: 10px; padding: 8px 0 12px; border-bottom: 1px solid rgb(20 42 34 / .25); color: inherit; text-decoration: none; }
  .sheet-num { font: 400 13px/1 'Lab Mono', monospace; padding-bottom: 10px; }
  .sheet-mask { display: block; overflow: hidden; }
  .sheet-word { display: block; font: 700 clamp(56px, 17vw, 96px)/.92 'Lab Antonio', 'Arial Narrow', sans-serif; text-transform: uppercase; }
  .sheet-desc { grid-column: 2; font: 600 12px/1.4 var(--hero-font); letter-spacing: .08em; color: var(--plum); }
  li a:focus-visible { outline: 3px solid var(--plum); }
  li a[aria-current='page'] .sheet-word { color: var(--plum); }
  .sheet-label { margin-top: 22px; font: 400 12px/1 'Lab Mono', monospace; text-transform: uppercase; letter-spacing: .06em; }
  .sheet-sections { margin-top: 8px; gap: 0; grid-template-columns: 1fr 1fr; column-gap: 16px; }
  .sheet-sections a { display: flex; align-items: center; min-height: 44px; padding: 0; border-bottom: 1px solid rgb(20 42 34 / .25); font: 700 20px/1 'Lab Antonio', 'Arial Narrow', sans-serif; text-transform: uppercase; letter-spacing: .03em; }
  @media (prefers-reduced-motion: reduce) { .mast::before, .mast-rule, .mast-sections, .sections-row, .section-mark, .roll > span, .d1-links a::after, .sections-row a { transition: none; } }
  :global(html[data-motion='reduced']) .mast::before,
  :global(html[data-motion='reduced']) .mast-rule,
  :global(html[data-motion='reduced']) .mast-sections,
  :global(html[data-motion='reduced']) .sections-row { transition: none; }
</style>
