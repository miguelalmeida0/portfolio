<script lang="ts">
 import {page} from '$app/stores';
 import Story from '$lib/hero-lab/typographic/pages/TypographicStory.svelte';
 import Nav from '$lib/hero-lab/craft/Nav.svelte';
 import {craftNames,type Craft} from '$lib/hero-lab/craft/site';
</script>
<svelte:head><title>Story · {craftNames[$page.params.craft as Craft]} · Miguel Almeida</title><meta name="robots" content="noindex"/></svelte:head>
{#snippet navigation()}<Nav direction={$page.params.craft as Craft} page="story"/>{/snippet}
<div class="craft-linked"><Story previewBase={`/hero-lab/${$page.params.craft}`} {navigation}/></div>
