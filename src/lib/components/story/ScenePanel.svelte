<script lang="ts">
  import data from '$lib/story/story.json';
  import { format } from '$lib/story/reading';
  import type { SceneId, SceneRunner } from '$lib/story/scenes';
  import Scene from './Scene.svelte';
  let { index, runners, run, ready }: { index: number; runners: SceneRunner[]; run: (index: number, action: number) => void; ready: boolean } = $props();
  const question = $derived(data.questions[index]);
</script>
<div class="story-panel" data-story-panel>
  <p class="scene-caption" data-story-caption>{question.scene.caption}</p>
  <div class="scene-stage">
    <div class="story-scene" data-story-scene={question.id} role="region" aria-label={format(data.ui.illustration, { question: question.question })}>
      <Scene id={question.id as SceneId} runner={runners[index]} run={action => run(index, action)} />
    </div>
  </div>
  <div class="scene-controls"><span>{data.ui.tryIt}</span>{#each question.scene.actions as label, action}<button type="button" disabled={!ready} data-story-action={action} onclick={() => run(index, action)}>{label}</button>{/each}</div>
  {#if index >= 2}<p class="illustrative">{data.ui.example}</p>{/if}
</div>
