<script lang="ts">
  import ResponsivePicture from '$lib/components/media/ResponsivePicture.svelte';
  import type { ProjectMedia as ProjectMediaType } from '$lib/content/project-media';
  import VideoLoop from './VideoLoop.svelte';

  export let media: ProjectMediaType;
  export let active = false;
  export let featured = false;
</script>

<div
  class:active
  class="project-media"
  style:aspect-ratio={media.aspectRatio ?? '16 / 10'}
  style:--focal-x={`${media.focalPoint?.x ?? 50}%`}
  style:--focal-y={`${media.focalPoint?.y ?? 50}%`}
  data-project-media
>
  {#if media.webm || media.mp4}
    <VideoLoop
      alt={media.alt}
      poster={media.poster}
      posterSources={media.posterSources}
      webm={media.webm}
      mp4={media.mp4}
      {featured}
    />
  {:else}
    <ResponsivePicture
      fallbackSrc={media.poster}
      alt={media.alt}
      width={media.posterSources?.width ?? 1440}
      height={media.posterSources?.height ?? 900}
      avifSrcset={media.posterSources?.avifSrcset}
      webpSrcset={media.posterSources?.webpSrcset}
      sizes={media.posterSources?.sizes ?? '100vw'}
      loading={featured ? 'eager' : 'lazy'}
      fetchpriority={featured ? 'high' : 'auto'}
      fit="contain"
    />
  {/if}
</div>

<style>
  .project-media {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: inherit;
    overflow: hidden;
    background: #0b0b0b;
  }

  :global(.project-media > picture img) {
    transition: filter 220ms ease;
  }

  .active :global(picture img) {
    filter: brightness(0.94);
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.project-media > picture img) {
      transition: none;
    }
  }
</style>
