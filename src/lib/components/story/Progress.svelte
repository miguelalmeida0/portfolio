<script lang="ts">
  import { onMount } from "svelte";
  import data from '$lib/story/story.json';
  import { format } from '$lib/story/reading';
  let { current, go, ready }: { current: number; go: (index: number) => void; ready: boolean } = $props();
  let open = $state(false);
  let trigger: HTMLButtonElement;
  let dock: HTMLElement;
  function choose(index: number) { open = false; go(index); }
  onMount(() => {
    const outside = (event: PointerEvent) => { if (!dock.contains(event.target as Node)) open = false; };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape" && open) { open = false; trigger.focus(); } };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  });
  const complete = $derived(current === 8);
  const label = $derived(format(complete ? data.progress.done : current === 7 ? data.progress.last : data.progress.format, { n: current + 1, total: 8, left: 7 - current }));
</script>
<nav bind:this={dock} class="story-progress" aria-label="Story navigation">
  <a class="story-home" href="/#top"><span aria-hidden="true">←</span> Home</a>
  <button bind:this={trigger} class="chapter-trigger" aria-expanded={open} aria-controls="story-chapters" onclick={() => open = !open} disabled={!ready} aria-label="Choose a chapter">
  <span class="story-ring" class:complete data-story-ring data-complete={complete || undefined} aria-hidden="true">
    <svg viewBox="0 0 64 64"><circle class="ring-bg" cx="32" cy="32" r="26" /><circle class="ring-line" cx="32" cy="32" r="26" stroke-dasharray="163.4" stroke-dashoffset={163.4 * (1 - current / 8)} /><circle class="ring-disc" cx="32" cy="32" r="29" /><path class="ring-check" d="M21 33 l7 7 l15 -16" /></svg>
    <span class="ring-count" data-story-ring-count>{current}/8</span><span class="ring-burst">{#each Array(12) as _, i}<i style:--angle={i * 30 + 'deg'}></i>{/each}</span>
  </span>
  <span class="chapter-label"><small>{complete ? "The short version" : `Chapter ${current + 1} of 8`}</small><strong>{complete ? "Your takeaway" : data.questions[current].question}</strong></span><span aria-hidden="true" class:expanded={open}>⌃</span>
  </button>
  <div class="chapter-steps"><button disabled={!ready || current === 0} onclick={() => choose(current - 1)} aria-label="Previous chapter">↑</button><button disabled={!ready || complete} onclick={() => choose(current + 1)} aria-label="Next chapter">↓</button></div>
  <span class="sr-only" data-story-progress role="status" aria-live="polite">{label}</span>
  <div id="story-chapters" class="chapter-list" hidden={!open}><p>Explore the story</p>{#each data.questions as question, i}<button onclick={() => choose(i)} aria-current={current === i ? "step" : undefined}><span>{String(i + 1).padStart(2, "0")}</span>{question.question}</button>{/each}<button onclick={() => choose(8)} aria-current={complete ? "step" : undefined}><span>✓</span>The short version</button></div>
</nav>
