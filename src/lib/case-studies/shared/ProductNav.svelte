<script>
  import CircleFill from '$lib/components/experience/CircleFill.svelte';
  import { getContext, onMount } from 'svelte';
  import { pushState } from '$app/navigation';
  import { scrollToElement } from '$lib/motion/smooth-scroll';
  import { findProject } from '$lib/experience/projects';
  import { destinationLink } from '$lib/navigation/destination-link';
  import { sectionMotion } from './section-motion';
  let { name, slug = undefined, links, standalone = false, overviewHref = '#overview' } = $props();
  const project = $derived(findProject(slug));
  const typographic = getContext('typographic-case') === true;
  const homeHref = '/';
  function chooseChapter(event) {
    const id = event.currentTarget.value;
    const target = document.getElementById(id);
    if (!target) return;
    pushState('#' + id, {});
    scrollToElement(target, { focus: true });
  }
  let sentinel, nav;
  let stuck = $state(false), current = $state('');
  let navHeight = $state(0);
  onMount(() => {
    const io = new IntersectionObserver(([e]) => stuck = e.boundingClientRect.top < 0);
    io.observe(sentinel);
    const resize = new ResizeObserver(() => navHeight = nav.offsetHeight);
    navHeight = nav.offsetHeight;
    resize.observe(nav);
    const sections = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) current = e.target.id; }), { rootMargin: '-35% 0px -60% 0px' });
    links.forEach(([id]) => { const el = document.getElementById(id); if (el) sections.observe(el); });
    return () => { io.disconnect(); resize.disconnect(); sections.disconnect(); };
  });
