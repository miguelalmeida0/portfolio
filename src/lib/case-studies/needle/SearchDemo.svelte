<script lang="ts">
  import data from './examples.json';
  import { destinationLink } from '$lib/navigation/destination-link';
  let selected = $state(0);
  let resultIndex = $state(0);
  let failed = $state<string[]>([]);
  const example = $derived(data.examples[selected]);
  const artwork = $derived(example.artworks[resultIndex]);
  function choose(index: number) { selected = index; resultIndex = 0; }
</script>

<section class="frame search-demo" id="try" aria-label="Explore a Needle search" data-needle-demo>
  <div class="demo-toolbar"><span class="demo-name">Needle <span class="quiet">/ Collection search</span></span><span class="small-label">10,000 Met artworks</span></div>
  <div class="query-controls" role="group" aria-label="Prepared search queries">
    {#each data.examples as item, i}<button type="button" class="chip" aria-pressed={selected === i} onclick={() => choose(i)}>{item.query}</button>{/each}
  </div>
  <div class="search-layout">
    <div class="results-panel">
      <div class="panel-heading"><h2>Four results to explore</h2><span class="small-label">Select an artwork</span></div>
      <div class="artwork-grid" aria-label="Search results">
        {#each example.artworks as item, i (item.id)}
          <button type="button" class="artwork-card" aria-pressed={resultIndex === i} onclick={() => resultIndex = i} aria-label={`Inspect ${item.title}`}>
            <span class="artwork-image"><span class="rank">{i + 1}</span>{#if item.image && !failed.includes(item.id)}<img src={item.image} alt="" width="420" height="520" loading="eager" onerror={() => failed = [...failed, item.id]} />{:else}<span class="image-unavailable">Image unavailable</span>{/if}</span>
            <span class="artwork-title">{item.title}</span><span class="artwork-artist">{item.artist}</span>
          </button>
        {/each}
      </div>
    </div>
    <aside class="inspector" aria-label="Selected artwork" aria-live="polite" aria-atomic="true">
      <p class="eyebrow">A result, with its source</p>
      <div class="inspector-image">{#if artwork.image && !failed.includes(artwork.id)}<img src={artwork.image} alt={artwork.title} width="420" height="520" onerror={() => failed = [...failed, artwork.id]} />{:else}<p>Image unavailable. The museum record is still available below.</p>{/if}</div>
      <h3>{artwork.title}</h3><p class="artist">{artwork.artist} · {artwork.date}</p>
      <dl><dt>Medium</dt><dd>{artwork.medium}</dd><dt>Collection</dt><dd>{artwork.department}</dd></dl>
      <a class="tlink" href={artwork.objectUrl} {...destinationLink(artwork.objectUrl)}>View the Met record ↗</a>
    </aside>
  </div>
  <div class="query-route" aria-label="Search path"><span>Metadata query</span><span aria-hidden="true">→</span><span>Hybrid retrieval</span><span aria-hidden="true">→</span><span>Ranked IDs</span><span aria-hidden="true">→</span><span class="route-final">Visible artwork</span></div>
</section>
<p class="cap">Prepared searches from Needle’s released engine and 10,000-record corpus. Select a query and inspect its results.</p>
