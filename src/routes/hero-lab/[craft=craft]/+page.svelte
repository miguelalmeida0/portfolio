<script lang="ts">
 import {page} from '$app/stores';
 import Counterform from '$lib/hero-lab/craft/Counterform.svelte';
 import Bearing from '$lib/hero-lab/craft/Bearing.svelte';
 import Throughline from '$lib/hero-lab/craft/Throughline.svelte';
 import WorkSection from '$lib/components/experience/work/WorkSection.svelte';
 import {craftNames,type Craft} from '$lib/hero-lab/craft/site';
</script>
<svelte:head><title>{craftNames[$page.params.craft as Craft]} · Miguel Almeida</title><meta name="robots" content="noindex"/><link rel="preload" href="/fonts/antonio-700-latin.woff2" as="font" type="font/woff2" crossorigin="anonymous"/></svelte:head>
{#if $page.params.craft==='counterform'}<Counterform/>{:else if $page.params.craft==='bearing'}<Bearing/>{:else}<Throughline/>{/if}
<div class:rail-work={$page.params.craft==='counterform'}><WorkSection current/></div>
<style>.rail-work{margin-left:168px}@media(max-width:800px){.rail-work{margin-left:0}}</style>
