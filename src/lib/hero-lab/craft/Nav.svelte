<script lang="ts">
 import CounterformNav from './CounterformNav.svelte';
 import BearingNav from './BearingNav.svelte';
 import ThroughlineNav from './ThroughlineNav.svelte';
 import type {Craft,CraftPage} from './site';
 let {direction,page='home'}:{direction:Craft;page?:CraftPage}=$props();
</script>
{#if direction==='counterform'}<CounterformNav {page}/>{:else if direction==='bearing'}<BearingNav {page}/>{:else}<ThroughlineNav {page}/>{/if}
