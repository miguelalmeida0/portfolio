<script lang="ts">
  import { onDestroy } from 'svelte';
  import { authors, strengths, originalDraft, sampleFor, noteFor, type Author, type Strength } from '$lib/experience/samples';
  import RewritePlayback from '../../RewritePlayback.svelte';
  import { copyText } from '$lib/experience/motion';
  let author = $state<Author>('Tolkien');
  let strength = $state<Strength>('Balanced');
  let submitted = $state<`${Author}-${Strength}`>('Tolkien-Balanced');
  let applied = $state(true);
  let copied = $state('');
  let playing = $state(false);
  let showOriginal = $state(false);
  let revision = $state(0);
  let playback: RewritePlayback;
  let copyTimer: ReturnType<typeof setTimeout>;
  let copyRequest = 0;
  let alive = true;
  const id = $props.id();
  const settings = $derived(submitted.split('-') as [Author, Strength]);
  const result = $derived(sampleFor(...settings));
  function resetCopy() { copyRequest++; clearTimeout(copyTimer); copied = ''; }
  function changed() { playback?.finish(); applied = false; showOriginal = false; resetCopy(); }
  function selectAuthor(next: Author) { changed(); author = next; }
  function selectStrength(next: Strength) { changed(); strength = next; }
  function apply() {
    if (playing) return;
    submitted = `${author}-${strength}`;
    applied = true;
    showOriginal = false;
    resetCopy();
    playing = true;
    revision += 1;
  }
  async function copy() {
    const request = ++copyRequest;
    const success = await copyText(showOriginal ? originalDraft : result);
    if (!alive || request !== copyRequest) return;
    copied = success ? 'Copied' : 'Select the text to copy it.';
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => copied = '', 2500);
  }
  onDestroy(() => { alive = false; resetCopy(); });
  function tabKey(event: KeyboardEvent, index: number) {
    const next = event.key === 'ArrowRight' ? (index + 1) % authors.length : event.key === 'ArrowLeft' ? (index + authors.length - 1) % authors.length : event.key === 'Home' ? 0 : event.key === 'End' ? authors.length - 1 : -1;
    if (next < 0) return;
    event.preventDefault(); selectAuthor(authors[next]); document.getElementById(`${id}-${authors[next]}`)?.focus();
  }
