<script lang="ts">
  import type { HTMLAnchorAttributes } from 'svelte/elements';
  import { destinationLink } from '$lib/navigation/destination-link';

  /**
   * The cover's two actions. `block`: an ink plate that plum floods from the
   * left edge as the arrow advances. `line`: a serif line that turns italic as
   * its rule draws in. `on="dark"` inverts both.
   */
  let { href, label, variant = 'block', on = 'light', external = false, ...rest }:
    { href: string; label: string; variant?: 'block' | 'line'; on?: 'light' | 'dark'; external?: boolean } & HTMLAnchorAttributes = $props();
</script>

{#if variant === 'block'}
  <a {href} class="ep-block" class:dark={on === 'dark'} {...destinationLink(href, rest.download)} {...rest}>
    <span class="flood" aria-hidden="true"></span>
    <span class="label">{label}</span>
    <svg class="arrow" class:up={external} viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 12h15m-6-6 6 6-6 6" /></svg>
  </a>
{:else}
  <a {href} class="ep-line" class:dark={on === 'dark'} {...destinationLink(href, rest.download)} {...rest}>
    <span class="text">{label}</span><span class="rule" aria-hidden="true"></span>
    {#if external}<svg class="arrow up" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 12h15m-6-6 6 6-6 6" /></svg>{/if}
  </a>
{/if}

<style>
  .ep-block { --bg: var(--ep-ink); --fg: var(--ep-paper); position: relative; isolation: isolate; display: inline-flex; align-items: center; gap: 18px; min-height: calc(56px / var(--lab-zoom, 1)); padding: 0 22px 0 26px; overflow: hidden; background: var(--bg); color: var(--fg); text-decoration: none; font: 600 15px/1 var(--ep-sans); letter-spacing: .08em; text-transform: uppercase; }
  .ep-block.dark { --bg: var(--ep-paper); --fg: var(--ep-ink); }
  .flood { position: absolute; inset: 0; z-index: -1; background: var(--ep-plum); transform: scaleX(0); transform-origin: 0 50%; transition: transform .6s var(--ep-ease); }
  .ep-block:is(:hover, :focus-visible) { color: var(--ep-paper); }
  .ep-block:is(:hover, :focus-visible) .flood { transform: scaleX(1); }
  .arrow { width: 20px; height: 20px; flex: none; fill: none; stroke: currentColor; stroke-width: 1.6; transition: transform .6s var(--ep-ease); }
  .arrow.up { transform: rotate(-45deg); }
  .ep-block:is(:hover, :focus-visible) .arrow { transform: translateX(6px); }
  .ep-block:is(:hover, :focus-visible) .arrow.up { transform: rotate(-45deg) translateX(6px); }
  .ep-block:active { transform: translateY(1px); }

  .ep-line { position: relative; display: inline-flex; align-items: center; gap: 8px; min-height: calc(48px / var(--lab-zoom, 1)); color: var(--ep-ink); text-decoration: none; font: 400 23px/1.1 var(--ep-serif); }
  .ep-line.dark { color: var(--ep-paper); }
  .text { transition: color .3s; }
  .rule { position: absolute; left: 0; right: 0; bottom: 8px; height: var(--ep-hair); background: currentColor; transform-origin: 100% 50%; transition: transform .6s var(--ep-ease); }
  .ep-line .arrow { width: 18px; height: 18px; }
  .ep-line:is(:hover, :focus-visible) .text { font-style: italic; color: var(--ep-plum); }
  .ep-line.dark:is(:hover, :focus-visible) .text { color: var(--ep-paper); }
  .ep-line:is(:hover, :focus-visible) .rule { animation: ep-redraw .7s var(--ep-ease); }
  @keyframes ep-redraw { 0% { transform: scaleX(1); transform-origin: 100% 50%; } 45% { transform: scaleX(0); transform-origin: 100% 50%; } 46% { transform: scaleX(0); transform-origin: 0 50%; } 100% { transform: scaleX(1); transform-origin: 0 50%; } }
  @media (prefers-reduced-motion: reduce) { .flood, .arrow, .text { transition: none; } .ep-line:is(:hover, :focus-visible) .rule { animation: none; } }
  :global(html[data-motion='reduced']) .ep-line .rule { animation: none !important; }
</style>
