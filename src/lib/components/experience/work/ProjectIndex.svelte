<script lang="ts">
  import { destinationLink } from '$lib/navigation/destination-link';
  import { workProjects, type WorkProject } from '$lib/content/work-projects';
  let { project, select }: { project: WorkProject; select: (project: WorkProject) => void } = $props();
</script>
<div class="index-column">
  <nav aria-label="Selected projects">
    <ol class="project-index">
      {#each workProjects as item}
        <li><button type="button" data-project-row data-ask-id={item.id === 'second-voice' ? 'w-sv' : `w-${item.id}`} aria-current={item.id === project.id ? 'true' : undefined} onclick={() => select(item)}>
          <span class="project-name">{item.name}{' '}<span class="subtitle">{item.sub}</span></span>
        </button></li>
      {/each}
    </ol>
  </nav>
  <div class="project-meta" data-index-meta>
    <p class="role">{project.role}</p>
    <p class="stack">{project.stack}</p>
    <div class="links">
      <a class="primary-link" href={project.cta.href} {...destinationLink(project.cta.href)}>{project.cta.label}</a>
      <a class="secondary-link" href={project.cta2.href} {...destinationLink(project.cta2.href)}>{project.cta2.label}</a>
      {#if project.source && project.cta2.href !== project.source}<a class="source-link" href={project.source} {...destinationLink(project.source)}>Source</a>{/if}
    </div>
  </div>
</div>
<style>
  .index-column { display: flex; flex-direction: column; justify-content: center; gap: 32px; min-width: 0; }
  .project-index { list-style: none; margin: 0; padding: 0; }
  /* .42 fails AA for selectable text; retain the hierarchy at readable contrast. */
  button { position: relative; isolation: isolate; width: 100%; display: grid; grid-template-columns: minmax(0,1fr); align-items: start; gap: 8px; padding: 17px 0; text-align: left; color: inherit; opacity: .72; cursor: pointer; transition: opacity 180ms ease; }
  button::after { content: ''; position: absolute; z-index: -1; inset: 4px -12px; border-radius: 12px; }
  button[aria-current='true'] { color: var(--work-cta-text); }
  button[aria-current='true']::after { background: var(--work-cta); }
  .project-name { font: 800 42px/.98 var(--hero-font); letter-spacing: -.035em; }
  .subtitle { display: block; margin-top: 8px; font: 400 14px/1.4 var(--hero-font); letter-spacing: 0; }
  button[aria-current='true'], button:hover, button:focus-visible { opacity: 1; }
  .role { font: 500 18px/1.4 var(--hero-font); }
  .stack { margin-top: 12px; font: 400 13px/1.6 var(--hero-font); white-space: pre-line; }
  .links { margin-top: 22px; display: flex; flex-wrap: wrap; align-items: center; gap: 12px 18px; }
  .primary-link { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 48px; padding: 0 20px; border-radius: 999px; background: var(--work-cta); color: var(--work-cta-text); font-size: 14px; font-weight: 700; }
  .secondary-link { font: 600 14px/1.4 var(--hero-font); text-decoration: underline; text-underline-offset: 4px; }
  .source-link { font: 600 14px/1.4 var(--hero-font); text-decoration: underline; text-underline-offset: 4px; }
  @media (min-width: 1100px) and (max-width: 1279px) { .project-name { font-size: 36px; } }
  @media (max-width: 1099px) {
    .index-column { display: contents; }
    nav { order: 0; }
    .project-index { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 12px; }
    button { grid-template-columns: minmax(0,1fr); gap: 4px; padding: 12px 8px; border-bottom: 2px solid transparent; }
    button::after { inset: 4px 0; }
    .project-name { font-size: 24px; }
    .subtitle { font-size: 13px; }
    .project-meta { order: 2; display: grid; grid-template-columns: 1fr 1fr; gap: 8px 24px; }
    .links { grid-column: 2; grid-row: 1 / 3; margin-top: 0; justify-content: flex-end; }
    .stack { margin-top: 0; }
  }
  @media (max-width: 767px) {
    .project-index { grid-template-columns: repeat(2,minmax(0,1fr)); gap: 0 12px; }
    button { min-height: 48px; padding: 14px 10px; }
    .project-name { font-size: 20px; }
    .subtitle { display: none; }
    .project-meta { display: block; }
    .role { font-size: 18px; }
    .stack { margin-top: 6px; font-size: 11px; }
    .links { margin-top: 14px; justify-content: flex-start; }
  }
  @media (prefers-reduced-motion: reduce) { button { transition: none; } }
</style>
