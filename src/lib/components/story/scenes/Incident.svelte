<script lang="ts">
  import data from '$lib/story/story.json';
  import type { SceneState } from '$lib/story/scenes';
  let { state }: { state: SceneState } = $props();
  const copy = data.scenes.f24;
</script>
<div class="scene-card"><div class="scene-heading"><strong>{copy.title}</strong><span class="scene-pill">{state.phase ? copy.active : copy.clear}</span></div>
  {#if state.phase === 0}<p class="empty-state">{copy.empty}</p>{:else}
    <div class="incident-alarm" class:acknowledged={state.phase >= 2}><span class="alarm-icon" aria-hidden="true">!</span><div><strong>{copy.alarm}</strong><small>{state.phase >= 2 ? copy.acknowledged : copy.triggered}</small></div><span class="scene-pill">{state.phase >= 2 ? copy.handled : copy.alarmActive}</span></div>
  {/if}
  {#if state.phase >= 2}<div class="coordinator"><strong>{copy.coordinator}</strong><p>{copy.reply}</p></div>{/if}
  {#if state.phase >= 3}<div class="phones"><span>{copy.message}</span>{#each [0,1,2] as _}<div class="phone"><span>{copy.phone}</span></div>{/each}<p>{copy.sent}</p></div>{/if}
</div>
