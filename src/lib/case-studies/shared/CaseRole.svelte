<script lang="ts">
  import { projects } from '$lib/experience/projects';
  let { slug }: { slug: string } = $props();
  const project = $derived(projects.find(item => item.slug === slug));
</script>

{#if project}<p class="case-ownership">{project.ownership}</p>{/if}
