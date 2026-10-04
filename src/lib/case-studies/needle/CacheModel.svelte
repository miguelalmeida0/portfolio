<script lang="ts">
  const scenarios = [
    { name: 'First visit', explanation: 'A prepared graph saves construction, not transfer. The browser still loads the corpus and checks compatibility. An uncached derivative needs a transform.', steps: [['Corpus', 'Download & hash'], ['Graph', 'Load compatible snapshot'], ['Derivative', 'Read disk or generate'], ['Browser', 'Store the response']] },
    { name: 'Repeat visit', explanation: 'Corpus and graph revalidate. A matching ETag can return 304. A fresh immutable local-image response can be reused without contacting the server.', steps: [['Corpus', 'Revalidate bytes'], ['Graph', 'Check corpus identity'], ['Derivative', 'Reuse matching key'], ['Browser', 'Reuse while fresh']] },
    { name: 'New corpus', explanation: 'Changing the corpus changes its checksum. The old graph cannot be reused. Local artwork must move to a new versioned pack URL; a server fingerprint cannot evict a fresh browser response at the old URL.', steps: [['Corpus', 'New checksum'], ['Graph', 'New snapshot or rebuild'], ['Derivative', 'New source identity'], ['Browser', 'Request new pack URL']] }
  ];
  let selected = $state(0);
  const scenario = $derived(scenarios[selected]);
</script>
<div class="cache-model" data-cache-journey>
  <div class="chips" role="group" aria-label="Explore cache behavior">{#each scenarios as item, i}<button type="button" class="chip" aria-pressed={selected === i} onclick={() => selected = i}>{item.name}</button>{/each}</div>
  <div aria-live="polite" aria-atomic="true"><ol class="pipeline">{#each scenario.steps as [name, action], i}<li><span class="step-number">0{i + 1}</span><h3>{name}</h3><p>{action}</p></li>{/each}</ol><p class="cache-explanation">{scenario.explanation}</p></div>
  <p class="cap">Illustrated request behavior from the release code. This diagram issues no live requests.</p>
</div>
