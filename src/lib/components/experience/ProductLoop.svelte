<script lang="ts">
  import { onMount } from 'svelte';
  import { motionState } from '$lib/motion/policy';

  let { src, poster, label, active = true, onerror }: {
    src: string; poster: string; label: string; active?: boolean; onerror?: () => void;
  } = $props();

  let video: HTMLVideoElement;
  let visible = $state(false);
  let pageVisible = $state(true);
  let mediaReady = $state(false);
  const shouldPlay = $derived(active && visible && pageVisible && !$motionState.reduced && !$motionState.saveData);

  function prepareVideo() {
    if (!video) return;
    // Safari/WebKit is most reliable when these are set as DOM properties before play().
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
  }

  async function syncPlayback() {
    if (!video) return;
    prepareVideo();
    if (!shouldPlay) {
      video.pause();
      return;
    }
    try {
      await video.play();
    } catch {
      // Muted autoplay is still a browser policy, not a product invariant.
      // The poster is deliberately retained as the cross-browser fallback.
    }
  }

  onMount(() => {
    prepareVideo();
    const syncVisibility = () => {
      pageVisible = document.visibilityState === 'visible';
    };
    const syncReady = () => {
      mediaReady = video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA;
      void syncPlayback();
    };

    syncVisibility();
    syncReady();

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      void syncPlayback();
    }, { threshold: .05 });

    observer.observe(video);
    video.addEventListener('loadeddata', syncReady);
    video.addEventListener('canplay', syncReady);
    document.addEventListener('visibilitychange', syncVisibility);

    return () => {
      observer.disconnect();
      video.removeEventListener('loadeddata', syncReady);
      video.removeEventListener('canplay', syncReady);
      document.removeEventListener('visibilitychange', syncVisibility);
    };
  });

  $effect(() => {
    shouldPlay;
    mediaReady;
    void syncPlayback();
  });
</script>

<video
  bind:this={video}
  src={active && !$motionState.saveData ? src : undefined}
  {poster}
  autoplay={shouldPlay}
  muted
  loop
  playsinline
  preload={active && !$motionState.reduced && !$motionState.saveData ? 'auto' : 'none'}
  aria-label={label}
  {onerror}
  class="block aspect-[16/10] max-h-[25rem] w-full object-contain"
>
  <track kind="captions" />
</video>
