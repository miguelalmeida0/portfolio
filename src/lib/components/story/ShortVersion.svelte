<script lang="ts">
  import { onDestroy } from 'svelte';
  import data from '$lib/story/story.json';
  let result = $state('');
  let timer: ReturnType<typeof setTimeout>;
  let alive = true;
  async function copy() {
    clearTimeout(timer);
    let text = data.ui.copyFailed;
    try { await navigator.clipboard.writeText(data.shortVersion.copyText); text = data.ui.copied; } catch { /* The summary stays selectable. */ }
    if (!alive) return;
    result = text;
    timer = setTimeout(() => result = '', 2400);
  }
  onDestroy(() => { alive = false; clearTimeout(timer); });
</script>
<div class="short-version">
  <p class="short-kicker">{data.shortVersion.kicker}</p>
  <h2 id="story-summary" tabindex="-1">{data.shortVersion.title}</h2>
  <ol>{#each data.shortVersion.lines as line}<li>{line}</li>{/each}</ol>
  <div class="short-actions"><button type="button" data-story-copy onclick={copy}>{result || data.shortVersion.copyLabel}<span aria-hidden="true">↗</span></button></div>
  <span class="sr-only" role="status">{result}</span>
</div>
