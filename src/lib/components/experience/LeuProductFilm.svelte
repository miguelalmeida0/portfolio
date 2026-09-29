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
  const chapterProgress = $derived(
    Math.min(100, Math.max(0, (activeStage +
      (currentTime - stages[activeStage].from) / (stages[activeStage].to - stages[activeStage].from)
    ) / stages.length * 100))
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

<section aria-labelledby="leu-product-loop-title" class="leu-film">
  <div class="film-composition">
    <div class="film-copy">
      <p class="label-type film-eyebrow">Native product loop</p>
      <h2 id="leu-product-loop-title" class="display-type film-title">
        From source<br />to understanding<br />in seconds.
      </h2>
      <p class="film-description">
        Leu reads, diagnoses the gap, repairs the misunderstanding, and returns you to the exact source.
      </p>
    </div>

    <div class="film-stage">
      <div class="film-device">
        <div class="film-aperture">
          {#if failed}
            <img
              src={poster}
              alt="Leu native iOS Library, ready to open a source."
              width="1080"
              height="1350"
              class="film-media"
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
              class="film-media"
            >
              <track kind="captions" />
            </video>
          {/if}
        </div>
      </div>

      <div class="film-controls">
        {#if failed}
          <p class="film-status">Film unavailable</p>
        {:else}
          <button
            type="button"
            aria-label={playing ? 'Pause Leu product film' : 'Play Leu product film'}
            aria-pressed={playing}
            onclick={togglePlayback}
            class="film-toggle"
          >
            {#if playing}
              <Pause aria-hidden="true" size={14} strokeWidth={1.8} />
              Pause
            {:else}
              <Play aria-hidden="true" size={14} strokeWidth={1.8} />
              Play
            {/if}
          </button>
          <span class="control-divider" aria-hidden="true"></span>
          <span class="film-status" aria-hidden="true">{stages[activeStage]?.label ?? 'Read'}</span>
        {/if}
      </div>
    </div>
  </div>

  <div class="film-chapters">
    <div class="chapter-track" aria-hidden="true">
      <span style:width={`${chapterProgress}%`}></span>
    </div>
    <ol class="chapter-list" aria-label="Product film chapters">
      {#each stages as stage, index}
        <li class:chapter-active={index === activeStage} aria-current={index === activeStage ? 'step' : undefined}>
          <span class="chapter-number" aria-hidden="true">0{index + 1}</span>
          <span>{stage.label}</span>
        </li>
      {/each}
    </ol>
  </div>
</section>

<style>
  .leu-film {
    padding-block: clamp(3.5rem, 7vw, 6.5rem) clamp(3rem, 5vw, 4.5rem);
  }

  .film-composition {
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
    align-items: center;
    gap: clamp(2rem, 5vw, 5rem);
  }

  .film-copy { padding-bottom: 5rem; }

  .film-eyebrow {
    margin-bottom: 1.75rem;
    color: var(--color-plum);
    font-size: .6875rem;
    letter-spacing: .16em;
    text-transform: uppercase;
  }

  .film-title {
    font-size: clamp(2rem, 4.2vw, 3.75rem);
    line-height: 1.06;
  }

  .film-description {
    max-width: 28rem;
    margin-top: 1.75rem;
    color: var(--color-muted);
    font-size: clamp(.9375rem, 1.25vw, 1.125rem);
    line-height: 1.7;
  }

  .film-stage {
    width: min(100%, 25.75rem);
    justify-self: center;
    min-width: 0;
    margin-right: clamp(0rem, 2vw, 2rem);
  }

  .film-device {
    border-radius: 13.5% / 6.38%;
    box-shadow: 0 2px 4px rgb(11 43 34 / .08), 0 18px 32px -12px rgb(11 43 34 / .16), 0 44px 64px -24px rgb(11 43 34 / .13);
  }

  /* The original 4:5 film includes a fixed phone at x242/y44, 596x1262
     on its 1080x1350 master. Hide only that baked-in outer matte. */
  .film-aperture {
    position: relative;
    aspect-ratio: 596 / 1262;
    overflow: hidden;
    border-radius: inherit;
    isolation: isolate;
  }

  .film-media {
    position: absolute;
    display: block;
    width: 181.208054%;
    max-width: none;
    height: 106.973059%;
    left: -40.604027%;
    top: -3.486529%;
  }

  .film-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    min-height: 2.75rem;
    margin-top: 1.5rem;
    color: var(--color-muted);
  }

  .film-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: .5rem;
    min-width: 5rem;
    min-height: 2.75rem;
    padding: .5rem;
    border-radius: .25rem;
    font-size: .75rem;
    font-weight: 500;
    transition: color 160ms ease;
  }

  .film-toggle:hover { color: var(--color-plum); }
  .film-toggle:focus-visible { outline: 2px solid var(--color-plum); outline-offset: 3px; }
  .control-divider { height: .75rem; width: 1px; background: var(--color-rule); }
  .film-status { min-width: 5rem; font-size: .6875rem; letter-spacing: .02em; }

  .film-chapters { margin-top: clamp(3rem, 5vw, 4.5rem); }
  .chapter-track { height: 1px; background: color-mix(in srgb, var(--color-rule) 50%, transparent); }
  .chapter-track span { display: block; height: 100%; background: var(--color-plum); }
  .chapter-list { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); list-style: none; padding: 0; margin: 0; }
  .chapter-list li {
    position: relative;
    display: flex;
    align-items: baseline;
    gap: .75rem;
    padding-top: 1.25rem;
    color: var(--color-muted);
    font-size: .625rem;
    font-weight: 500;
    letter-spacing: .14em;
    text-transform: uppercase;
  }
  .chapter-number { font-size: .5625rem; letter-spacing: .04em; opacity: .65; }
  .chapter-list .chapter-active { color: var(--color-plum); font-weight: 600; }
  .chapter-active::before {
    content: "";
    position: absolute;
    top: -2px;
    left: 0;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--color-plum);
  }

  @media (max-width: 63.99rem) and (min-width: 48rem) {
    .film-composition { grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr); gap: 1.75rem; }
    .film-stage { margin-right: 0; }
    .film-copy { padding-bottom: 3rem; }
  }

  @media (max-width: 47.99rem) {
    .film-composition { grid-template-columns: minmax(0, 1fr); gap: 3rem; }
    .film-copy { padding-bottom: 0; }
    .film-title { font-size: clamp(2rem, 7.6vw, 3.5rem); }
    .film-description { max-width: 26rem; font-size: 1rem; }
    .film-stage { width: min(82%, 22rem); margin-right: 0; }
    .film-controls { margin-top: 1.25rem; }
    .chapter-list li { justify-content: center; padding-top: 1rem; font-size: .5625rem; letter-spacing: .06em; white-space: nowrap; }
    .chapter-number { display: none; }
    .chapter-active::before { left: calc(50% - 2px); }
  }
</style>
