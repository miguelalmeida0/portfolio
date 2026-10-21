<script lang="ts">
  import { destinationLink } from '$lib/navigation/destination-link';
  import { selectedProjects } from './selected-projects';
  import PreviewMedia from './PreviewMedia.svelte';
  let { blockedIds, videosPaused, toggleVideos, retryVideos }: {
    blockedIds: string[]; videosPaused: boolean; toggleVideos: () => void; retryVideos: () => void;
  } = $props();
</script>

<section class="project-collection" id="projects" aria-labelledby="projects-heading">
  <header class="collection-heading">
    <h3 id="projects-heading">My projects</h3>
    <div class="collection-intro">
      <p>Three products I designed and built end to end.<br />Try the live apps and explore the code.</p>
      <button class="collection-playback" type="button" onclick={toggleVideos}
        aria-label={videosPaused ? 'Play project videos' : 'Pause project videos'}
        title={videosPaused ? 'Play project videos' : 'Pause project videos'}>{videosPaused ? '▶' : 'Ⅱ'}</button>
    </div>
  </header>
  <div class="collection-grid">
    {#each selectedProjects as project, index}
      <article class="project-card" data-selected-project={project.id} aria-labelledby={`selected-${project.id}`}>
        <div class="collection-media">
          <a href={project.href} {...destinationLink(project.href)} aria-label={`${project.name} case study`}><PreviewMedia {project} /></a>
          <span class="collection-category">{String(index + 1).padStart(2, '0')} · {project.category}</span>
          {#if blockedIds.includes(project.id)}
            <button type="button" class="collection-retry" aria-label={`Play ${project.name} and other blocked project videos`} onclick={retryVideos}>Play videos <span aria-hidden="true">▶</span></button>
          {/if}
        </div>
        <div class="collection-info">
          <h4 id={`selected-${project.id}`}><a href={project.href} {...destinationLink(project.href)}>{project.name}</a></h4>
          <p class="collection-line">{project.line}</p>
          <p class="collection-detail"><strong>The hard part.</strong> {project.challenge}</p>
        </div>
        <footer class="collection-footer">
          <span class="collection-evidence">{project.evidence}</span>
          <div class="collection-actions">
            {#if project.live}<a href={project.live} {...destinationLink(project.live)} aria-label={`Open ${project.name} live app`}>Live</a>{/if}
            {#if project.code}<a href={project.code} {...destinationLink(project.code)} aria-label={`View ${project.name} code`}>Code</a>{/if}
          </div>
        </footer>
      </article>
    {/each}
  </div>
</section>

<style>
  .project-collection { --collection-ink: #142d23; --collection-muted: #526657; padding: 64px 3.9% 80px; background: #eef2e1; color: var(--collection-ink); scroll-margin-top: 100px; }
  .collection-heading { display: flex; justify-content: space-between; align-items: end; gap: 32px; margin-bottom: 28px; }
  h3 { margin: 0; font: 700 clamp(48px, 5.8vw, 92px)/1 'Lab Antonio', 'Arial Narrow', sans-serif; text-transform: uppercase; letter-spacing: -.025em; }
  .collection-intro { display: flex; align-items: center; gap: 16px; padding-bottom: 4px; }
  .collection-intro p { margin: 0; font-size: var(--d1-body-size, 17px); line-height: 1.55; color: var(--collection-muted); }
  .collection-playback { flex: none; width: 44px; height: 44px; border: 1px solid #b8c4a6; border-radius: 50%; background: transparent; color: inherit; cursor: pointer; }
  .collection-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; }
  .project-card { min-width: 0; display: flex; flex-direction: column; overflow: hidden; border: 1px solid #d8dfc6; border-radius: 24px; background: #faf8ee; transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease, background-color 180ms ease; }
  .project-card:focus-within { border-color: #1c352b; background: #fffdf4; box-shadow: 0 14px 30px #142d2314; }
  @media (hover: hover) and (pointer: fine) {
    .project-card:hover { border-color: #1c352b; background: #fffdf4; box-shadow: 0 14px 30px #142d2314; transform: translateY(-3px); }
  }
  .collection-media { min-width: 0; position: relative; background: #eef0e3; }
  .collection-media > a { display: block; aspect-ratio: 4 / 3; overflow: hidden; }
  .collection-media :global(.preview-frame) { height: 100%; border-radius: 0; background: #eef0e3; }
  .collection-category { position: absolute; top: 14px; left: 14px; z-index: 3; pointer-events: none; padding: 6px 11px; border-radius: 999px; background: #1c352b; color: #faf8ee; font-size: 11px; line-height: 1; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; }
  .collection-info { flex: 1; min-width: 0; padding: 24px 24px 20px; }
  h4 { margin: 0; font: 700 clamp(32px, 3vw, 48px)/1.1 'Lab Antonio', 'Arial Narrow', sans-serif; text-transform: uppercase; }
  h4 a { display: inline-flex; align-items: center; min-height: calc(44px / var(--lab-zoom, 1)); color: inherit; text-decoration: none; }
  .collection-line { margin: 10px 0 0; font-size: var(--d1-body-size, 17px); line-height: 1.45; }
  .collection-detail { margin: 16px 0 0; font-size: var(--d1-body-size, 17px); line-height: 1.55; color: var(--collection-muted); }
  .collection-detail strong { font-weight: 600; color: var(--collection-ink); }
  .collection-footer { display: flex; justify-content: space-between; align-items: center; gap: 14px; margin-top: auto; padding: 12px 24px; border-top: 1px solid #e0e4d2; }
  .collection-evidence { font-size: 11px; font-weight: 600; line-height: 1.4; }
  .collection-actions { display: flex; flex: none; gap: 16px; }
  .collection-actions a { display: inline-flex; align-items: center; min-height: 44px; color: inherit; font-size: 14px; font-weight: 600; text-decoration: underline; text-underline-offset: 6px; }
  .collection-retry { position: absolute; bottom: 12px; right: 12px; z-index: 3; min-height: 44px; padding: 8px 14px; border-radius: 999px; background: var(--collection-ink); color: #faf8ee; }
  a:focus-visible, button:focus-visible { outline: 3px solid #68143e; outline-offset: 3px; }
  @media (max-width: 1100px) {
    .collection-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }
    .collection-heading { align-items: start; }
    .collection-info { padding: 20px; }
    .collection-footer { padding: 10px 20px; }
  }
  @media (max-width: 639px) {
    .project-collection { padding: 36px 16px 48px; }
    .collection-heading { display: block; margin-bottom: 22px; }
    h3 { font-size: 46px; }
    .collection-intro { justify-content: space-between; margin-top: 14px; }
    .collection-grid { grid-template-columns: minmax(0, 1fr); gap: 24px; }
    .project-card { border-radius: 20px; }
    .collection-media > a { aspect-ratio: 3 / 2; }
    h4 { font-size: 36px; }
  }
  @media (prefers-reduced-motion: reduce) { .project-card { transition: none; } }
  :global(html[data-motion='reduced']) .project-card { transition: none; }
</style>
