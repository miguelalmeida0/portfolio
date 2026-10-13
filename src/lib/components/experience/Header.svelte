<script lang="ts">
  import { afterNavigate, beforeNavigate } from '$app/navigation';
  import { onMount } from 'svelte';
  import FullscreenNavigation from './FullscreenNavigation.svelte';
  import { primaryNavigation } from '$lib/content/navigation';
  import ArrowRight from '@lucide/svelte/icons/arrow-right';
  let { navigateFromMenu, onGuideToggle, navigationTransitionActive, guideOpen = false, guideReady = false, homepage = false, askActive = false, story = false }: {
    navigateFromMenu: (event: MouseEvent, close: () => void | Promise<void>) => Promise<void>;
    onGuideToggle: (restoreFocusOnClose: boolean) => void;
    navigationTransitionActive: boolean;
    guideOpen?: boolean;
    guideReady?: boolean;
    homepage?: boolean;
    askActive?: boolean;
    story?: boolean;
  } = $props();
  let open = $state(false);
  let trigger = $state<HTMLButtonElement>();
  let menu = $state<FullscreenNavigation>();
  // Release the saved scroll position before Kit restores a history destination.
  beforeNavigate(() => { if (open) void menu?.close(false, true); });
  afterNavigate(() => { open = false; });
  onMount(() => {
    const restoreAsk = () => trigger?.focus({ preventScroll: true });
    window.addEventListener('ask:restore-trigger', restoreAsk);
    const desktop = matchMedia('(min-width: 1024px)');
    const closeOnDesktop = async () => {
      if (!desktop.matches || !open) return;
      await menu?.close(false, true);
      document.querySelector<HTMLAnchorElement>('[data-identity-home]')?.focus({ preventScroll: true });
    };
    desktop.addEventListener('change', closeOnDesktop);
    return () => {
      window.removeEventListener('ask:restore-trigger', restoreAsk);
      desktop.removeEventListener('change', closeOnDesktop);
    };
  });
  async function toggleGuide() {
    const fromMenu = open;
    if (fromMenu) await menu?.close();
    onGuideToggle(!fromMenu);
  }

</script>

