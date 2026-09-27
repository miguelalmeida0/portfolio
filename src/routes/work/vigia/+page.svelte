<script lang="ts">
  import CaseStudy from '$lib/components/experience/CaseStudy.svelte';
  import { findProject } from '$lib/experience/projects';
</script>
<CaseStudy project={findProject('vigia')!} />
