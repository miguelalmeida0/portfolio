<script lang="ts">
  import data from '$lib/story/story.json';
  import { format } from '$lib/story/reading';
  import type { SceneId, SceneRunner } from '$lib/story/scenes';
  import Scene from './Scene.svelte';
  import ShortVersion from './ShortVersion.svelte';
  let { index, complete = false, inline = false, active = true, runners, run }: { index: number; complete?: boolean; inline?: boolean; active?: boolean; runners: SceneRunner[]; run: (index: number, action: number) => void } = $props();
  const question = $derived(data.questions[Math.min(index, 7)]);
</script>
<div class="story-panel" class:inline data-story-panel data-complete={complete || undefined}>
  <span class="big-number" data-n={String(Math.min(index + 1, 8)).padStart(2, '0')} aria-hidden="true"></span>
  <p class="scene-caption" data-story-caption>{question.scene.caption}</p>
  <div class="scene-stage">
    {#each data.questions as item, i}
      {#if !inline || i === index}
        <div class="story-scene" data-scroll-native={inline || undefined} data-story-scene={item.id} data-active={active && !complete && i === index || undefined} inert={!active || complete || i !== index} aria-hidden={!active || complete || i !== index} role="region" aria-label={format(data.ui.illustration, { question: item.question })}>
          <Scene id={item.id as SceneId} runner={runners[i]} run={action => run(i, action)} />
        </div>
      {/if}
    {/each}
  </div>
  <div class="scene-controls" inert={!active || complete}><span>{data.ui.tryIt}</span>{#each question.scene.actions as label, action}<button type="button" data-story-action={action} onclick={() => run(index, action)}>{label}</button>{/each}</div>
  {#if index >= 2}<p class="illustrative">{data.ui.example}</p>{/if}
  {#if !inline}<ShortVersion {complete} />{/if}
</div>
