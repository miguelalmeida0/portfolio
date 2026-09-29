<script lang="ts">
  import ProductLoop from './ProductLoop.svelte';
  import { findProject } from '$lib/experience/projects';

  let { active = true }: { active?: boolean } = $props();
  const project = findProject('flow')!;
  // Build only exposes the player when both authentic deliverables are present.
  const media = import.meta.glob('/static/projects/flow/flow-loop-{web-final.mp4,poster-final.jpg}');
  const available = Object.keys(media).length === 2;
</script>

{#if available}
  <ProductLoop src={project.video!} poster={project.image} label={project.alt} {active} stillForReduced wide />
{:else}
  <div class="flex aspect-video items-center justify-center p-6 text-center">
    <p class="text-sm text-muted">The Flow product film is currently unavailable.</p>
  </div>
{/if}
