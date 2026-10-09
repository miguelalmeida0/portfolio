<script lang="ts">
  import { fade } from 'svelte/transition';

  const scenes = [
    { id: 'home', label: 'Home', phone: 'iphone-home.webp', browser: 'browser-home.webp' },
    { id: 'library', label: 'Library', phone: 'iphone-library.webp', browser: 'browser-library.webp' },
    { id: 'read', label: 'Read', phone: 'iphone-scenes.webp', browser: 'browser-read.webp', crop: 627 },
    { id: 'words', label: 'Tell it back', phone: 'iphone-scenes.webp', browser: 'browser-words.webp', crop: 1087 }
  ];
  const views = ['Together', 'Phone', 'Desktop'] as const;
  let selected = $state('read');
  let view = $state<(typeof views)[number]>('Together');
  const scene = $derived(scenes.find(item => item.id === selected)!);
  const asset = (file: string) => `/projects/leu/showcase/${file}`;
</script>

<section class="platform-showcase" id="overview" aria-label="Leu across phone and browser" data-leu-showcase>
  <header class="showcase-heading">
    <div>
      <h1 id="hero-h">Built around the page.</h1>
      <p class="showcase-deck">Two interfaces, each shaped for how you read.</p>
    </div>
    <div class="view-switch" role="group" aria-label="Focus a platform">
      {#each views as option}
        <button type="button" aria-pressed={view === option} aria-controls="leu-platform-gallery" onclick={() => view = option}>{option}</button>
      {/each}
    </div>
  </header>

  <div>
    <div id="leu-platform-gallery" class="platform-gallery" data-view={view.toLowerCase()}>
      <figure class="platform-phone" hidden={view === 'Desktop'}>
        <p class="platform-label">On iPhone</p>
        <div class="phone-stage">
          {#key scene.id}
            <div class="phone-screen" class:from-sheet={scene.crop !== undefined} in:fade={{ duration: 180 }}>
              <img src={asset(scene.phone)} alt={`Leu on iPhone: ${scene.label}`} data-scene={scene.id}
                width={scene.crop === undefined ? 984 : 2048} height={scene.crop === undefined ? 2048 : 888}
                style={scene.crop === undefined ? undefined : `--sheet-x:${scene.crop};`}
                fetchpriority={scene.id === 'read' ? 'high' : 'auto'} decoding="async" />
            </div>
          {/key}
        </div>
        <figcaption>
          <h2>Touch, read, listen.</h2>
          <p>Native app · SwiftUI · PDFKit</p>
        </figcaption>
      </figure>

      <figure class="platform-desktop" hidden={view === 'Phone'}>
        <p class="platform-label">In your browser</p>
        <div class="browser-stage" class:has-scrollbar={scene.id === 'read'}>
          {#key scene.id}
            <img src={asset(scene.browser)} alt={`Leu in your browser: ${scene.label}`} width="1363" height="936"
              in:fade={{ duration: 180 }} fetchpriority={scene.id === 'read' ? 'high' : 'auto'} decoding="async" />
          {/key}
        </div>
        <figcaption>
          <h2>Room to explore.</h2>
          <p>Browser companion · React · TypeScript</p>
        </figcaption>
      </figure>
    </div>

    <footer class="scene-bar">
      <div class="scene-switch" role="group" aria-label="Choose a moment">
        {#each scenes as item}
          <button type="button" aria-pressed={selected === item.id} aria-controls="leu-platform-gallery" onclick={() => selected = item.id}>{item.label}</button>
        {/each}
      </div>
      <p>Choose a moment, then focus a view.</p>
      <span class="showcase-status" role="status">{scene.label}. {view === 'Together' ? 'Phone and browser shown.' : `${view} shown.`}</span>
    </footer>
  </div>
</section>

<style>
  .platform-showcase { padding: 24px 0 clamp(44px, 6vw, 88px); }
  .showcase-heading { display: flex; align-items: center; justify-content: space-between; gap: 28px; margin-bottom: 38px; }
  .showcase-heading h1 { font: 800 clamp(52px, 7.5vw, 112px)/1.04 var(--sans); letter-spacing: -.055em; margin: 0; text-wrap: balance; }
  .showcase-deck { font: 400 clamp(23px, 2.5vw, 39px)/1.3 var(--serif); letter-spacing: -.025em; margin: 12px 0 0; }
  .view-switch { display: flex; align-self: flex-start; flex: 0 0 auto; gap: 4px; border: 1px solid var(--line); border-radius: 999px; padding: 5px; margin-top: 12px; }
  .view-switch button { border: 0; border-radius: 999px; padding: 12px 23px; min-height: 56px; font: 500 16px/1.3 var(--sans); cursor: pointer; background: transparent; transition: background .2s, color .2s; }
  .view-switch button[aria-pressed='true'] { background: var(--forest); color: var(--ivory); font-weight: 700; }
  .view-switch button:hover:not([aria-pressed='true']) { background: var(--sagebg); }
  .platform-gallery { display: grid; grid-template-columns: minmax(0, .33fr) minmax(0, 1fr); align-items: start; gap: clamp(34px, 5vw, 80px); padding-inline: clamp(20px, 2.5vw, 40px); }
  figure { min-width: 0; margin: 0; }
  figure[hidden] { display: none; }
  .platform-label { font: 650 15px/1.4 var(--sans); letter-spacing: .17em; text-transform: uppercase; color: var(--muted); margin: 0 0 18px; }
  .phone-stage { display: flex; justify-content: flex-start; }
  .phone-screen { position: relative; width: 100%; aspect-ratio: 984/2048; }
  .phone-screen img { display: block; width: 100%; height: auto; }
  /* Display the supplied handset from its original four-screen composition.
     Source pixels and device chrome stay intact; this is a measured viewport. */
  .phone-screen.from-sheet { overflow: hidden; aspect-ratio: 334/696; border-radius: 16% / 8%; }
  .from-sheet img { position: absolute; width: calc(100% * 2048 / 334); max-width: none; left: calc(-100% * var(--sheet-x) / 334); top: calc(-100% * 89 / 696); }
  .browser-stage { width: 100%; aspect-ratio: 1363/936; overflow: hidden; border-radius: 16px; background: var(--sagebg); box-shadow: 0 20px 48px -32px rgb(11 43 34 / .3); }
  .browser-stage img { display: block; width: 100%; height: 100%; object-fit: cover; }
  .has-scrollbar img { width: calc(100% * 1348 / 1333); max-width: none; object-position: left; }
  figcaption { margin: 20px 0 0; }
  figcaption h2 { font: 750 clamp(23px, 2.3vw, 37px)/1.15 var(--sans); letter-spacing: -.04em; margin: 0 0 7px; }
  figcaption p { font: 400 19px/1.4 var(--sans); color: var(--muted); margin: 0; }
  .platform-gallery[data-view='phone'] { grid-template-columns: 1fr; }
  [data-view='phone'] .platform-phone { width: min(100%, 380px); margin-inline: auto; }
  .platform-gallery[data-view='desktop'] { grid-template-columns: 1fr; }
  [data-view='desktop'] .platform-desktop { width: min(100%, 1250px); margin-inline: auto; }
  .scene-bar { display: flex; align-items: center; gap: 34px; margin-top: 32px; padding-top: 18px; border-top: 1px solid var(--rulec); }
  .scene-switch { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
  .scene-switch button { position: relative; background: transparent; border: 0; padding: 12px 16px 17px; min-height: 56px; font: 500 17px/1.3 var(--sans); color: var(--muted); cursor: pointer; transition: color .2s; }
  .scene-switch button[aria-pressed='true'] { font-weight: 750; color: var(--ink); }
  .scene-switch button[aria-pressed='true']::after { content: ''; position: absolute; bottom: 3px; left: calc(50% - 4px); width: 8px; height: 8px; border-radius: 50%; background: var(--plum); }
  .scene-switch button:hover { color: var(--plum); }
  .scene-bar > p { border-left: 1px solid var(--rulec); padding-left: 34px; font: 400 19px/1.5 var(--serif); color: var(--muted); margin: 0; }
  .showcase-status { position: absolute; width: 1px; height: 1px; padding: 0; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
  button:focus-visible { outline: 2px solid var(--plum); outline-offset: 4px; }
  @media (max-width: 1100px) {
    .showcase-heading { align-items: flex-start; flex-direction: column; gap: 24px; }
    .view-switch { margin-top: 0; }
    .showcase-heading h1 { font-size: clamp(48px, 7vw, 82px); }
    .platform-gallery { gap: 32px; }
    figcaption p { font-size: 16px; }
    .scene-bar { gap: 16px; }
    .scene-bar > p { padding-left: 20px; font-size: 17px; }
  }
  @media (max-width: 700px) {
    .platform-showcase { padding-top: 24px; }
    .showcase-heading { margin-bottom: 30px; }
    .showcase-heading h1 { font-size: clamp(42px, 10vw, 62px); max-width: 12ch; }
    .showcase-deck { font-size: 23px; max-width: 26ch; margin-top: 14px; }
    .view-switch { width: 100%; }
    .view-switch button { flex: 1; padding-inline: 12px; }
    .platform-gallery { grid-template-columns: 1fr; gap: 32px; padding-inline: 0; }
    .platform-phone { width: min(100%, 270px); margin-inline: auto; }
    .platform-label { font-size: 12px; margin-bottom: 14px; }
    .browser-stage { border-radius: 10px; }
    figcaption { margin-top: 16px; }
    figcaption h2 { font-size: 26px; }
    figcaption p { font-size: 15px; }
    .scene-bar { flex-direction: column; align-items: flex-start; gap: 14px; margin-top: 26px; }
    .scene-switch { width: 100%; justify-content: space-between; gap: 0; }
    .scene-switch button { padding-inline: 8px; font-size: 15px; }
    .scene-bar > p { border: 0; padding: 0 8px; }
  }
  @media (prefers-reduced-motion: reduce) {
    button { transition: none; }
    .phone-screen, .browser-stage img { opacity: 1 !important; transition: none !important; }
  }
</style>
