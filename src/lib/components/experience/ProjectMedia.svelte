<script lang="ts">
  import { destinationLink } from '$lib/navigation/destination-link';
  import type { Project } from '$lib/experience/projects';
  import ProductLoop from './ProductLoop.svelte';
  let { project, hero = false }: { project: Project; hero?: boolean } = $props();
  let failed = $state(false);
</script>
<figure class={!hero && project.slug === 'f24' ? 'w-full max-w-sm self-center' : 'w-full'}>
  <div class="overflow-clip rounded-xl bg-sage">
    {#if project.video}
      <ProductLoop src={project.video} poster={project.image} label={project.alt} onerror={() => failed = true} />
    {:else if !failed}
      <img src={project.image} alt={project.alt} width={project.slug === 'f24' ? 1024 : 1440} height={project.slug === 'f24' ? 685 : 900} loading={hero ? 'eager' : 'lazy'} decoding="async" class="block h-auto w-full object-contain" onerror={() => failed = true} />
    {:else}
      <div class="flex min-h-48 items-center justify-center p-8 text-center">The product image is unavailable. You can still read the complete case study below.</div>
    {/if}
  </div>
  <figcaption class="mt-3 max-w-2xl text-xs leading-relaxed text-muted">{project.caption}{#if failed && project.video} <a class="underline underline-offset-4" href={project.video} {...destinationLink(project.video)}>Open the recording directly.</a>{/if}</figcaption>
</figure>
