<script lang="ts">
  import { onMount } from 'svelte';
  import Sparkles from '@lucide/svelte/icons/sparkles';

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

<section id="top" class="hero-section" aria-labelledby="hero-title">
  <div class="hero-stage">
    <div class="hero-content">
      <h1 id="hero-title">
        <span>I’m Miguel, a frontend</span> <span>engineer building multimodal</span> <span>and computer-vision systems.</span>
      </h1>

      <p class="hero-focus">Frontend & design engineering for elite products.<br /><span>React, TypeScript, and Svelte.</span></p>

      <div class="hero-actions" aria-label="Primary portfolio actions">
        <a class="primary" href="#work">Explore my work</a>
        <a href="/cv">View résumé</a>
        <button type="button" on:click={openMiguelLLM}>
          <Sparkles size={12} strokeWidth={1.8} aria-hidden="true" />
          <span>Ask MiguelLLM</span>
        </button>
      </div>
    </div>

    <div class="portrait-wrap">
      <HeroPortrait />
    </div>
  </div>
</section>

<MiguelLLMDrawer bind:open={drawerOpen} bind:mode={drawerMode} />

<style>
  .hero-section { overflow: clip; background: #000; color: #f4eadc; border-bottom: 1px solid rgb(244 234 220 / 0.16); }
  .hero-stage { position: relative; height: clamp(600px, 42.7vw, 800px); width: 100%; margin-inline: auto; }
  .hero-content { position: relative; z-index: 4; display: flex; flex-direction: column; justify-content: center; align-items: flex-start; gap: 18px; height: 100%; padding: 48px 0 0 3.6vw; }
  h1 { margin: 0; font-family: var(--font-serif); font-size: var(--text-page); font-weight: 430; letter-spacing: -0.046em; line-height: 1.07; }
  h1 span { display: block; }
  .hero-focus { margin: 0; max-width: 38rem; color: rgb(244 234 220 / 0.75); font-size: var(--text-label); line-height: 1.6; }
  .hero-focus span { color: rgb(244 234 220 / 0.55); }
  .hero-actions { display: flex; flex-wrap: wrap; gap: 9px; }
  .hero-actions a, .hero-actions button { display: inline-flex; min-height: 40px; align-items: center; justify-content: center; gap: 6px; border: 1px solid rgb(244 234 220 / 0.3); border-radius: 999px; background: #000; padding: 0 14px; color: #f4eadc; cursor: pointer; font-family: var(--font-sans); font-size: 11px; font-weight: 760; line-height: 1; transition: background-color 180ms ease; }
  .hero-actions .primary { border-color: #f4eadc; background: #f4eadc; color: #050505; }
  .hero-actions a:hover, .hero-actions button:hover { background: #24221e; }
  .hero-actions .primary:hover { background: #e3d6c3; }
  .hero-actions a:focus-visible, .hero-actions button:focus-visible { outline: 2px solid var(--ring); outline-offset: 3px; }
  .portrait-wrap { position: absolute; z-index: 1; width: 55%; aspect-ratio: 1451 / 1086; top: 8px; right: 0; }
  .portrait-wrap :global(.hero-portrait) { inset: 0; }
  .portrait-wrap :global(.portrait-frame) { inset: 0; width: 100%; height: 100%; aspect-ratio: auto; transform: none; }
  .portrait-wrap :global(.portrait-image) { object-fit: contain; object-position: center; }
  @media (max-width: 1050px) and (min-width: 761px) {
    .hero-stage { height: 560px; }
    h1 { font-size: 30px; }
    .portrait-wrap { width: 62%; top: 80px; right: -5%; }
  }
  @media (max-width: 760px) {
    .hero-stage { display: flex; flex-direction: column; height: auto; min-height: 100svh; }
    .hero-content { flex: none; height: auto; padding: 100px 20px 16px; gap: 22px; }
    h1 { font-size: clamp(25px, 5.8vw, 42px); line-height: 1.12; }
    .hero-actions { gap: 8px; }
    .hero-actions a, .hero-actions button { min-height: 44px; padding-inline: 12px; font-size: 11px; }
    .portrait-wrap { position: relative; flex: 1; align-self: center; width: min(120%, 700px); min-height: 350px; top: auto; right: auto; }
  }
  @media (max-width: 360px) { h1 span { display: inline; } }
</style>
