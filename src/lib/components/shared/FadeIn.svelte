<script lang="ts">
  import { onMount } from 'svelte';

  export let as: 'div' | 'section' | 'article' | 'header' | 'footer' = 'div';
  export let className = '';
  export let delay = 0;
  export let distance = 20;
  export let id: string | undefined = undefined;

  let root: HTMLElement;
  let mounted = false;
  let visible = true;

  $: revealed = !mounted || visible;

  onMount(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      visible = true;
      return;
    }

    visible = root.getBoundingClientRect().top < window.innerHeight * 0.92;
    mounted = true;

    if (visible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          visible = true;
          observer.disconnect();
        }
      },
      {
        threshold: 0.14,
        rootMargin: '0px 0px -10% 0px'
      }
    );

    observer.observe(root);
    return () => observer.disconnect();
  });
</script>

<svelte:element
  this={as}
  bind:this={root}
  {id}
  class={className}
  style={`opacity:${revealed ? 1 : 0};transform:translate3d(0, ${revealed ? 0 : distance}px, 0);transition:opacity 0.68s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s, transform 0.68s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s;`}
>
  <slot />
</svelte:element>
