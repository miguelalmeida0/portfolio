<script lang="ts">
  import data from '$lib/story/story.json';
  import type { SceneState } from '$lib/story/scenes';
  let { state }: { state: SceneState } = $props();
  const copy = data.scenes.own;
</script>
<div class="scene-card"><div class="state-tabs">{#each copy.tabs as label, i}<span class:chosen={state.tab === i}>{label}</span>{/each}</div>
  {#if state.tab === 0}<p class="draft">{#if state.rewritten}<s>{copy.original}</s> <mark>{copy.rewrite}</mark>{:else}{copy.original}{/if}</p><p class="scene-note">{state.rewritten ? copy.kept : copy.before}</p>
  {:else}<p class="transcript">{state.transcript || copy.listening}</p>{#if state.event}<div class="event-draft"><strong>{copy.event}</strong><p>{copy.draft}</p></div>{/if}{/if}
</div>
