<script lang="ts">
  import data from '$lib/story/story.json';
  import type { SceneState } from '$lib/story/scenes';
  import Rows from './Rows.svelte';
  let { state: value, patch, retry }: { state: SceneState; patch: (value: Partial<SceneState>) => void; retry: () => void } = $props();
  let row = $state<HTMLButtonElement>(); let close = $state<HTMLButtonElement>();
  const copy = data.scenes.fail;
  $effect(() => { if (value.open) close?.focus({ preventScroll: true }); else if (value.returned) row?.focus({ preventScroll: true }); });
  function dismiss() { patch({ open: false, returned: true }); }
</script>
<div class="scene-card failure-card"><div class="scene-heading"><strong>{copy.title}</strong><span class="scene-pill">{value.mode === 1 ? copy.weak : copy.online}</span></div>
  {#if value.mode === 1}<p class="scene-banner">{copy.error} <button type="button" onclick={retry}>{data.scenes.build.retry}</button></p>{/if}
  {#if value.mode === 2 && value.late}<p class="scene-banner">{copy.stale}</p>{/if}
  <Rows rows={value.mode === 2 ? [data.scenes.rows[2]] : data.scenes.rows} />
  {#if value.mode === 3}<button bind:this={row} class="detail-button" type="button" onclick={() => patch({ open: true, returned: false })}>{copy.details}</button>{#if value.returned}<p class="scene-note">{copy.returned}</p>{/if}{/if}
  <div class="request-strip"><span>{copy.requests}</span>{#if !value.request}<span>{copy.none}</span>{:else if value.mode === 2}<span class:late={value.late}>{copy.alarms}</span><span class:accepted={value.request >= 2}>{copy.templates}</span>{:else}<span class:late={value.mode === 1}>{copy.refresh}</span>{/if}</div>
  {#if value.open}<div class="detail-sheet" role="group" aria-label={copy.details}><strong>{data.scenes.rows[2][1]}</strong><p>{copy.escape}</p><button bind:this={close} type="button" onkeydown={event => { if (event.key === 'Escape') { event.stopPropagation(); dismiss(); } }} onclick={dismiss}>{copy.close}</button></div>{/if}
</div>
