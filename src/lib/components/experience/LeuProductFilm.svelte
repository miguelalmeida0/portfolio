<script lang="ts">
  import Pause from '@lucide/svelte/icons/pause';
  import Play from '@lucide/svelte/icons/play';
  import { onMount } from 'svelte';
  import { motionState } from '$lib/motion/policy';

  const src = '/projects/leu/leu-loop-web.mp4';
  const poster = '/projects/leu/leu-loop-poster.jpg';
  const startAt = 1.55;
  const stages = [
    { label: 'Read', from: 1.55, to: 6.5 },
    { label: 'Diagnose', from: 6.5, to: 11 },
    { label: 'Repair', from: 11, to: 15.5 },
    { label: 'Teach back', from: 15.5, to: 22 },
    { label: 'Return', from: 22, to: 28.3 }
  ];

  let video: HTMLVideoElement;
  let visible = $state(false);
  let pageVisible = $state(true);
  let playing = $state(false);
  let failed = $state(false);
  let userStarted = $state(false);
  let currentTime = $state(startAt);
  let startApplied = false;

  const shouldAutoplay = $derived(
    visible && pageVisible && !$motionState.reduced && !$motionState.saveData && !userStarted && !failed
  );
  const activeStage = $derived(
    Math.max(0, stages.findIndex((stage) => currentTime >= stage.from && currentTime < stage.to))
  );

  function prepare() {
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
  }

  function applyFastStart() {
    if (!video || startApplied || !Number.isFinite(video.duration)) return;
    video.currentTime = Math.min(startAt, Math.max(0, video.duration - 0.25));
    currentTime = video.currentTime;
    startApplied = true;
  }

  async function playFromCurrentState() {
    if (!video || failed) return;
    prepare();
    applyFastStart();
    try {
      await video.play();
    } catch {
      // The real first frame remains visible if autoplay is blocked.
    }
  }

  async function syncPlayback() {
    if (!video || failed) return;
    prepare();
    applyFastStart();

    if (!shouldAutoplay) {
      if (!userStarted) video.pause();
      return;
    }
    await playFromCurrentState();
  }

  async function restart() {
    if (!video || failed) return;
    video.currentTime = startAt;
    currentTime = startAt;
    if (userStarted || shouldAutoplay) await playFromCurrentState();
  }

  async function togglePlayback() {
    if (!video || failed) return;
    prepare();
    applyFastStart();
    userStarted = true;
    if (video.paused) await playFromCurrentState();
    else video.pause();
  }

  onMount(() => {
    prepare();

    const syncVisibility = () => {
      pageVisible = document.visibilityState === 'visible';
      void syncPlayback();
    };
    const ready = () => {
      applyFastStart();
      void syncPlayback();
    };
    const time = () => { currentTime = video.currentTime; };
    const ended = () => { void restart(); };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      void syncPlayback();
    }, { threshold: 0.01 });

    observer.observe(video);
    video.addEventListener('loadedmetadata', ready);
    video.addEventListener('loadeddata', ready);
    video.addEventListener('canplay', ready);
    video.addEventListener('timeupdate', time);
    video.addEventListener('ended', ended);
    document.addEventListener('visibilitychange', syncVisibility);

    return () => {
      observer.disconnect();
      video.removeEventListener('loadedmetadata', ready);
      video.removeEventListener('loadeddata', ready);
      video.removeEventListener('canplay', ready);
      video.removeEventListener('timeupdate', time);
      video.removeEventListener('ended', ended);
      document.removeEventListener('visibilitychange', syncVisibility);
    };
  });

  $effect(() => {
    shouldAutoplay;
    void syncPlayback();
  });
</script>

<section aria-labelledby="leu-product-loop-title" class="border-b border-rule py-8 sm:py-12">
  <div class="mb-5 grid gap-4 min-[51.25rem]:grid-cols-[1fr_minmax(18rem,.7fr)] min-[51.25rem]:items-end">
    <div>
      <p class="label-type mb-3 text-plum">Native product loop</p>
      <h2 id="leu-product-loop-title" class="display-type max-w-3xl text-[clamp(2rem,4vw,3.5rem)] leading-[1.02]">
        From source to understanding in seconds.
      </h2>
    </div>
    <p class="max-w-xl text-sm leading-relaxed text-muted min-[51.25rem]:justify-self-end">
      The film starts at the first interaction: open the source, select the passage, diagnose the gap, repair it and Teach It Back.
    </p>
  </div>

  <div class="relative overflow-clip rounded-[1.5rem] border border-rule bg-ivory">
    {#if failed}
      <img
        src={poster}
        alt="Leu native iOS Library, ready to open a source."
        width="1178"
        height="2556"
        class="block aspect-[16/10] w-full object-contain"
      />
    {:else}
      <video
        bind:this={video}
        {src}
        {poster}
        muted
        playsinline
        preload="auto"
        aria-label="Leu native iOS product walkthrough"
        onplay={() => playing = true}
        onpause={() => playing = false}
        onerror={() => failed = true}
        class="block aspect-[16/10] w-full object-contain"
      >
        <track kind="captions" />
      </video>

      <div class="pointer-events-none absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 sm:inset-x-5 sm:bottom-5">
        <div class="hidden rounded-full border border-rule bg-ivory/95 px-3 py-2 text-xs font-medium shadow-sm backdrop-blur sm:block">
          {stages[activeStage]?.label ?? 'Read'}
        </div>
        <button
          type="button"
          aria-label={playing ? 'Pause Leu product film' : 'Play Leu product film'}
          aria-pressed={playing}
          onclick={togglePlayback}
          class="pointer-events-auto ml-auto flex min-h-11 items-center gap-2 rounded-full border border-rule bg-ivory/95 px-4 text-sm font-medium shadow-sm backdrop-blur transition hover:text-plum focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum"
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

  <div aria-hidden="true" class="mt-4 grid grid-cols-5 border-y border-rule text-[10px] font-semibold uppercase tracking-[.12em] text-muted sm:text-xs">
    {#each stages as stage, index}
      <div class="border-r border-rule px-2 py-2 text-center last:border-r-0 transition-colors duration-200 {index === activeStage && playing ? 'bg-sage text-plum' : ''}">
        {stage.label}
      </div>
    {/each}
  </div>
</section>
