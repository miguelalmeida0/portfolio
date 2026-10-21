<script lang="ts">
  import { fade } from 'svelte/transition';
  const scenes = [
    { id: 'journey', label: 'The journey', title: 'Reading and learning in Leu', description: 'Pick up where you left off, stay with the passage, then put it in your own words.', phone: 'iphone-flow-20261009.webp' },
    { id: 'home', label: 'Home', title: 'Continue reading', description: 'Open your current book and return to the page where you stopped.', phone: 'iphone-home-20261009.webp' },
    { id: 'library', label: 'Library', title: 'Your PDF library', description: 'A shelf of your own books, with your current passage ready to open.', phone: 'iphone-library-20261009.webp' },
    { id: 'read', label: 'Read', title: 'Read and select a passage', description: 'Read the passage, hear it aloud, or ask for an explanation without losing the source.', phone: 'iphone-hero-20261009.webp' },
    { id: 'words', label: 'Tell it back', title: 'Explain it in your own words', description: 'Explain the page in your own words. See which ideas got across and which need another look.', phone: 'iphone-words-20261009.webp' }
  ];
  // Preserve the native phone journey. Desktop is its own six-screen gallery:
  // a desktop Journey panorama would needlessly duplicate the product walkthrough.
  const desktopScreens = [
    { ...scenes[1], desktop: 'desktop-home-20261011.webp' },
    { ...scenes[2], desktop: 'desktop-library-20261011.webp' },
    { ...scenes[3], desktop: 'desktop-select-20261011.webp' },
    { id: 'explain', label: 'Explain', title: 'Make the passage clearer.', description: 'An explanation alongside the real source, with the page and its meaning kept in view.', phone: scenes[3].phone, desktop: 'desktop-explain-20261011.webp' },
    { ...scenes[4], desktop: 'desktop-own-words-20261011.webp' },
    { id: 'study', label: 'Study', title: 'Review what you read', description: 'Answer study questions about passages from your book.', phone: scenes[4].phone, desktop: 'desktop-study-20261011.webp' }
  ];
  const views = ['Together', 'Phone', 'Desktop'] as const;
  let selected = $state('journey');
  let desktopSelected = $state('home');
  let view = $state<(typeof views)[number]>('Together');
  const momentOptions = $derived(view === 'Desktop' ? desktopScreens : scenes);
  const scene = $derived((view === 'Desktop' ? desktopScreens.find(item => item.id === desktopSelected) : scenes.find(item => item.id === selected))!);
  const overview = $derived(view !== 'Desktop' && selected === 'journey');
  const asset = (file: string) => `/projects/leu/showcase/${file}`;
  const chooseView = (next: (typeof views)[number]) => {
    if (next === 'Desktop' && selected !== 'journey') desktopSelected = selected;
    if (view === 'Desktop' && next === 'Together') selected = desktopSelected === 'explain' ? 'read' : desktopSelected === 'study' ? 'words' : desktopSelected;
    view = next;
  };
</script>

