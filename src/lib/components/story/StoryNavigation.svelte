<script lang="ts">
  import data from '$lib/story/story.json';
  import { format } from '$lib/story/reading';
  let { index, go, current, ready, ending = false }: { index: number; go: (index: number) => void; current: boolean; ready: boolean; ending?: boolean } = $props();
  let reached = $state(false);
  $effect(() => { if (current) reached = true; });
  const previous = $derived(data.questions[Math.max(0, index - 1)].question);
  const next = $derived(index === 7 ? data.ending.question : data.questions[Math.min(index + 1, 7)].question);
</script>
<div class="story-navigation" class:reached>
  {#if index > 0}<button type="button" disabled={!ready} class="story-back" data-story-back aria-label={format(data.ui.back, { question: previous })} onclick={() => go(index - 1)}><span aria-hidden="true">↑</span><span class="back-tip" data-story-back-tip>{format(data.ui.backTip, { question: previous }).replace('Back to:', 'Back:')}</span></button>{/if}
  {#if !ending}<button type="button" disabled={!ready} class="story-next" data-story-next onclick={() => go(index + 1)}><span class="next-icon" aria-hidden="true">↓</span><span><small>{index === 7 ? data.ui.last : format(data.ui.next, { left: 7 - index })}</small><strong>{index === 7 ? data.ui.seeEnd : next}</strong>{#if index === 7}<span class="sr-only">: {next}</span>{/if}</span></button>{/if}
</div>