{#snippet identity()}
    <a href="/#top" data-identity-home data-mobile-route-link={open || undefined} onclick={event => { if (open) void navigateFromMenu(event, () => menu?.close(false, true)); }} class="group flex min-h-11 min-w-0 shrink-0 items-center gap-3 rounded-lg sm:gap-4" aria-label="Miguel Almeida, Berlin — home">
      <span class="flex min-w-0 flex-col items-start sm:flex-row sm:items-center sm:gap-7">
        <span data-identity-name class="identity-name font-wordmark relative inline-block origin-top-left whitespace-nowrap text-base leading-tight font-bold tracking-[-.035em] transition-colors group-hover:text-plum min-[24rem]:text-lg sm:text-xl"><span data-identity-first class="inline-block">MIGUEL</span> <span data-identity-last class="inline-block">ALMEIDA</span><span data-identity-rule aria-hidden="true" class="pointer-events-none absolute inset-x-0 -bottom-1 h-0.5 origin-left bg-plum"></span></span>
        <span data-identity-location data-ask-id={homepage ? 'city' : undefined} class="mt-1 text-xs sm:mt-0 sm:text-sm">Berlin</span>
      </span>
    </a>
{/snippet}
<header id="top" class="wind-header shell relative z-50 no-print" data-align="left" data-story={story || undefined}>
  <div class="flex items-center justify-between gap-4" inert={open} aria-hidden={open || undefined}>
    {@render identity()}
    <nav aria-label="Main navigation" class="hidden shrink-0 items-center gap-7 text-sm min-[64rem]:flex">
      {#each primaryNavigation as link}
        <a data-ask-id={homepage ? `nav-${link.label.toLowerCase()}` : undefined} class="group ink-link hover:text-plum hover:underline" href={link.href} aria-current={story && link.href === '/story' ? 'page' : undefined} data-sveltekit-preload-data={link.href === '/story' ? 'hover' : undefined}>{link.label}{#if link.label === 'CV'} <ArrowRight size={18} aria-hidden="true" class="transition-transform group-hover:translate-x-0.5" />{/if}</a>
      {/each}
      <button class="guide-trigger" data-ask-trigger type="button" aria-expanded={askActive} disabled={!guideReady || navigationTransitionActive} aria-label={askActive ? 'Close Ask MiguelLLM' : 'Ask MiguelLLM'} onclick={toggleGuide}>Ask MiguelLLM</button>
    </nav>
    <button bind:this={trigger} type="button" onclick={() => open = true} disabled={!guideReady || navigationTransitionActive} aria-label="Menu" aria-expanded={open} aria-controls="mobile-navigation" class="menu-toggle">
      <span class="menu-icon" aria-hidden="true"><span></span><span></span><span></span></span>
    </button>
  </div>
  {#if open}
    <FullscreenNavigation bind:this={menu} {identity} {navigateFromMenu} {navigationTransitionActive}
      {guideReady} {askActive} {story} onAsk={toggleGuide}
      onClosed={() => { open = false; }} restoreFocus={() => trigger?.focus({ preventScroll: true })} />
  {/if}
</header>

<style>
  .wind-header { --ink: #142A22; --plum: #59163C; --color-plum: #610d3d; --hero-font: 'Figtree', sans-serif; width: min(calc(100% - 2 * var(--page-x)), var(--content-max)); margin-inline: auto; padding-block: 0; height: var(--header-height); display: grid; align-items: center; color: var(--ink); font-family: var(--hero-font); }
  .wind-header > div { height: 56px; }
  .menu-toggle { display: inline-flex; flex: 0 0 44px; align-items: center; justify-content: center; width: 44px; height: 44px; padding: 0; border: 0; border-radius: 0; color: var(--ink); background: transparent; cursor: pointer; -webkit-tap-highlight-color: transparent; transition: background-color 180ms ease, border-color 180ms ease; }
  .menu-toggle[aria-expanded="true"] { background: rgb(20 42 34 / 5%); border-color: rgb(20 42 34 / 22%); }
  .menu-icon { position: relative; width: 20px; height: 16px; }
  .menu-icon > span { position: absolute; left: 0; top: 7px; width: 20px; height: 2px; border-radius: 2px; background: currentColor; transform-origin: center; transition: transform 240ms cubic-bezier(.22, 1, .36, 1), opacity 160ms ease; }
  .menu-icon > span:first-child { transform: translateY(-6px); }
  .menu-icon > span:last-child { transform: translateY(6px); }
  .menu-toggle[aria-expanded="true"] .menu-icon > span:first-child { transform: rotate(45deg); }
  .menu-toggle[aria-expanded="true"] .menu-icon > span:nth-child(2) { opacity: 0; transform: scaleX(.4); }
  .menu-toggle[aria-expanded="true"] .menu-icon > span:last-child { transform: rotate(-45deg); }
  @media (hover: hover) { .menu-toggle:hover { background: rgb(20 42 34 / 5%); border-color: rgb(20 42 34 / 28%); } }
  @media (min-width: 1024px) { .menu-toggle { display: none; } }
  @media (prefers-reduced-motion: reduce) { .menu-toggle, .menu-icon > span { transition: none; } }
  .guide-trigger { flex-shrink: 0; min-height: 44px; font: inherit; white-space: nowrap; color: var(--plum); text-underline-offset: 4px; }
  .guide-trigger:hover { text-decoration: underline; }
  /* The same control opens and closes Ask; make the active state visible. */
  .guide-trigger[aria-expanded='true'] { text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 6px; }
  .wind-header :focus-visible { outline: 3px solid var(--plum); outline-offset: 2px; }
  .wind-header nav[aria-label="Main navigation"] { gap: var(--s-7); }
  .wind-header nav[aria-label="Main navigation"] a[aria-current='page'] {
    color: var(--plum);
    font-weight: 650;
    text-decoration-line: underline;
    text-decoration-thickness: 2px;
    text-underline-offset: 8px;
  }
  .wind-header [data-identity-name] { font: 700 26px/1 'Antonio', sans-serif; letter-spacing: -.01em; }
  .wind-header [data-identity-rule] { height: 2px; background: var(--plum); }
  .wind-header [data-identity-location], .wind-header nav { font-size: var(--type-ui,17px); line-height: 1.4; font-weight: 400; }
  .wind-header [data-identity-location] { margin: 0; }
  .wind-header [data-identity-home] > span { flex-direction: row; align-items: center; gap: 24px; }
  .wind-header :global(svg) { transition: none; transform: none; }
  @media (max-width: 767px) {
    .wind-header[data-story] > div [data-identity-location] { display:none; }
    .wind-header [data-identity-home] > span { gap: 14px; }
    .wind-header [data-identity-name] { font-size: 22px; }
    .wind-header [data-identity-location] { font-size: 14px; }
  }
  @media (max-width: 359px) { .wind-header [data-identity-home] > span { flex-direction: column; align-items: flex-start; gap: 5px; } }
</style>
