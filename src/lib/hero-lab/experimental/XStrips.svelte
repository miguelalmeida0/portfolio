<script lang="ts">
  import type { Snippet } from 'svelte';
  import { portrait } from '$lib/hero-lab/content';
  import LabPortrait from '$lib/hero-lab/LabPortrait.svelte';

  /**
   * The real cutout, cut into vertical strips. Strip `accessible` carries the one
   * accessible image ("Miguel Almeida"); the others are visual slices of the same
   * file (same URL, fetched once) and are hidden from assistive technology.
   *
   * Owners per strip: `[data-x-col]` → scroll, `[data-x-move]` → pointer,
   * `[data-x-tile]` → opening. Nothing here carries a CSS transform.
   */
  let { count, sizes, accessible = Math.floor(count / 2), overlay, class: extra = '' }:
    { count: number; sizes: string; accessible?: number; overlay?: Snippet<[number]>; class?: string } = $props();
  const strips = $derived(Array.from({ length: count }, (_, i) => i));
</script>

<span class="x-strips {extra}" style:--n={count} data-x-strips>
  {#each strips as i}
    <span class="x-col" style:--i={i} data-x-col>
      <span class="x-move" data-x-move>
        <span class="x-tile" data-x-tile>
          <span class="x-photo">
            {#if i === accessible}
              <LabPortrait {sizes} />
            {:else}
              <picture class="x-slice" aria-hidden="true">
                <source type="image/avif" srcset={portrait.avif} {sizes} />
                <source type="image/webp" srcset={portrait.webp} {sizes} />
                <img src={portrait.fallback} width={portrait.width} height={portrait.height} alt="" loading="eager" decoding="async" draggable="false" />
              </picture>
            {/if}
          </span>
        </span>
        {@render overlay?.(i)}
      </span>
    </span>
  {/each}
</span>

<style>
  /* --x-pw: width of the whole photograph; --x-gap: space between strips;
     --x-ph: photograph height (from the asset's 1086 × 1448 ratio). */
  .x-strips { --x-ph: calc(var(--x-pw) * 1448 / 1086); --x-sw: calc(var(--x-pw) / var(--n));
    display: grid; grid-template-columns: repeat(var(--n), var(--x-sw)); column-gap: var(--x-gap); height: 100%; }
  .x-col { position: relative; display: block; height: 100%; }
  .x-move { position: absolute; inset: 0; display: block; }
  .x-tile { position: absolute; inset: 0; display: block; overflow: hidden; background: var(--x-tile, var(--plum)); }
  .x-photo { position: absolute; bottom: 0; left: calc(-1 * var(--i) * var(--x-sw)); width: var(--x-pw); height: var(--x-ph); }
  .x-photo :global(picture) { display: block; width: 100%; height: 100%; }
  .x-slice img { display: block; width: 100%; height: 100%; object-fit: contain; object-position: 50% 100%; user-select: none; }
</style>
