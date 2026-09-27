<script lang="ts">
  import Pause from '@lucide/svelte/icons/pause';
  import Play from '@lucide/svelte/icons/play';
  import { onMount } from 'svelte';
  import { motionState } from '$lib/motion/policy';

  const src = '/projects/leu/leu-loop-web.mp4';
  const poster = '/projects/leu/leu-native-poster.svg';

  let video: HTMLVideoElement;
  let visible = $state(false);
  let pageVisible = $state(true);
  let playing = $state(false);
  let failed = $state(false);
  let userStarted = $state(false);

  const shouldAutoplay = $derived(
    visible && pageVisible && !$motionState.reduced && !$motionState.saveData && !userStarted && !failed
  );

  function prepare() {
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
  }

  async function syncPlayback() {
    if (!video || failed) return;
    prepare();
    if (!shouldAutoplay) {
      if (!userStarted) video.pause();
      return;
    }
    try {
      await video.play();
    } catch {
      // Poster remains the deliberate fallback when autoplay is unavailable.
    }
  }

  async function togglePlayback() {
    if (!video || failed) return;
    prepare();
    userStarted = true;
    if (video.paused) {
      try {
        await video.play();
      } catch {
        failed = true;
      }
    } else {
      video.pause();
    }
  }

  onMount(() => {
    prepare();

    const syncVisibility = () => {
      pageVisible = document.visibilityState === 'visible';
      void syncPlayback();
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      void syncPlayback();
    }, { threshold: 0.12 });

    observer.observe(video);
    document.addEventListener('visibilitychange', syncVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', syncVisibility);
    };
  });

  $effect(() => {
    shouldAutoplay;
    void syncPlayback();
  });
</script>

<section aria-labelledby="leu-product-loop-title" class="border-b border-rule py-8 sm:py-12">
  <div class="mb-6 grid gap-4 min-[51.25rem]:grid-cols-[1fr_minmax(18rem,.7fr)] min-[51.25rem]:items-end">
    <div>
      <p class="label-type mb-3 text-plum">Native product loop</p>
      <h2 id="leu-product-loop-title" class="display-type max-w-3xl text-[clamp(2rem,4vw,3.5rem)] leading-[1.02]">
        Read the source. Diagnose the gap. Return to the exact passage.
      </h2>
    </div>
    <p class="max-w-xl text-sm leading-relaxed text-muted min-[51.25rem]:justify-self-end">
      A 28-second native iOS walkthrough of Library, passage selection, grounded diagnosis, feedback, Teach It Back and exact source return.
    </p>
  </div>

  <div class="relative overflow-clip rounded-[1.5rem] border border-rule bg-ivory">
    {#if failed}
      <img
        src={poster}
        alt="Leu native reader with a highlighted source passage."
        width="1440"
        height="900"
        class="block aspect-[16/10] w-full object-cover"
      />
    {:else}
      <video
        bind:this={video}
        {src}
        {poster}
        muted
        loop
        playsinline
        preload="metadata"
        aria-label="Leu native iOS product walkthrough"
        onplay={() => playing = true}
        onpause={() => playing = false}
        onerror={() => failed = true}
        class="block aspect-[16/10] w-full object-contain"
      >
        <track kind="captions" />
      </video>

      <div class="absolute bottom-4 right-4 sm:bottom-5 sm:right-5">
        <button
          type="button"
          aria-label={playing ? 'Pause Leu product film' : 'Play Leu product film'}
          aria-pressed={playing}
          onclick={togglePlayback}
          class="flex min-h-11 items-center gap-2 rounded-full border border-rule bg-ivory/95 px-4 text-sm font-medium shadow-sm backdrop-blur transition hover:text-plum focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum"
        >
          {#if playing}
            <Pause aria-hidden="true" size={16} strokeWidth={1.8} />
            Pause
          {:else}
            <Play aria-hidden="true" size={16} strokeWidth={1.8} />
            Play
          {/if}
        </button>
      </div>
    {/if}
  </div>

  <p class="mt-3 text-xs leading-relaxed text-muted">
    Native iOS capture. Muted loop by default; reduced-motion and data-saving preferences keep the film still until you choose to play it.
  </p>
</section>
