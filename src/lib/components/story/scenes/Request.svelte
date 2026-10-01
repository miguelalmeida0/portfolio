<script lang="ts">
  import data from '$lib/story/story.json';
  import type { SceneState } from '$lib/story/scenes';
  let { state, patch }: { state: SceneState; patch: (value: Partial<SceneState>) => void } = $props();
  const copy = data.scenes.love;
</script>
<div class="scene-card request-card"><div class="scene-heading"><strong>{copy.title}</strong><span class="scene-pill">{state.running ? copy.flight : copy.ready}</span></div>
  <div class="request-line" class:running={state.running}><span class="wire" aria-hidden="true"></span>{#each copy.stops as [name, note], i}<button type="button" class:lit={state.stop === i} style:--stop={i} onmouseenter={() => patch({ stop: i })} onfocus={() => patch({ stop: i })} onclick={() => patch({ stop: i })}><strong>{name}</strong><small>{note}</small></button>{/each}<span class="packet" aria-hidden="true"></span></div>
  <p class="request-explanation">{state.stop < 0 ? copy.intro : copy.stops[state.stop][2]}</p>
</div>
