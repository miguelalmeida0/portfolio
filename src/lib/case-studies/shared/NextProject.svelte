<script lang="ts">
  import { getContext } from 'svelte';
  import { nextProject } from '$lib/navigation/project-tour';
  let { slug }: { slug: string } = $props();
  const preview = getContext('typographic-case') === true;
  const next = $derived(nextProject(slug, preview));
</script>
<nav class="next" aria-label={next.label} data-sveltekit-preload-data="hover"><span class="lbl">{next.label}</span><a href={next.href}>{next.name}</a></nav>

