<script lang="ts">
  import { onDestroy } from 'svelte';
  import { autoGrow } from '$lib/experience/textarea';
  import { env } from '$env/dynamic/public';
  import ArrowRight from '@lucide/svelte/icons/arrow-right';
  import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
  import { originalDraft, sampleFor, noteFor, type Author, type Strength } from '$lib/experience/samples';
  import { VoiceBridge, SECOND_VOICE_URL } from '$lib/experience/voice-bridge';
  import { copyText } from '$lib/experience/motion';
  import VoiceControls from './VoiceControls.svelte';
  import RewriteResult from './RewriteResult.svelte';
  let author = $state<Author>('Tolkien');
  let strength = $state<Strength>('Balanced');
  let customDraft = $state(originalDraft);
  let mode = $state<'sample' | 'live'>('sample');
  let submitted = $state({ author: 'Tolkien' as Author, strength: 'Balanced' as Strength, source: originalDraft, live: false });
  let result = $state(sampleFor('Tolkien', 'Balanced'));
  let playing = $state(false);
  let busy = $state(false), error = $state(''), announcement = $state(''), copyStatus = $state('');
  let revision = $state(0), remaining = $state<number | null>(null);
  let bridge: VoiceBridge | undefined;
  let alive = true;
  const id = $props.id();
  const liveConfigured = env.PUBLIC_SECOND_VOICE_EMBED_ENABLED === 'true';
  const source = $derived(mode === 'sample' ? originalDraft : customDraft);
  const pending = $derived(author !== submitted.author || strength !== submitted.strength || source !== submitted.source || (mode === 'live') !== submitted.live);
  const note = $derived(submitted.live ? 'Review the rewrite before using it; a live model can change meaning.' : noteFor(submitted.author, submitted.strength));
  onDestroy(() => { alive = false; bridge?.destroy(); });

  async function rewrite(event: SubmitEvent) {
    event.preventDefault();
    if (busy || playing) return;
    error = ''; announcement = '';
    const request = { author, strength, source: source.trim(), live: mode === 'live' };
    if (!request.source) { error = 'Add a few words before rewriting.'; return; }
    if (request.source.length > 2000) { error = 'Keep this passage under 2,000 characters.'; return; }
    if (!request.live) {
      result = sampleFor(request.author, request.strength);
    } else {
      if (!liveConfigured) { error = 'Use the full app to rewrite your own text.'; return; }
      busy = true;
      try {
        bridge ??= new VoiceBridge();
        const response = await bridge.rewrite({ text: request.source, author: author === 'King' ? 'stephenking' : author.toLowerCase(), mood: { Subtle: 20, Balanced: 50, Strong: 80 }[strength] });
        if (!alive) return;
        result = response.text; remaining = response.remaining;
      } catch (caught) {
        if (alive) error = caught instanceof Error ? caught.message : 'The connection failed. Your draft is unchanged.';
        return;
      } finally { if (alive) busy = false; }
    }
    submitted = request; revision++;
    announcement = '';
    playing = true;
  }
  function playbackChanged(value: boolean) {
    playing = value;
    if (!value && revision) announcement = `${submitted.author}, ${submitted.strength.toLowerCase()} ${submitted.live ? 'rewrite' : 'prepared example'} ready.`;
  }
  async function copyDraft() { copyStatus = await copyText(source) ? 'Draft copied. Paste it into Second Voice.' : 'Select your draft and copy it manually.'; }
</script>
<div>
  <div class="grid items-stretch gap-5 min-[51.25rem]:grid-cols-2">
    <section id={id+'-panel-draft'} aria-label="Draft">
      <form onsubmit={rewrite} class="flex h-full min-h-[22rem] flex-col rounded-xl bg-sage/80 p-5 sm:min-h-[24rem] sm:p-6">
        <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 class="text-[1.75rem] font-bold tracking-[-.035em]">Your draft.</h3>
          <span id={id+'-mode'} class="rounded-md bg-ivory/65 px-3 py-1 text-sm text-muted">{mode === 'sample' ? 'Prepared example' : 'Live rewrite'}</span>
        </div>
        {#if mode === 'sample'}
          <p class="flex-1 font-serif text-[clamp(1.125rem,1rem+.5vw,1.5rem)] leading-[1.5] tracking-[-.015em]">{originalDraft}</p>
        {:else}
          <label class="sr-only" for={id+'-draft'}>Your draft</label>
          <textarea use:autoGrow id={id+'-draft'} aria-describedby={id+'-mode'} bind:value={customDraft} maxlength="2000" rows="4" class="min-h-28 w-full flex-1 resize-none rounded-sm bg-transparent font-serif text-xl leading-relaxed" disabled={busy || playing}></textarea>
        {/if}
        <div class="mt-4 border-t border-rule pt-3"><VoiceControls bind:author bind:strength disabled={busy || playing} /></div>
        <button type="submit" disabled={busy || playing} class="action-button group mt-3 w-full gap-3 px-3 hover:bg-ink active:scale-[.985] disabled:opacity-65">
          {busy ? 'Connecting…' : playing ? 'Playing the edit…' : mode === 'sample' ? 'Show ' + author + ' example' : 'Rewrite as ' + author}<ArrowRight aria-hidden="true" size={21} class="shrink-0 transition-transform group-hover:translate-x-1" />
        </button>
        <p class="mt-3 text-sm leading-relaxed text-muted">{mode === 'sample' ? 'Written examples. Choose a voice and strength to compare.' : remaining !== null ? `${remaining} rewrites remaining.` : 'Live generation uses the service’s access and quota limits.'}</p>
        {#if liveConfigured}<button type="button" disabled={busy || playing} onclick={() => { mode = mode === 'sample' ? 'live' : 'sample'; error = ''; }} class="mt-2 min-h-11 text-left text-sm text-plum underline underline-offset-4">{mode === 'sample' ? 'Rewrite your own text here' : 'Return to the prepared example'}</button>{/if}
      </form>
    </section>
    <section id={id+'-panel-result'} aria-label="Result">
      <RewriteResult text={result} source={submitted.source} settings={`${submitted.author} · ${submitted.strength}`} live={submitted.live} {note} {revision} {busy} {pending} {playing} onplaying={playbackChanged} />
    </section>
  </div>
  <div class="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
    <a href={SECOND_VOICE_URL} target="_blank" rel="noopener noreferrer" class="ink-link text-plum underline">Rewrite your own text in the full app <ArrowUpRight aria-hidden="true" size={17} /></a>
    <button type="button" onclick={copyDraft} class="min-h-11 text-muted underline underline-offset-4">Copy this draft</button>
    <span role="status" class="text-muted">{copyStatus}</span>
  </div>
  {#if error}<div role="alert" class="mt-3 rounded-lg border border-plum/30 bg-ivory p-4 text-sm leading-relaxed"><p>{error}</p><p class="mt-2">Your draft and previous result are preserved. Copy the draft above to continue in the full app.</p></div>{/if}
  <p class="sr-only" role="status" aria-live="polite">{announcement}</p>
</div>
