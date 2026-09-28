<script lang="ts">
  import ArrowRight from '@lucide/svelte/icons/arrow-right';
  import { findProject } from '$lib/experience/projects';
  import { projectSystems } from '$lib/experience/project-systems';
  import FlowProductFilm from '$lib/components/experience/FlowProductFilm.svelte';
  import ProjectArchitecture from '$lib/components/experience/ProjectArchitecture.svelte';
  import LinkButton from '$lib/components/experience/LinkButton.svelte';

  const project = findProject('flow')!;
  const system = projectSystems.flow;

  const stages = [
    ['01', 'Hear', 'Speech becomes input, not authority.'],
    ['02', 'Resolve', 'Use route, selection, recent references and the current time scope.'],
    ['03', 'Clarify', 'Ask when the target or consequence is genuinely ambiguous.'],
    ['04', 'Protect', 'Confirm consequential changes and preserve explicit constraints.'],
    ['05', 'Transact', 'Apply typed actions to a draft and validate the result before commit.'],
    ['06', 'Render', 'Show the same state in Calendar, Journal, Friends or Memories.'],
    ['07', 'Recover', 'Correct, interrupt, undo or redo without inventing a second source of truth.']
  ];

  const proof = [
    ['120', 'unit & integration test files', 'State, parsing, context, recovery and feature behavior in the current Flow repository.'],
    ['32', 'Playwright journey specs', 'Cross-surface behavior, responsive states, motion, recovery and voice journeys.'],
    ['14', 'commands in one voice acceptance journey', 'One continuous automated recognition session from navigation through edits, commitments, undo, redo and pause.']
  ];
</script>

<svelte:head>
  <title>Flow — Voice that changes real product state | Miguel Almeida</title>
  <meta
    name="description"
    content="Flow is a React and TypeScript voice-first product where conversation resolves into validated actions across Calendar, Journal, Friends and Memories."
  />
</svelte:head>

