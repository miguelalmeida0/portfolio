<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { observeMediaViewport } from '$lib/actions/observe-media-viewport';
  import ResponsivePicture from '$lib/components/media/ResponsivePicture.svelte';
  import type { ResponsiveImageSources } from '$lib/content/project-media';
  import { getMediaPolicy } from '$lib/media/media-policy';

  export let alt: string;
  export let poster: string;
  export let posterSources: ResponsiveImageSources | undefined = undefined;
  export let webm: string | undefined = undefined;
  export let mp4: string | undefined = undefined;
  export let featured = false;

  let video: HTMLVideoElement;
  let mounted = false;
  let playing = false;
  let ready = false;
  let failed = false;
  let playRejected = false;
  let sourcesAttached = false;
  let sourcesReady = false;
  let nearViewport = false;
  let visibleRatio = 0;
  let reducedMotion = false;
  let saveData = false;
  let documentHidden = false;

  $: policy = getMediaPolicy({
    nearViewport,
    visibleRatio,
    reducedMotion,
    saveData,
    documentHidden,
    failed
  });

  $: if (mounted && policy.shouldLoad && !sourcesAttached) {
    attachSources();
  }

  $: if (mounted && video && sourcesReady) {
    syncPlayback(policy.shouldPlay);
  }

  const updateViewport = (state: { nearViewport: boolean; visibleRatio: number }) => {
    nearViewport = state.nearViewport;
    visibleRatio = state.visibleRatio;
  };

  const attachSources = async () => {
    sourcesAttached = true;
    await tick();
    sourcesReady = true;
    video?.load();
    syncPlayback(policy.shouldPlay);
  };

  const syncPlayback = (shouldPlay: boolean) => {
    if (!video) return;
    if (!shouldPlay) {
      video.pause();
      return;
    }

    const result = video.play();
    if (result) {
      result.catch(() => {
        playRejected = true;
        playing = false;
      });
    }
  };

  const handleMediaError = () => {
    failed = true;
    ready = false;
    playing = false;
    video?.pause();
  };

  onMount(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (
      navigator as Navigator & {
        connection?: EventTarget & { saveData?: boolean };
      }
    ).connection;

    const syncPreferences = () => {
      reducedMotion = motionQuery.matches;
      saveData = connection?.saveData === true;
      documentHidden = document.hidden;
    };

    syncPreferences();
    mounted = true;
    motionQuery.addEventListener('change', syncPreferences);
    connection?.addEventListener?.('change', syncPreferences);
    document.addEventListener('visibilitychange', syncPreferences);

    return () => {
      mounted = false;
      video?.pause();
      motionQuery.removeEventListener('change', syncPreferences);
      connection?.removeEventListener?.('change', syncPreferences);
      document.removeEventListener('visibilitychange', syncPreferences);
    };
  });
</script>

<div
  class="video-stage"
  class:ready
  class:failed
  class:featured
  use:observeMediaViewport={{ onChange: updateViewport }}
  data-media-stage
  data-poster-visible={!ready || !playing || failed}
>
  <div class="poster" aria-hidden="true">
    <ResponsivePicture
      fallbackSrc={poster}
      alt=""
      width={posterSources?.width ?? 1440}
      height={posterSources?.height ?? 900}
      avifSrcset={posterSources?.avifSrcset}
      webpSrcset={posterSources?.webpSrcset}
      sizes={posterSources?.sizes ?? '100vw'}
      loading="lazy"
      fetchpriority="auto"
      fit={featured ? 'cover' : 'contain'}
      draggable={false}
    />
  </div>

  <video
    bind:this={video}
    on:loadeddata={() => (ready = true)}
    on:playing={() => (playing = true)}
    on:pause={() => (playing = false)}
    on:error={handleMediaError}
    aria-label={alt}
    muted
    playsinline
    loop
    preload="none"
    data-video-loop
    data-video-loaded={sourcesAttached}
    data-video-ready={ready}
    data-video-active={playing}
    data-video-near-viewport={nearViewport}
    data-video-visible-ratio={visibleRatio.toFixed(2)}
    data-media-policy={policy.reason}
    data-reduced-motion={reducedMotion}
    data-save-data={saveData}
    data-play-rejected={playRejected}
    data-featured={featured}
  >
    {#if sourcesAttached}
      {#if webm}<source src={webm} type="video/webm" />{/if}
      {#if mp4}<source src={mp4} type="video/mp4" />{/if}
    {/if}
  </video>
</div>

<style>
  .video-stage,
  .poster,
  video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .poster {
    z-index: 1;
    opacity: 1;
  }

  video {
    z-index: 0;
    display: block;
    object-fit: contain;
    object-position: var(--focal-x, 50%) var(--focal-y, 50%);
  }

  .video-stage.ready video {
    z-index: 2;
  }

  .video-stage.ready .poster {
    opacity: 0;
  }

  .video-stage.failed video,
  .video-stage:not(.ready) video {
    visibility: hidden;
  }

  .video-stage.failed .poster {
    z-index: 3;
    opacity: 1;
  }

  .video-stage.featured video {
    object-fit: cover;
  }
</style>
