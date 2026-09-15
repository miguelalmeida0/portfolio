<script lang="ts">
  import type { ProjectTile } from '$lib/content/project-media';
  import ProjectMedia from './ProjectMedia.svelte';

  export let project: ProjectTile;

  let active = false;

  $: isVigia = project.id === 'vigia';
  $: isSecondVoice = project.id === 'second-voice-ai';
</script>

<article
  class={`media-tile size-${project.size}`}
  class:featured={project.featured}
  data-project-tile={project.id}
  data-project-size={project.size}
  on:mouseenter={() => (active = true)}
  on:mouseleave={() => (active = false)}
  on:focusin={() => (active = true)}
  on:focusout={(event) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) active = false;
  }}
>
  <div class="tile-surface">
    {#if project.media?.publicSafe}
      <ProjectMedia media={project.media} {active} featured={Boolean(project.featured)} />
    {:else if project.sequence}
      <ol class="evidence-sequence" aria-label={project.sequenceLabel}>
        {#each project.sequence as step, index}
          <li class:active-step={active && index === 1}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{step}</strong>
          </li>
        {/each}
      </ol>
    {/if}
    <a class="surface-link" href={project.href} aria-label={`Open ${project.title}`}>
      <span class="sr-only">Open {project.title}</span>
    </a>
  </div>

  <div class="tile-copy">
    <div class="tile-meta">
      <span>{project.category}</span>
      {#if project.status}<span>{project.status}</span>{/if}
    </div>
    <a class="title-link" href={project.href} aria-label={`${project.title}. ${project.shortDescription}`}>
      <h3>{project.title}</h3>
      <span aria-hidden="true">↗</span>
    </a>
    <p>{project.shortDescription}</p>
    {#if project.valueLine}
      <small>{project.valueLine}</small>
    {/if}

    {#if isVigia || isSecondVoice}
      <div class="project-actions" aria-label={`${project.title} links`}>
        <a class="action action-secondary" href={project.href}>Case study</a>
        {#if isVigia}
          <a
            class="action action-primary"
            href="https://vigia-public-demo.onrender.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open live demo <span aria-hidden="true">↗</span>
          </a>
        {:else}
          <a class="action action-primary" href={project.href}>
            Open Second Voice AI <span aria-hidden="true">→</span>
          </a>
        {/if}
      </div>
    {/if}
  </div>
</article>

<style>
  .media-tile {
    display: grid;
    min-width: 0;
    gap: 1rem;
    background: transparent;
  }

  .featured {
    grid-column: 1 / -1;
  }

  .tile-surface {
    position: relative;
    aspect-ratio: 16 / 10;
    overflow: hidden;
    background: #0a0a0a;
  }

  .featured .tile-surface {
    aspect-ratio: 21 / 9;
  }

  .surface-link {
    position: absolute;
    inset: 0;
    z-index: 2;
  }

  .surface-link:focus-visible,
  .title-link:focus-visible,
  .action:focus-visible {
    outline: 2px solid var(--ring);
    outline-offset: 3px;
  }

  .tile-copy {
    display: grid;
    gap: 0.55rem;
    padding-right: clamp(0.5rem, 2vw, 2rem);
  }

  .tile-meta,
  small {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem 0.8rem;
    color: rgb(244 234 220 / 0.7);
    font-family: var(--font-sans);
    font-size: var(--text-label);
    font-weight: 600;
    letter-spacing: 0;
    line-height: 1.5;
  }

  .tile-meta span + span::before {
    margin-right: 0.8rem;
    color: var(--accent);
    content: '·';
  }

  .title-link {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 1rem;
    color: inherit;
  }

  h3,
  p {
    margin: 0;
  }

  h3 {
    color: var(--foreground);
    font-size: var(--text-card);
    font-weight: 700;
    letter-spacing: -0.025em;
    line-height: 1.06;
  }

  .featured h3 {
    font-size: clamp(1.8rem, 2.7vw, 2.85rem);
  }

  .title-link > span {
    color: var(--accent);
    font-size: 1.45rem;
    transition: transform var(--interaction-duration) var(--interaction-ease);
  }

  .title-link:hover > span,
  .title-link:focus-visible > span {
    transform: translate(0.15rem, -0.15rem);
  }

  p {
    max-width: 46rem;
    color: rgb(244 234 220 / 0.77);
    font-size: var(--text-body);
    font-weight: 400;
    line-height: 1.58;
  }

  small {
    max-width: 48rem;
    color: rgb(244 234 220 / 0.74);
    font-weight: 500;
  }

  .project-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.65rem;
    margin-top: 0.45rem;
  }

  .action {
    display: inline-flex;
    min-height: 2.8rem;
    align-items: center;
    justify-content: center;
    gap: 0.45rem;
    border: 1px solid rgb(244 234 220 / 0.2);
    border-radius: 999px;
    padding: 0.68rem 0.95rem;
    font-size: 0.88rem;
    font-weight: 700;
    line-height: 1;
    transition:
      background var(--interaction-duration) var(--interaction-ease),
      border-color var(--interaction-duration) var(--interaction-ease),
      color var(--interaction-duration) var(--interaction-ease),
      transform var(--interaction-duration) var(--interaction-ease);
  }

  .action-secondary {
    color: rgb(244 234 220 / 0.72);
    background: transparent;
  }

  .action-primary {
    border-color: var(--accent);
    background: var(--accent);
    color: #090909;
  }

  .action:hover,
  .action:focus-visible {
    transform: translateY(-1px);
  }

  .action-secondary:hover,
  .action-secondary:focus-visible {
    border-color: rgb(244 234 220 / 0.45);
    color: var(--foreground);
  }

  .action-primary:hover,
  .action-primary:focus-visible {
    background: var(--foreground);
    border-color: var(--foreground);
    color: #090909;
  }

  .evidence-sequence {
    display: grid;
    align-content: center;
    gap: 1px;
    min-height: 100%;
    margin: 0;
    padding: clamp(1.2rem, 2.5vw, 2.2rem);
    background: #0a0a0a;
    list-style: none;
  }

  .evidence-sequence li {
    display: grid;
    grid-template-columns: 2.6rem minmax(0, 1fr);
    gap: 1rem;
    align-items: center;
    min-height: 3.5rem;
    border-top: 1px solid rgb(244 234 220 / 0.15);
    color: rgb(244 234 220 / 0.68);
    transition: color 260ms ease, transform 260ms ease;
  }

  .evidence-sequence li:last-child {
    border-bottom: 1px solid rgb(244 234 220 / 0.15);
  }

  .evidence-sequence span {
    color: var(--accent);
    font-family: var(--font-mono);
    font-size: 0.72rem;
  }

  .evidence-sequence strong {
    font-size: clamp(1rem, 1.5vw, 1.25rem);
    line-height: 1.25;
  }

  .evidence-sequence .active-step {
    color: var(--foreground);
    transform: translateX(0.4rem);
  }

  @media (max-width: 980px) {
    .featured {
      grid-column: auto;
    }

    .featured .tile-surface {
      aspect-ratio: 16 / 10;
    }
  }

  @media (max-width: 720px) {
    .media-tile {
      gap: 0.78rem;
    }

    .tile-copy {
      gap: 0.38rem;
      padding-right: 0.2rem;
    }

    h3,
    .featured h3 {
      font-size: clamp(1.35rem, 6vw, 1.72rem);
    }

    .tile-meta,
    small {
      font-size: var(--text-label);
      letter-spacing: 0;
    }

    .tile-meta span:nth-child(2) {
      display: none;
    }

    .title-link {
      align-items: center;
      gap: 0.65rem;
    }

    .title-link > span {
      font-size: 1.1rem;
    }

    p {
      font-size: 1rem;
      line-height: 1.5;
    }

    small {
      color: rgb(244 234 220 / 0.74);
    }

    .project-actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
      margin-top: 0.6rem;
    }

    .action {
      width: 100%;
      padding-inline: 0.7rem;
      font-size: 0.82rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .title-link > span,
    .evidence-sequence li,
    .action {
      transition: none;
    }

    .title-link:hover > span,
    .title-link:focus-visible > span,
    .evidence-sequence .active-step,
    .action:hover,
    .action:focus-visible {
      transform: none;
    }
  }
</style>
