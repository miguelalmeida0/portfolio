<script lang="ts">
  import { originalDraft, sampleFor } from '$lib/experience/samples';
  import { compareText } from '$lib/experience/text-diff';
  let concise = $state(false);
  const rewrite = $derived(sampleFor(concise ? 'Hemingway' : 'Tolkien', 'Balanced'));
  const diff = $derived(compareText(originalDraft, rewrite));
</script>
<div class="rounded-xl border border-rule bg-ivory p-5 sm:p-6">
  <p class="label-type text-plum">Prepared comparison</p>
  <h3 class="mt-3 text-2xl font-bold tracking-[-.03em]">Change the cadence. Keep the facts.</h3>
  <div class="mt-5 grid gap-5 sm:grid-cols-2">
    <div><p class="mb-2 text-sm font-semibold">Original</p><p class="font-sans text-xl leading-relaxed">{originalDraft}</p></div>
    <div><p class="mb-2 text-sm font-semibold">{concise ? 'Hemingway' : 'Tolkien'} · Balanced</p><p class="font-sans text-xl leading-relaxed">{#each diff.rewrite as part}{#if part.changed}<mark class="bg-highlight text-ink">{part.text}</mark>{:else}{part.text}{/if}{/each}</p></div>
  </div>
  <button type="button" onclick={() => concise = !concise} class="mt-5 min-h-12 rounded-lg border border-plum px-4 text-sm font-semibold text-plum hover:bg-sage">{concise ? 'Compare a longer cadence' : 'Compare shorter sentences'}</button>
  <p class="mt-3 text-sm leading-relaxed text-muted">Both examples retain Elias, the last lamp, the recurring winter darkness and the twenty-year absence. Highlighting comes from a word comparison.</p>
</div>
