<script lang="ts">
  import { destinationLink } from '$lib/navigation/destination-link';
  import { workProjects } from '$lib/content/work-projects';
  import ProjectIndex from './ProjectIndex.svelte';
  import Stage from './Stage.svelte';
  let project = $state(workProjects[0]);
</script>

<section id="work" aria-labelledby="work-title" class="work-section" data-project={project.id}>
  <header class="work-heading" data-align="left"><h2 id="work-title" data-ask-id="selwork">Selected Work</h2></header>
  <!-- SSR and hydration share the current work interface from the first paint. -->
    <div class="work-body">
      <ProjectIndex {project} select={next => project = next} />
      <div class="stage-region" aria-live="polite" aria-atomic="false">
        {#key project.id}<Stage {project} />{/key}
      </div>
    </div>
  <noscript>
    <div class="static-projects">
      {#each workProjects as item}
        <article>
          <img src={item.poster} alt={item.alt} width="800" height="500" loading="lazy" />
          <h3>{item.name}</h3><p>{item.line}</p><p>{item.role}</p><p class="static-stack">{item.stack}</p>
          <a href={item.cta.href} {...destinationLink(item.cta.href)}>{item.cta.label}</a><a href={item.cta2.href} {...destinationLink(item.cta2.href)}>{item.cta2.label}</a>
        </article>
      {/each}
    </div>
  </noscript>
</section>

<style>
  .work-section { --work-bg: var(--lime); --work-text: var(--ink); --work-rule: rgba(20,42,34,.2); --work-cta: var(--plum); --work-cta-text: var(--paper); margin-top: 60px; padding: 44px 120px 40px; background: var(--work-bg); color: var(--work-text); font-family: var(--hero-font); transition: background .75s cubic-bezier(.22,.8,.2,1), color .5s; scroll-margin-top: 0; }
  [data-project='f24'] { --work-bg: var(--forest); --work-text: var(--page); --work-rule: rgba(240,243,228,.22); --work-cta: var(--lime); --work-cta-text: var(--ink); }
  [data-project='flow'] { --work-bg: var(--sage); }
  [data-project='leu'] { --work-bg: var(--plum); --work-text: var(--paper); --work-rule: rgba(249,247,238,.24); --work-cta: var(--lime); --work-cta-text: var(--ink); }
  .work-heading { display: flex; justify-content: space-between; padding-bottom: 12px; border-bottom: 1px solid var(--work-rule); font-size: 15px; }
  .work-heading h2 { font-size: inherit; font-weight: 400; }
  .work-body { display: grid; grid-template-columns: 330px minmax(0,1fr); gap: 44px; margin-top: 28px; }
  .stage-region { min-width: 0; }
  @media (scripting: none) { .work-body { display: none; } }
  .work-section :global(:focus-visible) { outline: 3px solid var(--work-cta); outline-offset: 3px; }
  .work-section :global(.stage-card :focus-visible) { outline-color: var(--plum); }
  .work-section :global(.primary-link:focus-visible), .work-section :global(.apply:focus-visible) { outline: 3px solid var(--work-text); outline-offset: 3px; }
  .static-projects { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 40px; margin-top: 28px; }
  .static-projects article { min-width: 0; }
  .static-projects img { width: 100%; height: 240px; object-fit: contain; background: var(--paper); border-radius: 16px; }
  .static-projects h3 { margin-top: 16px; font-size: 24px; font-weight: 800; }
  .static-projects p { margin-block: 8px; }
  .static-stack { font: 400 11px/1.8 var(--hero-font); }
  .static-projects a { display: inline-block; padding: 12px 20px 12px 0; text-decoration: underline; }
  @media (min-width: 1100px) and (max-width: 1279px) { .work-section { padding-inline: 64px; } .work-body { grid-template-columns: 280px minmax(0,1fr); gap: 32px; } }
  @media (max-width: 1099px) { .work-section { padding-inline: 64px; } .work-body { display: flex; flex-direction: column; gap: 24px; margin-top: 12px; } .stage-region { order: 1; } }
  @media (max-width: 767px) { .work-section { margin-top: 40px; padding: 28px 20px 32px; } .work-body { gap: 20px; } .static-projects { grid-template-columns: 1fr; } }
  @media (prefers-reduced-motion: reduce) { .work-section { transition: none; } }
</style>