<article class="shell pb-16 sm:pb-24">
  <a href="/#work" aria-label="All work" class="ink-link mt-5 text-sm text-muted">← All work</a>

  <header class="border-b border-rule pb-8 pt-8 sm:pb-10 sm:pt-10">
    <p class="label-type text-plum">04 · Flow · Voice-first personal computing</p>
    <h1 class="display-type mt-4 max-w-5xl text-[clamp(2.75rem,6vw,5rem)] text-plum">
      Voice that can actually change your day.
    </h1>
    <p class="mt-5 max-w-3xl font-serif text-[clamp(1.35rem,2.5vw,2rem)] leading-[1.3] tracking-[-.025em]">
      Tell Flow you are running late, need to renew your passport, or promised Maya a proposal. It does not open a chatbot. It changes the product — and leaves the result there for you to inspect, edit or undo.
    </p>

    <section aria-label="Flow stack" class="mt-8 border-y border-rule py-6">
      <p class="label-type text-muted">Built with</p>
      <ul data-flow-stack class="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-[clamp(1.05rem,2vw,1.45rem)] font-bold tracking-[-.025em]">
        {#each project.stack as item}
          <li>{item}</li>
        {/each}
      </ul>
    </section>

    <div class="mt-6 grid gap-6 text-sm sm:grid-cols-2">
      <div>
        <p class="label-type mb-2 text-muted">My scope</p>
        <p class="max-w-prose leading-relaxed">{project.role}</p>
      </div>
      <div>
        <p class="label-type mb-2 text-muted">Product surface</p>
        <p class="max-w-prose leading-relaxed">Calendar · Journal · Friends · Memories · Plans · shared voice runtime</p>
      </div>
    </div>

    {#if project.live || project.source}
      <div class="mt-7 flex flex-wrap items-center gap-x-8 gap-y-2">
        {#if project.live}<LinkButton href={project.live.href} label={project.live.label} external />{/if}
        {#if project.source}<LinkButton href={project.source} label="View source" external secondary />{/if}
      </div>
    {/if}
  </header>

  <figure class="mt-8 overflow-clip rounded-xl bg-sage">
    <FlowProductFilm />
  </figure>

  <div class="mt-10 grid gap-10 min-[60rem]:grid-cols-[1fr_2.3fr] min-[60rem]:gap-16">
    <nav aria-label="Flow case study sections" class="flex h-fit flex-wrap gap-x-6 gap-y-1 border-y border-rule py-3 text-sm min-[60rem]:sticky min-[60rem]:top-6 min-[60rem]:flex-col min-[60rem]:border-b-0">
      {#each [
        ['context', 'The hard part'],
        ['architecture', 'Architecture & tools'],
        ['decisions', 'Key decisions'],
        ['proof', 'Verification'],
        ['outcome', 'Outcome']
      ] as [id, label]}
        <a href={'#' + id} class="ink-link justify-between border-plum hover:text-plum">{label}<ArrowRight aria-hidden="true" size={15} /></a>
      {/each}
    </nav>

    <div>
      <section id="context" class="scroll-mt-8 border-b border-rule pb-10 sm:pb-14">
        <p class="label-type mb-4 text-plum">The hard part</p>
        <h2 class="max-w-3xl font-serif text-[clamp(1.65rem,3vw,2.75rem)] leading-tight tracking-[-.025em]">
          The hard part is not speech recognition.
        </h2>
        <p class="mt-5 max-w-prose text-lg leading-relaxed">{project.problem}</p>

        <div class="mt-8 border-l-2 border-plum pl-5 sm:pl-7">
          <p class="label-type text-muted">One request, end to end</p>
          <p class="mt-3 font-serif text-2xl leading-snug">“I’m 35 minutes behind. Keep dinner.”</p>
          <p class="mt-4 max-w-prose leading-relaxed">
            Flow turns that sentence into constraints, works out what can move, protects the dinner anchor, validates the changed schedule, commits one transaction and leaves the calendar editable.
          </p>
        </div>

        <ol aria-label="Flow interaction model" class="mt-10 grid border-y border-rule sm:grid-cols-2">
          {#each stages as stage}
            <li class="grid grid-cols-[2.25rem_1fr] gap-3 border-b border-rule/60 py-5 pr-4 last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0">
              <span class="font-serif text-sm text-plum">{stage[0]}</span>
              <div>
                <h3 class="font-bold">{stage[1]}</h3>
                <p class="mt-1 text-sm leading-relaxed text-muted">{stage[2]}</p>
              </div>
            </li>
          {/each}
        </ol>
      </section>

      <ProjectArchitecture {system} />

      <section id="decisions" class="scroll-mt-8 border-b border-rule py-10 sm:py-14">
        <p class="label-type mb-7 text-plum">Decisions that shaped the product</p>
        <p class="mb-10 max-w-prose text-lg leading-relaxed">{project.contribution}</p>
        {#each project.decisions as decision, index}
          <div data-decision-item class="mb-10 grid grid-cols-[2rem_1fr] gap-3 last:mb-0 sm:gap-6">
            <span class="pt-1 font-serif text-xl text-plum">0{index + 1}</span>
            <div>
              <h3 class="text-2xl font-bold leading-tight tracking-[-.03em] sm:text-3xl">{decision.title}</h3>
              <p class="mt-4 max-w-prose text-base leading-relaxed sm:text-lg">{decision.detail}</p>
              <p class="mt-4 border-l-2 border-plum/35 pl-4 text-sm leading-relaxed text-muted">
                <span class="font-semibold text-ink">The tradeoff.</span> {decision.tradeoff}
              </p>
            </div>
          </div>
        {/each}
      </section>

      <section id="proof" class="scroll-mt-8 border-b border-rule py-10 sm:py-14">
        <p class="label-type mb-4 text-plum">Verification, not theatre</p>
        <h2 class="max-w-3xl text-3xl font-bold tracking-[-.035em] sm:text-4xl">
          The repo is built like a product, not a voice demo.
        </h2>
        <p class="mt-5 max-w-prose text-base leading-relaxed sm:text-lg">
          The interesting failure modes are not visual. They are stale context, the wrong target, a partial transaction, a duplicate command, or an undo that only fixes the screen. Flow has explicit tests around those boundaries.
        </p>

        <dl aria-label="Flow engineering proof" class="mt-8 grid border-y border-rule sm:grid-cols-3">
          {#each proof as item}
            <div class="border-b border-rule/60 py-6 pr-5 last:border-b-0 sm:border-b-0 sm:border-l sm:pl-5 sm:first:border-l-0 sm:first:pl-0">
              <dt class="display-type text-4xl text-plum sm:text-5xl">{item[0]}</dt>
              <dd class="mt-2 font-bold leading-tight">{item[1]}</dd>
              <dd class="mt-2 text-sm leading-relaxed text-muted">{item[2]}</dd>
            </div>
          {/each}
        </dl>

        <p class="mt-5 max-w-prose text-sm leading-relaxed text-muted">
          Those numbers describe the current repository structure. The automated voice journey injects transcripts into the production action pipeline; physical microphone quality is a separate acceptance gate.
        </p>
      </section>

      <section id="outcome" class="scroll-mt-8 mt-10 rounded-xl bg-sage p-6 sm:mt-14 sm:p-9">
        <p class="label-type mb-4 text-plum">The outcome</p>
        <h2 class="max-w-3xl font-serif text-2xl leading-snug tracking-[-.025em] sm:text-3xl">{project.outcome}</h2>
        <p class="mt-6 max-w-prose border-t border-rule pt-5 text-sm leading-relaxed text-muted">{project.limitation}</p>
      </section>
    </div>
  </div>

  <a href="/work/mirror-ai" aria-label="Next case study Mirror AI" class="group mt-16 flex items-end justify-between gap-5 border-t border-rule pt-8 sm:mt-24">
    <div>
      <p class="label-type mb-3 text-muted">Next case study</p>
      <p class="display-type text-[clamp(2rem,5vw,5rem)] text-plum">Mirror AI</p>
    </div>
    <ArrowRight aria-hidden="true" class="mb-1 size-10 shrink-0 transition-transform duration-300 group-hover:translate-x-1 sm:size-14" />
  </a>
</article>
