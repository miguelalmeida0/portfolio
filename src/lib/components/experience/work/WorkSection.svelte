<script lang="ts">
  import { onMount } from 'svelte';
  import { destinationLink } from '$lib/navigation/destination-link';
  import { f24Ownership } from '$lib/content/work-projects';
  import PreviewMedia from './PreviewMedia.svelte';
  import { selectedProjects } from './selected-projects';
  import { createPreviewController } from './preview-controller';
  let section: HTMLElement;
  let paused = $state(true);
  let ready = $state(false);
  let controller: ReturnType<typeof createPreviewController> | undefined;
  onMount(() => {
    controller = createPreviewController(section, selectedProjects, value => paused = value);
    ready = true;
    return () => controller?.destroy();
  });
</script>

<section id="work" class="selected-work bg-[var(--forest)] text-[var(--paper)]" aria-labelledby="work-title" bind:this={section}>
  <div class="selected-inner mx-auto">
    <header class="selected-heading flex flex-wrap items-end justify-between gap-6">
      <h2 id="work-title" data-ask-id="selwork" class="font-extrabold tracking-tight">Selected Work</h2>
      <p>Professional experience.<br />Independent ideas, built.</p>
    </header>
    <article class="f24-feature" data-f24-feature aria-labelledby="f24-title">
      <a class="f24-photo-link" href="/work/f24" aria-label="F24 case study" {...destinationLink('/work/f24')}>
        <img class="f24-photo" src="/projects/f24/hackathon.webp" alt="Colleagues gathered for a presentation at an F24 hackathon." width="1024" height="685" loading="lazy" />
      </a>
      <div class="f24-editorial">
        <p class="feature-label">Professional experience</p>
        <h3 id="f24-title" class="font-extrabold tracking-tight">F24</h3>
        <p class="feature-headline font-bold tracking-tight">From mockups to production.</p>
        <p class="feature-body">{f24Ownership.body} A product used by hundreds of companies.</p>
        <ul class="capabilities flex flex-wrap gap-2" aria-label="F24 contributions">
          {#each f24Ownership.tags as tag}<li>{tag}</li>{/each}
        </ul>
        <a class="case-action inline-flex items-center justify-center gap-4" href="/work/f24" {...destinationLink('/work/f24')}>View case study <span aria-hidden="true">→</span></a>
      </div>
    </article>
    <div class="preview-heading flex flex-wrap items-center justify-between gap-4">
      <p>Independent projects</p>
      {#if ready}<button class="preview-toggle" onclick={() => controller?.toggle()}>{paused ? 'Resume previews' : 'Pause previews'}</button>{/if}
    </div>
    <div class="project-gallery">
      {#each selectedProjects as project}
        <article data-selected-project={project.id} aria-labelledby={`selected-${project.id}`}>
          <a class="preview-link block" href={project.href} {...destinationLink(project.href)} aria-label={`${project.name} case study`}><PreviewMedia {project} /></a>
          <h3 id={`selected-${project.id}`} class="font-bold tracking-tight"><a href={project.href} {...destinationLink(project.href)}>{project.name} <span aria-hidden="true">↗</span></a></h3>
          <p class="project-line">{project.line}</p>
          <ul class="capabilities flex flex-wrap gap-2" aria-label={`${project.name} capabilities`}>{#each project.tags as tag}<li>{tag}</li>{/each}</ul>
          <div class="project-actions flex flex-wrap gap-x-8 gap-y-2">
            {#if project.live}<a href={project.live} {...destinationLink(project.live)}>Live app <span aria-hidden="true">↗</span></a>{/if}
            {#if project.code}<a href={project.code} {...destinationLink(project.code)}>Code <span aria-hidden="true">↗</span></a>{/if}
          </div>
        </article>
      {/each}
    </div>
  </div>
</section>

<style>
  .selected-work { margin-top: var(--work-offset, 64px); padding: 56px var(--page-x) 72px; font-family: var(--hero-font); scroll-margin-top: 24px; }
  .selected-inner { max-width: 1800px; }
  .selected-heading { margin-bottom: 28px; }
  .selected-heading h2 { font-size: clamp(42px, 4.8vw, 76px); line-height: 1.05; }
  .selected-heading > p { font-size: 20px; line-height: 1.4; color: var(--sage); }
  .f24-feature { display: grid; grid-template-columns: minmax(0,1.7fr) minmax(0,1fr); gap: 40px; align-items: center; }
  .f24-photo-link { display: block; min-width: 0; border-radius: var(--r-media); }
  .f24-photo { width: 100%; height: auto; aspect-ratio: 1.72; object-fit: cover; border-radius: var(--r-media); }
  .f24-editorial { min-width: 0; }
  .feature-label, .preview-heading > p { font-size: 14px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: var(--sage); }
  .f24-editorial h3 { font-size: clamp(64px,7vw,112px); line-height: 1; margin-top: 20px; }
  .feature-headline { font-size: clamp(26px,2.6vw,40px); line-height: 1.13; margin-top: 6px; }
  .feature-body { font-size: 20px; line-height: 1.5; margin: 22px 0; color: var(--sage); }
  .capabilities { list-style: none; padding: 0; margin: 0; }
  .capabilities li { border: 1px solid color-mix(in srgb,var(--sage) 40%,transparent); border-radius: var(--r-pill); padding: 7px 13px; font-size: 14px; line-height: 1.25; color: var(--sage); }
  .case-action { min-height: 58px; padding: 12px 28px; border-radius: var(--r-pill); background: var(--lime); color: var(--ink); font-size: 21px; font-weight: 750; margin-top: 30px; }
  .preview-heading { margin: 36px 0 18px; min-height: 48px; }
  .preview-toggle { font-size: 16px; min-height: 48px; padding: 10px 2px; text-decoration: underline; text-underline-offset: 6px; cursor: pointer; }
  .project-gallery { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 24px; }
  .project-gallery article { min-width: 0; display: flex; flex-direction: column; }
  .preview-link { border-radius: var(--r-media); }
  .project-gallery h3 { font-size: 28px; line-height: 1.2; margin-top: 12px; }
  .project-gallery h3 a { display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 48px; }
  .project-gallery h3 span { font-size: 20px; font-weight: 400; }
  .project-line { font-size: 19px; line-height: 1.4; color: var(--sage); margin: 6px 0 18px; }
  .project-gallery .capabilities { margin-top: auto; }
  .project-actions { margin-top: 14px; }
  .project-actions a { display: inline-flex; align-items: center; gap: 12px; min-height: 48px; font-size: 18px; text-decoration: underline; text-underline-offset: 7px; }
  .selected-work :global(a:focus-visible), .selected-work button:focus-visible { outline: 3px solid var(--lime); outline-offset: 5px; }
  .selected-work .case-action:focus-visible { outline-color: var(--paper); }
  @media (max-width: 1279px) { .project-gallery { grid-template-columns: repeat(2,minmax(0,1fr)); gap: 32px 24px; } .f24-feature { grid-template-columns: 1.2fr 1fr; gap: 28px; } }
  @media (max-width: 899px) { .f24-feature { grid-template-columns: 1fr; } .f24-editorial { max-width: 650px; } .feature-label { margin-top: 6px; } .f24-editorial h3 { margin-top: 12px; } }
  @media (max-width: 679px) { .selected-work { padding: 36px 20px 48px; } .selected-heading > p { font-size: 17px; } .project-gallery { grid-template-columns: 1fr; gap: 36px; } .selected-heading h2 { font-size: 42px; } .feature-body { font-size: 18px; } .project-line { font-size: 18px; } }
</style>
