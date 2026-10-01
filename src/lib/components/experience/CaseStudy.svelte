<script lang="ts">
  import { destinationLink } from '$lib/navigation/destination-link';
  import { projects, type Project } from '$lib/experience/projects';
  import F24Proof from "./F24Proof.svelte";
  import F24Impact from './F24Impact.svelte';
  import LeuInvestigation from './LeuInvestigation.svelte';
  import SecondVoiceCaseStudy from './SecondVoiceCaseStudy.svelte';
  import EngineeringEvidence from "./EngineeringEvidence.svelte";
  import ProjectMedia from './ProjectMedia.svelte';
  import LeuProductFilm from './LeuProductFilm.svelte';
  import FreshnessDemo from './FreshnessDemo.svelte';
  import WritingDecision from './WritingDecision.svelte';
  import ProjectArchitecture from './ProjectArchitecture.svelte';
  import ProjectOwnership from './ProjectOwnership.svelte';
  import ProjectStack from './ProjectStack.svelte';
  import { projectSystems } from '$lib/experience/project-systems';
  import LinkButton from './LinkButton.svelte';
  import { enter } from '$lib/experience/motion';
  let { project }: { project: Project } = $props();
  const next = $derived(projects[(projects.findIndex(p => p.slug === project.slug) + 1) % projects.length]);
</script>
<svelte:head>
  <title>{project.name} | Miguel Almeida</title>
  <meta name="description" content={project.slug === 'leu' ? 'Leu engineering case study: PDF reconstruction, learning-state safety, the V36 semantic plateau, V37 model interpretation and the limits of native validation.' : project.summary + ' ' + project.contribution} />
  <meta property="og:title" content={project.name + ' — Miguel Almeida'} />
  <meta property="og:description" content={project.slug === 'leu' ? 'From corrupted PDF text to trustworthy learner state: the failures that changed Leu’s architecture.' : project.summary} />
