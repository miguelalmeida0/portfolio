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
    transition:
      filter var(--motion-indicator) var(--motion-ease-feedback),
      scale var(--motion-indicator) var(--motion-ease-feedback);
  }

  /*
   * The inner response. Only the image and the video surface move, never the frame
   * or the link, so the clickable area and the playback control stay exactly where
   * the pointer found them. Capped at the 1.025 limit.
   */
  .active img,
  .active :global(video) {
    scale: var(--motion-media-hover-scale, 1.025);
  }

  .active img {
    filter: brightness(0.94);
  }

  :global(video) {
    transition: scale var(--motion-indicator) var(--motion-ease-feedback);
  }

  @media (prefers-reduced-motion: reduce) {
    img,
    :global(video) {
      transition: none;
      scale: 1;
    }
  }
</style>
