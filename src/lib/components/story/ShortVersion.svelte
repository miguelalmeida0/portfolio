<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import data from '$lib/story/story.json';
  import { destinationLink } from '$lib/navigation/destination-link';
  let { complete }: { complete: boolean } = $props();
  let summary: HTMLDivElement;
  let visible = $state(false);
  onMount(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) visible = true; }, { threshold: .2 });
    // Observe the stage: the summary itself is clipped shut before its reveal.
    observer.observe(summary.parentElement!);
    return () => observer.disconnect();
  });
  let result = $state(''); let timer: ReturnType<typeof setTimeout>; let alive = true;
  async function copy() {
    clearTimeout(timer);
    let text = data.ui.copyFailed;
    try { await navigator.clipboard.writeText(data.shortVersion.copyText); text = data.ui.copied; } catch { /* Keep selectable summary visible. */ }
    if (!alive) return;
    result = text; timer = setTimeout(() => result = '', 2400);
  }
  onDestroy(() => { alive = false; clearTimeout(timer); });
</script>
<div bind:this={summary} class="short-version" class:complete={complete && visible} inert={!complete} aria-hidden={!complete}>
  <p class="short-kicker">{data.shortVersion.kicker}</p><h2>{data.shortVersion.title}</h2>
  <ol>{#each data.shortVersion.lines as line, i}<li style:--line={i}>{line}</li>{/each}</ol>
  <div class="short-actions"><button type="button" data-story-copy onclick={copy}>{result || data.shortVersion.copyLabel}</button><a href="#contact" {...destinationLink('#contact')}>{data.ending.ctas[0].label}</a></div>
  <span class="sr-only" role="status">{result}</span>
</div>
