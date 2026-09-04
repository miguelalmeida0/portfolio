<script lang="ts">
  import type { ProjectTile } from '$lib/content/project-media';
  import ProjectMedia from './ProjectMedia.svelte';

  export let project: ProjectTile;

  let active = false;
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
  <a href={project.href} aria-label={`${project.title}. ${project.shortDescription}`}>
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
    </div>

    <div class="tile-copy">
      <div class="tile-meta">
        <span>{project.category}</span>
        {#if project.status}<span>{project.status}</span>{/if}
      </div>
      <div class="tile-title-row">
        <h3>{project.title}</h3>
        <span aria-hidden="true">↗</span>
      </div>
      <p>{project.shortDescription}</p>
      {#if project.technicalTension}
        <small>{project.technicalTension}</small>
      {/if}
    </div>
  </a>
</article>

<style>
  .media-tile {
    min-width: 0;
    background: transparent;
  }

  a {
    display: grid;
    gap: 1rem;
    color: inherit;
  }

  a:focus-visible {
    outline: 2px solid var(--ring);
    outline-offset: 5px;
  }

  .tile-surface {
    position: relative;
    aspect-ratio: 16 / 10;
    overflow: hidden;
    background: #0a0a0a;
  }

  .tile-copy {
    display: grid;
    gap: 0.45rem;
    padding-right: clamp(0.5rem, 2vw, 2rem);
  }

  .tile-meta,
  small {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem 0.8rem;
    color: rgb(244 234 220 / 0.62);
    font-family: var(--font-mono);
    font-size: 0.68rem;
    font-weight: 760;
    letter-spacing: 0.1em;
    line-height: 1.45;
    text-transform: uppercase;
  }

  .tile-meta span + span::before {
    margin-right: 0.8rem;
    color: var(--accent);
    content: '·';
  }

  .tile-title-row {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 1rem;
  }

  h3,
  p {
    margin: 0;
  }

  h3 {
    color: var(--foreground);
    font-size: clamp(1.3rem, 1.8vw, 1.85rem);
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.08;
  }

  .tile-title-row > span {
    color: var(--accent);
    font-size: 1.45rem;
    transition: transform 220ms ease;
  }

  a:hover .tile-title-row > span,
  a:focus-visible .tile-title-row > span {
    transform: translate(0.15rem, -0.15rem);
  }

  p {
    max-width: 42rem;
    color: rgb(244 234 220 / 0.68);
    font-size: clamp(0.82rem, 0.95vw, 0.92rem);
    font-weight: 520;
    line-height: 1.48;
  }

  small {
    max-width: 48rem;
    color: rgb(244 234 220 / 0.48);
  }

  .evidence-sequence {
    display: grid;
    align-content: start;
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
    color: rgb(244 234 220 / 0.64);
    transition:
      color 260ms ease,
      transform 260ms ease;
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

  @media (max-width: 720px) {
    a {
      gap: 0.72rem;
    }

    .tile-surface {
      aspect-ratio: 16 / 10;
    }

    .tile-copy {
      gap: 0.3rem;
      padding-right: 0.2rem;
    }

    h3 {
      font-size: clamp(1.1rem, 5vw, 1.35rem);
      line-height: 1.05;
    }

    .tile-meta {
      max-width: 22rem;
      font-size: 0.56rem;
      letter-spacing: 0.08em;
    }

    .tile-meta span:nth-child(2),
    small {
      display: none;
    }

    .tile-title-row {
      align-items: center;
      gap: 0.65rem;
    }

    .tile-title-row > span {
      font-size: 1.05rem;
    }

    p {
      display: -webkit-box;
      overflow: hidden;
      font-size: 0.76rem;
      line-height: 1.4;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      line-clamp: 2;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .tile-title-row > span,
    .evidence-sequence li {
      transition: none;
    }

    a:hover .tile-title-row > span,
    a:focus-visible .tile-title-row > span,
    .evidence-sequence .active-step {
      transform: none;
    }
  }
</style>
