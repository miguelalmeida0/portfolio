<script lang="ts">
  import { tick } from 'svelte';

  export let ready = false;
  export let percent = 100;
  export let mode = 'auto';
  export let onscale: (value: string) => void;

  let open = false;
  let root: HTMLDivElement;
  let trigger: HTMLButtonElement;
  let slider: HTMLInputElement;
  const minimum = 25;
  // Wide-window fit modes can exceed 200%; keep the rail and ARIA value honest.
  $: maximum = Math.max(200, Math.ceil(percent / 50) * 50);
  $: marks = Array.from({ length: 36 }, (_, index) => minimum + index * (maximum - minimum) / 35);
  const fits = [
    { value: 'auto', label: 'Auto' },
    { value: 'page-fit', label: 'Page' },
    { value: 'page-width', label: 'Width' }
  ];
  $: position = Math.max(0, Math.min(1, (percent - minimum) / (maximum - minimum)));
  $: fitIndex = fits.findIndex(fit => fit.value === mode);
  $: description = mode === 'auto' ? 'Automatic fit' : mode === 'page-fit' ? 'Whole page' : mode === 'page-width' ? 'Fit to width' : 'Custom zoom';

  function setPercent(value: number) {
    onscale(String(Math.max(minimum, Math.min(maximum, value)) / 100));
  }

  function step(direction: number) {
    setPercent(direction > 0 ? Math.floor(percent / 10) * 10 + 10 : Math.ceil(percent / 10) * 10 - 10);
  }

  async function toggle(event: MouseEvent) {
    open = !open;
    if (open && event.detail === 0) {
      await tick();
      slider?.focus({ preventScroll: true });
    }
  }

  function outside(event: PointerEvent) {
    if (open && !root?.contains(event.target as Node)) open = false;
  }

  function escape(event: KeyboardEvent) {
    if (open && event.key === 'Escape') {
      event.preventDefault();
      open = false;
      trigger?.focus({ preventScroll: true });
    }
  }

  function leave(event: FocusEvent) {
    if (event.relatedTarget && !root?.contains(event.relatedTarget as Node)) open = false;
  }
</script>

<svelte:window onpointerdown={outside} onkeydown={escape} />