</script>
<div id="sentinel" bind:this={sentinel}></div>
<!-- Preserve flow when pinned, including beyond the case-study wrapper at Contact. -->
<div aria-hidden="true" style:height={stuck && !typographic ? `${navHeight}px` : '0px'}></div>
<nav data-sveltekit-preload-data="hover" aria-label={name+' sections'} class="pnav" class:stuck class:standalone id="pnav" bind:this={nav} use:sectionMotion>
  <div class="wrap">
    <div class="project-identity">
      <a class="back-home" href={homeHref} aria-label="Back home" title="Back home">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <path d="M19 12H5m6-6-6 6 6 6" />
        </svg>
        <span>Back home</span>
      </a>
      <a class="pname" data-project-identity href={overviewHref}>{name}</a>
    </div>
    <ul><li data-section-indicator aria-hidden="true"></li>{#each links as [id, label]}<li><a href={'#' + id} aria-current={current ? String(current === id) : undefined}>{label}</a></li>{/each}</ul>
    {#if !standalone}<div class="project-actions">
      {#if project?.source}<a class="btn sm code" href={project.source} {...destinationLink(project.source)}>Code</a>{/if}
      {#if project?.live}
        <a class="btn primary sm" data-circle-fill="compact" href={project.live.href} {...destinationLink(project.live.href)}><CircleFill label="Open live app" /></a>
      {:else if !project?.source}
        <a class="btn primary sm" data-circle-fill="compact" href="#try"><CircleFill label="Try the case demo" /></a>
      {/if}
    </div>{/if}
  </div>
  <label class="chapter-picker">On this case
    <select aria-label="Case study chapter" value={current || links[0]?.[0]} onchange={chooseChapter}>
      {#each links as [id, label]}<option value={id}>{label}</option>{/each}
    </select>
  </label>
  <span data-reading-progress aria-hidden="true"></span>
</nav>
<style>
  .chapter-picker { display: none; }
  @media (max-width: 1200px) {
    .chapter-picker { display: flex; align-items: center; gap: 16px; padding: 6px var(--page-x, 20px); border-top: 1px solid var(--line); font: 500 14px/1.4 var(--sans, sans-serif); }
    .chapter-picker select { flex: 1; min-width: 0; min-height: 44px; padding: 8px; color: var(--ink); background: transparent; border: 0; font: inherit; }
  }

  /* Non-case-study pages share the same controls without project launch actions. */
  .pnav.standalone { --ink: #122A22; --sagebg: #E7ECD9; --plum: #5B153C; position: sticky; top: env(safe-area-inset-top, 0px); z-index: 40; background: #F0F3E5; color: var(--ink); border-bottom: 1px solid transparent; font-family: var(--hero-font, 'Figtree', sans-serif); }
  .pnav.standalone.stuck { position: fixed; border-bottom-color: rgba(18, 42, 34, .17); }
  .pnav.standalone .wrap { display: flex; align-items: center; min-height: 64px; width: calc(100% - 2 * var(--page-x, 20px)); margin-inline: auto; }
  .pnav.standalone .pname { color: inherit; font-size: 24px; line-height: 1; font-weight: 800; letter-spacing: -.03em; text-decoration: none; }
  .pnav.standalone ul { display: flex; gap: 6px; list-style: none; margin: 0; padding: 0; }
  .pnav.standalone ul a { display: block; padding: 8px 14px; border-radius: 999px; color: inherit; font-size: 14.5px; text-decoration: none; }
  .pnav.standalone ul a:hover, .pnav.standalone ul a[aria-current='true'] { background: var(--sagebg); }
  .pnav.standalone a:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
  @media (max-width: 1200px) { .pnav.standalone ul { display: none; } }

  .pnav.stuck { position: fixed; inset-inline: 0; }
  .pnav .wrap { gap: clamp(8px, 2vw, 24px); }
  .pnav .project-identity { display: flex; align-items: center; gap: 12px; min-width: 0; }
  .pnav .pname { min-width: 0; }
  .pnav .back-home { display: inline-flex; align-items: center; justify-content: center; gap: 8px; flex: 0 0 auto; min-width: 44px; min-height: 44px; padding-inline: 8px; box-sizing: border-box; border-radius: 6px; color: var(--ink); font: 600 13px/1.2 var(--sans, sans-serif); text-decoration: none; white-space: nowrap; transition: background-color .15s, color .15s; }
  .pnav .back-home svg { flex: none; fill: none; stroke: currentColor; stroke-width: 1.75; stroke-linecap: round; stroke-linejoin: round; }
  .pnav .back-home:hover { background: var(--sagebg, var(--sage, #E4EAD3)); }
  .pnav .back-home:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
  .pnav .project-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; margin-left: auto; }
  .pnav .project-actions .btn { min-height: 44px; box-sizing: border-box; }
  .pnav .project-actions .code { background: transparent; color: var(--ink); border: 1px solid var(--line); }
  /* The portfolio renders desktop content at 80%; retain a physical 44px target. */
  @media screen and (min-width: 1024px) {
    .pnav .project-identity { gap: 40px; margin-inline-end: 16px; }
    .pnav .back-home { min-width: 55px; min-height: 55px; font-size: 16.25px; }
    .pnav .back-home svg { width: 25px; height: 25px; }
  }
  @media (max-width: 1200px) { .pnav ul { display: none; } }
  @media (max-width: 1023px) {
    .pnav .back-home span { display: none; }
    .pnav .back-home { padding-inline: 0; }
  }
  @media (max-width: 600px) {
    .pnav#pnav .wrap { gap: 8px; }
    .pnav .project-identity { gap: 8px; }
    .pnav .project-identity { flex: 1 1 0; }
    .pnav .pname { overflow-wrap: anywhere; display: block; font-size: 18px; line-height: 1.15; white-space: normal; }
    .pnav .project-actions .btn { padding-inline: 13px; }
  }
  @media (prefers-reduced-motion: reduce) { .pnav .back-home { transition: none; } }
  @media (max-width: 360px) { .pnav .pname { font-size: 16px; } }
  .pnav :global([data-section-indicator]) { display: none; border-radius: 999px; background: var(--sagebg, var(--sage, #E4EAD3)); }
  .pnav:global([data-nav-motion]) :global([data-section-indicator]) { display: block; }
  .pnav:global([data-nav-motion]) :global(ul a) { position: relative; }
  .pnav:global([data-nav-motion]) :global(ul a[aria-current='true']) { background: transparent !important; }
  .pnav [data-reading-progress] { display: block; position: absolute; bottom: -1px; left: 0; width: 100%; height: 2px; background: var(--plum, #610D3D); transform: scaleX(0); transform-origin: left; pointer-events: none; }
</style>
