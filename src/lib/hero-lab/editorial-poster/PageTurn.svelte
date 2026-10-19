<script lang="ts">
  import { gsap } from 'gsap';
  import { curves } from '$lib/hero-lab/runtime';
  import { installPageTransition } from '$lib/hero-lab/editions/transition';
  import type { EditionPage } from '$lib/hero-lab/editions/site';

  /**
   * A paper leaf turns over the page: it slides in from the right with a
   * hairline edge, carrying the destination's name, then leaves to the left.
   */
  const names: Record<EditionPage, string> = { home: 'Miguel Almeida', story: 'Story', cv: 'CV' };
  let leaf = $state<HTMLElement>();
  let title = $state('');

  installPageTransition('editorial-poster', {
    cover: async (_from, to) => {
      if (!leaf) return;
      title = names[to];
      leaf.hidden = false;
      await gsap.timeline()
        .fromTo(leaf, { xPercent: 100 }, { xPercent: 0, duration: .62, ease: curves.shutter })
        .fromTo(leaf.querySelector('[data-leaf-title]'), { yPercent: 110 }, { yPercent: 0, duration: .55, ease: curves.settle }, .22);
    },
    reveal: async () => {
      if (!leaf) return;
      await gsap.to(leaf, { xPercent: -100, duration: .7, ease: curves.shutter, delay: .08 });
      leaf.hidden = true;
      gsap.set(leaf, { clearProps: 'transform' });
    }
  });
</script>

<div class="leaf" bind:this={leaf} hidden aria-hidden="true">
  <span class="edge"></span>
  <p class="leaf-title"><span class="mask"><span data-leaf-title>{title}</span></span></p>
</div>

<style>
  .leaf { position: fixed; inset: 0; z-index: 1200; display: grid; place-items: center; background: var(--ep-paper, #F9F7EE); color: var(--ep-ink, #142A22); pointer-events: none; }
  .leaf[hidden] { display: none; }
  .edge { position: absolute; left: 0; top: 0; bottom: 0; width: max(1px, calc(1.25px / var(--lab-zoom, 1))); background: var(--ep-ink, #142A22); }
  .leaf-title { margin: 0; font: italic 400 clamp(56px, 9vw, 150px)/1 'Poster Serif', Georgia, serif; letter-spacing: -.02em; }
  .mask { display: inline-block; overflow: clip; padding-bottom: .12em; }
  .mask > span { display: inline-block; }
</style>
