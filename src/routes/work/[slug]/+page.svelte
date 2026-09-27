<script lang="ts">
  import CaseStudy from '$lib/components/experience/CaseStudy.svelte';
  import type { PageData } from './$types';
  export let data: PageData;
</script>
<CaseStudy project={data.project} />
