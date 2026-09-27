<script lang="ts">
  import { onMount } from 'svelte';
  import { resetScrollMotion, syncScrollPosition } from '$lib/motion/smooth-scroll';
  let enabled = $state(false);
  let top = $state(0);
  let height = $state(44);
  let maximum = $state(0);
  let position = $state(0);
  let dragging = $state(false);
  let trails = $state([0, 0]);
  let overFooter = $state(false);
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
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let followers = [0, 0];
    let previousTime = 0;
    let initialized = false;
    let frame = 0;
    const update = (time: number) => {
      frame = 0;
      const available = Math.max(0, innerHeight - 24);
      maximum = Math.max(0, root.scrollHeight - innerHeight);
      height = Math.min(available, 44);
      travel = Math.max(1, available - height);
      position = Math.max(0, Math.min(maximum, scrollY));
      top = maximum ? position / maximum * travel : 0;
      const dt = Math.min(64, Math.max(1, time - previousTime || 16));
      previousTime = time;
      followers = followers.map((value, index) => {
        if (!initialized || reduced.matches || dragging || !enabled) return top;
        const lag = (value - top) * Math.exp(-dt / (index ? 90 : 45));
        return top + Math.max(-3, Math.min(3, lag));
      });
      initialized = true;
      trails = followers.map(value => Math.abs(value - top) < .02 ? 0 : value - top);
      const footer = document.querySelector('footer')?.getBoundingClientRect();
      const center = 12 + top + height / 2;
      overFooter = !!footer && center >= footer.top && center <= footer.bottom;
      if (trails.some(value => value !== 0)) schedule();
    };
    const schedule = () => { frame ||= requestAnimationFrame(update); };
    const policy = () => {
      enabled = media.matches;
      if (enabled) root.dataset.bookmarkScrollbar = 'true';
      else delete root.dataset.bookmarkScrollbar;
      release(); schedule();
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    media.addEventListener('change', policy);
    reduced.addEventListener('change', schedule);
    policy();
    return () => {
      cancelAnimationFrame(frame); observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      media.removeEventListener('change', policy);
      reduced.removeEventListener('change', schedule);
      delete root.dataset.bookmarkScrollbar;
    };
  });
</script>

{#if enabled && maximum > 0}
  <div data-bookmark-rail role="scrollbar" aria-label="Scroll page" aria-controls="portfolio-content"
    aria-orientation="vertical" aria-valuemin={0} aria-valuemax={Math.round(maximum)} aria-valuenow={Math.round(position)}
    tabindex="0" onpointerdown={pointerdown} onpointermove={pointermove} onpointerup={release}
    onpointercancel={release} onlostpointercapture={release} onkeydown={keydown}
    class="group fixed inset-y-3 right-0 z-40 w-6 touch-none select-none no-print focus-visible:outline-none"
    class:bookmark-dragging={dragging}>
    <div data-bookmark-thumb class="absolute inset-x-0 top-0 flex justify-center" style:height={`${height}px`} style:transform={`translateY(${top}px)`}>
      <div data-pixel-traveller class="pointer-events-none flex h-full flex-col items-center justify-center gap-1 opacity-60 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 group-[.bookmark-dragging]:opacity-100 motion-reduce:transition-none group-focus-visible:outline group-focus-visible:outline-1 group-focus-visible:outline-offset-4"
        class:text-paper={overFooter} class:text-forest={!overFooter}>
        {#each [0, ...trails] as offset, index}
          <span data-pixel={index} class="block size-1.5 shrink-0 bg-current" style:transform={`translateY(${offset}px)`}></span>
        {/each}
      </div>
    </div>
  </div>
{/if}
