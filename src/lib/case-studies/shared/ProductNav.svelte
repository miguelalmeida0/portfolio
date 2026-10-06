<script>
  import { onMount } from 'svelte';
  import { sectionMotion } from './section-motion';
  let { name, links } = $props();
  let sentinel, nav;
  let stuck = $state(false), current = $state('');
  let expanded = $state(false);
  onMount(() => {
    const io = new IntersectionObserver(([e]) => stuck = !e.isIntersecting);
    io.observe(sentinel);
    const sections = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) current = e.target.id; }), { rootMargin: '-35% 0px -60% 0px' });
    links.forEach(([id]) => { const el = document.getElementById(id); if (el) sections.observe(el); });
    return () => { io.disconnect(); sections.disconnect(); };
  });
</script>
<div id="sentinel" bind:this={sentinel}></div>
<nav aria-label={name+' sections'} class="pnav" class:stuck id="pnav" bind:this={nav} use:sectionMotion>
  <div class="wrap">
    <a class="case-back" href="/#work" aria-label="Back to selected work">Work</a>
    <a class="pname" data-project-identity href="#overview">{name}</a>
    <ul><li data-section-indicator aria-hidden="true"></li>{#each links as [id, label]}<li><a href={'#' + id} aria-current={current ? String(current === id) : undefined}>{label}</a></li>{/each}</ul>
    <details class="case-mobile-menu" bind:open={expanded}>
      <summary>On this page<span>{links.find(([id]) => id === current)?.[1] ?? 'Overview'}</span></summary>
      <div>{#each links as [id, label]}<a href={'#' + id} aria-current={current === id ? 'location' : undefined} onclick={() => expanded = false}>{label}</a>{/each}<a href="#try" onclick={() => expanded = false}>Explore demo</a></div>
    </details>
    <a class="btn primary sm case-demo-link" href="#try">Explore demo</a>
  </div><span data-reading-progress aria-hidden="true"></span>
</nav>
<style>
  .pnav :global([data-section-indicator]) { display: none; border-radius: 999px; background: var(--sagebg, var(--sage, #E4EAD3)); }
  .pnav:global([data-nav-motion]) :global([data-section-indicator]) { display: block; }
  .pnav:global([data-nav-motion]) :global(ul a) { position: relative; }
  .pnav:global([data-nav-motion]) :global(ul a[aria-current='true']) { background: transparent !important; }
  .pnav [data-reading-progress] { display: block; position: absolute; bottom: -1px; left: 0; width: 100%; height: 2px; background: var(--plum, #610D3D); transform: scaleX(0); transform-origin: left; pointer-events: none; }
</style>
