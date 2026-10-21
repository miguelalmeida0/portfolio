<script lang="ts">
  import type { Snippet } from 'svelte';
  import { gsap } from 'gsap';
  import '$lib/hero-lab/lab.css';
  import XNav from '$lib/hero-lab/experimental/XNav.svelte';
  import { curves } from '$lib/hero-lab/runtime';
  import { installPageTransition } from '$lib/hero-lab/editions/transition';

  let { children }: { children: Snippet } = $props();
  let shutter = $state<HTMLElement>();
  const strips = () => shutter?.querySelectorAll<HTMLElement>('[data-shutter-strip]') ?? [];

  // Home, Story and CV change behind a strip shutter: eight plum strips drop
  // closed from the top, staggered from the rail outward, and lift open on the
  // new page in the same order. About 0.85s from click to settled page.
  installPageTransition('experimental', {
    cover: () => new Promise(resolve => {
      if (!shutter) return resolve();
      shutter.dataset.active = '';
      gsap.fromTo(strips(), { scaleY: 0, transformOrigin: '50% 0%' }, {
        scaleY: 1, duration: .28, ease: curves.shutter, stagger: .022, onComplete: () => resolve()
      });
    }),
    reveal: () => new Promise<void>(resolve => {
      gsap.to(strips(), {
        scaleY: 0, transformOrigin: '50% 100%', duration: .32, ease: curves.shutter, stagger: .022, delay: .04,
        onComplete: () => { if (shutter) delete shutter.dataset.active; resolve(); }
      });
    })
  });
</script>

<XNav />
{@render children()}
<div class="x-shutter" bind:this={shutter} aria-hidden="true">
  {#each [0, 1, 2, 3, 4, 5, 6, 7] as i}<span data-shutter-strip style:--i={i}></span>{/each}
</div>

<style>
  .x-shutter { position: fixed; z-index: 900; inset: 0; display: grid; grid-template-columns: repeat(8, 1fr); pointer-events: none; visibility: hidden; }
  .x-shutter:global([data-active]) { visibility: visible; pointer-events: auto; }
  .x-shutter span { background: var(--plum); }
  .x-shutter span:nth-child(even) { background: var(--plum-700); }
</style>
