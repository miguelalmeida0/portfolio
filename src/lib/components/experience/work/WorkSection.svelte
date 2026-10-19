<script lang="ts">
  import { onMount } from 'svelte';
  import { destinationLink } from '$lib/navigation/destination-link';
  import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
  import { f24Ownership } from '$lib/content/work-projects';
  import PreviewMedia from './PreviewMedia.svelte';
  import { selectedProjects } from './selected-projects';
  import { createPreviewController } from './preview-controller';
  import { workMotion } from './work-motion';
  import { chapterTitles } from '$lib/motion/actions/chapterTitles';
  let { current = false }: { current?: boolean } = $props();
  let section: HTMLElement;
  let controller: ReturnType<typeof createPreviewController> | undefined;
  let blockedIds = $state<string[]>([]);
  let videosPaused = $state(false);
  onMount(() => {
    controller = createPreviewController(section, selectedProjects, ids => {
      blockedIds = ids;
    }, paused => { videosPaused = paused; });
    return () => controller?.destroy();
  });
  function toggleVideos() {
    videosPaused = !videosPaused;
    controller?.setPaused(videosPaused);
  }
</script>

<section data-sveltekit-preload-data="hover" id="work" class="selected-work bg-[var(--forest)] text-[var(--paper)]" class:current-work={current} aria-labelledby="work-title" bind:this={section} use:workMotion={current}>
  <div class="selected-inner mx-auto">
    <header class="selected-heading flex flex-wrap items-end justify-between gap-6" data-current-narrative={current || undefined} use:chapterTitles={current ? '[data-default-work-title]' : 'h2'}>
      <h2 id="work-title" data-ask-id="selwork" class="font-extrabold tracking-tight">{#if current}<span data-current-word>Selected</span> <span data-current-word>Work</span>{:else}Selected Work{/if}</h2>
      <p>Professional experience.<br />Independent ideas, built.</p>
    </header>
    <article class="f24-feature" data-f24-feature aria-labelledby="f24-title">
      <a class="f24-photo-link" data-current-assembly={current || undefined} href="/work/f24" aria-label="F24 case study" {...destinationLink('/work/f24')}>
        <figure class="f24-moment f24-working" data-current-piece={current || undefined}>
          <img src="/projects/f24/hackathon-working.webp" alt="Miguel and a colleague working together at their desks during the F24 hackathon." width="640" height="854" loading="lazy" />
          <figcaption>Building together.</figcaption>
        </figure>
        <figure class="f24-moment f24-team" data-current-piece={current || undefined}>
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
        <a class="case-action inline-flex items-center justify-center" href="/work/f24" {...destinationLink('/work/f24')}>
          <span class="case-label">View case study</span>
          <span class="case-reveal" aria-hidden="true">View case study</span>
          <span class="case-orbit" aria-hidden="true">
            <svg class="case-arrow case-arrow-out" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" focusable="false"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
            <svg class="case-arrow case-arrow-in" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" focusable="false"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
          </span>
        </a>
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
          <div class="project-shell" data-project-chapter={current ? project.id : undefined} data-chapter-tone={current ? (index % 2 ? 'forest' : 'lime') : undefined} style:--chapter-index={index}>
          <article
            class="project-row"
            class:reversed={index % 2 === 1}
            data-selected-project={project.id}
            data-current-reveal={current || undefined}
            aria-labelledby={`selected-${project.id}`}
          >
            {#if current}<span class="chapter-shade" data-chapter-shade aria-hidden="true"></span>{/if}
            <div class="project-media">
              <a class="preview-link" href={project.href} {...destinationLink(project.href)} aria-label={`${project.name} case study`}>
                {#if current}<div data-current-art><PreviewMedia {project} /></div>{:else}<PreviewMedia {project} />{/if}
              </a>
              {#if blockedIds.includes(project.id)}
                <button class="preview-retry" type="button"
                  aria-label={`Play ${project.name} and other blocked project videos`}
                  onclick={() => controller?.retryAll()}>Play videos <span aria-hidden="true">▶</span></button>
              {/if}
            </div>
            <div class="project-info">
              <p class="project-number">{String(index + 1).padStart(2, '0')} / {project.category}</p>
              <h4 id={`selected-${project.id}`} class="project-title" data-current-counter={current || undefined}>
                <a href={project.href} {...destinationLink(project.href)}>{project.name} <ArrowUpRight size={20} strokeWidth={1.8} aria-hidden="true" /></a>
              </h4>
              <p class="project-line">{project.line}</p>
              <ul class="capabilities project-tags" aria-label={`${project.name} capabilities`}>
                {#each project.tags as tag}<li>{tag}</li>{/each}
              </ul>
              <p class="project-stack" aria-label={`${project.name} technology stack`}>{project.stack.join(' · ')}</p>
              <div class="project-actions">
                {#if current}<a href={project.href} {...destinationLink(project.href)}>View case study <ArrowUpRight size={18} strokeWidth={1.8} aria-hidden="true" /></a>{/if}
                {#if project.live}<a href={project.live} {...destinationLink(project.live)}>Live app <ArrowUpRight size={18} strokeWidth={1.8} aria-hidden="true" /></a>{/if}
                {#if project.code}<a href={project.code} {...destinationLink(project.code)}>Code <ArrowUpRight size={18} strokeWidth={1.8} aria-hidden="true" /></a>{/if}
              </div>
            </div>
          </article>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>

<style>
  .project-shell { display: contents; }
  .chapter-shade { display: none; }
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
  .case-action {
    --case-duration: 450ms;
    --case-ease: cubic-bezier(0.785, 0.135, 0.15, 0.86);
    --case-scale: 1;
    --case-icon: calc(36px * var(--case-scale));
    --case-inset: calc(5px * var(--case-scale));
    --case-padding: 0 62px 0 28px;
    --case-clip: inset(calc(50% - var(--case-icon) / 2) var(--case-inset) calc(50% - var(--case-icon) / 2) calc(100% - var(--case-icon) - var(--case-inset)) round 999px);
    --case-orbit-bg: var(--plum);
    --case-orbit-ink: var(--lime);
    --case-arrow-out: translate(-50%, -50%) scale(1);
    --case-arrow-in: translate(-170%, -50%) scale(0);
    position: relative;
    isolation: isolate;
    box-sizing: border-box;
    flex-shrink: 0;
    justify-content: flex-start;
    min-height: max(58px, calc(48px * var(--case-scale)));
    padding: var(--case-padding);
    overflow: hidden;
    border: 2px solid var(--lime);
    border-radius: var(--r-pill);
    background: var(--lime);
    color: var(--ink);
    font-size: 21px;
    font-weight: 750;
    line-height: 1;
    margin-top: 30px;
    white-space: nowrap;
    text-decoration: none;
    touch-action: manipulation;
  }
  .case-action span, .case-arrow { pointer-events: none; }
  .case-label { position: relative; }
  /* Clip the plum surface and its lime label together: text never fades
     through an intermediate color or appears on the wrong background. */
  .case-reveal {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    padding: var(--case-padding);
    background: var(--plum);
    color: var(--lime);
    clip-path: var(--case-clip);
    transition: clip-path var(--case-duration) var(--case-ease);
  }
  .case-orbit {
    position: absolute;
    right: var(--case-inset);
    top: 50%;
    width: var(--case-icon);
    height: var(--case-icon);
    transform: translateY(-50%);
    overflow: hidden;
    border-radius: 50%;
    background: var(--case-orbit-bg);
    color: var(--case-orbit-ink);
  }
  .case-arrow {
    position: absolute;
    top: 50%;
    left: 50%;
    width: calc(19px * var(--case-scale));
    height: calc(19px * var(--case-scale));
    transition: transform var(--case-duration) var(--case-ease);
  }
  .case-arrow-out { transform: var(--case-arrow-out); }
  .case-arrow-in { transform: var(--case-arrow-in); }
  .case-action:is(:focus-visible, :active) {
    --case-clip: inset(0 0 0 0 round 999px);
    --case-orbit-bg: var(--lime);
    --case-orbit-ink: var(--plum);
    --case-arrow-out: translate(65%, -50%) scale(0);
    --case-arrow-in: translate(-50%, -50%) scale(1);
  }
  @media (hover: hover) and (pointer: fine) {
    .case-action:hover {
      --case-clip: inset(0 0 0 0 round 999px);
      --case-orbit-bg: var(--lime);
      --case-orbit-ink: var(--plum);
      --case-arrow-out: translate(65%, -50%) scale(0);
      --case-arrow-in: translate(-50%, -50%) scale(1);
    }
  }
  .case-action:focus-visible { outline: 3px solid var(--paper); outline-offset: 4px; }
  /* Keep the circle and touch target sized consistently within the site's 80% desktop zoom.
     Keep the inherited typography at its existing size. */
  @media screen and (min-width: 1024px) {
    .case-action { --case-scale: 1.25; }
  }
  @media (prefers-reduced-motion: reduce) {
    .case-reveal, .case-arrow { transition: none; }
  }
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
