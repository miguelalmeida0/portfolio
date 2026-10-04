<script lang="ts">
  const scenarios = [
    { label: 'Compatible graph', stages: ['Hash corpus bytes', 'Accept prepared graph', 'Retrieve in worker', 'Accept current request'], title: 'Prepare once. Verify on arrival.', detail: 'The corpus checksum and encoder version match. The worker can load the prepared graph, then return results carrying the current request ID.', state: 'The current query owns the result.', active: 3 },
    { label: 'Changed corpus', stages: ['Hash changed bytes', 'Reject old graph', 'Build graph in worker', 'Accept current request'], title: 'The graph belongs to these bytes.', detail: 'A new corpus means a different checksum. The old snapshot is rejected and the worker builds a compatible graph. Precomputation is an optimization, not a reason to skip identity checks.', state: 'Rebuild before retrieving.', active: 1 },
    { label: 'Older reply', stages: ['Accept compatible graph', 'Start query A, then B', 'Query A returns late', 'Discard stale response'], title: 'Finishing last does not mean winning.', detail: 'Each result carries a request ID. If the user has already started query B, a delayed result from query A must not replace it. The interface checks the active search sequence.', state: 'The latest query keeps ownership.', active: 3 }
  ];
  let selected = $state(0);
  const scenario = $derived(scenarios[selected]);
</script>
<div class="pipeline-model">
  <div class="chips" role="group" aria-label="Search pipeline scenarios">{#each scenarios as item, i}<button class="chip" type="button" aria-pressed={selected === i} onclick={() => selected = i}>{item.label}</button>{/each}</div>
  <div aria-live="polite" aria-atomic="true"><ol class="pipeline">{#each scenario.stages as stage, i}<li class:active={i === scenario.active}><span class="step-number">0{i + 1}</span><strong>{stage}</strong></li>{/each}</ol><div class="pipeline-detail"><h3>{scenario.title}</h3><p>{scenario.detail}</p><p class="decision">{scenario.state}</p></div></div>
  <p class="cap">Interactive model of the release’s compatibility and request checks.</p>
</div>
