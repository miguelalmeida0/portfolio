<script lang="ts">
  import { fade } from 'svelte/transition';
  const scenes = [
    { id: 'journey', label: 'The journey', title: 'A place to return. A page to understand.', description: 'Pick up where you left off, stay with the passage, then put it in your own words.', phone: 'iphone-flow-20261009.webp' },
    { id: 'home', label: 'Home', title: 'Your place is still here.', description: 'The book, the page, the next step. A quiet invitation to keep reading.', phone: 'iphone-home-20261009.webp' },
    { id: 'library', label: 'Library', title: 'Everything you brought, together.', description: 'A shelf of your own books, with your current passage ready to open.', phone: 'iphone-library-20261009.webp' },
    { id: 'read', label: 'Read', title: 'Stay with the thought.', description: 'Read the passage, hear it aloud, or ask for an explanation without losing the source.', phone: 'iphone-hero-20261009.webp' },
    { id: 'words', label: 'Tell it back', title: 'Tell it to a curious friend.', description: 'Explain the page in your own words. See which ideas got across and which need another look.', phone: 'iphone-words-20261009.webp' }
  ];
  const views = ['Together', 'Phone', 'Desktop'] as const;
  let selected = $state('journey');
  let view = $state<(typeof views)[number]>('Together');
  const scene = $derived(scenes.find(item => item.id === selected)!);
  const overview = $derived(selected === 'journey');
  const asset = (file: string) => `/projects/leu/showcase/${file}`;
</script>

