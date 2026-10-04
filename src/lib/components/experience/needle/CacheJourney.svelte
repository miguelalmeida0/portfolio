<script lang="ts">
  const scenarios = [
    { name: 'First visit', explanation: 'A prepared graph saves construction, not transfer. The browser still loads the corpus and checks graph compatibility. An uncached derivative needs a transform.', steps: [['Corpus', 'Download & hash'], ['Graph', 'Load compatible snapshot'], ['Derivative', 'Read disk or generate'], ['Browser', 'Store the response']] },
    { name: 'Repeat visit', explanation: 'Corpus and graph revalidate. A matching ETag can return 304. A fresh immutable local-image response can be reused without contacting the server.', steps: [['Corpus', 'Revalidate bytes'], ['Graph', 'Check corpus identity'], ['Derivative', 'Reuse matching key'], ['Browser', 'Reuse while fresh']] },
    { name: 'New corpus', explanation: 'Changing the corpus changes its checksum. The old graph cannot be reused. Local artwork must move to a new versioned pack URL; a server fingerprint cannot evict a fresh browser response at the old URL.', steps: [['Corpus', 'New checksum'], ['Graph', 'New snapshot or rebuild'], ['Derivative', 'New source identity'], ['Browser', 'Request new pack URL']] }
  ];
  let selected = $state(0);
  const scenario = $derived(scenarios[selected]);
</script>
<div class="mt-8 border-y border-[var(--color-rule)] py-6" data-cache-journey>
  <div class="flex flex-wrap gap-2" role="group" aria-label="Explore cache behavior">
    {#each scenarios as item, i}<button type="button" aria-pressed={selected === i} onclick={() => selected = i} class="min-h-11 rounded-full border border-[var(--color-ink)] px-5 py-2 text-sm font-semibold aria-pressed:bg-[var(--color-ink)] aria-pressed:text-[var(--color-ivory)]">{item.name}</button>{/each}
  </div>
  <div aria-live="polite" aria-atomic="true">
    <ol class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {#each scenario.steps as [name, action], i}<li class="border-t-2 border-[var(--color-ink)] pt-4"><span class="text-xs text-[var(--color-muted)]">0{i + 1}</span><h3 class="mt-3 text-xl font-semibold">{name}</h3><p class="mt-2 text-sm leading-relaxed">{action}</p></li>{/each}
    </ol>
    <p class="mt-6 max-w-[75ch] leading-relaxed">{scenario.explanation}</p>
  </div>
  <p class="mt-4 text-xs text-[var(--color-muted)]">Illustrated request behavior from the release code; no live requests are issued by this diagram.</p>
</div>