</script>
<div class="stage-card card-a">
  <div class="card-top"><h4><span data-ask-id="draft">Your draft</span></h4><span>Prepared example</span></div>
  <p class="draft">{originalDraft}</p>
  <div class="controls">
    <div role="tablist" aria-label="Author voice" class="authors">
      {#each authors as name, index}<button id={`${id}-${name}`} type="button" role="tab" aria-selected={author === name} aria-controls={`${id}-rewrite`} tabindex={author === name ? 0 : -1} onclick={() => selectAuthor(name)} onkeydown={event => tabKey(event,index)}>{name}</button>{/each}
    </div>
    <fieldset><legend class="sr-only">Strength</legend><div class="strengths">
      {#each strengths as value}<label class:chosen={strength === value}><input type="radio" name={`${id}-strength`} checked={strength === value} onchange={() => selectStrength(value)} value={value} /><span>{value}</span></label>{/each}
    </div></fieldset>
    <button class="apply" type="button" disabled={playing} onclick={apply}>{playing ? 'Playing the edit…' : applied ? 'Regenerate' : `Show ${author} example`}</button>
  </div>
</div>
<div class="stage-card card-b" role="tabpanel" id={`${id}-rewrite`} aria-labelledby={`${id}-${author}`} tabindex="0" aria-busy={playing}>
  <div class="card-top"><h4><span data-ask-id="rewrite">Prepared rewrite</span></h4>
    {#if playing}<button class="compare" type="button" onclick={() => playback.finish()}>Skip animation</button>
    {:else}<button class="compare" type="button" aria-pressed={showOriginal} onclick={() => { showOriginal = !showOriginal; resetCopy(); }}>{showOriginal ? 'Show rewrite' : 'Compare original'}</button>{/if}
  </div>
  <p class="submitted">{submitted.replace('-', ' · ')}</p>
  <RewritePlayback bind:this={playback} source={originalDraft} text={result} {revision} {showOriginal} onplaying={value => playing = value} />
  <div class="note"><p>{playing ? 'Playing the edit…' : !applied ? 'Press the button to apply this voice.' : showOriginal ? 'Highlighted words were removed or replaced.' : 'Highlighted words were added or replaced.'}</p>{#if applied && !playing}<p>{noteFor(...settings)}</p>{/if}</div>
  <div class="result-footer"><span>Original preserved.</span><button type="button" disabled={playing} onclick={copy}>{copied === 'Copied' ? 'Copied' : showOriginal ? 'Copy original' : 'Copy rewrite'}</button></div>
  <p role="status" class="sr-only">{copied}</p>
  <p role="status" class="sr-only">{revision && !playing && applied ? `Rewrite updated (${revision}): ${submitted.replace('-', ', ')}.` : ''}</p>
</div>
<style>
  .card-top { display: flex; justify-content: space-between; gap: 10px; align-items: center; }
  h4 { font: 700 15px/1.3 var(--hero-font); }
  .card-top > span, .submitted { font: 400 10px/1.5 var(--hero-font); color: var(--muted); }
  .draft { margin-top: 24px; font: 400 20px/1.45 var(--hero-font); }
  .controls { margin-top: auto; padding-top: 24px; }
  .authors { display: flex; flex-wrap: wrap; gap: 0 12px; border-bottom: 1px solid var(--rule-ink); }
  .authors button { min-height: 44px; padding: 8px 0; border-bottom: 2px solid transparent; font-size: 12px; cursor: pointer; }
  .authors button[aria-selected='true'] { border-color: var(--plum); font-weight: 700; }
  fieldset { margin-top: 18px; }
  .strengths { display: flex; padding: 3px; border-radius: 999px; background: rgba(20,42,34,.06); }
  .strengths label { flex: 1; position: relative; text-align: center; padding: 10px 2px; border-radius: 999px; font-size: 12px; cursor: pointer; }
  .strengths input { position: absolute; opacity: 0; width: 100%; height: 100%; inset: 0; cursor: pointer; }
  .strengths label:has(:focus-visible) { outline: 3px solid var(--plum); outline-offset: 2px; }
  .chosen { background: var(--paper); font-weight: 700; }
  .apply { display: flex; justify-content: space-between; align-items: center; width: 100%; min-height: 50px; margin-top: 18px; padding: 10px 16px; border-radius: 999px; background: var(--plum); color: var(--paper); font-size: 13px; font-weight: 700; cursor: pointer; }
  .submitted { margin-top: 10px; }
  .compare { min-height: 44px; font-size: 11px; text-decoration: underline; text-underline-offset: 3px; cursor: pointer; }
  button:disabled { cursor: wait; opacity: .65; }
  .note { margin-top: auto; padding-top: 20px; font: 400 11px/1.6 var(--hero-font); color: var(--muted); }
  .note p + p { margin-top: 10px; }
  .result-footer { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 4px 8px; margin-top: 18px; padding-top: 10px; border-top: 1px solid var(--rule-ink); font-size: 11px; }
  .result-footer button { min-height: 44px; text-decoration: underline; text-underline-offset: 3px; cursor: pointer; }
  @media (max-width: 767px) {
    .draft { margin-top: 14px; font-size: 18px; line-height: 1.35; }
    .controls { padding-top: 12px; }
    .authors { justify-content: space-between; gap: 4px; }
    fieldset, .apply { margin-top: 10px; }
    .note { padding-top: 14px; }
    .result-footer { margin-top: 12px; padding-top: 0; }
  }
</style>
