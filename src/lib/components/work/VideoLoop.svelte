<script lang="ts">
  import { onMount } from 'svelte';

  export let alt: string;
  export let webm: string | undefined = undefined;
  export let mp4: string | undefined = undefined;
  export let featured = false;

  let video: HTMLVideoElement;
  let playing = false;
  let reducedMotion = false;

  const play = () => {
    if (!video || reducedMotion || document.hidden) return;
    video.play().catch(() => {
      // Muted autoplay is expected; the native first frame remains visible if a browser blocks it.
    });
  };

  const pause = () => {
    if (!video) return;
    video.pause();
  };

  onMount(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const syncMotionPreference = () => {
      reducedMotion = motionQuery.matches;
      if (reducedMotion) pause();
      else play();
    };

    const syncPageVisibility = () => {
      if (document.hidden) pause();
      else play();
    };

    syncMotionPreference();
    motionQuery.addEventListener('change', syncMotionPreference);
    document.addEventListener('visibilitychange', syncPageVisibility);

    return () => {
      pause();
      motionQuery.removeEventListener('change', syncMotionPreference);
      document.removeEventListener('visibilitychange', syncPageVisibility);
    };
  });
</script>

<video
  bind:this={video}
  on:canplay={play}
  on:loadeddata={play}
  on:play={() => (playing = true)}
  on:pause={() => (playing = false)}
  aria-label={alt}
  autoplay
  muted
  playsinline
  loop
  preload="auto"
  data-video-loop
  data-video-loaded="true"
  data-video-active={playing}
  data-autoplay-visible="true"
  data-featured={featured}
  data-mobile-poster="false"
>
  {#if webm}<source src={webm} type="video/webm" />{/if}
  {#if mp4}<source src={mp4} type="video/mp4" />{/if}
</video>

<style>
  video {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: var(--focal-x, 50%) var(--focal-y, 50%);
  }

  video[data-featured='true'] {
    object-fit: cover;
  }
</style>
