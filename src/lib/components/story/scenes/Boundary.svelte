<script lang="ts">
  import data from '$lib/story/story.json';
  import type { SceneState } from '$lib/story/scenes';
  let { state }: { state: SceneState } = $props();
  const copy = data.scenes.care;
</script>
<div class="scene-card"><div class="scene-heading"><strong>{copy.title}</strong><span class="scene-pill">{state.bad ? copy.handled : copy.ok}</span></div><dl class="response-fields">{#each copy.fields as [name, value], i}<div class:invalid={i === 1 && state.bad}><dt>{name}</dt><dd>{i === 1 && state.bad ? copy.invalid : value}</dd></div>{/each}</dl><strong>{copy.acknowledged}</strong><p class="scene-note">{state.bad ? copy.unavailable : copy.time}</p><ol class="boundary-checks">{#each copy.checks as label, i}<li class:passed={state.checks > i}><span aria-hidden="true">✓</span>{label}</li>{/each}</ol></div>
