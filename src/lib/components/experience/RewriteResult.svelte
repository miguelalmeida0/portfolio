<script lang="ts">
  import RewritePlayback from './RewritePlayback.svelte';
  import Copy from '@lucide/svelte/icons/copy';
  import Check from '@lucide/svelte/icons/check';
  import { copyText } from '$lib/experience/motion';
  import { compareText } from '$lib/experience/text-diff';
  import { onDestroy } from 'svelte';
  let { text, source, settings, note, live, revision, busy, pending, playing, onplaying }: {
    text: string; source: string; settings: string; note: string; live: boolean;
    revision: number; busy: boolean; pending: boolean; playing: boolean; onplaying: (playing: boolean) => void;
  } = $props();
  let playback: RewritePlayback;
  let status = $state('');
  let showOriginal = $state(false);
  let timer: ReturnType<typeof setTimeout>;
  const diff = $derived(compareText(source, text));
  $effect(() => { revision; showOriginal = false; status = ''; });
  async function copy() {
    status = await copyText(showOriginal ? source : text) ? 'Copied' : 'Select the text to copy it.';
    clearTimeout(timer); timer = setTimeout(() => status = '', 2500);
  }
  onDestroy(() => clearTimeout(timer));
</script>
<div class="flex h-full min-h-[22rem] flex-col rounded-xl bg-ivory p-5 sm:min-h-[24rem] sm:p-6" aria-busy={busy || playing}>
  <div class="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
    <p class="label-type">{live ? 'Your rewrite' : 'Prepared rewrite'}</p>
    {#if playing}
      <button type="button" onclick={() => playback.finish()} class="min-h-11 text-sm text-plum underline underline-offset-4">Skip animation</button>
    {:else}
      <button type="button" disabled={busy} aria-pressed={showOriginal} onclick={() => showOriginal = !showOriginal} class="min-h-11 text-sm text-plum underline underline-offset-4 disabled:opacity-50">{showOriginal ? 'Show rewrite' : 'Compare original'}</button>
    {/if}
  </div>
  <p class="text-sm text-muted">{settings}</p>
  <RewritePlayback bind:this={playback} {source} {text} {revision} {showOriginal} {onplaying} />
  <p class="text-sm leading-relaxed text-muted">{diff.coarse ? 'Highlighted passages contain changes; long text uses a broader comparison.' : showOriginal ? 'Highlighted words were removed or replaced.' : 'Highlighted words were added or replaced.'}</p>
  {#if note}<p class="mt-2 text-sm leading-relaxed">{note}</p>{/if}
  <div class="mt-3 flex min-h-11 flex-wrap items-center justify-between gap-2 border-t border-rule pt-2 text-sm">
    <p class="text-muted">{busy ? 'Rewriting…' : playing ? 'Playing the edit…' : pending ? 'Settings changed. Update to compare.' : 'Original preserved.'}</p>
    <button type="button" onclick={copy} disabled={busy || playing} class="flex min-h-11 items-center gap-2 rounded px-2 hover:text-plum disabled:opacity-50">
      {status === 'Copied' ? 'Copied' : showOriginal ? 'Copy original' : 'Copy rewrite'}
      {#if status === 'Copied'}<Check aria-hidden="true" size={18} />{:else}<Copy aria-hidden="true" size={18} />{/if}
    </button>
  </div>
  <span role="status" class="sr-only">{status}</span>
</div>
