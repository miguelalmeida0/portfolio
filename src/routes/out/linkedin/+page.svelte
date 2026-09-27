<script lang="ts">
  import LinkButton from '$lib/components/experience/LinkButton.svelte';
  import { site } from '$lib/content/folio';
</script>
<svelte:head><title>LinkedIn — Miguel Almeida</title><meta name="robots" content="noindex" /></svelte:head>
<section class="shell py-20 sm:py-28"><p class="label-type text-plum">Keep in touch</p><h1 class="display-type mb-6 mt-5 text-[clamp(3rem,7vw,6rem)]">See you on LinkedIn.</h1><p class="mb-8 text-lg">Open my profile, or keep exploring my experience here.</p><div class="flex flex-wrap gap-8"><LinkButton href={site.linkedin} label="Open LinkedIn" external /><LinkButton href="/cv" label="Back to CV" secondary /></div></section>