<div class="zoom" class:open bind:this={root} onfocusout={leave}>
  <div class="zoom-capsule" role="group" aria-label="PDF zoom">
    <button class="step" aria-label="Zoom out" disabled={!ready || percent <= minimum} onclick={() => step(-1)}>
      <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 10h10" /></svg>
    </button>
    <button class="zoom-trigger" bind:this={trigger} disabled={!ready} aria-label="Adjust zoom" aria-expanded={open} aria-controls="cv-zoom-panel" onclick={toggle}>
      <span class="trigger-value">{ready ? percent : '—'}<span class="unit">%</span></span>
      <svg class="chevron" viewBox="0 0 16 16" aria-hidden="true"><path d="m5 6 3 3 3-3" /></svg>
      <span class="capsule-track" aria-hidden="true"><span style={`transform: scaleX(${position})`}></span></span>
    </button>
    <button class="step" aria-label="Zoom in" disabled={!ready || percent >= maximum} onclick={() => step(1)}>
      <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 10h10M10 5v10" /></svg>
    </button>
  </div>

  {#if open}
    <section id="cv-zoom-panel" class="zoom-panel" aria-label="Reading scale">
      <div class="panel-top">
        <div>
          <h2>READING SCALE</h2>
          <div class="large-value" aria-hidden="true">{#key percent}<span class="number">{percent}</span>{/key}<span class="large-unit">%</span></div>
          <p>{description}</p>
        </div>
        <div class="scale-preview" aria-hidden="true">
          <div class="preview-page" style={`transform: scale(${0.55 + position * 0.9})`}><i></i><i></i><i></i><i></i><i></i></div>
          <span class="corner tl"></span><span class="corner tr"></span><span class="corner bl"></span><span class="corner br"></span>
        </div>
      </div>

      <div class="ruler">
        <div class="ruler-marks" aria-hidden="true">
          {#each marks as mark, index}
            <span class:major={index % 5 === 0} class:passed={mark <= percent} style={`--lift: ${Math.max(0, 1 - Math.abs(mark - percent) / 25) * 9}px`}></span>
          {/each}
        </div>
        <div class="ruler-needle" aria-hidden="true" style={`left: calc(10px + (100% - 20px) * ${position})`}><span></span></div>
        <input bind:this={slider} type="range" min={minimum} max={maximum} step="1" value={percent} aria-label="Zoom percentage" aria-valuetext={`${percent} percent, ${description}`} oninput={(event) => setPercent(Number(event.currentTarget.value))} />
      </div>
      <div class="ruler-labels" aria-hidden="true"><span>25</span><span style={`left: ${75 / (maximum - minimum) * 100}%`}>100</span><span>{maximum}%</span></div>

      <div class="fit-options" role="group" aria-label="Fit document">
        {#if fitIndex >= 0}<span class="fit-highlight" aria-hidden="true" style={`transform: translateX(${fitIndex * 100}%)`}></span>{/if}
        {#each fits as fit}
          <button aria-label={fit.value === 'auto' ? 'Automatic fit' : fit.value === 'page-fit' ? 'Fit page' : 'Fit width'} aria-pressed={mode === fit.value} onclick={() => onscale(fit.value)}>
            <svg viewBox="0 0 20 20" aria-hidden="true">
              {#if fit.value === 'auto'}<path d="M6 3H3v3m11-3h3v3M3 14v3h3m11-3v3h-3M7 7h6v6H7z" />
              {:else if fit.value === 'page-fit'}<rect x="5" y="3" width="10" height="14" rx="1" /><path d="M8 7h4M8 10h4" />
              {:else}<path d="M3 4v12M17 4v12M6 10h8M8 8l-2 2 2 2m4-4 2 2-2 2" />{/if}
            </svg>{fit.label}
          </button>
        {/each}
      </div>
      <div class="panel-footer"><span>Make yourself comfortable.</span><span class="key-hint"><kbd>←</kbd><kbd>→</kbd></span></div>
    </section>
  {/if}
</div>

<style>
  .zoom { position: relative; z-index: 5; --ink: #173c32; --accent: #d4edac; }
  button { font: inherit; cursor: pointer; border: 0; color: inherit; -webkit-tap-highlight-color: transparent; }
  button:disabled { opacity: .35; cursor: default; }
  svg { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; flex-shrink: 0; }
  .zoom-capsule { display: flex; align-items: center; padding: 3px; border: 1px solid #cbd2c3; border-radius: 16px; background: #fcfcf6; box-shadow: 0 2px 3px #193b3005, inset 0 1px 0 #fff; transition: border-color 180ms, box-shadow 180ms; }
  .zoom-capsule:hover, .open .zoom-capsule { border-color: #8ca18d; box-shadow: 0 3px 10px #193b300a; }
  .step { display: grid; place-items: center; width: 44px; height: 44px; background: transparent; border-radius: 11px; transition: background 160ms, transform 160ms; }
  .step:hover:not(:disabled) { background: #e7ecdF; }
  .step:active:not(:disabled) { transform: scale(.9); background: #dce5d3; }
  .zoom-trigger { position: relative; display: flex; align-items: center; justify-content: center; gap: 8px; width: 92px; height: 44px; border-radius: 8px; background: transparent; font-size: 15px; font-weight: 600; font-variant-numeric: tabular-nums; }
  .unit { margin-left: 2px; color: #65776a; font-size: 12px; font-weight: 400; }
  .chevron { width: 14px; height: 14px; color: #738471; transition: transform 240ms; }
  .open .chevron { transform: rotate(180deg); }
  .capsule-track { position: absolute; bottom: 5px; left: 19px; right: 19px; height: 2px; background: #e3e8dc; border-radius: 2px; overflow: hidden; }
  .capsule-track span { display: block; height: 100%; background: #789268; transform-origin: left; transition: transform 160ms ease-out; }
  .zoom-panel { position: absolute; top: calc(100% + 12px); right: 0; width: min(304px, calc(100vw - 24px)); box-sizing: border-box; padding: 24px 22px 16px; border: 1px solid #375347; border-radius: 22px; color: #f5f6ed; background: #173c32; box-shadow: 0 24px 60px -12px #112e3045, 0 4px 12px #112e3020, inset 0 1px 0 #ffffff12; transform-origin: top right; animation: reveal 240ms cubic-bezier(.16,1,.3,1) both; }
  .panel-top { display: flex; justify-content: space-between; align-items: center; }
  h2 { margin: 0 0 8px; font-size: 10px; letter-spacing: .16em; font-weight: 500; color: #b0c5b5; }
  .large-value { display: flex; align-items: baseline; height: 56px; font-variant-numeric: tabular-nums; letter-spacing: -.04em; line-height: 1; }
  .number { font-size: 52px; font-weight: 400; animation: settle 160ms ease-out; }
  .large-unit { margin-left: 4px; font-size: 21px; color: #b0c5b5; }
  p { margin: 2px 0 0; color: #b0c5b5; font-size: 12px; }
  .scale-preview { position: relative; width: 70px; height: 82px; overflow: hidden; display: grid; place-items: center; border-radius: 3px; background: #ffffff04; }
  .preview-page { width: 38px; height: 54px; box-sizing: border-box; background: #d4edac; padding: 9px 6px; display: flex; flex-direction: column; gap: 4px; box-shadow: 0 3px 14px #08221c30; transition: transform 150ms ease-out; }
  i { display: block; height: 2px; width: 100%; background: #173c3250; }
  i:first-child { height: 3px; width: 64%; margin-bottom: 3px; background: #173c32; }
  i:last-child { width: 70%; }
  .corner { position: absolute; width: 7px; height: 7px; border-color: #93ad96; border-style: solid; border-width: 0; }
  .tl { top: 0; left: 0; border-top-width: 1px; border-left-width: 1px; }
  .tr { top: 0; right: 0; border-top-width: 1px; border-right-width: 1px; }
  .bl { bottom: 0; left: 0; border-bottom-width: 1px; border-left-width: 1px; }
  .br { bottom: 0; right: 0; border-bottom-width: 1px; border-right-width: 1px; }
  .ruler { position: relative; height: 48px; margin-top: 22px; border-radius: 5px; }
  .ruler:focus-within { outline: 2px solid var(--accent); outline-offset: 5px; }
  .ruler-marks { position: absolute; inset: 5px 10px 7px; display: flex; align-items: center; justify-content: space-between; pointer-events: none; }
  .ruler-marks > span { width: 1px; height: calc(10px + var(--lift)); background: #527164; transition: height 100ms, background 100ms; }
  .ruler-marks > span.major { height: calc(20px + var(--lift)); background: #8aa591; }
  .ruler-marks > span.passed { background: #c3d7b0; }
  .ruler-needle { position: absolute; top: 3px; bottom: 3px; width: 2px; transform: translateX(-50%); background: var(--accent); box-shadow: 0 0 10px #d4edac25; pointer-events: none; }
  .ruler-needle span { position: absolute; top: -3px; left: -3px; width: 8px; height: 5px; border-radius: 2px 2px 3px 3px; background: var(--accent); }
  input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; appearance: none; cursor: ew-resize; opacity: 0; touch-action: pan-y; }
  input::-webkit-slider-thumb { appearance: none; width: 20px; height: 44px; }
  input::-moz-range-thumb { width: 20px; height: 44px; border: 0; }
  .ruler-labels { position: relative; display: flex; justify-content: space-between; margin: 1px 6px 21px; color: #a6bcac; font-size: 10px; font-variant-numeric: tabular-nums; }
  .ruler-labels span:nth-child(2) { position: absolute; transform: translateX(-50%); }
  .fit-options { position: relative; display: grid; grid-template-columns: repeat(3,1fr); padding: 4px; border-radius: 12px; background: #0c2b2366; }
  .fit-highlight { position: absolute; top: 4px; bottom: 4px; left: 4px; width: calc((100% - 8px) / 3); border-radius: 9px; background: var(--accent); transition: transform 240ms cubic-bezier(.2,.8,.2,1); }
  .fit-options button { position: relative; z-index: 1; display: flex; justify-content: center; align-items: center; gap: 6px; height: 44px; border-radius: 9px; background: transparent; color: #c0d0c3; font-size: 12px; transition: color 160ms, background 160ms; }
  .fit-options button[aria-pressed='true'] { color: #173c32; }
  .fit-options button:hover:not([aria-pressed='true']) { color: white; background: #ffffff0a; }
  .fit-options svg { width: 17px; height: 17px; }
  .panel-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 14px; gap: 6px; color: #a6bcac; font-size: 10px; }
  .key-hint { display: flex; gap: 3px; }
  kbd { display: grid; place-items: center; width: 17px; height: 17px; border: 1px solid #527164; border-radius: 4px; font: inherit; }
  button:focus-visible { outline: 2px solid #610d3d; outline-offset: 2px; }
  .zoom-panel button:focus-visible { outline-color: var(--accent); outline-offset: 1px; }
  @keyframes reveal { from { opacity: 0; transform: translateY(-6px) scale(.975); } to { opacity: 1; transform: none; } }
  @keyframes settle { from { opacity: .65; transform: translateY(2px); } to { opacity: 1; transform: none; } }
  @media (max-width: 600px) { .zoom-panel { right: auto; left: 0; transform-origin: top left; } .key-hint { display: none; } }
  @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important; } }
</style>
