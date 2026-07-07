<script lang="ts">
  import { onMount } from 'svelte';

  export let src: string;
  export let srcset: string | undefined = undefined;
  export let avifSrcset: string | undefined = undefined;
  export let webpSrcset: string | undefined = undefined;
  export let sizes: string | undefined = undefined;
  export let alt: string;
  export let duration = 650;
  export let className = '';
  export let fetchpriority: 'high' | 'low' | 'auto' = 'high';

  let noiseCanvas: HTMLCanvasElement;
  let revealed = false;

  onMount(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!reduceMotion) {
      const width = (noiseCanvas.width = 160);
      const height = (noiseCanvas.height = 214);
      const context = noiseCanvas.getContext('2d');

      if (!context) {
        revealed = true;
        return;
      }

      const image = context.createImageData(width, height);
      for (let index = 0; index < image.data.length; index += 4) {
        const value = (Math.random() * 255) | 0;
        image.data[index] = value;
        image.data[index + 1] = value;
        image.data[index + 2] = value;
        image.data[index + 3] = 255;
      }
      context.putImageData(image, 0, 0);
    }

    if (reduceMotion) {
      revealed = true;
      return;
    }

    let animationFrame = 0;
    animationFrame = requestAnimationFrame(() => {
      revealed = true;
    });

    return () => cancelAnimationFrame(animationFrame);
  });
</script>

<div
  class={`developing-image relative h-full w-full overflow-hidden ${className}`}
  class:revealed
  style={`--develop-duration:${duration}ms;`}
>
  <picture class="block h-full w-full">
    {#if avifSrcset}
      <source type="image/avif" srcset={avifSrcset} {sizes} />
    {/if}
    {#if webpSrcset}
      <source type="image/webp" srcset={webpSrcset} {sizes} />
    {/if}
    <img
      {src}
      {srcset}
      {sizes}
      {alt}
      loading="eager"
      decoding="async"
      {fetchpriority}
      class="developing-image__img h-full w-full object-cover"
    />
  </picture>

  <div
    class="developing-image__wash pointer-events-none absolute inset-0 mix-blend-multiply"
  ></div>

  <canvas
    bind:this={noiseCanvas}
    class="developing-image__noise pointer-events-none absolute inset-0 h-full w-full mix-blend-overlay"
  ></canvas>

  <div
    class="developing-image__flash pointer-events-none absolute inset-0"
  ></div>
</div>

<style>
  .developing-image {
    --develop-duration: 650ms;
  }

  .developing-image__img {
    opacity: 0.96;
    transform: scale(1.012);
    transition:
      opacity var(--develop-duration) cubic-bezier(0.22, 1, 0.36, 1),
      transform var(--develop-duration) cubic-bezier(0.22, 1, 0.36, 1);
  }

  .developing-image.revealed .developing-image__img {
    opacity: 1;
    transform: scale(1);
  }

  .developing-image__wash {
    background-color: oklch(0.55 0.06 60 / 0.22);
    opacity: 1;
    transition: opacity var(--develop-duration) cubic-bezier(0.22, 1, 0.36, 1);
  }

  .developing-image.revealed .developing-image__wash {
    opacity: 0;
  }

  .developing-image__noise {
    image-rendering: pixelated;
    opacity: 0.18;
    transition: opacity var(--develop-duration) cubic-bezier(0.22, 1, 0.36, 1);
  }

  .developing-image.revealed .developing-image__noise {
    opacity: 0;
  }

  .developing-image__flash {
    background-color: oklch(0.98 0.01 90);
    opacity: 0.14;
    transition: opacity 180ms ease-out;
  }

  .developing-image.revealed .developing-image__flash {
    opacity: 0;
  }
</style>
