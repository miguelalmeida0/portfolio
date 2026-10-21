<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { hero, labNavigation } from '$lib/hero-lab/content';
  import { motionState } from '$lib/motion/policy';
  import { curves } from '$lib/hero-lab/runtime';

  // A toolbar, not a menu: every destination is one thumb-reach tap on mobile.
  let dock = $state<HTMLElement>();
  // The wrapper owns the step-aside offset; the hero's opening owns the dock itself.
  let wrap = $state<HTMLElement>();
  let indicator = $state<HTMLElement>();
  let current = $state<string | undefined>();

  let shown = false;
  function place(target: HTMLElement | undefined) {
    if (!indicator || !dock) return;
    if (!target) { shown = false; gsap.to(indicator, { opacity: 0, duration: $motionState.reduced ? 0 : .25 }); return; }
    const vars = { x: target.offsetLeft, width: target.offsetWidth };
    // First appearance happens in place; later changes slide between links.
    if ($motionState.reduced || !shown) {
      gsap.set(indicator, vars);
      gsap.to(indicator, { opacity: 1, duration: $motionState.reduced ? 0 : .25 });
    } else gsap.to(indicator, { ...vars, opacity: 1, duration: .55, ease: curves.snap });
    shown = true;
  }
  $effect(() => { place(current ? dock?.querySelector<HTMLElement>(`[data-dock-link="${current}"]`) ?? undefined : undefined); });

  onMount(() => {
    // The indicator reports where the reader is: hero, Selected Work or contact.
    const sections = [['#work', document.getElementById('work')], ['#contact', document.getElementById('contact')]] as const;
    const update = () => {
      const line = innerHeight * .45;
      let active: string | undefined;
      for (const [href, el] of sections) {
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top < line && rect.bottom > line) active = href;
      }
      current = active;
    };
    // Out of the way while reading downward past the hero; back on any upward
    // scroll, near the end of the page, or when keyboard focus enters it.
    let lastY = scrollY, hidden = false, down = false;
    // Never cover the hero's own actions: step aside while they sit in the dock's band.
    const actions = document.querySelector<HTMLElement>('[data-lab-root] .d3-actions');
    const coversActions = () => {
      if (!actions || !dock) return false;
      const a = actions.getBoundingClientRect(), band = innerHeight - dock.offsetHeight - 24;
      return a.bottom > band && a.top < innerHeight;
    };
    const reveal = (hide: boolean) => {
      if (hide === hidden || !wrap) return;
      hidden = hide;
      gsap.to(wrap, { y: hide ? 120 : 0, duration: $motionState.reduced ? 0 : .45, ease: curves.snap });
    };
    const travel = () => {
      const y = scrollY, nearEnd = y + innerHeight > document.documentElement.scrollHeight - 160;
      if (Math.abs(y - lastY) > 6) { down = y > lastY; lastY = y; }
      reveal(coversActions() || (down && y > innerHeight * .3 && !nearEnd));
    };
    const focusIn = () => reveal(false);
    update();
    travel();
    // Layout settles after fonts and the opening; re-check once each.
    void document.fonts.ready.then(travel);
    window.addEventListener('load', travel, { once: true });
    const settled = setTimeout(travel, 1600);
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('scroll', travel, { passive: true });
    window.addEventListener('resize', update);
    dock?.addEventListener('focusin', focusIn);
    window.addEventListener('resize', travel);
    return () => { clearTimeout(settled); window.removeEventListener('load', travel); window.removeEventListener('scroll', update); window.removeEventListener('scroll', travel); window.removeEventListener('resize', update); window.removeEventListener('resize', travel); dock?.removeEventListener('focusin', focusIn); };
  });
</script>

<div class="d3-dock-wrap" bind:this={wrap}>
<nav class="d3-dock" aria-label="Main navigation" bind:this={dock} data-dock data-arm>
  <span class="d3-indicator" bind:this={indicator} aria-hidden="true"></span>
  <a href="#top" class="d3-home" data-identity-home aria-label={hero.homeLabel}>
    <span class="d3-mono" aria-hidden="true">MA</span><span class="d3-home-name">Miguel Almeida</span>
  </a>
  <span class="d3-sep" aria-hidden="true"></span>
  {#each labNavigation as link}
    <a href={link.href} class="d3-link" data-dock-link={link.href}
      aria-current={current === link.href ? 'location' : undefined}>{link.label}</a>
  {/each}

</nav>
</div>

<style>
  .d3-dock-wrap { position: fixed; z-index: 55; left: 0; right: 0; bottom: max(20px, env(safe-area-inset-bottom)); display: flex; justify-content: center; pointer-events: none; }
  .d3-dock { position: relative; pointer-events: auto; display: flex; align-items: center; gap: 2px; padding: 6px; border-radius: 14px; background: var(--ink); color: var(--paper); box-shadow: 0 10px 30px rgb(20 42 34 / .22); font-family: var(--hero-font); }
  .d3-indicator { position: absolute; left: 0; top: 6px; bottom: 6px; width: 0; border-radius: 9px; background: var(--lime); opacity: 0; pointer-events: none; }
  .d3-home, .d3-link { position: relative; z-index: 1; display: inline-flex; align-items: center; gap: 10px; min-height: calc(44px / var(--lab-zoom, 1)); padding: 0 16px; border-radius: 9px; color: inherit; text-decoration: none; font: 600 16px/1 var(--hero-font); background: none; border: 0; cursor: pointer; transition: color .3s, background-color .3s; }
  .d3-mono { display: inline-grid; place-items: center; width: 32px; height: 32px; border-radius: 8px; background: var(--plum); color: var(--paper); font: 800 13px/1 var(--hero-font); letter-spacing: .02em; }
  .d3-home-name { font-weight: 700; }
  .d3-sep { width: 1px; height: 24px; margin: 0 6px; background: rgb(249 247 238 / .2); }
  .d3-link[aria-current] { color: var(--ink); }
  @media (hover: hover) { .d3-link:not([aria-current]):hover, .d3-home:hover { background: rgb(249 247 238 / .1); } }
  .d3-home:focus-visible, .d3-link:focus-visible { outline: 2px solid var(--lime); outline-offset: 2px; }
  @media (max-width: 767px) {
    .d3-dock-wrap { left: 10px; right: 10px; bottom: max(10px, env(safe-area-inset-bottom)); }
    .d3-dock { width: 100%; justify-content: space-between; }
    .d3-home, .d3-sep { display: none; }
    .d3-link { min-height: 48px; padding: 0 7px; font-size: 14px; flex: 1 1 auto; justify-content: center; }
  }
  @media (prefers-reduced-motion: reduce) { .d3-home, .d3-link { transition: none; } }
</style>
