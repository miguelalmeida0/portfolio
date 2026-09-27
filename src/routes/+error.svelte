<script lang="ts">
  import { page } from '$app/stores';
  import LinkButton from '$lib/components/experience/LinkButton.svelte';
</script>
<svelte:head><title>{$page.status} — Miguel Almeida</title><meta name="robots" content="noindex" /></svelte:head>
<section class="shell py-20 sm:py-32">
  <p class="label-type text-plum">{$page.status} / A small detour</p>
  <h1 class="display-type mt-6 max-w-3xl text-[clamp(3rem,7vw,7rem)]">{$page.status===404 ? 'Nothing here. Plenty to explore.' : 'That didn’t go as planned.'}</h1>
  <p class="mb-8 mt-6 max-w-xl text-lg leading-relaxed">{$page.status===404 ? 'This page may have moved. The selected work is a good place to pick up the thread.' : 'Please try again, or head back to the portfolio.'}</p>
  <LinkButton href="/" label="Back to the work" />
</section>
