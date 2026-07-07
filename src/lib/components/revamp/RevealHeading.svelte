<script lang="ts">
  import { onMount } from 'svelte';

  export let as: 'h1' | 'h2' | 'h3' = 'h2';
  export let className = '';
  export let delay = 0;

  let root: HTMLDivElement;
  let mounted = false;
  let inView = true;

  $: revealed = !mounted || inView;

  onMount(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      inView = true;
      return;
    }

    inView = root.getBoundingClientRect().top < window.innerHeight * 0.92;
    mounted = true;

    if (inView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          inView = true;
          observer.disconnect();
        }
      },
      {
        threshold: 0.2,
        rootMargin: '-15% 0px -15% 0px'
      }
    );

    observer.observe(root);

    return () => observer.disconnect();
  });
</script>

<div bind:this={root} class="relative inline-block overflow-visible">
	<svelte:element this={as} class={className}>
	  <span
	    class={`reveal-text ${revealed ? 'is-visible' : 'is-hidden'}`}
	    style={`transition-delay:${delay}s;`}
	  >
      <slot />
    </span>
    <span
	    aria-hidden="true"
	    class={`reveal-bar ${mounted && inView ? 'is-visible' : ''}`}
	    style={`transition-delay:${delay}s;`}
	  ></span>
  </svelte:element>
</div>

<style>
	  .reveal-text {
	    display: inline-block;
	    overflow: visible;
	    padding-bottom: 0.14em;
	    margin-bottom: -0.14em;
	    clip-path: inset(0 0 0 0);
	    transition: clip-path 1.1s cubic-bezier(0.22, 1, 0.36, 1);
	  }

	  .reveal-text.is-hidden {
	    clip-path: inset(0 100% 0 0);
	  }

  .reveal-text.is-visible {
    clip-path: inset(0 0 0 0);
  }

  .reveal-bar {
    pointer-events: none;
    position: absolute;
    inset: 0 0 -0.14em 0;
    background: color-mix(in oklch, var(--accent) 25%, transparent);
    mix-blend-mode: screen;
    transform: scaleX(0);
    transform-origin: left center;
  }

  .reveal-bar.is-visible {
    animation: reveal-sweep 1.15s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  @keyframes reveal-sweep {
    0% {
      transform: scaleX(0);
      transform-origin: left center;
    }

    55% {
      transform: scaleX(1);
      transform-origin: left center;
    }

    100% {
      transform: scaleX(0);
      transform-origin: right center;
    }
  }
</style>
