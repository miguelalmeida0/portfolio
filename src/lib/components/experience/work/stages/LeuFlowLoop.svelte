<script lang="ts">
  import { destinationLink } from '$lib/navigation/destination-link';
  import { onMount, type Snippet } from 'svelte';
  import Pause from '@lucide/svelte/icons/pause';
  import Play from '@lucide/svelte/icons/play';
  import { motionState } from '$lib/motion/policy';
  import { leuMedia } from '$lib/content/leu-media';

  let { href, layout }: { href?: string; layout?: Snippet<[Snippet, Snippet]> } = $props();
  let element: HTMLVideoElement;
  let mounted = $state(false);
  let visible = $state(true);
  let pageVisible = $state(true);
  let paused = $state(false);
  let requested = $state(false);
  let playing = $state(false);
  let unavailable = $state(false);
  let usedFallback = false;
  const autoplay = $derived(mounted && visible && pageVisible && !paused && !$motionState.reduced);
  const shouldPlay = $derived(mounted && visible && pageVisible && !paused && (requested || !$motionState.reduced));

  function sync() {
    if (!element || !mounted || unavailable) return;
    if (!shouldPlay) { element.pause(); return; }
    if (!element.getAttribute('src')) {
      element.src = leuMedia.sources.find(source => element.canPlayType(source.type))?.src ?? leuMedia.src;
      element.load();
    }
    void element.play().catch(() => { /* Keep the matching poster and explicit Play control. */ });
  }

  function fallback() {
    if (!usedFallback && element.getAttribute('src') !== leuMedia.src) {
      usedFallback = true;
      element.src = leuMedia.src;
      element.load();
      sync();
    } else { unavailable = true; playing = false; }
  }

  function toggle() {
    if (playing) paused = true;
    else { paused = false; requested = true; }
  }

  $effect(() => { $motionState.reduced; requested = false; });
  $effect(() => { shouldPlay; sync(); });

  onMount(() => {
    mounted = true;
    element.muted = true;
    element.defaultMuted = true;
    element.playsInline = true;
    const visibility = () => { pageVisible = !document.hidden; };
    visibility();
    // The active stage starts immediately; observation only manages later visibility.
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: .01 });
    observer.observe(element);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', visibility);
      element.pause();
      element.removeAttribute('src');
      element.load();
    };
  });
</script>

{#snippet player()}
<div class="leu-flow-loop" data-playing={playing}>
  {#snippet media()}
    <video bind:this={element} poster={leuMedia.posterFallback} muted loop playsinline {autoplay}
      preload={mounted && (!$motionState.reduced || requested) ? 'auto' : 'none'}
      aria-label={leuMedia.label} onplay={() => playing = true} onpause={() => playing = false} onerror={fallback}></video>
  {/snippet}
  {#if href}
    <a class="leu-media" {href} aria-label="View Leu case study" {...destinationLink(href)}>{@render media()}</a>
  {:else}
    <div class="leu-media">{@render media()}</div>
  {/if}
  {#if !layout}{@render controls()}{/if}
</div>
{/snippet}
{#snippet controls()}
  <div class="loop-controls" data-media-controls>
    <span>{leuMedia.duration}-second flow</span>
    {#if unavailable}<span role="status">Film unavailable</span>{:else}
      <button type="button" disabled={!mounted} onclick={toggle} aria-label={playing ? 'Pause Leu film' : 'Play Leu film'}>
        {#if playing}<Pause size={14} aria-hidden="true" />{:else}<Play size={14} aria-hidden="true" />{/if}
        {playing ? 'Pause' : 'Play'}
      </button>
    {/if}
  </div>
{/snippet}
{#if layout}{@render layout(player, controls)}{:else}{@render player()}{/if}

<style>
  .leu-flow-loop { display: flex; flex-direction: column; width: 100%; height: 100%; min-height: 0; background: #f9f7ef; color: var(--ink, var(--color-ink)); }
  .leu-media { position: relative; display: block; flex: 1; min-height: 0; overflow: hidden; }
  a.leu-media { cursor: pointer; }
  a.leu-media:focus-visible { outline: 3px solid var(--plum, var(--color-plum)); outline-offset: -5px; }
  video { position: absolute; inset: 0; display: block; width: 100%; height: 100%; object-fit: contain; }
  .loop-controls { display: flex; align-items: center; justify-content: center; gap: 20px; flex-shrink: 0; padding: 0 16px 12px; font: 500 12px/1.4 var(--hero-font, var(--font-sans)); }
  button { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-width: 90px; min-height: 44px; padding: 8px 16px; border-radius: 999px; background: var(--plum, var(--color-plum)); color: var(--paper, var(--color-paper)); cursor: pointer; }
  button:focus-visible { outline: 3px solid var(--plum, var(--color-plum)); outline-offset: 3px; }
</style>
