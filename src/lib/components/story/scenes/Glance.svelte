<script lang="ts">
  import data from '$lib/story/story.json';
  import type { SceneState } from '$lib/story/scenes';
  let { state }: { state: SceneState } = $props();
</script>
<div class="scene-card glance"><div class="scene-heading"><strong>{data.scenes.hi.title}</strong><span class="scene-pill">{data.questions[0].scene.actions[state.view]}</span></div><dl>{#each state.view ? data.scenes.hi.engineer : data.scenes.hi.recruiter as [label, value]}<div><dt>{label}</dt><dd>{value}</dd></div>{/each}</dl></div>
