<script>
  import { onMount } from 'svelte';
  import { findProject } from '$lib/experience/projects';
  import { destinationLink } from '$lib/navigation/destination-link';
  import { sectionMotion } from './section-motion';
  let { name, slug, links } = $props();
  const project = $derived(findProject(slug));
  let sentinel, nav;
  let stuck = $state(false), current = $state('');
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
    <a class="pname" data-project-identity href="#overview">{name}</a>
    <ul><li data-section-indicator aria-hidden="true"></li>{#each links as [id, label]}<li><a href={'#' + id} aria-current={current ? String(current === id) : undefined}>{label}</a></li>{/each}</ul>
    <div class="project-actions">
      {#if project?.source}<a class="btn sm code" href={project.source} {...destinationLink(project.source)}>Code</a>{/if}
      {#if project?.live}
        <a class="btn primary sm" href={project.live.href} {...destinationLink(project.live.href)}>Try it</a>
      {:else if !project?.source}
        <a class="btn primary sm" href="#try">Explore demo</a>
      {/if}
    </div>
  </div>
  <span data-reading-progress aria-hidden="true"></span>
</nav>
<style>
  .pnav .wrap { gap: clamp(8px, 2vw, 24px); }
  .pnav .pname { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
  .pnav .project-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; margin-left: auto; }
  .pnav .project-actions .btn { min-height: 44px; box-sizing: border-box; }
  .pnav .project-actions .code { background: transparent; color: var(--ink); border: 1px solid var(--line); }
  @media (max-width: 1200px) { .pnav ul { display: none; } }
  @media (max-width: 600px) {
    .pnav .pname { font-size: 18px; }
    .pnav .project-actions .btn { padding-inline: 13px; }
  }
  .pnav :global([data-section-indicator]) { display: none; border-radius: 999px; background: var(--sagebg, var(--sage, #E4EAD3)); }
  .pnav:global([data-nav-motion]) :global([data-section-indicator]) { display: block; }
  .pnav:global([data-nav-motion]) :global(ul a) { position: relative; }
  .pnav:global([data-nav-motion]) :global(ul a[aria-current='true']) { background: transparent !important; }
  .pnav [data-reading-progress] { display: block; position: absolute; bottom: -1px; left: 0; width: 100%; height: 2px; background: var(--plum, #610D3D); transform: scaleX(0); transform-origin: left; pointer-events: none; }
</style>