</svelte:head>
<article class="shell portfolio-study">
  <a href="/#work" class="study-back ink-link" {...destinationLink("/#work")}> All work</a>
  {#if project.slug === 'leu'}
    <LeuInvestigation />
  {:else if project.slug === 'second-voice-ai'}
    <SecondVoiceCaseStudy {project} />
  {:else}
  <header class="project-hero border-b border-rule">
    <div class="min-w-0">
    <p class="label-type text-plum">{project.slug === 'f24' ? 'Professional work · ' : ''}{project.period}</p>
    <h1 class="page-title mt-4 text-plum">{project.name}</h1>
    <ProjectStack stack={project.stack} />
    <p class="project-statement" data-ask-id={`project-${project.slug}`}>{project.summary}</p>
    <ProjectOwnership {project} caseStudy />
    {#if project.slug === 'f24'}
      <div class="project-actions"><LinkButton href="#product-impact" label="Explore my contribution" /><LinkButton href="#architecture" label="Frontend architecture" secondary /></div>
    {/if}
    {#if project.live || project.source}
      <div class="project-actions">
        {#if project.live}<LinkButton href={project.live.href} label={project.live.label} external />{/if}
        {#if project.source}<LinkButton href={project.source} label="View source" external secondary />{/if}
      </div>
    {/if}
    {#if project.slug === 'second-voice-ai'}<p class="project-note">Live generation was blocked on 29 September. Try the prepared homepage demo.</p>{/if}
    </div>
    {#if project.slug === "f24"}
    <aside class="border-t border-rule pt-6" aria-labelledby="product-purpose">
      <h2 id="product-purpose" class="label-type text-plum">What the product is</h2>
      <p class="mt-3 text-base leading-relaxed">Connectivity Hub connects operational systems and controls how events and communications move between them. Users configure workflows, recipients and integrations through its frontend.</p>
      <h2 class="label-type mt-6 text-plum">My engineering contribution</h2>
      <ul class="shipped-list">
        <li><a href="#architecture" {...destinationLink("#architecture")}>Modular frontend architecture <span>Reusable components and independent feature modules</span></a></li>
        <li><a href="#backend-integration" {...destinationLink("#backend-integration")}>Backend-to-frontend integration <span>Connect services, data and product workflows</span></a></li>
        <li><a href="#performance" {...destinationLink("#performance")}>Application performance <span>Improve responsiveness while continuing product delivery</span></a></li>
      </ul>
    </aside>
    {:else}
    <div class="min-w-0" data-hero-media>
      {#key project.slug}
        {#if project.slug === 'leu'}<LeuProductFilm compact />
        {:else}<ProjectMedia {project} hero />{/if}
      {/key}
    </div>
    {/if}
  </header>
  {#if project.slug === 'f24'}<F24Impact />{/if}
  {#if projectSystems[project.slug]}
    <ProjectArchitecture system={projectSystems[project.slug]} />
  {/if}
  {#if project.slug === "f24"}
    <F24Proof />
  {:else}
    <EngineeringEvidence slug={project.slug} />
    <section id="context" class="section-space grid gap-5 border-b border-rule min-[64rem]:grid-cols-[1fr_2.3fr] min-[64rem]:gap-16" use:enter>
        <p class="label-type mb-4 text-plum">The challenge</p>
        <h2 class="max-w-3xl font-sans text-[clamp(1.3rem,1.8vw,1.625rem)] leading-[1.4] tracking-[-.015em]">{project.problem}</h2>
      </section>
  <div class="grid gap-10 min-[60rem]:grid-cols-[1fr_2.3fr] min-[60rem]:gap-16">
    <nav aria-label="Case study sections" class="flex h-fit flex-wrap gap-x-6 gap-y-1 border-y border-rule py-3 text-sm min-[60rem]:sticky min-[60rem]:top-6 min-[60rem]:flex-col min-[60rem]:border-b-0">
      {#each [['architecture','Architecture & tools'],['context','The challenge'],['contribution','What I built'],['decisions','Key decisions'],['outcome','The outcome']] as [id,label]}
        <a href={'#'+id} class="ink-link justify-between border-plum hover:text-plum" {...destinationLink('#'+id)}>{label}</a>
      {/each}
    </nav>
    <div>
      <section id="contribution" class="scroll-mt-8 border-t border-rule py-10 sm:py-14" use:enter>
        <h2 class="section-title mb-4 text-plum">What I built</h2>
        <p class="max-w-prose text-lg leading-relaxed">{project.contribution}</p>
      </section>
      <section id="decisions" class="scroll-mt-8 border-t border-rule pt-10 sm:pt-14">
        <h2 class="section-title mb-7 text-plum">Decisions that shaped the product</h2>
        <div class="mb-8">
          {#key project.slug}
            {#if project.slug === 'second-voice-ai'}<WritingDecision />
            {:else if project.slug === 'vigia'}<FreshnessDemo />
            {/if}
          {/key}
        </div>
        {#each project.decisions as decision, index}
          <div data-decision-item class="mb-10 grid grid-cols-[2rem_1fr] gap-3 sm:gap-6" use:enter>
            <span class="pt-1 font-sans text-xl text-plum">0{index + 1}</span>
            <div>
              <h3 data-ask-id={`project-${project.slug}-decision-${index}`} class="text-2xl leading-tight font-bold tracking-[-.03em] sm:text-3xl">{decision.title}</h3>
              <p class="mt-4 max-w-prose text-base leading-relaxed sm:text-lg">{decision.detail}</p>
              <p class="mt-4 border-l-2 border-plum/35 pl-4 text-sm leading-relaxed text-muted"><span class="font-semibold text-ink">The tradeoff.</span> {decision.tradeoff}</p>
            </div>
          </div>
        {/each}
      </section>
      <section id="outcome" class="scroll-mt-8 rounded-xl bg-sage p-6 sm:p-9" use:enter>
        <p class="label-type mb-4 text-plum">The outcome</p>
        <h2 class="font-sans text-2xl leading-snug tracking-[-.025em] sm:text-3xl">{project.outcome}</h2>
        <p class="mt-6 border-t border-rule pt-5 text-sm leading-relaxed text-muted">{project.limitation}</p>
      </section>
    </div>
  </div>
  {/if}
  {/if}
  <a href={'/work/'+next.slug} class="group mt-16 flex items-end justify-between gap-5 border-t border-rule pt-8 sm:mt-24" {...destinationLink('/work/'+next.slug)}>
    <div><p class="label-type mb-3 text-muted">Next case study</p><p class="display-type text-[clamp(2rem,5vw,5rem)] text-plum">{next.name}</p></div>
  </a>
</article>

<style>
  .shipped-list { margin-top: 10px; }
  .shipped-list li { border-top: 1px solid var(--color-rule); }
  .shipped-list a { display: block; padding: 12px 0; font-size: 15px; font-weight: 600; }
  .shipped-list span { display: block; margin-top: 3px; font-size: 13px; font-weight: 400; color: var(--color-muted); }
  .shipped-list a:hover { color: var(--color-plum); }
  @media (max-width: 699px) {
    .shipped-list a { padding: 10px 0; }
  }
</style>
