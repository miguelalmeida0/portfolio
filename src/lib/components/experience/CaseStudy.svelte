<script lang="ts">
  import ArrowLeft from '@lucide/svelte/icons/arrow-left';
  import ArrowRight from '@lucide/svelte/icons/arrow-right';
  import { projects, type Project } from '$lib/experience/projects';
  import ProjectMedia from './ProjectMedia.svelte';
  import LeuProductFilm from './LeuProductFilm.svelte';
  import FreshnessDemo from './FreshnessDemo.svelte';
  import CorrectionDemo from './CorrectionDemo.svelte';
  import WritingDecision from './WritingDecision.svelte';
  import ProjectArchitecture from './ProjectArchitecture.svelte';
  import { projectSystems } from '$lib/experience/project-systems';
  import LinkButton from './LinkButton.svelte';
  import { enter } from '$lib/experience/motion';
  let { project }: { project: Project } = $props();
  const next = $derived(projects[(projects.findIndex(p => p.slug === project.slug) + 1) % projects.length]);
</script>
<svelte:head>
  <title>{project.name} | Miguel Almeida</title>
  <meta name="description" content={project.summary + ' ' + project.contribution} />
  <meta property="og:title" content={project.name + ' — Miguel Almeida'} />
  <meta property="og:description" content={project.summary} />
