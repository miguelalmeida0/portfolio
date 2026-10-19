<script lang="ts">
  import { tick, type Snippet } from 'svelte';
  import { gsap } from 'gsap';
  import { curves } from '$lib/hero-lab/runtime';
  import { installPageTransition } from '$lib/hero-lab/editions/transition';
  import type { EditionPage } from '$lib/hero-lab/editions/site';

  let { children }: { children: Snippet } = $props();
  let card = $state<HTMLElement>();
  let title = $state('');
  // The destination's own name, as the navigation prints it.
  const names: Record<EditionPage, string> = { home: 'Miguel Almeida', story: 'Story', cv: 'CV' };

  // Between pages a lime chapter card sweeps up carrying the destination's
  // name, holds while the next page renders, then leaves upward.
  installPageTransition('kinetic-story', {
    async cover(_from, to) {
      if (!card) return;
      title = names[to];
      card.hidden = false;
      await tick();
      const chars = card.querySelectorAll('[data-card-char]');
      await gsap.timeline()
        .fromTo(card, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: .5, ease: curves.shutter })
        .fromTo(chars, { yPercent: 115 }, { yPercent: 0, duration: .45, stagger: .03, ease: curves.settle }, .22);
    },
    async reveal() {
      if (!card) return;
      await gsap.to(card, { clipPath: 'inset(0% 0% 100% 0%)', duration: .55, ease: curves.shutter, delay: .08 });
      card.hidden = true;
    }
  });
</script>

{@render children()}

<div class="ks-card" bind:this={card} hidden aria-hidden="true">
  {#key title}<p class="ks-card-title">{#each [...title] as ch}<span class="m"><span data-card-char>{ch === ' ' ? ' ' : ch}</span></span>{/each}</p>{/key}
</div>

<style>
  .ks-card { position: fixed; inset: 0; z-index: 900; display: grid; place-items: center; background: var(--lime); color: var(--forest); pointer-events: none; }
  .ks-card[hidden] { display: none; }
  .ks-card-title { display: flex; font: 700 clamp(72px, 14vw, 260px)/.9 'Lab Antonio', 'Arial Narrow', sans-serif; text-transform: uppercase; }
  .m { display: inline-block; overflow: hidden; padding-block: .04em; }
  .m > span { display: inline-block; }
</style>
