<script lang="ts">
  import { onMount } from 'svelte';
  import { motionState } from '$lib/motion/policy';
  import type { GradientController } from '$lib/graphics/hero-gradient/preset';

  let host: HTMLDivElement;
  let status = $state<'static' | 'loading' | 'running' | 'paused' | 'unavailable'>('static');
  let ready = $state(false);

  onMount(() => {
    let controller: GradientController | undefined;
    let disposed = false;
    let inView = false;
    let reduced = true;
    let failed = false;
    let pending = false;
    let generation = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const visible = () => inView && !document.hidden;

    const release = () => {
      generation++;
      pending = false;
      clearTimeout(timer);
      timer = undefined;
      ready = false;
      controller?.destroy();
      controller = undefined;
    };

    const fail = () => {
      if (disposed) return;
      failed = true;
      ready = false;
      status = 'unavailable';
      // React errors can arrive during commit; tear down outside that commit.
      queueMicrotask(release);
    };

    const start = async () => {
      const ticket = ++generation;
      pending = true;
      status = 'loading';
      try {
        const { mountHeroGradient } = await import('$lib/graphics/hero-gradient/renderer');
        if (disposed || ticket !== generation) return;
        pending = false;
        if (reduced || !visible()) { status = 'static'; return; }
        const styles = getComputedStyle(host);
        controller = mountHeroGradient(host, {
          color1: styles.getPropertyValue('--hero-red').trim(),
          color2: styles.getPropertyValue('--hero-gradient-shadow').trim(),
          color3: styles.getPropertyValue('--hero-black').trim()
        }, () => {
          if (disposed || failed || ticket !== generation) return;
          ready = true;
          status = visible() ? 'running' : 'paused';
        }, fail);
        status = 'running';
      } catch { if (ticket === generation) fail(); }
    };

    const sync = () => {
      if (disposed || failed) return;
      if (reduced) { release(); status = 'static'; return; }
      if (controller) {
        controller.pause(!visible());
        status = visible() ? 'running' : 'paused';
        return;
      }
      if (!visible()) { clearTimeout(timer); timer = undefined; return; }
      if (!pending && !timer) {
        // Let the real content and portrait paint before downloading WebGL.
        timer = setTimeout(() => { timer = undefined; if (visible() && !reduced) void start(); }, 900);
      }
    };

    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync(); });
    observer.observe(host);
    const unsubscribe = motionState.subscribe((motion) => { reduced = motion.reduced; sync(); });
    document.addEventListener('visibilitychange', sync);

    return () => {
      disposed = true;
      observer.disconnect();
      unsubscribe();
      document.removeEventListener('visibilitychange', sync);
      release();
    };
  });
</script>

<div
  aria-hidden="true"
  data-hero-gradient={status}
  class="pointer-events-none absolute inset-0 z-0 overflow-hidden [contain:paint]"
>
  <div class="absolute inset-0 [background:radial-gradient(ellipse_at_78%_48%,color-mix(in_srgb,var(--hero-red)_24%,transparent),transparent_62%)]"></div>
  <div
    bind:this={host}
    class="absolute -inset-6 opacity-0 blur-[18px] transition-opacity duration-[1800ms] ease-out motion-reduce:transition-none"
    class:opacity-85={ready}
  ></div>
  <div class="absolute inset-0 [background:linear-gradient(90deg,var(--hero-black)_12%,transparent_80%),linear-gradient(0deg,var(--hero-black),transparent_28%,transparent_78%,var(--hero-black))] max-[760px]:[background:linear-gradient(180deg,var(--hero-black)_25%,transparent_65%,var(--hero-black))]"></div>
</div>
