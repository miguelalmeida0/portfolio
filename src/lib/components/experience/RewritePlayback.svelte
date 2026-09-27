<script lang="ts">
  import { untrack } from 'svelte';
  import { animate } from 'motion/mini';
  import { compareText } from '$lib/experience/text-diff';
  import { motionState, prefersReducedMotion } from '$lib/motion/policy';
  let { source, text, revision, showOriginal, onplaying }: {
    source: string; text: string; revision: number; showOriginal: boolean;
    onplaying: (playing: boolean) => void;
  } = $props();
  let phase = $state<'complete' | 'prelude' | 'editing'>('complete');
  let step = $state(-1);
  let timeouts: ReturnType<typeof setTimeout>[] = [];
  const comparison = $derived(compareText(source, text));
  const operations = $derived(comparison.operations.map((operation, index) => ({ ...operation, index })));
  const events = $derived(operations.filter(operation => operation.kind !== 'equal'));
  function clear() { timeouts.forEach(clearTimeout); timeouts = []; }
  export function finish() { clear(); phase = 'complete'; onplaying(false); }
  function schedule(callback: () => void, delay: number) { timeouts.push(setTimeout(callback, delay)); }
  $effect(() => {
    const run = revision, reduced = $motionState.reduced, edits = events;
    untrack(() => {
      clear(); step = -1;
      if (!run || reduced || !edits.length) { finish(); return; }
      phase = 'prelude'; onplaying(true);
      const stepMs = Math.min(180, Math.max(55, 2400 / edits.length));
      edits.forEach((event, index) => schedule(() => { phase = 'editing'; step = event.index; }, 420 + index * stepMs));
      schedule(finish, 420 + edits.length * stepMs + 360);
    });
    return clear;
  });
  function arrive(node: HTMLElement) {
    if (prefersReducedMotion()) return {};
    const animation = animate(node, { opacity: [0.5, 1], filter: ['blur(2px)', 'blur(0px)'] }, { duration: 0.45, ease: [0.22, 1, 0.36, 1] });
    return { destroy: () => animation.stop() };
  }
</script>
<div class="relative flex-1 py-5" data-playback-phase={phase}>
  {#if phase !== 'complete'}
    <div aria-hidden="true" class="absolute inset-x-0 bottom-2 h-px overflow-hidden bg-rule/30"><div class="h-full w-1/3 origin-left bg-plum motion-safe:animate-edit-scan"></div></div>
    <p aria-hidden="true" class="[overflow-wrap:anywhere] whitespace-pre-wrap font-serif text-[clamp(1.5rem,1.05rem+1vw,2rem)] leading-[1.35] tracking-[-.025em]">
      {#each operations as operation (operation.index)}{#if operation.kind === 'equal'}{operation.text}{:else if operation.kind === 'delete'}<span class="transition-colors duration-300 {step >= operation.index ? 'text-muted line-through decoration-plum/70 decoration-2' : ''}">{operation.text}</span>{:else if step >= operation.index}<span use:arrive class="rounded-sm bg-highlight text-ink [box-decoration-break:clone]">{operation.text}</span>{/if}{/each}
    </p>
    <p class="sr-only">Animating the edits. The complete rewrite will be available shortly.</p>
  {:else}
    {#key revision}
      <p use:arrive class="[overflow-wrap:anywhere] whitespace-pre-wrap font-serif text-[clamp(1.5rem,1.05rem+1vw,2rem)] leading-[1.35] tracking-[-.025em]">
        {#each showOriginal ? comparison.original : comparison.rewrite as part}{#if part.changed}<mark class="bg-highlight text-ink [box-decoration-break:clone]">{part.text}</mark>{:else}{part.text}{/if}{/each}
      </p>
    {/key}
  {/if}
</div>
