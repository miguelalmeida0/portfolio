<script lang="ts">
  import type { SelectedProject } from './selected-projects';
  let { project }: { project: SelectedProject } = $props();
  let aspectRatio = $state(project.initialAspectRatio);
  // Reserve a full-width canvas with the poster. Once media loads, the video
  // itself determines its height, so portrait and landscape loops remain intact.
  function useIntrinsicRatio(event: Event) {
    const video = event.currentTarget as HTMLVideoElement;
    if (video.videoWidth > 0 && video.videoHeight > 0) {
      aspectRatio = video.videoWidth / video.videoHeight;
    }
  }
</script>

<div class="preview-frame" data-preview data-preview-status="poster" data-treatment={project.id}
  style:aspect-ratio={aspectRatio}>
  <div class="preview-plane" data-preview-plane>
    <img src={project.poster} alt={project.alt} width="1600" height="900" loading="lazy" decoding="async" />
    {#if project.sources.length}
      <video data-project-preview={project.id} muted loop playsinline preload="none"
        poster={project.poster} aria-label={project.alt} onloadedmetadata={useIntrinsicRatio}></video>
    {/if}
  </div>
</div>

<style>
  .preview-frame { position: relative; display: block; width: 100%; min-width: 0; overflow: hidden; isolation: isolate; border: 0; border-radius: 12px; background: #f6f3ec; }
  .preview-plane { position: absolute; inset: 0; min-width: 0; }
  img, video { position: absolute; inset: 0; display: block; width: 100%; height: 100%; object-fit: contain; object-position: center; }
  img { z-index: 1; }
  video { z-index: 2; opacity: 0; }
  .preview-frame[data-preview-status='playing'] img { visibility: hidden; }
  .preview-frame[data-preview-status='playing'] video { opacity: 1; }
</style>
