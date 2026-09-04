<script lang="ts">
  import { onMount } from 'svelte';

  import MiguelLLMDrawer from '$lib/components/miguel-llm/MiguelLLMDrawer.svelte';
  import type { MiguelLLMMode } from '$lib/miguel-llm/types';
  import HeroPortrait from './HeroPortrait.svelte';

  let drawerOpen = false;
  let drawerMode: MiguelLLMMode = 'recruiter';

  const openMiguelLLM = () => {
    drawerMode = 'recruiter';
    drawerOpen = true;
  };

  onMount(() => {
    const handleOpen = (event: Event) => {
      const detail = (event as CustomEvent<{ mode?: MiguelLLMMode }>).detail;
      drawerMode = detail?.mode ?? 'recruiter';
      drawerOpen = true;
    };

    window.addEventListener('miguel-llm:open', handleOpen as EventListener);
    return () => window.removeEventListener('miguel-llm:open', handleOpen as EventListener);
  });
</script>

<section id="top" class="portrait-hero" aria-labelledby="hero-title">
  <div class="portrait-stage">
    <HeroPortrait />

    <div class="hero-content">
      <h1 id="hero-title">
        I’m Miguel, a frontend engineer building multimodal and computer-vision systems.
      </h1>
      <div class="hero-actions" aria-label="Primary portfolio actions">
        <a class="primary" href="#work">Explore my work</a>
        <a href="/cv">View résumé</a>
        <button type="button" on:click={openMiguelLLM}>
          <span aria-hidden="true">✦</span>
          Ask MiguelLLM
        </button>
      </div>
    </div>

    <div class="work-tease" aria-label="Featured work begins below">
      <a href="/work/camera-harness"><span>01</span>Camera Harness</a>
      <a href="/work/atlas"><span>02</span>Atlas</a>
      <a href="/work/ghostwriter"><span>03</span>Ghostwriter</a>
    </div>
  </div>
</section>

<MiguelLLMDrawer bind:open={drawerOpen} bind:mode={drawerMode} />

