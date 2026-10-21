<script lang="ts">
  import { onMount } from 'svelte';
  import { resetScrollMotion, syncScrollPosition } from '$lib/motion/smooth-scroll';
  import { SCROLLBAR_EDGE_INSET } from './footer/journey-geometry';
  let enabled = $state(false);
  let top = $state(0);
  let height = $state(44);
  let maximum = $state(0);
  let position = $state(0);
  let dragging = $state(false);
  let startY = 0;
  let startScroll = 0;
  let travel = 1;
  function moveTo(value: number) {
    window.scrollTo({ top: Math.max(0, Math.min(maximum, value)), behavior: 'instant' });
    syncScrollPosition();
  }
  function pointerdown(event: PointerEvent) {
    if (event.button !== 0 || maximum <= 0) return;
    event.preventDefault();
    const rail = event.currentTarget as HTMLDivElement;
    resetScrollMotion();
    rail.focus({ preventScroll: true });
    rail.setPointerCapture(event.pointerId);
    dragging = true;
    if (!(event.target as Element).closest('[data-bookmark-thumb]')) {
      moveTo((event.clientY - rail.getBoundingClientRect().top - height / 2) / travel * maximum);
    }
    startY = event.clientY;
    startScroll = window.scrollY;
  }
  function pointermove(event: PointerEvent) {
    if (dragging) moveTo(startScroll + (event.clientY - startY) / travel * maximum);
  }
  function release() { dragging = false; }
  function keydown(event: KeyboardEvent) {
    const targets: Record<string, number> = {
      ArrowDown: position + 48, ArrowUp: position - 48,
      PageDown: position + innerHeight * .85, PageUp: position - innerHeight * .85,
      Home: 0, End: maximum
    };
    if (event.key in targets) { event.preventDefault(); moveTo(targets[event.key]); }
  }
  onMount(() => {
    const root = document.documentElement;
    const media = matchMedia('(pointer: fine) and (hover: hover) and (forced-colors: none)');
    const update = () => {
      position = Math.max(0, Math.min(maximum, scrollY));
      top = maximum ? position / maximum * travel : 0;
    };
    const measure = () => {
      const available = Math.max(0, innerHeight - 24);
      maximum = Math.max(0, root.scrollHeight - innerHeight);
      height = Math.min(available, 44);
      travel = Math.max(1, available - height);
      update();
    };
    const policy = () => {
      enabled = media.matches;
      if (enabled) root.dataset.bookmarkScrollbar = 'true';
      else delete root.dataset.bookmarkScrollbar;
      release(); measure();
    };
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', measure, { passive: true });
    media.addEventListener('change', policy);
    policy();
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', measure);
      media.removeEventListener('change', policy);
      delete root.dataset.bookmarkScrollbar;
    };
  });
</script>

{#if enabled && maximum > 0}
  <aside aria-label="Page scrolling">
  <div data-bookmark-rail role="scrollbar" aria-label="Scroll page" aria-controls="portfolio-content"
    aria-orientation="vertical" aria-valuemin={0} aria-valuemax={Math.round(maximum)} aria-valuenow={Math.round(position)}
    tabindex="0" onpointerdown={pointerdown} onpointermove={pointermove} onpointerup={release}
    onpointercancel={release} onlostpointercapture={release} onkeydown={keydown}
    class="group fixed inset-y-3 right-0 z-[60] w-6 touch-none select-none no-print focus-visible:outline-none"
    class:bookmark-dragging={dragging}>
    <div data-bookmark-thumb class="absolute inset-x-0 top-0 flex justify-end" style:padding-right={`${SCROLLBAR_EDGE_INSET-1}px`} style:height={`${height}px`} style:transform={`translateY(${top}px)`}>
      <div data-scroll-handle class="pointer-events-none h-full w-0.5 rounded bg-plum opacity-30"></div>
    </div>
  </div>
  </aside>
{/if}

<style>
  /* Entry is one visual handoff. Keep the real hit area operable, and reveal its
     handle on deliberate pointer/keyboard use rather than leaving a second line. */
  :global(html[data-line-m-traveller='journey']) [data-bookmark-rail] [data-scroll-handle] { opacity:0; }
  :global(html[data-line-m-traveller='journey']) [data-bookmark-rail]:is(:hover,:focus-visible,.bookmark-dragging) [data-scroll-handle] { opacity:1; }
  /* Solid thumb color indicates keyboard focus without an enclosing border. */
  [data-bookmark-rail]:is(:hover,:focus-visible) [data-scroll-handle] { opacity:1; }
  /* Coincident shapes share the same fade so the first morph never disappears. */
  :global(html[data-line-m-traveller='rail']) [data-bookmark-rail] [data-scroll-handle] { opacity:calc(.3 * var(--line-m-thumb-opacity, 0)); }
  :global(html[data-line-m-traveller='rail']) [data-bookmark-rail]:is(:hover,:focus-visible,.bookmark-dragging) [data-scroll-handle] { opacity:var(--line-m-thumb-opacity, 0); }
</style>
