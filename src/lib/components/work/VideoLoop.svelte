<script lang="ts">
  import { onMount, tick } from 'svelte';
  import Pause from '@lucide/svelte/icons/pause';
  import Play from '@lucide/svelte/icons/play';

  import { motionState } from '$lib/motion/policy';
  import { registerPreview } from '$lib/motion/previewCoordinator';

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
  let saveData = false;
  let userPaused = false;
  let userStarted = false;
  let disposed = false;
  let ready = false;
  let slotHeld = false;

  /**
   * The preview slot. Only the most visible decorative preview autoplays; a film the
   * visitor started by hand keeps playing regardless of what else comes into view.
   */
  const slot = registerPreview({
    play: () => {
      slotHeld = true;
      void playWhenReady();
    },
    pause: () => {
      slotHeld = false;
      if (!userStarted) pause();
    }
  });

  /**
   * Automatic playback is decorative, so it answers to the whole motion policy: the
   * operating system's reduced-motion setting, the site's own Reduced control and
   * Save-Data all suppress it, and so does a hidden tab or a deliberate pause. An
   * explicit Play is a different thing and stays under the visitor's control.
   */
  const autoplayBlocked = () =>
    disposed || reducedMotion || saveData || document.hidden || !inViewport || userPaused;

  const pause = () => video?.pause();

  const mountSources = async () => {
    if (sourcesMounted) return true;
    sourcesMounted = true;
    await tick();
    if (disposed) return false;
    video.load();
    return true;
  };

  const playWhenReady = async () => {
    if (autoplayBlocked() || !slotHeld) return;
    if (!(await mountSources())) return;
    if (autoplayBlocked() || !slotHeld) return;
    video.play().catch(() => {
      // The poster remains visible if muted autoplay is blocked.
    });
  };

  const togglePlayback = async () => {
    if (playing) {
      userPaused = true;
      userStarted = false;
      pause();
      return;
    }

    userPaused = false;
    userStarted = true;
    slot.claim();
    slotHeld = true;
    if (!(await mountSources())) return;
    video.play().catch(() => undefined);
  };

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          inViewport = entry.isIntersecting && entry.intersectionRatio >= 0.25;
          slot.report(inViewport && !reducedMotion && !saveData ? entry.intersectionRatio : 0);
          if (!inViewport && !userStarted) pause();
        }
      },
      { rootMargin: '0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    // A single subscription covers the OS preference, the site's Reduced control and
    // Save-Data, so all three routes to "no decorative motion" behave identically.
    const stopWatchingPolicy = motionState.subscribe((state) => {
      reducedMotion = state.reduced;
      saveData = state.saveData;

      if (state.reduced || state.saveData) {
        slot.report(0);
        if (!userStarted) pause();
      } else {
        void playWhenReady();
      }
    });

    const syncPageVisibility = () => {
      if (document.hidden) pause();
      else void playWhenReady();
    };

    observer.observe(video);
    document.addEventListener('visibilitychange', syncPageVisibility);

    return () => {
      disposed = true;
      pause();
      observer.disconnect();
      slot.release();
      stopWatchingPolicy();
      document.removeEventListener('visibilitychange', syncPageVisibility);
    };
  });
</script>

<div class="video-shell" data-video-ready={ready}>
  <!--
    The poster layer crossfades out once real frames are on screen, which removes the
    black flash a bare `poster` swap produces. It is the same file the video element
    already uses as its poster, so it resolves from cache, and it stays in place if
    playback never starts. `loading="lazy"` matters: without it these three previews
    compete with the hero portrait for bandwidth and push LCP out measurably.
  -->
  <img
    class="poster-layer"
    src={poster}
    alt=""
    aria-hidden="true"
    loading="lazy"
    decoding="async"
  />

  <video
    bind:this={video}
    on:canplay={playWhenReady}
    on:playing={() => (ready = true)}
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
    data-video-ready={ready}
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

  .poster-layer {
    position: absolute;
    inset: 0;
    z-index: 2;
    width: 100%;
    height: 100%;
    object-fit: var(--video-fit, contain);
    object-position: var(--focal-x, 50%) var(--focal-y, 50%);
    opacity: 1;
    transition: opacity 180ms var(--motion-ease-feedback);
    pointer-events: none;
  }

  .video-shell[data-video-ready='true'] .poster-layer {
    opacity: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    .poster-layer {
      transition: none;
    }
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
