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
  let paused = $state(true);
  let ready = $state(false);
  let controller: ReturnType<typeof createPreviewController> | undefined;
  onMount(() => {
    controller = createPreviewController(section, selectedProjects, value => paused = value);
    ready = true;
    return () => controller?.destroy();
  });
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
      <header class="story-heading">
        <div class="story-heading-copy">
          <p class="story-eyebrow">Independent projects / Product design &amp; engineering</p>
          <h3 id="projects-heading">Four projects.<br />Designed and built.</h3>
          <p class="story-intro">Search, writing, learning and voice interfaces. Four independent projects with working demos and source code.</p>
        </div>
        {#if ready}
          <button class="preview-toggle" type="button" onclick={() => controller?.toggle()}>
            {paused ? 'Resume previews' : 'Pause previews'}
          </button>
        {/if}
      </header>
      <div class="project-story">
        {#each selectedProjects as project, index}
          <article class="project-chapter" class:reversed={index % 2 === 1}
            data-selected-project={project.id} aria-labelledby={`selected-${project.id}`}>
            <div class="project-copy">
              <p class="project-kicker">{String(index + 1).padStart(2, '0')} / {project.category}</p>
              <h4 id={`selected-${project.id}`} class="project-title">
                <a href={project.href} {...destinationLink(project.href)}>
                  {project.name} <span data-project-arrow aria-hidden="true">↗</span>
                </a>
              </h4>
              <p class="project-line">{project.line}</p>
              <ul class="capabilities project-tags" aria-label={`${project.name} capabilities`}>
                {#each project.tags as tag}<li>{tag}</li>{/each}
              </ul>
              <div class="project-details">
                <div class="project-actions">
                  {#if project.live}<a href={project.live} {...destinationLink(project.live)}>Live app <span aria-hidden="true">↗</span></a>{/if}
                  {#if project.code}<a href={project.code} {...destinationLink(project.code)}>Code <span aria-hidden="true">↗</span></a>{/if}
                </div>
                <p class="project-stack" aria-label={`${project.name} technology stack`}>{project.stack.join(' · ')}</p>
              </div>
            </div>
            <a class="preview-link" href={project.href} {...destinationLink(project.href)}
              aria-label={`${project.name} case study`}>
              <PreviewMedia {project} />
            </a>
            <span class="chapter-marker" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
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
  .selected-heading h2 { font-size: clamp(42px, 4.8vw, 76px); line-height: 1.05; }
  .selected-heading > p { font-size: 20px; line-height: 1.4; color: var(--sage); }
  .f24-feature { display: grid; grid-template-columns: minmax(0,1.35fr) minmax(0,1fr); gap: clamp(32px,4vw,72px); align-items: center; padding-block: 24px; }
  .f24-photo-link { display: grid; grid-template-columns: .8fr 1.2fr; align-items: end; gap: clamp(12px,1.5vw,24px); min-width: 0; max-width: 860px; border-radius: var(--r-media); }
  .f24-moment { margin: 0; min-width: 0; }
  .f24-moment img { display: block; width: 100%; height: auto; border-radius: var(--r-media); }
  .f24-moment figcaption { margin-top: 12px; font-size: 14px; line-height: 1.4; color: var(--sage); }
  .f24-editorial { min-width: 0; }
  .feature-label, .preview-heading > p { font-size: 14px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: var(--sage); }
  .f24-editorial h3 { font-size: clamp(64px,7vw,112px); line-height: 1; margin-top: 20px; }
  .feature-headline { font-size: clamp(26px,2.6vw,40px); line-height: 1.13; margin-top: 6px; }
  .feature-body { font-size: 20px; line-height: 1.5; margin: 22px 0; color: var(--sage); }
  .capabilities { list-style: none; padding: 0; margin: 0; }
  .capabilities li { border: 1px solid color-mix(in srgb,var(--sage) 40%,transparent); border-radius: var(--r-pill); padding: 7px 13px; font-size: 14px; line-height: 1.25; color: var(--sage); }
  .case-action { min-height: 58px; padding: 12px 28px; border-radius: var(--r-pill); background: var(--lime); color: var(--ink); font-size: 21px; font-weight: 750; margin-top: 30px; }
  .independent-projects { padding-top: clamp(48px, 6vw, 96px); }
  .story-heading { display: flex; align-items: end; justify-content: space-between; gap: 28px; margin-bottom: clamp(38px, 5vw, 72px); }
  .story-heading-copy { min-width: 0; }
  .story-eyebrow { margin: 0 0 16px; font: 600 12px/1.5 var(--hero-font); letter-spacing: .12em; text-transform: uppercase; color: var(--sage); }
  .story-heading h3 { margin: 0; font: 400 clamp(38px, 4.25vw, 67px)/1.03 Georgia, 'Iowan Old Style', 'Baskerville', serif; letter-spacing: -.035em; text-wrap: balance; }
  .story-intro { margin: 19px 0 0; max-width: 57ch; font: 400 clamp(16px, 1.4vw, 19px)/1.6 var(--hero-font); color: var(--sage); }
  .preview-toggle { flex: 0 0 auto; min-height: 48px; padding: 10px 4px; color: var(--paper); font: 600 14px/1.4 var(--hero-font); text-decoration: underline; text-underline-offset: 6px; cursor: pointer; }
  .project-story { position: relative; display: grid; gap: clamp(44px, 5.6vw, 92px); }
  .project-story::before { content: ''; position: absolute; pointer-events: none; top: 3%; bottom: 3%; left: 50%; width: 1px; transform: translateX(-50%); background: color-mix(in srgb, var(--paper) 25%, transparent); }
  .project-chapter { position: relative; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: clamp(72px, 5vw, 110px); align-items: center; min-width: 0; }
  .project-copy { grid-column: 1; grid-row: 1; display: flex; flex-direction: column; align-items: start; min-width: 0; }
  .project-chapter .preview-link { grid-column: 2; grid-row: 1; }
  .project-chapter.reversed .project-copy { grid-column: 2; }
  .project-chapter.reversed .preview-link { grid-column: 1; }
  .project-kicker { margin: 0 0 11px; color: var(--sage); font: 650 12px/1.5 var(--hero-font); letter-spacing: .13em; text-transform: uppercase; }
  .project-title { margin: 0; font: 400 clamp(34px, 3.35vw, 52px)/1.08 Georgia, 'Iowan Old Style', 'Baskerville', serif; letter-spacing: -.025em; }
  .project-title a { display: inline-flex; align-items: baseline; gap: 14px; color: var(--paper); text-decoration: none; }
  .project-title span { display: inline-block; color: var(--sage); font: 400 22px/1 var(--hero-font); transform-origin: center; }
  .project-line { margin: 12px 0 18px; max-width: 44ch; color: var(--paper); font: 400 clamp(16px, 1.25vw, 19px)/1.5 var(--hero-font); }
  .project-tags { gap: 7px; }
  .project-tags li { font-size: 12px; line-height: 1.3; padding: 7px 11px; }
  .project-details { width: 100%; display: flex; flex-wrap: wrap; align-items: end; justify-content: space-between; gap: 20px 24px; margin-top: 20px; }
  .project-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 12px 20px; }
  .project-actions a { display: inline-flex; align-items: center; gap: 9px; min-height: 44px; font: 600 15px/1.35 var(--hero-font); color: var(--paper); text-decoration: underline; text-underline-offset: 5px; }
  .project-actions span { font-size: 17px; }
  .project-stack { flex: 1 1 150px; max-width: 210px; margin: 0; padding: 1px 0 1px 12px; border-left: 1px solid color-mix(in srgb, var(--paper) 33%, transparent); color: var(--sage); font: 400 12px/1.55 var(--hero-font); font-style: normal; letter-spacing: 0; overflow-wrap: anywhere; }
  .project-chapter .preview-link { display: block; min-width: 0; width: 100%; overflow: hidden; border-radius: var(--r-media); outline-offset: 6px; }
  .chapter-marker { position: absolute; z-index: 1; left: 50%; top: 50%; display: grid; place-items: center; width: 40px; height: 40px; transform: translate(-50%, -50%); border: 1px solid color-mix(in srgb, var(--paper) 72%, transparent); border-radius: 50%; background: var(--forest); font: 600 12px/1 var(--hero-font); pointer-events: none; }
  .project-chapter .preview-link :global([data-preview]) { transition: border-color 180ms ease, box-shadow 180ms ease; }
  .project-chapter .preview-link:hover :global([data-preview]), .project-chapter .preview-link:focus-visible :global([data-preview]) { border-color: color-mix(in srgb, var(--paper) 68%, transparent); box-shadow: 0 12px 32px rgba(0, 0, 0, .12); }
  .selected-work :global(a:focus-visible), .selected-work button:focus-visible { outline: 3px solid var(--lime); outline-offset: 5px; }
  .selected-work .case-action:focus-visible { outline-color: var(--paper); }
  @media (max-width: 1279px) {
    .f24-feature { grid-template-columns: 1.2fr 1fr; gap: 28px; }
    .project-chapter { gap: 70px; }
  }
  @media (max-width: 1099px) {
    .project-story { gap: 54px; }
    .project-story::before, .chapter-marker { display: none; }
    .project-chapter, .project-chapter.reversed { display: flex; flex-direction: column; align-items: stretch; gap: 18px; }
    .project-copy { order: 0; }
    .project-chapter .preview-link { order: 1; }
    .project-details { justify-content: start; gap: 18px 30px; }
    .project-stack { flex-grow: 0; max-width: 320px; }
  }
  @media (max-width: 899px) {
    .f24-feature { grid-template-columns: 1fr; padding-block: 8px; }
    .f24-photo-link { max-width: 650px; }
    .f24-editorial { max-width: 650px; }
    .feature-label { margin-top: 6px; }
    .f24-editorial h3 { margin-top: 12px; }
    .story-heading { align-items: start; }
  }
  @media (max-width: 679px) {
    .selected-work { padding: 36px 20px 48px; }
    .selected-heading > p { font-size: 17px; }
    .feature-body { font-size: 18px; }
    .independent-projects { padding-top: 55px; }
    .story-heading { display: block; margin-bottom: 38px; }
    .story-heading h3 { font-size: clamp(37px, 9.6vw, 48px); }
    .story-intro { font-size: 16px; line-height: 1.55; }
    .preview-toggle { margin-top: 12px; }
    .project-story { gap: 48px; }
    .project-title { font-size: 36px; }
    .project-line { font-size: 16px; margin: 10px 0 14px; }
    .project-details { margin-top: 12px; }
    .project-stack { flex: 1 1 140px; max-width: 100%; font-size: 11px; }
    .project-tags li { font-size: 11px; }
  }
  @media (prefers-reduced-motion: reduce) {
    .project-chapter .preview-link :global([data-preview]) { transition: none; }
  }
</style>
