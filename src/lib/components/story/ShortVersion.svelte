<script lang="ts">
  import { onDestroy } from 'svelte';
  import data from '$lib/story/story.json';

  let result = $state('');
  let timer: ReturnType<typeof setTimeout>;
  let alive = true;

  async function copy() {
    clearTimeout(timer);
    let text = data.ui.copyFailed;
    try {
      await navigator.clipboard.writeText(data.shortVersion.copyText);
      text = data.ui.copied;
    } catch {
      // The introduction remains selectable when the Clipboard API is blocked.
    }
    if (!alive) return;
    result = text;
    timer = setTimeout(() => result = '', 2400);
  }

  onDestroy(() => {
    alive = false;
    clearTimeout(timer);
  });
</script>

<div class="short-version">
  <div class="short-opening">
    <div>
      <p class="short-kicker">{data.shortVersion.kicker}</p>
      <h2 id="story-summary" tabindex="-1">{data.shortVersion.title}</h2>
      <p class="short-introduction">{data.shortVersion.intro}</p>
    </div>
  </div>

  <ol class="short-journey" aria-label="My path into frontend">
    {#each data.shortVersion.chapters as chapter, i}
      <li>
        <span class="short-step">{String(i + 1).padStart(2, '0')}</span>
        <p class="short-period">{chapter.period}</p>
        <h3>{chapter.title}</h3>
        <p class="short-chapter-copy">{chapter.text}</p>
      </li>
    {/each}
  </ol>

  <div class="short-footer">
    <p class="short-outro">{data.shortVersion.outro}</p>
    <div class="short-actions">
      <button type="button" data-story-copy onclick={copy}>
        {result || data.shortVersion.copyLabel}
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
          <rect x="8" y="8" width="11" height="12" rx="2"></rect>
          <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2"></path>
        </svg>
      </button>
    </div>
  </div>
  <span class="sr-only" role="status">{result}</span>
</div>
