<script lang="ts">
  import { onMount } from 'svelte';
  import { destinationLink } from '$lib/navigation/destination-link';
  import { f24Ownership } from '$lib/content/work-projects';
  import PreviewMedia from './PreviewMedia.svelte';
  import { selectedProjects } from './selected-projects';
  import { createPreviewController } from './preview-controller';
  import { workMotion } from './work-motion';
  import { chapterTitles } from '$lib/motion/actions/chapterTitles';
  let section: HTMLElement;
  let controller: ReturnType<typeof createPreviewController> | undefined;
  let blockedIds = $state<string[]>([]);
  let videosPaused = $state(false);
  onMount(() => {
    controller = createPreviewController(section, selectedProjects, ids => {
      blockedIds = ids;
    });
    return () => controller?.destroy();
  });
  function toggleVideos() {
    videosPaused = !videosPaused;
    controller?.setPaused(videosPaused);
  }
</script>

<section id="work" class="selected-work bg-[var(--forest)] text-[var(--paper)]" aria-labelledby="work-title" bind:this={section} use:workMotion>
  <div class="selected-inner mx-auto">
    <header class="selected-heading flex flex-wrap items-end justify-between gap-6" use:chapterTitles={'h2'}>
      <h2 id="work-title" data-ask-id="selwork" class="font-extrabold tracking-tight">Selected Work</h2>
      <p>Professional experience.<br />Independent ideas, built.</p>
    </header>
    <article class="f24-feature" data-f24-feature aria-labelledby="f24-title">
      <a class="f24-photo-link" href="/work/f24" aria-label="F24 case study" {...destinationLink('/work/f24')}>
        <figure class="f24-moment f24-working">
          <img src="/projects/f24/hackathon-working.webp" alt="Miguel and a colleague working together at their desks during the F24 hackathon." width="640" height="854" loading="lazy" />
          <figcaption>Building together.</figcaption>
        </figure>
        <figure class="f24-moment f24-team">
          <img src="/projects/f24/hackathon-team.webp" alt="The F24 hackathon team gathered beside their presentation, with a colleague joining remotely." width="1000" height="749" loading="lazy" />
          <figcaption>A team effort.</figcaption>
        </figure>
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
    <div class="independent-projects" aria-labelledby="projects-heading">
      <header class="gallery-heading">
        <h3 id="projects-heading">Independent projects</h3>
        <div class="gallery-controls">
          <span class="gallery-count">04 projects</span>
          <button class="video-toggle" type="button"
            aria-label={videosPaused ? 'Play project videos' : 'Pause project videos'}
            title={videosPaused ? 'Play videos' : 'Pause videos'}
            onclick={toggleVideos}><span aria-hidden="true">{videosPaused ? '▶' : 'Ⅱ'}</span></button>
        </div>
      </header>
      <div class="project-rows">
        {#each selectedProjects as project, index}
          <article
            class="project-row"
            class:reversed={index % 2 === 1}
            data-selected-project={project.id}
            aria-labelledby={`selected-${project.id}`}
          >
            <div class="project-media">
              <a class="preview-link" href={project.href} {...destinationLink(project.href)} aria-label={`${project.name} case study`}>
                <PreviewMedia {project} />
              </a>
              {#if blockedIds.includes(project.id)}
                <button class="preview-retry" type="button"
                  aria-label={`Play ${project.name} and other blocked project videos`}
                  onclick={() => controller?.retryAll()}>Play videos <span aria-hidden="true">▶</span></button>
              {/if}
            </div>
            <div class="project-info">
              <p class="project-number">{String(index + 1).padStart(2, '0')} / {project.category}</p>
              <h4 id={`selected-${project.id}`} class="project-title">
                <a href={project.href} {...destinationLink(project.href)}>{project.name} <span data-project-arrow aria-hidden="true">↗</span></a>
              </h4>
              <p class="project-line">{project.line}</p>
              <ul class="capabilities project-tags" aria-label={`${project.name} capabilities`}>
                {#each project.tags as tag}<li>{tag}</li>{/each}
              </ul>
              <p class="project-stack" aria-label={`${project.name} technology stack`}>{project.stack.join(' · ')}</p>
              <div class="project-actions">
                {#if project.live}<a href={project.live} {...destinationLink(project.live)}>Live app <span aria-hidden="true">↗</span></a>{/if}
                {#if project.code}<a href={project.code} {...destinationLink(project.code)}>Code <span aria-hidden="true">↗</span></a>{/if}
              </div>
            </div>
          </article>
        {/each}
      </div>
    </div>
  </div>
</section>

<style>
  .selected-work { margin-top: var(--work-offset, 64px); padding: 56px var(--page-x) 72px; font-family: var(--hero-font); scroll-margin-top: 24px; }
  .selected-inner { max-width: 1800px; }
  .selected-heading { margin-bottom: 28px; }
  .selected-heading h2 { font-size: var(--type-section); line-height: var(--leading-display); }
  .selected-heading > p { font-size: var(--type-body); line-height: 1.5; color: var(--sage); }
  .f24-feature { display: grid; grid-template-columns: minmax(0,1.35fr) minmax(0,1fr); gap: clamp(32px,4vw,72px); align-items: center; padding-block: 24px; }
  .f24-photo-link { display: grid; grid-template-columns: .8fr 1.2fr; align-items: end; gap: clamp(12px,1.5vw,24px); min-width: 0; max-width: 860px; border-radius: var(--r-media); }
  .f24-moment { margin: 0; min-width: 0; }
  .f24-moment img { display: block; width: 100%; height: auto; border-radius: var(--r-media); }
  .f24-moment figcaption { margin-top: 12px; font-size: var(--type-caption); line-height: 1.4; color: var(--sage); }
  .f24-editorial { min-width: 0; }
  .feature-label { font-size: var(--type-meta); font-weight: 600; letter-spacing: .10em; text-transform: uppercase; color: var(--sage); }
  .f24-editorial h3 { font-size: var(--type-feature-wordmark); line-height: 1.03; margin-top: 20px; }
  .feature-headline { font-size: var(--type-subsection); line-height: var(--leading-heading); margin-top: 6px; }
  .feature-body { font-size: var(--type-body); line-height: var(--leading-body); margin: 22px 0; color: var(--sage); }
  .capabilities { list-style: none; padding: 0; margin: 0; }
  .capabilities li { border: 1px solid color-mix(in srgb,var(--sage) 40%,transparent); border-radius: var(--r-pill); padding: 7px 13px; font-size: 14px; line-height: 1.25; color: var(--sage); }
  .case-action { min-height: 58px; padding: 12px 28px; border-radius: var(--r-pill); background: var(--lime); color: var(--ink); font-size: 21px; font-weight: 750; margin-top: 30px; }
  .independent-projects { padding-top: clamp(40px, 5vw, 80px); }
  .gallery-heading { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; margin-bottom: clamp(26px, 3vw, 44px); }
  .gallery-heading h3 { font: 700 var(--type-collection)/var(--leading-heading) var(--hero-font); letter-spacing: -.035em; }
  .gallery-count { flex: 0 0 auto; color: var(--sage); font: 500 var(--type-small)/1.4 var(--hero-font); letter-spacing: .04em; }
  .gallery-controls { display: flex; align-items: center; gap: 12px; flex: 0 0 auto; }
  .video-toggle { display: grid; place-items: center; width: 44px; height: 44px; border: 1px solid color-mix(in srgb, var(--sage) 40%, transparent); border-radius: 999px; color: var(--paper); background: transparent; cursor: pointer; font: 600 15px/1 var(--hero-font); }
  .video-toggle:hover { background: color-mix(in srgb, var(--sage) 10%, transparent); }
  .project-media { position: relative; grid-column: 2; grid-row: 1; min-width: 0; width: 100%; }
  .project-media .preview-link { display: block; min-width: 0; width: 100%; border-radius: 12px; outline-offset: 5px; }
  .preview-retry { position: absolute; z-index: 3; right: 16px; bottom: 16px; display: inline-flex; align-items: center; gap: 9px; min-height: 44px; padding: 9px 16px; border: 1px solid var(--paper); border-radius: 999px; background: var(--forest); color: var(--paper); font: 600 var(--type-small)/1.3 var(--hero-font); cursor: pointer; box-shadow: 0 4px 18px rgba(0,0,0,.15); }
  .preview-retry span { font-size: 12px; }
  .project-rows { display: grid; gap: clamp(40px, 5vw, 76px); }
  .project-row { display: grid; grid-template-columns: minmax(0, .83fr) minmax(0, 1.17fr); column-gap: clamp(28px, 3.7vw, 72px); align-items: center; min-width: 0; }
  .project-row.reversed { grid-template-columns: minmax(0, 1.17fr) minmax(0, .83fr); }
  .project-row .preview-link { display: block; min-width: 0; width: 100%; border-radius: 12px; outline-offset: 5px; }
  .project-row .project-info { grid-column: 1; grid-row: 1; min-width: 0; }
  .project-row.reversed .project-media { grid-column: 1; }
  .project-row.reversed .project-info { grid-column: 2; }
  .project-number { margin: 0 0 9px; color: var(--sage); font: 650 var(--type-small)/1.5 var(--hero-font); letter-spacing: .13em; text-transform: uppercase; }
  .project-title { margin: 0; font: 400 var(--type-project-title)/1.12 Georgia, 'Iowan Old Style', 'Baskerville', serif; letter-spacing: -.025em; }
  .project-title a { display: inline-flex; align-items: baseline; gap: 12px; max-width: 100%; color: var(--paper); text-decoration: none; }
  .project-title span { display: inline-block; flex: 0 0 auto; color: var(--sage); font: 400 19px/1 var(--hero-font); }
  .project-line { max-width: 43ch; margin: 11px 0 17px; color: var(--paper); font: 400 var(--type-body)/1.5 var(--hero-font); }
  .project-tags { display: flex; flex-wrap: wrap; align-items: center; gap: 7px; margin: 0; padding: 0; }
  .project-tags li { flex: 0 0 auto; border: 0; background: color-mix(in srgb, var(--sage) 13%, transparent); color: var(--paper); font: 500 var(--type-small)/1.35 var(--hero-font); padding: 7px 11px; }
  .project-stack { margin: 17px 0 0; max-width: 52ch; color: var(--sage); font: 400 var(--type-small)/1.6 var(--hero-font); font-style: normal; letter-spacing: 0; overflow-wrap: anywhere; }
  .project-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 24px; margin-top: 16px; }
  .project-actions a { display: inline-flex; align-items: center; gap: 8px; min-height: 44px; color: var(--paper); font: 600 var(--type-ui)/1.3 var(--hero-font); text-decoration: underline; text-underline-offset: 5px; }
  .project-actions span { font: 400 17px/1 var(--hero-font); }
  .selected-work :global(a:focus-visible), .selected-work button:focus-visible { outline: 3px solid var(--lime); outline-offset: 5px; }
  .selected-work .case-action:focus-visible { outline-color: var(--paper); }
  @media (max-width: 1279px) {
    .f24-feature { grid-template-columns: 1.2fr 1fr; gap: 28px; }
    .project-row { column-gap: 30px; }
  }
  @media (max-width: 979px) {
    .project-rows { gap: 42px; }
    .project-row, .project-row.reversed { display: flex; flex-direction: column; align-items: stretch; gap: 16px; }
    .project-row .project-media { order: 0; }
    .project-row .project-info { order: 1; }
    .project-info { width: 100%; }
    .project-line { max-width: 62ch; margin-bottom: 13px; }
    .project-stack { margin-top: 14px; }
    .project-actions { margin-top: 10px; }
  }
  @media (max-width: 899px) {
    .f24-feature { grid-template-columns: 1fr; padding-block: 8px; }
    .f24-photo-link { max-width: 650px; }
    .f24-editorial { max-width: 650px; }
    .feature-label { margin-top: 6px; }
    .f24-editorial h3 { margin-top: 12px; }
  }
  @media (max-width: 679px) {
    .selected-work { padding: 36px 20px 48px; }
    .selected-heading > p { font-size: 17px; }
    .feature-body { font-size: 18px; }
    .independent-projects { padding-top: 45px; }
    .gallery-heading { margin-bottom: 24px; flex-wrap: wrap; }
    .gallery-heading h3 { flex: 1 1 185px; min-width: 0; }
    .gallery-heading h3 { font-size: var(--type-collection); }
    .gallery-count { font-size: var(--type-small); }
    .gallery-controls { gap: 8px; }
    .project-rows { gap: 38px; }
    .project-row, .project-row.reversed { gap: 13px; }
    .project-title { font-size: var(--type-project-title); }
    .project-line { font-size: var(--type-body); }
    .project-tags li { font-size: var(--type-small); padding: 6px 10px; }
    .project-stack { font-size: var(--type-small); }
  }
</style>
