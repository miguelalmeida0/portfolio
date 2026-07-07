<script lang="ts">
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';

  import { tokens } from '$lib/design/tokens';

  export let as: keyof HTMLElementTagNameMap = 'div';
  export let className: string = '';
  export let threshold: number = 0.16;
  export let delay: number = tokens.motion.stagger.none;
  export let distance: number = tokens.motion.distance.md;
  export let duration: number = tokens.motion.duration.slow;

  let root: HTMLElement | null = null;
  let visible = false;
  let prefersReducedMotion = false;

  onMount(() => {
    prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      visible = true;
      return () => undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          visible = true;
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (root) {
      observer.observe(root);
    }

    return () => observer.disconnect();
  });
</script>

<svelte:element this={as} bind:this={root} class={className}>
  {#if visible}
    <div
      class="h-full"
      in:fly={{
        y: distance,
        duration,
        delay,
        opacity: tokens.motion.opacity.enter
      }}
    >
      <slot />
    </div>
  {:else}
    <div class={`${tokens.utility.hiddenUntilReveal} h-full`}>
      <slot />
    </div>
  {/if}
</svelte:element>
