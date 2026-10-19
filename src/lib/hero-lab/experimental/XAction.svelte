<script lang="ts">
  import type { HTMLAnchorAttributes } from 'svelte/elements';
  import { destinationLink } from '$lib/navigation/destination-link';

  /**
   * Direction C's actions. The block fills with five vertical strips that rise
   * one after another (the portrait's strip motif); the line action shears its
   * underline. `tone="plum"` is for plum grounds.
   */
  let { href, label, variant = 'block', tone = 'light', external = false, ...rest }:
    { href: string; label: string; variant?: 'block' | 'line'; tone?: 'light' | 'plum'; external?: boolean } & HTMLAnchorAttributes = $props();
</script>

{#if variant === 'block'}
  <a {href} class="x-block" class:plum={tone === 'plum'} {...destinationLink(href, rest.download)} {...rest}>
    <span class="fill" aria-hidden="true">{#each [0, 1, 2, 3, 4] as i}<span style:--d="{i * 45}ms"></span>{/each}</span>
    <span class="label">{label}</span>
    <svg class="arrow" class:up={external} viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
  </a>
{:else}
  <a {href} class="x-line" class:plum={tone === 'plum'} {...destinationLink(href, rest.download)} {...rest}>
    <span class="label">{label}</span><span class="arrow-text" class:up={external} aria-hidden="true">→</span>
  </a>
{/if}

<style>
  .x-block { --bg: var(--plum); --fg: var(--lime); --rise: var(--ink); position: relative; isolation: isolate; display: inline-flex; align-items: center; gap: 14px; min-height: calc(56px / var(--lab-zoom, 1)); padding: 0 22px 0 24px; overflow: hidden; background: var(--bg); color: var(--fg); text-decoration: none; font: 700 20px/1 'Lab Antonio', 'Arial Narrow', sans-serif; letter-spacing: .06em; text-transform: uppercase; }
  .x-block.plum { --bg: var(--lime); --fg: var(--plum); --rise: var(--paper); }
  .fill { position: absolute; inset: 0; z-index: -1; display: grid; grid-template-columns: repeat(5, 1fr); }
  .fill span { background: var(--rise); transform: scaleY(0); transform-origin: 50% 100%; transition: transform .42s cubic-bezier(.16,1,.3,1) var(--d); }
  .x-block:is(:hover, :focus-visible) .fill span { transform: scaleY(1); }
  .x-block:is(:hover, :focus-visible) { color: var(--paper); }
  .x-block.plum:is(:hover, :focus-visible) { color: var(--plum); }
  .label { white-space: nowrap; }
  .arrow { width: 22px; height: 22px; flex: none; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: square; transition: transform .45s cubic-bezier(.16,1,.3,1); }
  .arrow.up { transform: rotate(-45deg); }
  .x-block:is(:hover, :focus-visible) .arrow { transform: translateX(5px); }
  .x-block:is(:hover, :focus-visible) .arrow.up { transform: rotate(-45deg) translate(5px); }
  .x-block:focus-visible { outline: 3px solid var(--ink); outline-offset: 3px; }
  .x-block.plum:focus-visible { outline-color: var(--lime); }
  .x-block:active { transform: translateY(1px); }

  .x-line { position: relative; display: inline-flex; align-items: center; gap: 8px; min-height: calc(56px / var(--lab-zoom, 1)); color: var(--ink); font: 700 20px/1 'Lab Antonio', 'Arial Narrow', sans-serif; letter-spacing: .06em; text-transform: uppercase; text-decoration: none; }
  .x-line.plum { color: var(--paper); }
  .x-line .label { background: linear-gradient(currentColor, currentColor) 0 100% / 100% 2px no-repeat; padding-bottom: 6px; transition: background-size .45s cubic-bezier(.16,1,.3,1), color .3s; }
  .x-line:is(:hover, :focus-visible) { color: var(--plum); }
  .x-line.plum:is(:hover, :focus-visible) { color: var(--lime); }
  .x-line:is(:hover, :focus-visible) .label { background-size: 100% 5px; }
  .arrow-text { display: inline-block; transition: transform .45s cubic-bezier(.16,1,.3,1); }
  .arrow-text.up { transform: rotate(-45deg); }
  .x-line:is(:hover, :focus-visible) .arrow-text { transform: translateX(5px); }
  .x-line:is(:hover, :focus-visible) .arrow-text.up { transform: rotate(-45deg) translate(5px); }
  .x-line:focus-visible { outline: 3px solid var(--plum); outline-offset: 4px; }
  .x-line.plum:focus-visible { outline-color: var(--lime); }
  @media (max-width: 1023px) { .x-block, .x-line { min-height: 52px; } }
  @media (prefers-reduced-motion: reduce) { .fill span, .arrow, .label, .arrow-text { transition: none; } }
</style>
