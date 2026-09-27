<script lang="ts">
  let expired = $state(false);
  let inspected = $state(false);
</script>
<div class="rounded-xl border border-rule bg-ivory p-5 sm:p-6">
  <p class="label-type text-plum">Interaction study</p>
  <h3 class="mt-3 text-2xl font-bold tracking-[-.03em]">When information expires.</h3>
  <p class="mt-2 text-sm leading-relaxed text-muted">A simplified, fictional observation. No live incident or route data.</p>
  <div class="mt-5 flex flex-wrap items-center justify-between gap-3 border-y border-rule py-4">
    <div><p class="font-semibold">Road access observation</p><p class="mt-1 text-sm text-muted">Source: demonstration feed · Updated {expired ? '22' : '2'} minutes ago</p></div>
    <span class="rounded-full border px-3 py-1 text-sm font-semibold {expired ? 'border-plum text-plum' : 'border-forest text-forest'}">{expired ? 'Expired' : 'Current'}</span>
  </div>
  <p class="mt-4 text-base leading-relaxed" role="status">{expired ? 'The last observation remains visible, but its age makes it insufficient for a new decision.' : inspected ? 'Observation inspected in this example. A current timestamp alone does not certify a safe route.' : 'The source and age are visible before the observation can be inspected.'}</p>
  <div class="mt-4 flex flex-wrap gap-3">
    <button type="button" disabled={expired} onclick={() => inspected = true} class="action-button hover:bg-ink disabled:bg-rule/30 disabled:text-muted">Inspect current observation</button>
    <button type="button" onclick={() => { expired = !expired; inspected = false; }} class="min-h-12 rounded-lg border border-rule px-4 text-sm font-semibold text-plum hover:bg-sage">{expired ? 'Restore current example' : 'Advance 20 minutes'}</button>
  </div>
  <p class="mt-3 text-sm leading-relaxed text-muted">This study uses a 15-minute expiry to show the transition. It does not specify the product’s source-specific freshness policy.</p>
</div>
