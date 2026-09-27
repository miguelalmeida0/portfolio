<script lang="ts">
  import { onMount } from 'svelte';
  import { correctSelection, receiveLabel } from '$lib/experience/correction-state';
  const storageKey = 'portfolio-mirror-correction-v1';
  let correction = $state('Shark');
  let selection = $state({ id: 'aquarium-subject', revision: 0, modelLabel: 'Bird', correction: '' });
  const saved = $derived(selection.correction);
  const olderResponse = { selectionId: 'aquarium-subject', requestRevision: 0, label: 'Bird' };
  function replay() {
    const result = receiveLabel(selection, olderResponse);
    selection = result.state;
    message = result.accepted ? 'The model response was applied.' : 'An older response returned “Bird”. It was ignored; your correction still owns the label.';
  }
  let message = $state('');
  onMount(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored && stored.length <= 60) { selection = correctSelection(selection, stored); correction = stored; message = 'Your example correction was restored from this browser.'; }
    } catch { /* In-memory correction still works when storage is unavailable. */ }
  });
  function save(event: SubmitEvent) {
    event.preventDefault();
    const value = correction.trim();
    if (!value) { message = 'Enter the corrected label.'; return; }
    selection = correctSelection(selection, value);
    try { localStorage.setItem(storageKey, value); message = 'Correction saved in this browser. The selection geometry is unchanged.'; }
    catch { message = 'Correction applied for this visit. Browser storage is unavailable.'; }
  }
  function reset() {
    selection = { id: 'aquarium-subject', revision: 0, modelLabel: 'Bird', correction: '' }; correction = 'Shark'; message = 'Example reset to the original model label.';
    try { localStorage.removeItem(storageKey); } catch { /* No other browser data is touched. */ }
  }
</script>
<div class="overflow-clip rounded-xl border border-rule bg-ivory">
  <figure>
    <img src="/projects/mirror-ai/aquarium-selection.png" alt="Captured Mirror AI error: a shark is outlined correctly but the inspector labels it Bird." width="1882" height="918" loading="lazy" class="block h-auto w-full" />
    <figcaption class="px-5 pt-3 text-sm leading-relaxed text-muted">Original prototype capture: the outline found the subject; the label says “Bird.”</figcaption>
  </figure>
  <div class="p-5 sm:p-6">
    <p class="label-type text-plum">Interaction study</p>
    <h3 class="mt-3 text-2xl font-bold tracking-[-.03em]">Correct the label. Keep the selection.</h3>
    <p class="mt-2 text-sm leading-relaxed text-muted">This small reproduction shows correction ownership. It saves only this example in your browser; no model runs here.</p>
    <dl class="mt-5 grid grid-cols-2 gap-4 border-y border-rule py-4">
      <div><dt class="text-sm text-muted">Model label</dt><dd class="mt-1 font-semibold">Bird</dd></div>
      <div><dt class="text-sm text-muted">Displayed label</dt><dd class="mt-1 break-words font-semibold text-plum">{saved || selection.modelLabel}</dd></div>
    </dl>
    <form onsubmit={save} class="mt-4">
      <label for="correction-label" class="block text-sm font-semibold">Your correction</label>
      <div class="mt-2 flex flex-wrap gap-3"><input id="correction-label" bind:value={correction} maxlength="60" required class="min-h-12 min-w-0 flex-1 rounded-lg border border-rule bg-paper px-3 text-base" /><button class="action-button hover:bg-ink" type="submit">Save correction</button></div>
    </form>
    <div class="mt-3 flex flex-wrap gap-x-5 gap-y-1">
      <button type="button" disabled={!saved} onclick={replay} class="min-h-11 text-sm text-plum underline underline-offset-4 disabled:text-muted disabled:no-underline disabled:opacity-60">Replay older response</button>
      <button type="button" onclick={reset} class="min-h-11 text-sm text-muted underline underline-offset-4">Reset example</button>
    </div>
    <p role="status" class="mt-2 text-sm leading-relaxed">{message}</p>
  </div>
</div>
