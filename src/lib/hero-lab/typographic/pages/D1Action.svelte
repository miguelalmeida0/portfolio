<script lang="ts">
  import type { HTMLAnchorAttributes } from 'svelte/elements';
  import { destinationLink } from '$lib/navigation/destination-link';

  /**
   * Direction 01's two actions, shared by every page: a square block whose
   * label rolls as the fill rises, and an underlined Antonio line.
   * `on="forest"` inverts both for dark grounds.
   */
  let { href, label, variant = 'block', on = 'light', external = false, ...rest }:
    { href: string; label: string; variant?: 'block' | 'line'; on?: 'light' | 'forest'; external?: boolean } & HTMLAnchorAttributes = $props();
</script>

{#if variant === 'block'}
  <a {href} class="d1-block" class:forest={on === 'forest'} {...destinationLink(href, rest.download)} {...rest}>
    <span class="fill" aria-hidden="true"></span>
    <span class="roll" aria-hidden="true"><span>{label}</span><span>{label}</span></span>
    <span class="sr-only">{label}</span>
    <svg class="arrow" class:up={external} viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
  </a>
{:else}
  <a {href} class="d1-line" class:forest={on === 'forest'} {...destinationLink(href, rest.download)} {...rest}>
    <span class="line-label">{label}</span> <span class="line-arrow" class:up={external} aria-hidden="true">→</span>
  </a>
{/if}

<style>
  .d1-block { --bg: var(--ink); --fg: var(--paper); --rise: var(--plum); position: relative; isolation: isolate; display: inline-flex; align-items: center; gap: 14px; min-height: 60px; padding: 0 22px 0 26px; overflow: hidden; background: var(--bg); color: var(--fg); text-decoration: none; font: 700 20px/1 'Lab Antonio', 'Arial Narrow', sans-serif; letter-spacing: .06em; text-transform: uppercase; }
  .d1-block.forest { --bg: var(--lime); --fg: var(--ink); --rise: var(--paper); }
  .fill { position: absolute; inset: 0; z-index: -1; background: var(--rise); transform: scaleY(0); transform-origin: 50% 100%; transition: transform .55s cubic-bezier(.16,1,.3,1); }
  .roll { display: inline-grid; height: 1.05em; overflow: hidden; }
  .roll > span { grid-area: 1 / 1; white-space: nowrap; transition: transform .55s cubic-bezier(.16,1,.3,1); }
  .roll > span:last-child { transform: translateY(105%); }
  .arrow { width: 22px; height: 22px; flex: none; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: square; transition: transform .55s cubic-bezier(.16,1,.3,1); }
  .arrow.up { transform: rotate(-45deg); }
  .d1-block:is(:hover, :focus-visible) .fill { transform: scaleY(1); }
  .d1-block:is(:hover, :focus-visible) .roll > span:first-child { transform: translateY(-105%); }
  .d1-block:is(:hover, :focus-visible) .roll > span:last-child { transform: none; }
  .d1-block:is(:hover, :focus-visible) .arrow { transform: translateX(5px); }
  .d1-block:is(:hover, :focus-visible) .arrow.up { transform: rotate(-45deg) translateX(5px); }
  .d1-block:focus-visible { outline: 3px solid var(--plum); outline-offset: 3px; }
  .d1-block.forest:focus-visible { outline-color: var(--lime); }
  .d1-block:active { transform: translateY(1px); }

  .d1-line { display: inline-flex; align-items: center; gap: 8px; min-height: 60px; color: var(--ink); font: 700 20px/1 'Lab Antonio', 'Arial Narrow', sans-serif; letter-spacing: .06em; text-transform: uppercase; text-decoration: none; transition: color .3s; }
  .d1-line.forest { color: var(--paper); }
  .line-label { text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 7px; transition: text-underline-offset .3s; }
  .line-arrow { display: inline-block; transition: transform .4s cubic-bezier(.16,1,.3,1); }
  .line-arrow.up { transform: rotate(-45deg); }
  .d1-line:is(:hover, :focus-visible) { color: var(--plum); }
  .d1-line.forest:is(:hover, :focus-visible) { color: var(--lime); }
  .d1-line:is(:hover, :focus-visible) .line-label { text-underline-offset: 10px; }
  .d1-line:is(:hover, :focus-visible) .line-arrow { transform: translateX(4px); }
  .d1-line:is(:hover, :focus-visible) .line-arrow.up { transform: rotate(-45deg) translateX(4px); }
  .d1-line:focus-visible { outline: 3px solid var(--plum); outline-offset: 4px; }
  .d1-line.forest:focus-visible { outline-color: var(--lime); }
  @media (max-width: 1023px) { .d1-block, .d1-line { min-height: 56px; } .d1-block { padding: 0 18px 0 20px; } }
  @media (prefers-reduced-motion: reduce) { .fill, .roll > span, .arrow, .d1-line, .line-label, .line-arrow { transition: none; } }
</style>
