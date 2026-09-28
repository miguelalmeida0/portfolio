<script lang="ts">
  import { findProject } from '$lib/experience/projects';
  import FlowProductFilm from '$lib/components/experience/FlowProductFilm.svelte';
  const project = findProject('flow')!;
  const stages = ['Conversation', 'Intent', 'Clarification / confirmation', 'Deterministic action', 'Shared state', 'Editable UI', 'Correction / interrupt / undo'];
</script>

<svelte:head>
  <title>Flow — Conversation becomes editable state | Miguel Almeida</title>
  <meta name="description" content="Voice-first personal computing where conversation directly changes structured life state across Calendar, Journal, Friends and Memories." />
</svelte:head>

<article class="shell pb-16 sm:pb-24">
  <a href="/#work" aria-label="All work" class="ink-link mt-5 text-sm text-muted">← All work</a>
  <header class="pb-8 pt-8 sm:py-12">
    <p class="label-type text-plum">04 · Flow · Voice-first personal computing</p>
    <h1 class="display-type mt-4 max-w-4xl text-[clamp(2.75rem,6vw,5rem)] text-plum">Conversation becomes editable life state.</h1>
    <p class="mt-5 max-w-2xl font-serif text-xl leading-relaxed">A changed day. An intention with a next step. A promise connected to a person. The result lives in the product, ready to change again.</p>
  </header>

  <figure class="overflow-clip rounded-xl bg-sage">
    <FlowProductFilm />
  </figure>

  <section id="architecture" class="border-b border-rule py-10 sm:py-14">
    <p class="label-type mb-4 text-plum">The interaction model</p>
    <h2 class="max-w-3xl font-serif text-3xl leading-tight">A sentence has consequences you can inspect.</h2>
    <p id="context" class="mt-5 max-w-prose text-lg leading-relaxed">{project.problem}</p>
    <ol class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {#each stages as stage, i}
        <li class="border-t border-rule pt-4"><span class="label-type text-muted">0{i + 1}</span><p class="mt-2 font-medium">{stage}</p></li>
      {/each}
    </ol>
  </section>

  <section class="grid gap-8 py-10 sm:py-14 min-[51.25rem]:grid-cols-[1fr_2fr]">
    <div><p class="label-type text-plum">Design and engineering</p><p class="mt-4 text-sm leading-relaxed text-muted">{project.role}<br />{project.stack.join(' · ')}</p></div>
    <div id="decisions"><p class="text-lg leading-relaxed">{project.contribution}</p>
      {#each project.decisions as decision}
        <div data-decision-item class="mt-9"><h3 class="font-serif text-2xl">{decision.title}</h3><p class="mt-4 leading-relaxed">{decision.detail}</p><p class="mt-4 border-l-2 border-plum/35 pl-4 text-sm leading-relaxed text-muted">{decision.tradeoff}</p></div>
      {/each}
    </div>
  </section>

  <section id="outcome" class="rounded-xl bg-sage p-6 sm:p-9">
    <p class="label-type mb-4 text-plum">Product behavior</p>
    <p class="max-w-3xl font-serif text-2xl leading-relaxed">{project.outcome}</p>
    <p class="mt-6 max-w-prose border-t border-rule pt-5 text-sm leading-relaxed text-muted">{project.limitation}</p>
  </section>
  <a href="/work/mirror-ai" aria-label="Next case study Mirror AI" class="ink-link mt-12 text-xl">05 · Mirror AI →</a>
</article>