<section class="platform-showcase" id="overview" aria-label="Leu across phone and browser" data-leu-showcase>
  <header class="showcase-heading">
    <div><h1 id="hero-h">Built around the page.</h1><p class="showcase-deck">A quieter way to read. A clearer way to understand.</p></div>
    <p class="platform-note">Native on iPhone.<br />At home in your browser.</p>
  </header>
  <div class="showcase-controls">
    <div class="scene-switch" role="group" aria-label="Choose a moment">
      {#each scenes as item, index}
        <button type="button" aria-pressed={selected === item.id} aria-controls="leu-platform-gallery" onclick={() => selected = item.id}>
          {#if index > 0}<span class="step-number" aria-hidden="true">{index}</span>{/if}{item.label}
        </button>
      {/each}
    </div>
    <div class="view-switch" role="group" aria-label="Focus a platform">
      {#each views as option}<button type="button" aria-pressed={view === option} aria-controls="leu-platform-gallery" onclick={() => view = option}>{option}</button>{/each}
    </div>
  </div>
  <div id="leu-platform-gallery" class="platform-gallery" data-view={view.toLowerCase()} data-moment={scene.id}>
    {#if overview && view !== 'Desktop'}
      <figure class="journey-stage">
        {#key view}
          {#if view === 'Together'}
            <picture in:fade={{ duration: 160 }}>
              <source media="(max-width: 600px)" srcset={asset('iphone-home-20261009.webp')} />
              <img src={asset('iphone-hero-20261009.webp')} alt="Leu’s learning journey: return to your book, read a passage, and explain it in your own words." width="2048" height="1280" fetchpriority="high" decoding="async" />
            </picture>
          {:else}
            <!-- svelte-ignore a11y_no_noninteractive_tabindex (This scroll viewport needs keyboard access to the complete supplied phone flow.) -->
            <div class="flow-scroll" tabindex="0" role="region" aria-label="Four iPhone screens; scroll horizontally to explore" in:fade={{ duration: 160 }}>
              <img src={asset(scene.phone)} alt="Leu on iPhone: Home, Read, Tell it back, and Library." width="2048" height="888" decoding="async" />
            </div>
          {/if}
        {/key}
        <figcaption><h2>{scene.title}</h2><p>{scene.description}</p></figcaption>
      </figure>
    {:else}
      <figure class="platform-phone" hidden={view === 'Desktop'}>
        <div class="phone-stage">
          {#key scene.id}
            <div class="phone-screen" class:from-sheet={scene.id === 'read'} in:fade={{ duration: 160 }}>
              <img src={asset(scene.phone)} alt={`Leu on iPhone: ${scene.label}`} data-scene={scene.id} width={scene.id === 'read' ? 2048 : 984} height={scene.id === 'read' ? 1280 : 2048} decoding="async" />
            </div>
          {/key}
        </div>
        <figcaption><p class="platform-label">On iPhone · SwiftUI</p><h2>{scene.title}</h2><p>{scene.description}</p></figcaption>
      </figure>
    {/if}
    <figure class="platform-desktop" hidden={overview && view !== 'Desktop' || view === 'Phone'}>
      <div class="browser-stage"><img src={asset('desktop-reading-20261009.webp')} alt="Leu in your browser: Read. The same source passage, chapter navigation, explanation tools, and narration controls." width="2048" height="1280" decoding="async" /></div>
      <figcaption><p class="platform-label">In your browser · React</p><h2>More room. The same page.</h2><p>The chapter on one side, your questions on the other. The source stays at the centre.</p></figcaption>
    </figure>
  </div>
  <footer class="scene-bar">
    <p>One book. One passage. Every step stays connected.</p>
    <a href="#try">Try the learning loop <svg aria-hidden="true" viewBox="0 0 20 20"><path d="M4 10h12m-5-5 5 5-5 5" /></svg></a>
    <span class="showcase-status" role="status">{scene.label}. {view === 'Together' ? overview ? 'Learning journey shown.' : 'Phone and browser shown.' : `${view} shown.`}</span>
  </footer>
</section>

<style>
  .platform-showcase { padding: 24px 0 clamp(40px, 5vw, 72px); }
  .showcase-heading { display: flex; align-items: flex-end; justify-content: space-between; gap: 32px; margin-bottom: 36px; }
  .showcase-heading h1 { font: 800 clamp(48px, 7vw, 96px)/1.05 var(--sans); letter-spacing: -.04em; margin: 0; text-wrap: balance; }
  .showcase-deck { font: 400 clamp(23px, 2.3vw, 34px)/1.35 var(--serif); letter-spacing: -.02em; margin: 14px 0 0; }
  .platform-note { flex-shrink: 0; font: 500 17px/1.65 var(--sans); color: var(--muted); margin: 0 0 4px; }
  .showcase-controls { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 24px; }
  .scene-switch { display: flex; flex-wrap: wrap; gap: 4px; }
  .scene-switch button { display: flex; align-items: center; gap: 8px; min-height: 48px; padding: 10px 14px; border: 0; border-radius: 10px; font: 550 16px/1.3 var(--sans); background: transparent; color: var(--muted); cursor: pointer; transition: background .18s, color .18s; }
  .scene-switch button[aria-pressed='true'] { background: var(--forest); color: var(--ivory); }
  .scene-switch button:hover:not([aria-pressed='true']) { background: var(--sagebg); color: var(--ink); }
  .step-number { font-size: 12px; font-variant-numeric: tabular-nums; opacity: .8; }
  .view-switch { display: flex; flex-shrink: 0; padding: 3px; border: 1px solid var(--line); border-radius: 999px; }
  .view-switch button { min-height: 44px; border: 0; border-radius: 999px; padding: 10px 17px; font: 550 14px/1.3 var(--sans); cursor: pointer; background: transparent; transition: background .18s, color .18s; }
  .view-switch button[aria-pressed='true'] { background: var(--ivory); color: var(--forest); }
  .view-switch button:hover:not([aria-pressed='true']) { background: var(--sagebg); }
  .platform-gallery { display: grid; grid-template-columns: minmax(0, .34fr) minmax(0, 1fr); gap: clamp(32px, 5vw, 72px); align-items: center; }
  figure { min-width: 0; margin: 0; }
  figure[hidden] { display: none; }
  .journey-stage { grid-column: 1 / -1; }
  .journey-stage picture { display: block; overflow: hidden; border-radius: 16px; }
  .journey-stage img { display: block; width: 100%; height: auto; }
  .journey-stage > figcaption { display: flex; align-items: baseline; justify-content: space-between; gap: 24px; }
  .journey-stage > figcaption p { max-width: 42ch; }
  .flow-scroll { overflow-x: auto; border-radius: 16px; scrollbar-color: var(--forest) var(--sagebg); }
  .phone-stage { display: flex; justify-content: center; }
  .phone-screen { position: relative; width: min(100%, 280px); aspect-ratio: 984/2048; }
  .phone-screen img { display: block; width: 100%; height: auto; }
  /* The larger reader in the supplied hero provides 46% more source pixels
     than the four-phone sheet. Preserve its complete device in this viewport. */
  .phone-screen.from-sheet { overflow: hidden; aspect-ratio: 489/1019; border-radius: 16% / 8%; }
  .from-sheet img { position: absolute; width: calc(100% * 2048 / 489); max-width: none; left: calc(-100% * 780 / 489); top: calc(-100% * 134 / 1019); }
  .browser-stage { overflow: hidden; border-radius: 16px; width: 100%; aspect-ratio: 2048/1280; }
  .browser-stage img { display: block; width: 100%; height: auto; }
  figcaption { margin-top: 24px; }
  figcaption h2 { font: 750 clamp(23px, 2.25vw, 34px)/1.18 var(--sans); letter-spacing: -.03em; text-wrap: balance; margin: 0 0 10px; }
  figcaption p { font: 400 18px/1.55 var(--sans); color: var(--muted); margin: 0; }
  figcaption .platform-label { font: 600 12px/1.5 var(--sans); margin: 0 0 8px; }
  .platform-gallery[data-moment='journey'], .platform-gallery[data-view='phone'], .platform-gallery[data-view='desktop'] { grid-template-columns: 1fr; }
  [data-view='phone'] .platform-phone { width: min(100%, 420px); margin-inline: auto; }
  [data-view='desktop'] .platform-desktop { width: 100%; }
  .scene-bar { display: flex; align-items: center; justify-content: space-between; gap: 24px; margin-top: 32px; padding-top: 20px; border-top: 1px solid var(--line); }
  .scene-bar > p { margin: 0; font: 400 19px/1.5 var(--serif); color: var(--muted); }
  .scene-bar a { display: flex; align-items: center; gap: 10px; min-height: 44px; font: 650 16px/1.4 var(--sans); text-decoration: none; text-underline-offset: 4px; }
  .scene-bar a:hover { color: var(--plum); text-decoration: underline; }
  .scene-bar svg { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 1.6; }
  .showcase-status { position: absolute; width: 1px; height: 1px; padding: 0; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
  button:focus-visible, .flow-scroll:focus-visible { outline: 2px solid var(--plum); outline-offset: 4px; }
  ::selection { color: var(--ink); background: var(--highlight); }
  @media (max-width: 1100px) {
    .platform-note { display: none; }
    .showcase-controls { flex-wrap: wrap; }
    .journey-stage > figcaption { align-items: flex-start; flex-direction: column; gap: 4px; }
    .journey-stage > figcaption p { max-width: 65ch; }
  }
  @media (max-width: 700px) {
    .showcase-heading { margin-bottom: 24px; }
    .showcase-heading h1 { font-size: clamp(42px, 10vw, 62px); max-width: 12ch; }
    .showcase-deck { font-size: 23px; max-width: 28ch; }
    .showcase-controls { gap: 14px; margin-bottom: 24px; }
    .scene-switch { width: 100%; }
    .scene-switch button { padding: 10px 11px; font-size: 14px; }
    .step-number { font-size: 11px; }
    .view-switch { width: 100%; }
    .view-switch button { flex: 1; }
    .platform-gallery { grid-template-columns: 1fr; gap: 36px; }
    .platform-phone { width: min(100%, 360px); margin-inline: auto; }
    .phone-screen { width: min(100%, 260px); }
    .flow-scroll img { width: max(100%, 760px); max-width: none; }
    .browser-stage { border-radius: 10px; }
    figcaption { margin-top: 20px; }
    figcaption h2 { font-size: 26px; }
    figcaption p { font-size: 17px; }
    .scene-bar { align-items: flex-start; flex-direction: column; gap: 12px; margin-top: 24px; }
    .scene-bar > p { font-size: 18px; }
  }
  @media (max-width: 600px) {
    .journey-stage picture { width: min(100%, 260px); margin-inline: auto; border-radius: 0; }
    .journey-stage picture img { aspect-ratio: 984/2048; }
  }
  @media (prefers-reduced-motion: reduce) {
    button { transition: none; }
    .phone-screen, picture, .flow-scroll { opacity: 1 !important; transition: none !important; }
  }
</style>
