<script lang="ts">
  import { onMount } from 'svelte';
  import { installWind, LINES } from './wind';
  import { motionState } from '$lib/motion/policy';
  let { lines = LINES, label = lines.join(' '), debugPos }: {
    lines?: readonly string[]; label?: string;
    debugPos?: { line: number; pos: number };
  } = $props();
  let enabled = $state(false);
  onMount(() => {
    let mounted = true;
    let fontReady = false;
    let policyReduced = true;
    const media = matchMedia('(min-width: 768px) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    const update = () => { enabled = media.matches && fontReady && !policyReduced; };
    const unsubscribe = motionState.subscribe(state => { policyReduced = state.reduced; update(); });
    // Keep the server-rendered text until the real font is ready; never mount
    // individual fallback glyphs whose widths would shift during font swap.
    document.fonts.load('800 52px Figtree').then(() => {
      if (mounted) { fontReady = true; update(); }
    });
    update(); media.addEventListener('change', update);
    return () => { mounted = false; unsubscribe(); media.removeEventListener('change', update); };
  });
  function windAction(node: HTMLElement) { return { destroy: installWind(node, debugPos) }; }
</script>
{#if enabled}
  <h1 id="intro-heading" aria-label={label} use:windAction><span class="ask-role" data-ask-id="role">
    {#each lines as line, li}<span class="line" aria-hidden="true">{#each [...line] as glyph, i}<span class="glyph" aria-hidden="true" data-line={li} data-glyph={i}>{glyph}</span>{/each}</span>{' '}{/each}
  </span></h1>
{:else}
  <h1 id="intro-heading" aria-label={label}><span class="ask-role" data-ask-id="role">{#each lines as line}<span class="line" aria-hidden="true">{line}</span>{' '}{/each}</span></h1>
{/if}
<style>
  h1 { margin: 0; font: 800 var(--type-home-display, 52px)/1.1 var(--hero-font); letter-spacing: -.03em; color: var(--ink); text-wrap: initial; }
  .line { display: block; }
  .ask-role { display: block; }
  .glyph { display: inline-block; white-space: pre; transform-origin: 50% 100%; transition: transform .7s cubic-bezier(.16,1,.3,1), color .55s cubic-bezier(.16,1,.3,1); }
  @media (min-width: 1024px) and (max-width: 1279px) { h1 { font-size: var(--type-home-display, clamp(2.25rem, 3.6vw, 3.25rem)); } }
  @media (min-width: 768px) and (max-width: 1023px) { h1 { font-size: var(--type-home-display-tablet, 44px); } }
  @media (max-width: 767px) { h1 { font-size: var(--type-home-display-mobile, clamp(2rem, 9vw, 2.75rem)); } }
  @media (prefers-reduced-motion: reduce), (pointer: coarse), (max-width: 767px) { .glyph { transform: none !important; color: var(--ink) !important; transition: none !important; } }
</style>
