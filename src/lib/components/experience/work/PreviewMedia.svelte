<script lang="ts">
  import type { SelectedProject } from './selected-projects';
  let { project }: { project: SelectedProject } = $props();
</script>
<div class="preview-frame" data-preview data-preview-status="poster" data-treatment={project.id}>
  <div class="preview-plane" data-preview-plane>
  <img src={project.poster} alt={project.alt} width="1440" height="1000" loading="lazy" decoding="async" />
  {#if project.sources.length}
    <video data-project-preview={project.id} muted loop playsinline preload="none" poster={project.poster} aria-label={project.alt}></video>
  {/if}
  </div>
</div>
<style>
  .preview-frame { position: relative; width: 100%; height: 310px; overflow: hidden; border: 1px solid color-mix(in srgb, var(--paper) 30%, transparent); border-radius: var(--r-media); background: var(--ink); }
  .preview-plane { position: absolute; inset: 0; }
  [data-treatment='needle'], [data-treatment='second-voice-ai'], [data-treatment='leu'] { background: var(--paper); }
  img, video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; }
  img { z-index: 1; }
  video { opacity: 0; }
  .preview-frame:global([data-preview-status='playing']) img { visibility: hidden; }
  .preview-frame:global([data-preview-status='playing']) video { opacity: 1; }
  @media (max-width: 679px) { .preview-frame { height: 270px; } }
</style>