<section class="platform-showcase" id="platforms" aria-label="Leu across phone and browser" data-leu-showcase>
  <header class="showcase-heading">
    <div><h2 id="platforms-h">iPhone and browser versions</h2><p class="showcase-deck">Explore the real iPhone and browser interfaces.</p></div>
    <p class="platform-note">SwiftUI on iPhone.<br />React in the browser.</p>
  </header>
  <div class="showcase-controls" data-platform={view.toLowerCase()}>
    <div class="scene-switch" role="group" aria-label={view === 'Desktop' ? 'Choose a desktop screen' : 'Choose a moment'}>
      {#each momentOptions as item, index (item.id)}
        <button type="button" aria-pressed={scene.id === item.id} aria-controls="leu-platform-gallery"
          onclick={() => view === 'Desktop' ? desktopSelected = item.id : selected = item.id}>
          {#if view === 'Desktop' || index > 0}<span class="step-number" aria-hidden="true">{view === 'Desktop' ? index + 1 : index}</span>{/if}{item.label}
        </button>
      {/each}
    </div>
    <div class="view-switch" role="group" aria-label="Focus a platform">
      {#each views as option}<button type="button" aria-pressed={view === option} aria-controls="leu-platform-gallery" onclick={() => chooseView(option)}>{option}</button>{/each}
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
    <figure class="platform-desktop" hidden={view === 'Phone' || overview}>
      <div class="browser-stage" data-desktop-moment={scene.id}>
        {#key scene.id}
          <img in:fade={{ duration: 160 }}
            src={asset(view === 'Desktop' ? desktopScreens.find(item => item.id === scene.id)!.desktop : (desktopScreens.find(item => item.id === scene.id)?.desktop ?? 'desktop-select-20261011.webp'))}
            alt={`Leu desktop — ${scene.label}: ${scene.description}`}
            width="2048" height="1280" decoding="async" />
        {/key}
      </div>
      <figcaption>
        <p class="platform-label">In your browser · React</p>
        <h2>{scene.title}</h2>
        <p>{scene.description}</p>
      </figcaption>
    </figure>
  </div>
  <footer class="scene-bar">
    <p>Return to the same passage from questions and feedback.</p>
    <a href="#try">Try the learning loop <svg aria-hidden="true" viewBox="0 0 20 20"><path d="M4 10h12m-5-5 5 5-5 5" /></svg></a>
    <span class="showcase-status" role="status">{scene.label}. {view === 'Together' ? overview ? 'Learning journey shown.' : 'Phone and browser shown.' : `${view} shown.`}</span>
  </footer>
</section>

<style>

  /*
   * Compact, viewport-conscious showcase. Keep the actual source screenshots
   * uncropped; scale their frames, not the raster contents or page scroll.
   */
  .platform-showcase {
    width: min(100%, 1000px);
    margin-inline: auto;
    padding: clamp(10px, 2vw, 20px) 0 clamp(24px, 3vw, 40px);
  }
  .showcase-heading {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: clamp(14px, 2vw, 22px);
  }
  .showcase-heading h2 {
    margin: 0;
    font: 800 clamp(36px, 4.7vw, 62px)/1.06 var(--sans);
    letter-spacing: -.045em;
    text-wrap: balance;
  }
  .showcase-deck {
    margin: 8px 0 0;
    font: 400 clamp(17px, 1.7vw, 22px)/1.32 var(--serif);
    letter-spacing: -.02em;
  }
  .platform-note {
    margin: 0 0 2px;
    flex: 0 0 auto;
    color: var(--muted);
    font: 500 13px/1.5 var(--sans);
  }

  /* The tabs and displayed frame must be visible in the same viewport. */
  .showcase-controls {
    width: min(100%, 940px);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin: 0 auto 12px;
  }
  .scene-switch {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 3px;
    min-width: 0;
  }
  .scene-switch button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    min-height: 44px;
    padding: 8px 11px;
    border: 0;
    border-radius: 10px;
    background: transparent;
    color: var(--muted);
    cursor: pointer;
    font: 600 13px/1.25 var(--sans);
    white-space: nowrap;
    transition: background .18s, color .18s;
  }
  .scene-switch button[aria-pressed='true'] { background: var(--forest); color: var(--ivory); }
  .scene-switch button:hover:not([aria-pressed='true']) { background: var(--sagebg); color: var(--ink); }
  .step-number { font: 500 11px/1 var(--sans); font-variant-numeric: tabular-nums; opacity: .7; }
  .view-switch {
    display: flex;
    flex: 0 0 auto;
    padding: 2px;
    border: 1px solid var(--line);
    border-radius: 999px;
  }
  .view-switch button {
    min-height: 44px;
    padding: 8px 14px;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: var(--forest);
    cursor: pointer;
    font: 600 12px/1.25 var(--sans);
    transition: background .18s, color .18s;
  }
  .view-switch button[aria-pressed='true'] { background: var(--ivory); color: var(--forest); }
  .view-switch button:hover:not([aria-pressed='true']) { background: var(--sagebg); }

  /* A single, compact gallery card across all three platform modes. */
  .platform-gallery {
    display: grid;
    grid-template-columns: minmax(0, .28fr) minmax(0, 1fr);
    align-items: center;
    gap: clamp(16px, 2.5vw, 26px);
    width: min(100%, 910px);
    min-width: 0;
    margin-inline: auto;
    padding: clamp(10px, 1.6vw, 18px);
    border: 1px solid var(--line);
    border-radius: 22px;
    background: rgba(226, 234, 210, .43);
    box-shadow: 0 12px 30px rgba(29, 54, 37, .055);
  }
  .platform-gallery[data-view='phone'],
  .platform-gallery[data-view='desktop'],
  .platform-gallery[data-moment='journey'] { grid-template-columns: minmax(0, 1fr); }
  figure { display: flex; flex-direction: column; align-items: center; min-width: 0; width: 100%; margin: 0; }
  figure[hidden] { display: none !important; }

  /* Put the concise context BEFORE the image, never below an oversized image. */
  figcaption {
    order: -1;
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: center;
    gap: 3px 12px;
    width: 100%;
    min-width: 0;
    margin: 0 0 12px;
    text-align: center;
  }
  figcaption .platform-label { display: none; font: 600 12px/1.4 var(--sans); }
  figcaption h2 {
    margin: 0;
    font: 750 clamp(17px, 1.65vw, 21px)/1.22 var(--sans);
    letter-spacing: -.025em;
    text-wrap: balance;
  }
  figcaption p {
    max-width: 65ch;
    margin: 0;
    color: var(--muted);
    font: 400 14px/1.4 var(--sans);
  }
  .platform-gallery:not([data-view='desktop']):not([data-view='phone']):not([data-moment='journey']) figcaption {
    display: grid;
    justify-items: center;
    gap: 4px;
    min-height: 50px;
  }
  .platform-gallery:not([data-view='desktop']):not([data-view='phone']):not([data-moment='journey']) figcaption p {
    max-width: 33ch;
  }
  .journey-stage { grid-column: 1 / -1; }
  .journey-stage picture {
    display: block;
    width: min(100%, 760px);
    overflow: hidden;
    border-radius: 14px;
  }
  .journey-stage img { display: block; width: 100%; height: auto; }
  .flow-scroll {
    width: min(100%, 760px);
    overflow-x: auto;
    overflow-y: hidden;
    border-radius: 14px;
    scrollbar-color: var(--forest) var(--sagebg);
  }
  .flow-scroll img { display: block; width: max(100%, 760px); height: auto; max-width: none; }

  .phone-stage { display: flex; justify-content: center; width: 100%; }
  .phone-screen {
    position: relative;
    width: min(100%, 190px, 19dvh);
    aspect-ratio: 984/2048;
  }
  .phone-screen img { display: block; width: 100%; height: auto; }
  /* The supplied high-resolution reader sheet is intentionally cropped to the
     original iPhone screen, and only in that specific mode. */
  .phone-screen.from-sheet {
    overflow: hidden;
    aspect-ratio: 489/1019;
    border-radius: 16% / 8%;
  }
  .from-sheet img {
    position: absolute;
    width: calc(100% * 2048 / 489);
    max-width: none;
    left: calc(-100% * 780 / 489);
    top: calc(-100% * 134 / 1019);
  }
  [data-view='phone'] .platform-phone { width: 100%; }
  [data-view='phone'] .phone-screen { width: min(100%, 245px, 30dvh); }

  /* Preserve the source screenshots uncropped. Width follows available space,
     not viewport height; the former 70dvh cap made laptop previews tiny. */
  .browser-stage {
    width: min(100%, 820px);
    aspect-ratio: 2048/1280;
    overflow: hidden;
    border-radius: 13px;
    background: var(--sagebg);
  }
  .browser-stage img { display: block; width: 100%; height: 100%; object-fit: contain; }
  [data-view='desktop'] .platform-desktop { width: 100%; }
  [data-view='desktop'] .browser-stage { width: min(100%, 820px); }

  /* One quiet next action; do not add another tall band below the images. */
  .scene-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    width: min(100%, 910px);
    margin: 12px auto 0;
    padding-top: 10px;
    border-top: 1px solid var(--line);
  }
  .scene-bar > p { margin: 0; color: var(--muted); font: 400 14px/1.4 var(--serif); }
  .scene-bar a {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    min-height: 44px;
    font: 650 13px/1.3 var(--sans);
    text-decoration: none;
    text-underline-offset: 4px;
  }
  .scene-bar a:hover { color: var(--plum); text-decoration: underline; }
  .scene-bar svg { width: 17px; height: 17px; fill: none; stroke: currentColor; stroke-width: 1.6; }
  .showcase-status { position: absolute; width: 1px; height: 1px; padding: 0; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
  button:focus-visible, .flow-scroll:focus-visible { outline: 2px solid var(--plum); outline-offset: 4px; }
  ::selection { color: var(--ink); background: var(--highlight); }

  @media (max-width: 900px) {
    .platform-note { display: none; }
    .showcase-controls { flex-wrap: wrap; }
    .platform-gallery { width: min(100%, 780px); }
    .scene-switch button { padding-inline: 10px; }
  }
  @media (max-width: 700px) {
    .platform-showcase { padding: 8px 0 24px; }
    .showcase-heading { margin-bottom: 12px; }
    .showcase-heading h2 { font-size: clamp(42px, 8vw, 48px); }
    .showcase-deck { margin-top: 5px; font-size: clamp(16px, 4.2vw, 19px); line-height: 1.24; }
    .showcase-controls { display: grid; grid-template-columns: minmax(0, 1fr); gap: 7px; margin-bottom: 10px; }
    .scene-switch {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 4px;
      width: 100%;
      overflow: visible;
    }
    .scene-switch button {
      width: 100%;
      min-width: 0;
      min-height: 44px;
      padding: 6px 4px;
      font-size: clamp(11px, 3vw, 13px);
      white-space: normal;
      text-align: center;
    }
    .step-number { display: none; }
    .view-switch { width: 100%; }
    .view-switch button { flex: 1 1 0; min-height: 44px; }
    .platform-gallery {
      grid-template-columns: minmax(0, .4fr) minmax(0, .6fr);
      gap: 11px;
      padding: 10px;
      border-radius: 18px;
    }
    .platform-gallery[data-view='phone'],
    .platform-gallery[data-view='desktop'],
    .platform-gallery[data-moment='journey'] { grid-template-columns: minmax(0, 1fr); }
    figcaption { margin-bottom: 8px; gap: 3px 8px; }
    figcaption h2 { font-size: 16px; line-height: 1.22; }
    figcaption p { font-size: 13px; line-height: 1.33; }
    .platform-gallery:not([data-view='desktop']):not([data-view='phone']):not([data-moment='journey']) figcaption p {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .journey-stage picture { width: min(100%, 160px); border-radius: 8px; }
    .journey-stage picture img { aspect-ratio: 984/2048; }
    .flow-scroll { width: 100%; max-height: 35dvh; border-radius: 10px; }
    .flow-scroll img { width: max(100%, 650px); }
    .phone-screen { width: min(100%, 108px, 16dvh); }
    [data-view='phone'] .phone-screen { width: min(100%, 215px, 28dvh); }
    .browser-stage, [data-view='desktop'] .browser-stage { width: min(100%, 700px); border-radius: 9px; }
    .scene-bar { margin-top: 8px; padding-top: 5px; }
    .scene-bar > p { display: none; }
    .scene-bar a { font-size: 12px; margin-inline: auto; }
  }
  @media (max-width: 360px) {
    .showcase-heading h2 { font-size: 42px; }
    .showcase-deck { font-size: 16px; }
    .scene-switch button { font-size: 11px; }
    .platform-gallery { grid-template-columns: minmax(0, .47fr) minmax(0, .53fr); gap: 7px; padding: 8px; }
    .phone-screen { width: min(100%, 108px, 15dvh); }
    .journey-stage picture { width: min(100%, 145px); }
    .flow-scroll img { width: max(100%, 620px); }
  }
  @media (prefers-reduced-motion: reduce) {
    button { transition: none; }
    .phone-screen, picture, .flow-scroll, .browser-stage img { opacity: 1 !important; transition: none !important; }
  }
</style>
