<script lang="ts">
  import data from '$lib/story/story.json';
  import type { SceneState } from '$lib/story/scenes';
  let { state }: { state: SceneState } = $props();
</script>

<div class="scene-card glance-journey">
  <div class="scene-heading">
    <strong>{data.scenes.hi.title}</strong>
    <span class="scene-pill">{data.questions[0].scene.actions[state.view]}</span>
  </div>
  <ol class="glance-steps">
    {#each state.view ? data.scenes.hi.engineer : data.scenes.hi.recruiter as [label, value], i}
      <li>
        <span class="glance-marker" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
        <span class="glance-label">{label}</span>
        <strong class="glance-value">{value}</strong>
      </li>
    {/each}
  </ol>
</div>

<style>
  .glance-journey { padding: 28px; }
  .glance-steps { list-style: none; padding: 0; margin: 22px 0 0; display: grid; }
  .glance-steps li {
    display: grid;
    grid-template-columns: 38px minmax(96px, .65fr) minmax(0, 1.6fr);
    align-items: baseline;
    gap: 12px;
    padding: 16px 0;
    border-top: 1px solid var(--story-line);
    font-size: 15px;
    line-height: 1.5;
  }
  .glance-marker { color: var(--story-plum); font-size: 12px; font-variant-numeric: tabular-nums; }
  .glance-label { color: var(--story-muted); }
  .glance-value { font-size: 17px; font-weight: 650; }
  @media (max-width: 599px) {
    .glance-journey { padding: 14px; }
    .glance-steps { margin-top: 10px; }
    .glance-steps li { grid-template-columns: 20px minmax(0, 1fr); gap: 0 10px; padding: 10px 0; font-size: 12px; }
    .glance-marker { grid-row: span 2; padding-top: 2px; }
    .glance-label { font-size: 11px; }
    .glance-value { font-size: 13px; }
  }
</style>
