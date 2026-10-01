<script lang="ts">
  import data from '$lib/story/story.json';
  import { format } from '$lib/story/reading';
  let { current }: { current: number } = $props();
  const complete = $derived(current === 8);
  const label = $derived(format(complete ? data.progress.done : current === 7 ? data.progress.last : data.progress.format, { n: current + 1, total: 8, left: 7 - current }));
</script>
<div class="story-progress">
  <span class="story-ring" class:complete data-story-ring data-complete={complete || undefined} aria-hidden="true">
    <svg viewBox="0 0 64 64"><circle class="ring-bg" cx="32" cy="32" r="26" /><circle class="ring-line" cx="32" cy="32" r="26" stroke-dasharray="163.4" stroke-dashoffset={163.4 * (1 - current / 8)} /><circle class="ring-disc" cx="32" cy="32" r="29" /><path class="ring-check" d="M21 33 l7 7 l15 -16" /></svg>
    <span class="ring-count" data-story-ring-count>{current}/8</span><span class="ring-burst">{#each Array(12) as _, i}<i style:--angle={i * 30 + 'deg'}></i>{/each}</span>
  </span>
  <span data-story-progress role="status" aria-live="polite">{label}</span>
</div>
