<script lang="ts">
  export let fallbackSrc: string;
  export let alt: string;
  export let width: number;
  export let height: number;
  export let avifSrcset: string | undefined = undefined;
  export let webpSrcset: string | undefined = undefined;
  export let sizes = '100vw';
  export let loading: 'eager' | 'lazy' = 'lazy';
  export let fetchpriority: 'high' | 'low' | 'auto' = 'auto';
  export let fit: 'cover' | 'contain' = 'contain';
  export let layout: 'fill' | 'intrinsic' = 'fill';
  export let objectPosition = 'var(--focal-x, 50%) var(--focal-y, 50%)';
  export let draggable = true;
</script>

<picture class:intrinsic={layout === 'intrinsic'}>
  {#if avifSrcset}<source type="image/avif" srcset={avifSrcset} {sizes} />{/if}
  {#if webpSrcset}<source type="image/webp" srcset={webpSrcset} {sizes} />{/if}
  <img
    src={fallbackSrc}
    {alt}
    {width}
    {height}
    {sizes}
    {loading}
    {fetchpriority}
    decoding="async"
    {draggable}
    style:object-fit={fit}
    style:object-position={objectPosition}
  />
</picture>

<style>
  picture,
  img {
    display: block;
    width: 100%;
    height: 100%;
  }

  picture.intrinsic,
  picture.intrinsic img {
    height: auto;
  }
</style>
