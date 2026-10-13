<script lang="ts">
  // Keep the native link, destination policy, and typography in the caller.
  let { label }: { label: string } = $props();
</script>

<span class="fill-label">{label}</span>
<span class="fill-reveal" aria-hidden="true">{label}</span>
<span class="fill-orbit" aria-hidden="true">
  <svg class="fill-arrow fill-arrow-out" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" focusable="false"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
  <svg class="fill-arrow fill-arrow-in" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" focusable="false"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
</span>

<style>
  /* Explicit opt-in only. Important declarations isolate the control from the
     case-study themes' existing important button and hover overrides. */
  :global(a[data-circle-fill]) {
    --fill-scale: 1;
    --fill-size: 36px;
    --fill-height: 48px;
    --fill-start: 22px;
    --fill-end: 61px;
    --fill-icon: calc(var(--fill-size) * var(--fill-scale));
    --fill-inset: calc(5px * var(--fill-scale));
    --fill-padding: 0 calc(var(--fill-end) * var(--fill-scale)) 0 calc(var(--fill-start) * var(--fill-scale));
    --fill-clip: inset(calc(50% - var(--fill-icon) / 2) var(--fill-inset) calc(50% - var(--fill-icon) / 2) calc(100% - var(--fill-icon) - var(--fill-inset)) round 999px);
    --fill-orbit-bg: var(--action-fill);
    --fill-orbit-ink: var(--action-plum);
    --fill-out: translate(-50%, -50%) scale(1);
    --fill-in: translate(-170%, -50%) scale(0);
  }
  :global(a[data-circle-fill][data-circle-fill][data-circle-fill][data-circle-fill]) {
    position: relative;
    isolation: isolate;
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    box-sizing: border-box;
    min-height: calc(var(--fill-height) * var(--fill-scale)) !important;
    padding: var(--fill-padding) !important;
    overflow: hidden;
    border: 2px solid var(--action-plum) !important;
    border-radius: var(--r-pill) !important;
    background: var(--action-plum) !important;
    color: var(--action-label) !important;
    box-shadow: none !important;
    transform: none !important;
    transition: none !important;
    line-height: 1 !important;
    white-space: nowrap;
    text-decoration: none !important;
    touch-action: manipulation;
  }
  :global(a[data-circle-fill="compact"]) {
    --fill-size: 28px;
    --fill-height: 44px;
    --fill-start: 14px;
    --fill-end: 47px;
  }
  span, svg { pointer-events: none; }
  .fill-label { position: relative; }
  /* Surface and label share one clip, preserving contrast during the wipe. */
  .fill-reveal {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    padding: var(--fill-padding);
    background: var(--action-fill);
    color: var(--action-plum);
    clip-path: var(--fill-clip);
    transition: clip-path 450ms cubic-bezier(0.785, 0.135, 0.15, 0.86);
  }
  .fill-orbit {
    position: absolute;
    top: 50%;
    right: var(--fill-inset);
    width: var(--fill-icon);
    height: var(--fill-icon);
    transform: translateY(-50%);
    overflow: hidden;
    border-radius: 50%;
    background: var(--fill-orbit-bg);
    color: var(--fill-orbit-ink);
  }
  .fill-arrow {
    fill: none;
    stroke: currentColor;
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
    position: absolute;
    top: 50%;
    left: 50%;
    width: calc(19px * var(--fill-scale));
    height: calc(19px * var(--fill-scale));
    transition: transform 450ms cubic-bezier(0.785, 0.135, 0.15, 0.86);
  }
  .fill-arrow-out { transform: var(--fill-out); }
  .fill-arrow-in { transform: var(--fill-in); }
  :global(a[data-circle-fill]:is(:focus-visible, :active)) {
    --fill-clip: inset(0 0 0 0 round 999px);
    --fill-orbit-bg: var(--action-plum);
    --fill-orbit-ink: var(--action-fill);
    --fill-out: translate(65%, -50%) scale(0);
    --fill-in: translate(-50%, -50%) scale(1);
  }
  @media (hover: hover) and (pointer: fine) {
    :global(a[data-circle-fill]:hover) {
      --fill-clip: inset(0 0 0 0 round 999px);
      --fill-orbit-bg: var(--action-plum);
      --fill-orbit-ink: var(--action-fill);
      --fill-out: translate(65%, -50%) scale(0);
      --fill-in: translate(-50%, -50%) scale(1);
    }
  }
  :global(a[data-circle-fill]:focus-visible) { outline: 3px solid var(--action-plum) !important; outline-offset: 4px; }
  @media screen and (min-width: 1024px) { :global(a[data-circle-fill]) { --fill-scale: 1.25; } }
  @media (prefers-reduced-motion: reduce) { .fill-reveal, .fill-arrow { transition: none; } }
</style>
