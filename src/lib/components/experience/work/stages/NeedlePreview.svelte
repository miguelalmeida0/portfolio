<script lang="ts">
  import { destinationLink } from '$lib/navigation/destination-link';
  let { src, alt }: { src: string; alt: string } = $props();
  let failed = $state(false);
</script>
<a href="/work/needle" {...destinationLink('/work/needle')} aria-label="Read the Needle performance case study" class="group relative block overflow-hidden rounded-2xl bg-[var(--paper)]">
  {#if failed}
    <div class="flex aspect-[36/25] items-center justify-center p-8 text-center text-[var(--ink)]"><p>Needle · Explore the search and image delivery case study</p></div>
  {:else}
    <picture><source media="(max-width: 599px)" srcset="/projects/needle/mobile-monolith.webp" width="390" height="844" /><img {src} {alt} width="1440" height="1000" loading="lazy" onerror={() => failed = true} class="block h-auto w-full" /></picture>
  {/if}
  <span class="absolute right-4 bottom-4 rounded-full bg-[var(--ink)] px-5 py-3 text-sm font-semibold text-[var(--paper)] group-hover:underline">Explore the engineering</span>
</a>
