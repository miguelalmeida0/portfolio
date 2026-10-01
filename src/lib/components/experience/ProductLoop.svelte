<script lang="ts">
  import { onMount } from 'svelte';
  import { motionState } from '$lib/motion/policy';

  let { src, poster, label, active = true, startAt = 0, stillForReduced = false, wide = false, onerror }: {
    src: string; poster: string; label: string; active?: boolean; startAt?: number; stillForReduced?: boolean; wide?: boolean; onerror?: () => void;
  } = $props();

  let video: HTMLVideoElement;
  let mounted = $state(false);
  let visible = $state(false);
  let pageVisible = $state(true);
  let mediaReady = $state(false);
  let startApplied = false;
  const shouldPlay = $derived(mounted && active && visible && pageVisible && !$motionState.reduced && !$motionState.saveData);

  function prepareVideo() {
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
  }

  function applyStart() {
    if (!video || startApplied || startAt <= 0 || !Number.isFinite(video.duration)) return;
    video.currentTime = Math.min(startAt, Math.max(0, video.duration - 0.25));
    startApplied = true;
  }

  async function syncPlayback() {
    if (!video) return;
    prepareVideo();
    applyStart();
    if (!shouldPlay) {
      video.pause();
      return;
    }
    try {
      await video.play();
    } catch {
      // The poster remains the cross-browser fallback when autoplay is blocked.
    }
  }

  async function restartLoop() {
    if (!video || startAt <= 0) return;
    video.currentTime = startAt;
    if (shouldPlay) {
      try { await video.play(); } catch { /* poster/current frame remains */ }
    }
  }

  onMount(() => {
    mounted = true;
    prepareVideo();

    const syncVisibility = () => {
      pageVisible = document.visibilityState === 'visible';
      void syncPlayback();
    };
    const syncReady = () => {
      mediaReady = video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA;
      applyStart();
      void syncPlayback();
    };
    const onEnded = () => { void restartLoop(); };

    syncVisibility();
    syncReady();

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      void syncPlayback();
    }, { threshold: .01 });

    observer.observe(video);
    video.addEventListener('loadedmetadata', syncReady);
    video.addEventListener('loadeddata', syncReady);
    video.addEventListener('canplay', syncReady);
    video.addEventListener('ended', onEnded);
    document.addEventListener('visibilitychange', syncVisibility);

    return () => {
      observer.disconnect();
      video.removeEventListener('loadedmetadata', syncReady);
      video.removeEventListener('loadeddata', syncReady);
      video.removeEventListener('canplay', syncReady);
      video.removeEventListener('ended', onEnded);
      document.removeEventListener('visibilitychange', syncVisibility);
    };
  });

  $effect(() => {
    shouldPlay;
    mediaReady;
    void syncPlayback();
  });
</script>

<div class="relative">
<video
  bind:this={video}
  src={mounted && active && !$motionState.saveData && !$motionState.reduced ? src : undefined}
  {poster}
  autoplay={shouldPlay}
  muted
  loop={startAt <= 0}
  playsinline
  preload={mounted && active && !$motionState.reduced && !$motionState.saveData ? 'auto' : 'none'}
  aria-label={label}
  {onerror}
  style:visibility={!mounted || stillForReduced && $motionState.reduced ? "hidden" : "visible"}
  aria-hidden={!mounted || stillForReduced && $motionState.reduced}
  class={wide ? "block aspect-video w-full object-contain" : "block aspect-[16/10] max-h-[25rem] w-full object-contain"}
>
  <track kind="captions" />
</video>
{#if !mounted || stillForReduced && $motionState.reduced}
  <img src={poster} alt={label} width="1920" height="1080" class="absolute inset-0 h-full w-full object-contain" />
{/if}
</div>
