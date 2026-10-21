<script lang="ts">
  import type { HTMLAnchorAttributes } from 'svelte/elements';
  import { destinationLink } from '$lib/navigation/destination-link';
  /**
   * The direction's primary action: a lime block whose label characters flip,
   * one after another, as plum fills from the left. `tone="paper"` for light grounds.
   */
  let { href, label, tone = 'forest', external = false, ...rest }:
    { href: string; label: string; tone?: 'forest' | 'paper'; external?: boolean } & HTMLAnchorAttributes = $props();
</script>

<a {href} class="ks-action" class:paper={tone === 'paper'} {...destinationLink(href, rest.download)} {...rest}>
  <span class="fill" aria-hidden="true"></span>
  <span class="sr-only">{label}</span>
  <span class="label" aria-hidden="true">{#each [...label] as ch, i}<span class="c" style:--d="{i * 22}ms"><span>{ch === ' ' ? ' ' : ch}</span><span>{ch === ' ' ? ' ' : ch}</span></span>{/each}</span>
  <svg class="arrow" class:up={external} viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
</a>

<style>
  .ks-action { --bg: var(--lime); --fg: var(--forest); --fill: var(--plum); --fill-fg: var(--paper); position: relative; isolation: isolate; display: inline-flex; align-items: center; gap: 14px; min-height: 60px; padding: 0 22px 0 24px; overflow: hidden; background: var(--bg); color: var(--fg); text-decoration: none; font: 700 20px/1 'Lab Antonio', 'Arial Narrow', sans-serif; letter-spacing: .06em; text-transform: uppercase; transition: color .4s; }
  .ks-action.paper { --bg: var(--forest); --fg: var(--lime); }
  .fill { position: absolute; inset: 0; z-index: -1; background: var(--fill); transform: scaleX(0); transform-origin: 0 50%; transition: transform .55s cubic-bezier(.16,1,.3,1); }
  .label { display: inline-flex; }
  .c { display: inline-grid; height: 1.05em; overflow: hidden; }
  .c > span { grid-area: 1 / 1; transition: transform .45s cubic-bezier(.16,1,.3,1) var(--d); }
  .c > span:last-child { transform: translateY(105%); }
  .arrow { width: 22px; height: 22px; flex: none; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: square; transition: transform .5s cubic-bezier(.16,1,.3,1); }
  .arrow.up { transform: rotate(-45deg); }
  .ks-action:is(:hover, :focus-visible) { color: var(--fill-fg); }
  .ks-action:is(:hover, :focus-visible) .fill { transform: scaleX(1); }
  .ks-action:is(:hover, :focus-visible) .c > span:first-child { transform: translateY(-105%); }
  .ks-action:is(:hover, :focus-visible) .c > span:last-child { transform: none; }
  .ks-action:is(:hover, :focus-visible) .arrow { transform: translateX(5px); }
  .ks-action:is(:hover, :focus-visible) .arrow.up { transform: rotate(-45deg) translateX(5px); }
  .ks-action:focus-visible { outline: 3px solid var(--lime); outline-offset: 3px; }
  .ks-action.paper:focus-visible { outline-color: var(--plum); }
  .ks-action:active { transform: translateY(1px); }
  @media (max-width: 1023px) { .ks-action { min-height: 56px; padding: 0 18px 0 20px; } }
  @media (prefers-reduced-motion: reduce) { .ks-action, .fill, .c > span, .arrow { transition: none; } }
</style>
