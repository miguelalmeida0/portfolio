<script>
  import { onMount } from 'svelte';
  let { name, links } = $props();
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
<nav aria-label={name+' sections'} class="pnav" class:stuck id="pnav" bind:this={nav}><div class="wrap"><a class="pname" href="#overview">{name}</a><ul>{#each links as [id, label]}<li><a href={'#' + id} aria-current={current ? String(current === id) : undefined}>{label}</a></li>{/each}</ul><a class="btn primary sm" href="#try">Try it</a></div></nav>
