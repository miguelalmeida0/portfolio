<script lang="ts">
  import { destinationLink } from '$lib/navigation/destination-link';
  import { onMount, type Snippet } from 'svelte';
  import type { VideoSpec } from '$lib/content/work-projects';
  let { video, href, linkLabel, layout }: { video: VideoSpec; href?: string; linkLabel?: string; layout?: Snippet<[Snippet, Snippet]> } = $props();
  let element: HTMLVideoElement;
  let reduced = $state(true);
  let requested = $state(false);
  let playing = $state(false);
  let paused = false;
  let unavailable = $state(false);
  let canAutoplay = $state(false);
  let visible = false;
  let alive = true;
  function sync() {
    if (!alive || !element) return;
    const shouldPlay = visible && !document.hidden && !paused && (!reduced || requested);
    canAutoplay = visible && !document.hidden && !reduced && !paused;
    if (!shouldPlay) { element.pause(); return; }
    if (!element.getAttribute('src')) {
      element.src = video.sources?.find(source => element.canPlayType(source.type) !== '')?.src ?? video.src;
      element.load();
    }
    void element.play().catch(() => { if (alive) unavailable = true; });
  }
  function toggle() { requested = !playing; paused = !requested; sync(); }
  onMount(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => { reduced = media.matches; requested = false; sync(); };
    change();
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: .05 });
    observer.observe(element);
    media.addEventListener('change', change);
    document.addEventListener('visibilitychange', sync);
    return () => { alive = false; observer.disconnect(); media.removeEventListener('change', change); document.removeEventListener('visibilitychange', sync); element.pause(); element.removeAttribute('src'); element.load(); };
  });
</script>
{#snippet player()}
<div class="video-frame">
  {#snippet media()}
  <video bind:this={element} poster={video.poster} muted loop playsinline autoplay={canAutoplay} preload="none" aria-label={video.label} style:object-fit={video.fit} onplay={() => playing = true} onpause={() => playing = false}></video>
  {/snippet}
  {#if href}<a {href} aria-label={linkLabel} class="media-link" {...destinationLink(href)}>{@render media()}</a>{:else}{@render media()}{/if}
  {#if !layout}{@render controls()}{/if}
</div>
{/snippet}
{#snippet controls()}
  {#if reduced || layout}<button data-media-controls type="button" onclick={toggle}>{playing ? 'Pause film' : 'Play film'} <span aria-hidden="true">{playing ? 'Ⅱ' : '▶'}</span></button>{/if}
{/snippet}
{#if layout}{@render layout(player, controls)}{:else}{@render player()}{/if}
{#if unavailable}<span class="sr-only" role="status">Automatic playback unavailable. The product poster remains visible.</span>{/if}
<style>
  .video-frame { position: relative; width: 100%; height: 100%; min-height: 0; overflow: hidden; }
  .media-link { position: absolute; inset: 0; display: block; cursor: pointer; }
  a.media-link:focus-visible { outline: 3px solid var(--plum); outline-offset: -5px; }
  video { position: absolute; inset: 0; display: block; width: 100%; height: 100%; }
  button { position: absolute; left: 50%; bottom: 22px; transform: translateX(-50%); display: flex; gap: 16px; align-items: center; min-height: 48px; padding: 10px 22px; border-radius: 999px; background: var(--plum); color: var(--paper); white-space: nowrap; font: 700 14px/1 var(--hero-font); cursor: pointer; }
</style>
