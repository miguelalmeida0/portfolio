<script lang="ts">
  import type { Project } from '$lib/experience/projects';
  import { projectSystems } from '$lib/experience/project-systems';
  import { workProjects } from '$lib/content/work-projects';
  import Stage from './work/Stage.svelte';
  import ProjectArchitecture from './ProjectArchitecture.svelte';
  import EngineeringEvidence from './EngineeringEvidence.svelte';
  import LinkButton from './LinkButton.svelte';
  let { project }: { project: Project } = $props();
  const demo = workProjects.find(item => item.id === 'second-voice')!;
</script>

<div class="second-voice-study wind-theme">
  <header class="study-hero">
    <div><p class="period">{project.period}</p><h1 data-ask-id="project-second-voice-ai">Second Voice</h1><p class="statement">Make every rewrite<br />inspectable.</p></div>
    <div class="intro">
      <p class="lead">{project.problem}</p>
      <p>{project.ownership}</p>
      <p class="stack">{project.stack.join(' · ')}</p>
      <div class="actions"><LinkButton href="#writing-demo" label="Try the writing demo" />{#if project.live}<LinkButton href={project.live.href} label={project.live.label} external secondary />{/if}</div>
    </div>
  </header>

  <section id="writing-demo" class="writing-demo" aria-label="Interactive Second Voice example">
    <h2 class="sr-only">Try the writing interface</h2>
    <Stage project={demo} />
    <p class="demo-note">Prepared examples, using the same writing interface as the homepage. Choose a voice and strength, play the edit, compare the original and copy the result. This demo does not generate new text.</p>
  </section>

  <section class="ownership" aria-labelledby="ownership-title">
    <h2 id="ownership-title">Design & engineering</h2>
    <p>{project.contribution}</p>
  </section>

  <ProjectArchitecture system={projectSystems['second-voice-ai']} />

  <section class="decisions" aria-labelledby="decisions-title">
    <h2 id="decisions-title">The boundaries behind the interaction</h2>
    {#each project.decisions as decision, index}
      <div class="decision" data-decision-item>
        <div><p class="number">0{index + 1}</p><h3 data-ask-id={`project-${project.slug}-decision-${index}`}>{decision.title}</h3></div>
        <div><p>{decision.detail}</p><p class="tradeoff"><strong>Tradeoff.</strong> {decision.tradeoff}</p></div>
      </div>
    {/each}
  </section>

  <EngineeringEvidence slug="second-voice-ai" />

  <section class="outcome" aria-labelledby="outcome-title">
    <h2 id="outcome-title">Implemented, with explicit limits.</h2>
    <p>{project.outcome}</p>
    <p class="limitation">{project.limitation}</p>
    {#if project.source}<LinkButton href={project.source} label="View source" external secondary />{/if}
  </section>
</div>

<style>
  .second-voice-study { color: var(--ink); font-family: var(--hero-font); }
  .study-hero { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: end; padding-block: 48px; }
  .period, .number { font-size: 14px; color: var(--muted); }
  h1 { margin-top: 16px; font-size: clamp(42px, 5.4vw, 76px); line-height: 1.04; letter-spacing: -.045em; font-weight: 800; }
  .statement { margin-top: 20px; font-size: clamp(26px, 3vw, 40px); line-height: 1.16; letter-spacing: -.025em; font-weight: 500; }
  .intro p + p { margin-top: 16px; }
  p { font-size: 17px; line-height: 1.6; }
  .lead { font-size: 21px; line-height: 1.5; }
  .stack { font-size: 15px; font-weight: 600; }
  .actions { display: flex; flex-wrap: wrap; gap: 16px 24px; margin-top: 24px; align-items: center; }
  .writing-demo { padding: 24px 32px; border-radius: 20px; background: var(--lime); scroll-margin-top: 24px; }
  .demo-note { margin-top: 20px; max-width: 85ch; font-size: 13px; color: var(--ink); }
  .ownership { display: grid; grid-template-columns: 1fr 1.7fr; gap: 48px; padding-block: 48px; border-bottom: 1px solid var(--rule-ink); }
  h2 { font-size: clamp(25px, 3vw, 36px); line-height: 1.2; letter-spacing: -.025em; font-weight: 700; }
  .decisions { padding-top: 48px; }
  .decision { display: grid; grid-template-columns: 1fr 1.7fr; gap: 48px; padding-block: 32px; border-bottom: 1px solid var(--rule-ink); }
  .decisions > h2 { margin-bottom: 16px; }
  h3 { margin-top: 8px; font-size: 25px; line-height: 1.2; font-weight: 650; }
  .tradeoff { margin-top: 16px; font-size: 15px; color: var(--muted); }
  .outcome { padding-block: 40px 0; max-width: 85ch; }
  .outcome p { margin-top: 20px; }
  .limitation { font-size: 14px; color: var(--muted); margin-bottom: 20px; }
  @media (max-width: 899px) { .study-hero { grid-template-columns: 1fr; gap: 28px; } }
  @media (max-width: 767px) {
    .study-hero { padding-block: 32px; }
    .writing-demo { padding: 12px; border-radius: 16px; }
    .ownership, .decision { grid-template-columns: 1fr; gap: 20px; padding-block: 28px; }
    .lead { font-size: 19px; }
    p { font-size: 16px; }
    .demo-note { padding: 0 8px 8px; }
  }
</style>
