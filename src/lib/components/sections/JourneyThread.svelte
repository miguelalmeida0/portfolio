<script lang="ts">
  import { onMount } from 'svelte';

  import type { NavItem } from '$lib/types/portfolio';
  import { tokens } from '$lib/design/tokens';
  import { cn } from '$lib/utils/cn';

  export let links: NavItem[];

  const maxBucket = tokens.motion.progressHeights.length - 1;

  let progressBucket = 0;
  let markerBuckets: number[] = [];
  let activeIndex = 0;
  let pulseActive = false;
  let atEnd = false;

  const clampBucket = (value: number) => Math.max(0, Math.min(maxBucket, Math.round(value)));

  const syncMarkers = (sections: HTMLElement[]) => {
    const scrollRange = document.documentElement.scrollHeight - window.innerHeight;

    markerBuckets =
      scrollRange > 0
        ? sections.map((section) =>
            clampBucket((Math.max(section.offsetTop - window.innerHeight * 0.18, 0) / scrollRange) * maxBucket)
          )
        : sections.map(() => 0);
  };

  const pulseNode = () => {
    pulseActive = false;

    requestAnimationFrame(() => {
      pulseActive = true;

      window.setTimeout(() => {
        pulseActive = false;
      }, 920);
    });
  };

  onMount(() => {
    const sections = links
      .map((link) => document.getElementById(link.href.slice(1)))
      .filter((section): section is HTMLElement => section instanceof HTMLElement);

    let current = 0;
    let target = 0;
    let rafId = 0;
    const handleResize = () => syncMarkers(sections);

    const animateProgress = () => {
      current += (target - current) * 0.14;
      progressBucket = clampBucket(current);
      atEnd = progressBucket >= maxBucket - 1;

      if (Math.abs(target - current) > 0.035) {
        rafId = window.requestAnimationFrame(animateProgress);
        return;
      }

      current = target;
      progressBucket = clampBucket(current);
      atEnd = progressBucket >= maxBucket - 1;
      rafId = 0;
    };

    const updateProgress = () => {
      const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = scrollRange > 0 ? window.scrollY / scrollRange : 0;

      target = ratio * maxBucket;

      if (!rafId) {
        rafId = window.requestAnimationFrame(animateProgress);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const best = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!best) {
          return;
        }

        const nextIndex = sections.findIndex((section) => section.id === best.target.id);

        if (nextIndex !== -1 && nextIndex !== activeIndex) {
          activeIndex = nextIndex;
          pulseNode();
        }
      },
      {
        threshold: [0.18, 0.42, 0.68],
        rootMargin: '-18% 0px -46% 0px'
      }
    );

    sections.forEach((section) => observer.observe(section));
    syncMarkers(sections);
    updateProgress();

    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', handleResize);

      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  });
</script>

<aside class={tokens.layout.journeyThread} aria-hidden="true">
  <div class={tokens.patterns.journeyRail}>
    <span class={tokens.patterns.journeyLine}></span>
    <span class={cn(tokens.patterns.journeyTrail, tokens.motion.progressHeights[progressBucket])}></span>

    {#each markerBuckets as bucket, index}
      <span
        class={cn(
          tokens.patterns.journeyMarker,
          tokens.motion.progressTops[bucket],
          index <= activeIndex ? tokens.patterns.journeyMarkerActive : tokens.patterns.journeyMarkerIdle
        )}
      ></span>
    {/each}

    <span
      class={cn(
        tokens.patterns.journeyNode,
        tokens.motion.progressTops[progressBucket],
        atEnd && tokens.patterns.journeyNodeEnd,
        pulseActive && tokens.patterns.journeyNodePulse
      )}
    ></span>
  </div>
</aside>
