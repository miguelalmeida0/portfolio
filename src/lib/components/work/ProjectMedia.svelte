<script lang="ts">
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
  style:--video-fit={media.videoFit ?? 'contain'}
  data-project-media
>
  {#if media.webm || media.mp4}
    <VideoLoop
      alt={media.alt}
      poster={media.poster}
      webm={media.webm}
      mp4={media.mp4}
      {featured}
    />
  {:else}
    <img
      src={media.poster}
      alt={media.alt}
      width="1440"
      height="900"
      loading={featured ? 'eager' : 'lazy'}
      fetchpriority={featured ? 'high' : 'auto'}
      decoding="async"
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

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: var(--focal-x) var(--focal-y);
    transition: filter 220ms ease;
  }

  .active img {
    filter: brightness(0.94);
  }

  @media (prefers-reduced-motion: reduce) {
    img {
      transition: none;
    }
  }
</style>
