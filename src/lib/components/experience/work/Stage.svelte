<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { WorkProject } from '$lib/content/work-projects';
  import SecondVoice from './stages/SecondVoice.svelte';
  import F24 from './stages/F24.svelte';
  import VideoLoop from './stages/VideoLoop.svelte';
  import LeuFlowLoop from './stages/LeuFlowLoop.svelte';
  let { project }: { project: WorkProject } = $props();
</script>
<div class="stage" data-kind={project.stage.kind} data-project={project.id}>
  {#snippet caption(controls?: Snippet)}
    <div class="caption" data-stage-caption><h3><span data-ask-id={project.id === 'second-voice' ? 'try' : undefined}>{project.line}</span></h3>{#if controls}{@render controls()}{/if}</div>
  {/snippet}
  {#snippet solo(media: Snippet, controls: Snippet)}
    <div class="frame" data-stage-frame><div class="stage-card solo">{@render media()}</div></div>
    {@render caption(controls)}
  {/snippet}
  {#if project.stage.kind === 'solo'}<p class="sr-only">{project.stage.video.caption}</p>{/if}
  {#if project.stage.kind === 'solo'}
    {#if project.id === 'leu'}<LeuFlowLoop href="/work/leu" layout={solo} />
    {:else}<VideoLoop video={project.stage.video} href={`/work/${project.id}`} linkLabel={`View ${project.name} case study`} layout={solo} />{/if}
  {:else}
    {@render caption()}
    <div class="frame" data-stage-frame>
    {#if project.stage.demo === 'second-voice'}
      <SecondVoice />
    {:else}
      <F24 />
    {/if}
    </div>
  {/if}
</div>
<style>
  .stage { --cols: minmax(0,1fr) minmax(0,1fr); display: flex; flex-direction: column; gap: 14px; }
  .stage[data-kind='solo'] { --cols: minmax(0,1fr); }
  .caption { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; height: 60px; }
  h3 { max-width: 32ch; font: 500 24px/1.25 var(--hero-font); }
  .frame { --stage-height: 560px; display: grid; grid-template-columns: var(--cols); grid-template-rows: minmax(0,1fr); gap: 14px; height: var(--stage-height); }
  .frame :global(.stage-card) { min-width: 0; min-height: 0; padding: 22px 24px; background: var(--sage); color: var(--ink); border-radius: 16px; overflow: auto; display: flex; flex-direction: column; }
  .frame :global(.card-b) { background: var(--paper); }
  .frame .solo { padding: 0; background: var(--paper); }
  @media (max-width: 1099px) { .frame { --stage-height: 480px; } }
  @media (max-width: 767px) {
    .caption { display: block; height: 114px; }
    h3 { font-size: 23px; }
    .frame { --stage-height: 780px; grid-template-columns: minmax(0,1fr); grid-template-rows: minmax(0,.46fr) minmax(0,.54fr); gap: 12px; }
    .stage[data-kind='solo'] .frame { grid-template-rows: minmax(0,1fr); }
    .frame :global(.stage-card) { padding: 20px; }
    .frame .solo { padding: 0; }
  }
  @media (prefers-reduced-motion: reduce) { .frame { transition: none; } }
  @media (max-width: 1099px) {
    /* The Flow film is 1920×1080; let its frame shrink with the available width. */
    .stage[data-project='flow'] .frame { height: auto; aspect-ratio: 16 / 9; grid-template-rows: minmax(0,1fr); }
    .stage[data-project='flow'] .caption { height: auto; min-height: 0; }
    .stage[data-project='flow'] :global(video) { object-fit: contain !important; }
  }
</style>