<style>
  .portrait-hero,
  .portrait-stage {
    position: relative;
    min-height: clamp(44rem, 100svh, 56rem);
    overflow: clip;
    background: #000;
    color: #f4eadc;
  }

  .portrait-stage :global(.hero-portrait) {
    z-index: 1;
  }

  .portrait-stage :global(.portrait-frame) {
    top: clamp(3.5rem, 5.5svh, 4.75rem);
    width: min(84vw, 78rem);
  }

  @media (min-width: 981px) {
    .portrait-stage {
      display: grid;
      grid-template-columns: minmax(0, 0.9fr) minmax(28rem, 1.1fr);
      grid-template-rows: minmax(0, 1fr) auto;
    }

    .portrait-stage :global(.hero-portrait) {
      position: relative;
      inset: auto;
      grid-column: 2;
      grid-row: 1;
      min-width: 0;
    }

    .portrait-stage :global(.portrait-frame) {
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      max-width: none;
      transform: none;
    }

    .portrait-stage :global(.portrait-image) {
      object-fit: cover;
      object-position: center bottom;
    }

    .portrait-stage > .hero-content {
      position: relative;
      top: auto;
      left: auto;
      grid-column: 1;
      grid-row: 1;
      align-self: center;
      width: auto;
      min-width: 0;
      margin: clamp(3rem, 8svh, 5.5rem) max(1.5rem, 2.5vw) 0 max(1.5rem, 4vw);
    }

    .portrait-stage > .work-tease {
      position: relative;
      inset: auto;
      grid-column: 1 / -1;
      grid-row: 2;
    }
  }

  .hero-content {
    position: absolute;
    top: clamp(5.25rem, 10svh, 7.75rem);
    left: max(clamp(1.25rem, 4vw, 4rem), env(safe-area-inset-left));
    z-index: 8;
    display: grid;
    width: min(35rem, calc(100vw - 2.5rem));
    gap: 0.7rem;
  }

  h1 {
    margin: 0;
  }

  h1 {
    max-width: 34rem;
    font-family: var(--font-serif);
    font-size: clamp(2.2rem, 2.75vw, 2.9rem);
    font-weight: 430;
    letter-spacing: -0.02em;
    line-height: 1.02;
  }

  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.55rem;
    margin-top: 0.4rem;
  }

  .hero-actions a,
  .hero-actions button {
    display: inline-flex;
    min-height: 2.5rem;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    border: 1px solid rgb(244 234 220 / 0.28);
    border-radius: 999px;
    background: rgb(0 0 0 / 0.4);
    padding: 0.52rem 0.86rem;
    color: #f4eadc;
    cursor: pointer;
    font-size: 0.78rem;
    font-weight: 850;
    line-height: 1;
  }

  .hero-actions .primary {
    background: #f4eadc;
    color: #050505;
  }

  .hero-actions a:hover,
  .hero-actions a:focus-visible,
  .hero-actions button:hover,
  .hero-actions button:focus-visible {
    border-color: var(--accent);
    outline: 2px solid var(--ring);
    outline-offset: 2px;
  }

  .work-tease {
    position: absolute;
    inset: auto 0 0;
    z-index: 10;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    min-height: 3.65rem;
    align-items: stretch;
    border-block: 1px solid rgb(244 234 220 / 0.18);
    background: rgb(0 0 0 / 0.74);
    backdrop-filter: blur(12px);
  }

  .work-tease a {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    border-right: 1px solid rgb(244 234 220 / 0.15);
    padding: 0.72rem clamp(0.72rem, 1.8vw, 1.4rem);
    color: rgb(244 234 220 / 0.76);
    font-size: clamp(0.7rem, 0.86vw, 0.82rem);
    font-weight: 760;
  }

  .work-tease a:hover,
  .work-tease a:focus-visible {
    background: rgb(244 234 220 / 0.08);
    color: var(--foreground);
    outline: none;
  }

  .work-tease a:focus-visible {
    box-shadow: inset 0 0 0 2px var(--ring);
  }

  .work-tease span {
    color: var(--accent);
    font-family: var(--font-mono);
    font-size: 0.68rem;
  }

  @media (max-width: 980px) {
    .portrait-hero,
    .portrait-stage {
      min-height: max(48rem, 100svh);
    }

    .portrait-stage {
      display: grid;
      grid-template-rows: auto minmax(24rem, 1fr) auto;
    }

    .portrait-stage :global(.hero-portrait) {
      position: relative;
      inset: auto;
      grid-row: 2;
      min-height: 24rem;
    }

    .hero-content {
      position: relative;
      top: auto;
      left: auto;
      grid-row: 1;
      width: min(35rem, calc(100vw - 2rem));
      margin: 4.75rem 1rem 1rem;
    }

    .portrait-stage :global(.portrait-frame) {
      top: 0;
      width: auto;
      height: 100%;
      max-width: none;
    }

    .work-tease {
      position: relative;
      inset: auto;
      grid-row: 3;
    }
  }

  @media (max-width: 760px) {
    .hero-content {
      gap: 0.5rem;
    }

    h1 {
      font-size: clamp(2rem, 7.2vw, 2.35rem);
      line-height: 1.02;
    }

    .hero-actions {
      gap: 0.42rem;
    }

    .hero-actions a,
    .hero-actions button {
      min-height: 2.45rem;
      padding-inline: 0.68rem;
      font-size: 0.74rem;
    }

    .work-tease {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      min-height: 3.25rem;
    }

    .work-tease a {
      justify-content: center;
      padding: 0.58rem 0.25rem;
      font-size: 0.64rem;
    }

    .work-tease span {
      display: none;
    }
  }

  @media (max-width: 390px) {
    .hero-content {
      margin-top: 4.4rem;
    }

    h1 {
      font-size: clamp(1.75rem, 7.5vw, 2rem);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .work-tease {
      backdrop-filter: none;
    }
  }
</style>
