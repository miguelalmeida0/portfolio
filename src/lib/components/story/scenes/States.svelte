<script lang="ts">
  import data from '$lib/story/story.json';
  import type { SceneState } from '$lib/story/scenes';
  import Rows from './Rows.svelte';
  let { state, retry }: { state: SceneState; retry: () => void } = $props();
</script>
<div class="scene-card"><div class="state-tabs">{#each data.scenes.build.states as label, i}<span class:chosen={state.status === i}>{label}</span>{/each}</div>{#if state.status === 2}<p class="empty-state">{data.scenes.build.empty}</p>{:else}{#if state.status === 3}<p class="scene-banner">{data.scenes.build.error} <button type="button" onclick={retry}>{data.scenes.build.retry}</button></p>{/if}<Rows loading={state.status === 1} />{/if}</div>
