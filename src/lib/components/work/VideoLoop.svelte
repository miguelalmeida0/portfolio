<script lang="ts">
  import { onMount, tick } from 'svelte';
  import Pause from '@lucide/svelte/icons/pause';
  import Play from '@lucide/svelte/icons/play';

  export let alt: string;
  export let poster: string;
  export let webm: string | undefined = undefined;
  export let mp4: string | undefined = undefined;
  export let featured = false;

  let video: HTMLVideoElement;
  let playing = false;
  let inViewport = false;
  let sourcesMounted = false;
  let reducedMotion = false;
  let userPaused = false;
  let disposed = false;

  const pause = () => video?.pause();

  const playWhenReady = async () => {
    if (disposed || reducedMotion || document.hidden || !inViewport || userPaused) return;
    if (!sourcesMounted) {
      sourcesMounted = true;
      await tick();
      if (disposed) return;
      video.load();
    }
    if (disposed || reducedMotion || document.hidden || !inViewport || userPaused) return;
    video.play().catch(() => {
      // The poster remains visible if muted autoplay is blocked.
    });
  };

  const togglePlayback = async () => {
    if (playing) {
      userPaused = true;
      pause();
      return;
    }

    userPaused = false;
    if (!sourcesMounted) {
      sourcesMounted = true;
      await tick();
      if (disposed) return;
      video.load();
    }
    video.play().catch(() => undefined);
  };

  onMount(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewport = entry.isIntersecting && entry.intersectionRatio >= 0.25;
        if (inViewport) void playWhenReady();
        else pause();
      },
      { rootMargin: '0px', threshold: 0.25 }
    );

    const syncMotionPreference = () => {
      reducedMotion = motionQuery.matches;
      if (reducedMotion) pause();
      else void playWhenReady();
    };

    const syncPageVisibility = () => {
      if (document.hidden) pause();
      else void playWhenReady();
    };

    syncMotionPreference();
    observer.observe(video);
    motionQuery.addEventListener('change', syncMotionPreference);
    document.addEventListener('visibilitychange', syncPageVisibility);

    return () => {
      disposed = true;
      pause();
      observer.disconnect();
      motionQuery.removeEventListener('change', syncMotionPreference);
      document.removeEventListener('visibilitychange', syncPageVisibility);
    };
  });
</script>

<div class="video-shell">
  <video
    bind:this={video}
    on:canplay={playWhenReady}
    on:play={() => (playing = true)}
    on:pause={() => (playing = false)}
    aria-label={alt}
    {poster}
    muted
    playsinline
    loop
    preload="none"
    data-video-loop
    data-video-active={playing}
    data-video-sources-mounted={sourcesMounted}
    data-autoplay-visible="true"
    data-featured={featured}
  >
    {#if sourcesMounted}
      {#if webm}<source src={webm} type="video/webm" />{/if}
      {#if mp4}<source src={mp4} type="video/mp4" />{/if}
    {/if}
  </video>

  <button
    type="button"
    class="playback-control"
    aria-label={playing ? 'Pause project film' : 'Play project film'}
    on:click={togglePlayback}
  >
    {#if playing}
      <Pause size={15} strokeWidth={2} aria-hidden="true" />
      <span>Pause</span>
    {:else}
      <Play size={15} strokeWidth={2} aria-hidden="true" />
      <span>Play</span>
    {/if}
  </button>
</div>

<style>
  .video-shell,
  video {
    width: 100%;
    height: 100%;
  }

  .video-shell {
    position: relative;
    display: grid;
    place-items: center;
    overflow: hidden;
    background: #0a0a0a;
  }

  video {
    position: absolute;
    inset: 0;
    display: block;
    object-fit: var(--video-fit, contain);
    object-position: var(--focal-x, 50%) var(--focal-y, 50%);
  }

  .playback-control {
    position: absolute;
    right: 0.75rem;
    bottom: 0.75rem;
    z-index: 4;
    display: inline-flex;
    min-height: 2.55rem;
    align-items: center;
    gap: 0.42rem;
    border: 1px solid rgb(244 234 220 / 0.3);
    border-radius: 999px;
    background: rgb(5 5 5 / 0.82);
    padding: 0.55rem 0.78rem;
    color: #f4eadc;
    cursor: pointer;
    font-family: var(--font-sans);
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0;
    backdrop-filter: blur(10px);
    transition:
      transform var(--interaction-duration) var(--interaction-ease),
      background-color var(--interaction-duration) var(--interaction-ease),
      box-shadow var(--interaction-duration) var(--interaction-ease);
  }

  .playback-control:hover {
    background: #050505;
    transform: translateY(-1px);
    box-shadow: 0 14px 30px -22px rgb(0 0 0 / 0.8);
  }

  .playback-control:focus-visible {
    outline: 2px solid var(--ring);
    outline-offset: 2px;
  }

  @media (max-width: 600px) {
    .playback-control {
      right: 0.55rem;
      bottom: 0.55rem;
      min-height: 2.4rem;
      padding: 0.48rem 0.68rem;
      font-size: 0.74rem;
    }
  }
</style>
