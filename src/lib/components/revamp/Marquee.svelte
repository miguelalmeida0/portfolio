<script lang="ts">
  import { onMount } from 'svelte';

  const items = [
    'Enterprise scale',
    'Component systems',
    'Svelte',
    'TypeScript',
    'Reusable UI',
    'Calm interfaces',
    'Product mindset',
    'Design collaboration',
    'Accessibility',
    'Performance'
  ];

  let wrapElement: HTMLDivElement;
  let playing = false;
  let reduceMotion = false;

  onMount(() => {
    reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        playing = Boolean(entry?.isIntersecting) && !document.hidden;
      },
      { rootMargin: '80px 0px', threshold: 0.01 }
    );

    const onVisibilityChange = () => {
      const rect = wrapElement.getBoundingClientRect();
      playing = !document.hidden && rect.bottom > 0 && rect.top < window.innerHeight;
    };

    observer.observe(wrapElement);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  });
</script>

<div
  bind:this={wrapElement}
  class="relative overflow-hidden border-y border-border/60 bg-card/20 py-5 select-none touch-pan-y"
  aria-hidden="true"
>
  <div class:marquee-playing={playing && !reduceMotion} class="marquee-track flex w-max gap-12 whitespace-nowrap">
    {#each [...items, ...items] as item}
      <span class="flex items-center gap-12 font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
        {item}
        <span class="text-accent">✦</span>
      </span>
    {/each}
  </div>
  <div class="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent"></div>
  <div class="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent"></div>
</div>

<style>
  .marquee-track {
    transform: translate3d(0, 0, 0);
  }

  .marquee-playing {
    animation: marquee-slide 34s linear infinite;
    will-change: transform;
  }

  @keyframes marquee-slide {
    to {
      transform: translate3d(-50%, 0, 0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .marquee-track {
      animation: none !important;
      transform: translate3d(0, 0, 0) !important;
    }
  }

  @media (max-width: 767px) {
    .marquee-playing {
      animation: none;
      transform: translate3d(0, 0, 0);
      will-change: auto;
    }
  }
</style>
