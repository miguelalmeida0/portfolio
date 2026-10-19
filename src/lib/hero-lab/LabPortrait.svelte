<script lang="ts">
  import { portrait } from './content';
  // The production cutout, unaltered. Directions crop, mask and move its box only.
  let { sizes, eager = true, class: className = '' }: { sizes: string; eager?: boolean; class?: string } = $props();
</script>
<picture class="lab-portrait {className}">
  <source type="image/avif" srcset={portrait.avif} {sizes} />
  <source type="image/webp" srcset={portrait.webp} {sizes} />
  <img src={portrait.fallback} width={portrait.width} height={portrait.height} alt={portrait.alt}
    fetchpriority={eager ? 'high' : 'auto'} loading={eager ? 'eager' : 'lazy'} decoding="async" draggable="false" />
</picture>
<style>
  .lab-portrait { display: block; }
  img { display: block; width: 100%; height: 100%; object-fit: contain; object-position: 50% 100%; user-select: none; }
</style>
