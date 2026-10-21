<script lang="ts">
 import {page} from '$app/stores';
 import Cv from '$lib/hero-lab/typographic/pages/TypographicCv.svelte';
 import Nav from '$lib/hero-lab/craft/Nav.svelte';
 import {craftNames,type Craft} from '$lib/hero-lab/craft/site';
</script>
<svelte:head><title>CV · {craftNames[$page.params.craft as Craft]} · Miguel Almeida</title><meta name="robots" content="noindex"/></svelte:head>
{#snippet navigation()}<Nav direction={$page.params.craft as Craft} page="cv"/>{/snippet}
<div class="craft-linked"><Cv previewBase={`/hero-lab/${$page.params.craft}`} {navigation}/></div>
