<script lang="ts">
  import { askController } from '$lib/ask/state';
  import type { AreaId } from '$lib/ask/types';
  let { area, label, explicit = false }: { area: AreaId; label: string; explicit?: boolean } = $props();
</script>

<button type="button" class="ask-topic" class:explicit disabled={!$askController} data-ask-id={area}
  aria-label={explicit ? label : `Ask about ${label}`} onclick={() => $askController?.explain(area)}>
  {label}<span aria-hidden="true">↗</span>
</button>

<style>
  .ask-topic { display: inline-flex; align-items: baseline; gap: .35em; min-height: 44px; padding: 4px 0; border: 0; background: none; color: inherit; font: inherit; text-align: left; cursor: pointer; text-decoration: underline; text-decoration-color: var(--plum); text-decoration-thickness: 1px; text-underline-offset: .22em; }
  .ask-topic span { color: var(--plum); font-size: .8em; transition: transform .25s ease; }
  .ask-topic.explicit { color: var(--plum); font: 600 14px/1.4 var(--hero-font); }
  .ask-topic:is(:hover, :focus-visible) { color: var(--plum); text-decoration-thickness: 2px; }
  .ask-topic:is(:hover, :focus-visible) span { transform: translate(2px, -2px); }
  .ask-topic:focus-visible { outline: 2px solid var(--plum); outline-offset: 4px; }
  .ask-topic:disabled { cursor: wait; }
  @media (prefers-reduced-motion: reduce) { .ask-topic span { transition: none; } }
  :global(html[data-motion='reduced']) .ask-topic span { transition: none; }
</style>