</svelte:head>
<article class="shell pb-14 sm:pb-24">
  <a href="/#work" class="ink-link mt-5 text-sm text-muted"><ArrowLeft size={17} aria-hidden="true" /> All work</a>
  <header class="border-b border-rule pb-8 pt-8 sm:pb-10 sm:pt-10">
    <p class="label-type text-plum">{project.type}</p>
    <h1 class="display-type mt-4 max-w-5xl break-words text-[clamp(2.75rem,6.5vw,5rem)] text-plum">{project.name}</h1>
    <p class="mt-4 max-w-3xl font-serif text-[clamp(1.35rem,2.5vw,2rem)] leading-[1.3] tracking-[-.025em]">{project.summary}</p>
    <dl class="mt-7 grid gap-5 text-sm sm:grid-cols-2">
      <div><dt class="label-type mb-2 text-muted">Built with</dt><dd class="leading-relaxed">{project.stack.join(' · ')}</dd></div>
      <div><dt class="label-type mb-2 text-muted">Context</dt><dd class="leading-relaxed">{project.period}</dd></div>
      {#if project.slug === 'f24'}
        <div><dt class="label-type mb-2 text-muted">Frontend scope</dt><dd class="max-w-prose leading-relaxed">{project.role}</dd></div>
        <div><dt class="label-type mb-2 text-muted">Collaboration</dt><dd class="max-w-prose leading-relaxed">Product · Design · Backend · QA</dd></div>
      {/if}
    </dl>
    {#if project.live || project.source}
      <div class="mt-8 flex flex-wrap items-center gap-x-8 gap-y-2">
        {#if project.live}<LinkButton href={project.live.href} label={project.live.label} external />{/if}
        {#if project.source}<LinkButton href={project.source} label="View source" external secondary />{/if}
      </div>
    {/if}
  </header>
  {#if project.slug === 'leu'}
    <LeuProductFilm />
  {/if}
  {#if project.slug !== 'f24' && projectSystems[project.slug]}
    <ProjectArchitecture system={projectSystems[project.slug]} />
  {/if}
  {#if project.slug === 'leu'}
    <section id="context" class="scroll-mt-8 border-b border-rule py-10 sm:py-14" use:enter>
      <p class="label-type mb-4 text-plum">The challenge</p>
      <h2 class="max-w-3xl font-serif text-[clamp(1.3rem,1.8vw,1.625rem)] leading-[1.4] tracking-[-.015em]">{project.problem}</h2>
    </section>
  {:else}
    <div class="grid items-center gap-7 py-8 {project.slug === 'f24' ? 'min-[51.25rem]:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]' : 'min-[51.25rem]:grid-cols-[1.3fr_1fr]'} min-[51.25rem]:gap-10 sm:py-10">
      <div class="min-w-0">{#key project.slug}<ProjectMedia {project} />{/key}</div>
      <section id="context" class="scroll-mt-8" use:enter>
        <p class="label-type mb-4 text-plum">{project.slug === 'f24' ? 'The starting point' : 'The challenge'}</p>
        <h2 class="font-serif text-[clamp(1.3rem,1.8vw,1.625rem)] leading-[1.4] tracking-[-.015em]">{project.problem}</h2>
      </section>
    </div>
  {/if}
  <div class="grid gap-10 min-[60rem]:grid-cols-[1fr_2.3fr] min-[60rem]:gap-16">
    <nav aria-label="Case study sections" class="flex h-fit flex-wrap gap-x-6 gap-y-1 border-y border-rule py-3 text-sm min-[60rem]:sticky min-[60rem]:top-6 min-[60rem]:flex-col min-[60rem]:border-b-0">
      {#each (project.slug === 'f24' ? [['context','Starting point'],['contribution','Svelte foundation'],['outcome','React evolution']] : [['architecture','Architecture & tools'],['context','The challenge'],['decisions','Key decisions'],['outcome','The outcome']]) as [id,label]}
        <a href={'#'+id} class="ink-link justify-between border-plum hover:text-plum">{label}<ArrowRight aria-hidden="true" size={15} /></a>
      {/each}
    </nav>
    <div>
      {#if project.slug === 'f24'}
      <section id="contribution" class="scroll-mt-8 border-t border-rule py-10 sm:py-14" use:enter>
        <p class="label-type mb-4 text-plum">Svelte foundation</p>
        <h2 class="display-type mb-5 text-3xl sm:text-4xl">Building the first production frontend.</h2>
        <p class="max-w-prose text-lg leading-relaxed">{project.contribution}</p>
      </section>
      {/if}
      {#if project.slug !== 'f24'}
      <section id="decisions" class="scroll-mt-8 border-t border-rule pt-10 sm:pt-14">
        <p class="label-type mb-7 text-plum">Decisions that shaped the product</p>
        <div class="mb-8">
          {#key project.slug}
            {#if project.slug === 'second-voice-ai'}<WritingDecision />
            {:else if project.slug === 'vigia'}<FreshnessDemo />
            {:else if project.slug === 'mirror-ai'}<CorrectionDemo />{/if}
          {/key}
        </div>
        {#each project.decisions as decision, index}
          <div data-decision-item class="mb-10 grid grid-cols-[2rem_1fr] gap-3 sm:gap-6" use:enter>
            <span class="pt-1 font-serif text-xl text-plum">0{index + 1}</span>
            <div>
              <h3 class="text-2xl leading-tight font-bold tracking-[-.03em] sm:text-3xl">{decision.title}</h3>
              <p class="mt-4 max-w-prose text-base leading-relaxed sm:text-lg">{decision.detail}</p>
              <p class="mt-4 border-l-2 border-plum/35 pl-4 text-sm leading-relaxed text-muted"><span class="font-semibold text-ink">The tradeoff.</span> {decision.tradeoff}</p>
            </div>
          </div>
        {/each}
      </section>
      {/if}
      <section id="outcome" class="scroll-mt-8 rounded-xl bg-sage p-6 sm:p-9" use:enter>
        <p class="label-type mb-4 text-plum">{project.slug === 'f24' ? 'React evolution' : 'The outcome'}</p>
        <h2 class="font-serif text-2xl leading-snug tracking-[-.025em] sm:text-3xl">{project.outcome}</h2>
        <p class="mt-6 border-t border-rule pt-5 text-sm leading-relaxed text-muted">{project.limitation}</p>
      </section>
    </div>
  </div>
  <a href={'/work/'+next.slug} class="group mt-16 flex items-end justify-between gap-5 border-t border-rule pt-8 sm:mt-24">
    <div><p class="label-type mb-3 text-muted">Next case study</p><p class="display-type text-[clamp(2rem,5vw,5rem)] text-plum">{next.name}</p></div>
    <ArrowRight aria-hidden="true" class="mb-1 size-10 shrink-0 transition-transform duration-300 group-hover:translate-x-1 sm:size-14" />
  </a>
</article>
