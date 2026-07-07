<script lang="ts" module>
  export type ProjectCard = {
    title: string;
    eyebrow: string;
    description: string;
    imageSrc: string;
    href: string;
    tags: string[];
  };
</script>

<script lang="ts">
  export let items: ProjectCard[] = [];
  export let initialIndex = 0;

  let active = initialIndex;

  $: activeItem = items[active] ?? items[0];

  const setActive = (index: number) => {
    active = index;
  };
</script>

{#if activeItem}
  <div class="project-stack" aria-label="Selected project cards">
    <div class="project-stage">
      {#each items as item, index}
        <button
          type="button"
          class:active-card={active === index}
          class="project-card"
          style={`--card-index:${index}; --active-offset:${index - active}; --distance:${Math.abs(index - active)};`}
          data-testid={`selected-work-card-${index}`}
          aria-pressed={active === index}
          aria-label={`Show ${item.title}`}
          on:click={() => setActive(index)}
        >
          <img src={item.imageSrc} alt={`${item.title} project screenshot`} loading="lazy" />
          <span class="project-card-shade" aria-hidden="true"></span>
          <span class="project-card-copy">
            <span class="project-eyebrow">{item.eyebrow}</span>
            <span class="project-title">{item.title}</span>
            <span class="project-description">{item.description}</span>
          </span>
        </button>
      {/each}
    </div>

    <div class="project-controls">
      <div class="project-dots" aria-label="Choose project">
        {#each items as item, index}
          <button
            type="button"
            class:active-dot={active === index}
            aria-label={`Show ${item.title}`}
            aria-pressed={active === index}
            on:click={() => setActive(index)}
          ></button>
        {/each}
      </div>

      <div class="project-summary">
        <span>{String(active + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</span>
        <strong>{activeItem.title}</strong>
        <a href={activeItem.href} class="project-link">View project</a>
      </div>
    </div>
  </div>
{/if}

<style>
  .project-stack {
    display: grid;
    gap: clamp(1.25rem, 3vw, 2rem);
  }

  .project-stage {
    position: relative;
    min-height: clamp(25rem, 56vw, 43rem);
    overflow: clip;
  }

  .project-card {
    position: absolute;
    top: 50%;
    left: 50%;
    width: min(50rem, 72vw);
    aspect-ratio: 16 / 10;
    border: 1px solid color-mix(in oklch, var(--border) 82%, transparent);
    border-radius: 8px;
    padding: 0;
    overflow: hidden;
    background: var(--card);
    color: white;
    cursor: pointer;
    box-shadow: 0 34px 90px -50px oklch(0 0 0 / 0.55);
    transform:
      translate(-50%, -50%)
      translateX(calc(var(--active-offset) * 14%))
      translateY(calc(var(--distance) * 1.4rem))
      rotate(calc(var(--active-offset) * 5deg))
      scale(calc(1 - var(--distance) * 0.08));
    transform-origin: center;
    opacity: calc(1 - var(--distance) * 0.18);
    z-index: calc(10 - var(--distance));
    transition:
      transform 420ms cubic-bezier(0.22, 1, 0.36, 1),
      opacity 240ms ease,
      border-color 180ms var(--interaction-ease);
  }

  .project-card:hover,
  .project-card:focus-visible,
  .project-card.active-card {
    border-color: color-mix(in oklch, var(--accent) 45%, var(--border));
  }

  .project-card:focus-visible {
    outline: 2px solid color-mix(in oklch, var(--ring) 65%, transparent);
    outline-offset: 4px;
  }

  .project-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 420ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .project-card:hover img,
  .project-card.active-card img {
    transform: scale(1.035);
  }

  .project-card-shade {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(180deg, transparent 44%, oklch(0 0 0 / 0.72) 100%),
      linear-gradient(90deg, oklch(0 0 0 / 0.38), transparent 55%);
  }

  .project-card-copy {
    position: absolute;
    inset: auto clamp(1rem, 3vw, 2rem) clamp(1rem, 3vw, 2rem);
    display: grid;
    gap: 0.55rem;
    max-width: 34rem;
    text-align: left;
  }

  .project-eyebrow {
    font-family: var(--font-mono);
    font-size: 0.62rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    opacity: 0.76;
  }

  .project-title {
    font-family: var(--font-display);
    font-size: clamp(2rem, 5vw, 4.6rem);
    font-weight: 700;
    line-height: 0.92;
  }

  .project-description {
    max-width: 30rem;
    color: rgb(255 255 255 / 0.78);
    font-size: clamp(0.92rem, 1.15vw, 1.05rem);
    line-height: 1.45;
  }

  .project-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .project-dots {
    display: flex;
    gap: 0.5rem;
  }

  .project-dots button {
    width: 0.7rem;
    height: 0.7rem;
    border: 0;
    border-radius: 999px;
    background: color-mix(in oklch, var(--foreground) 24%, transparent);
    cursor: pointer;
  }

  .project-dots button.active-dot {
    width: 2.4rem;
    background: var(--accent);
  }

  .project-summary {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.8rem;
    font-family: var(--font-mono);
    font-size: 0.68rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted-foreground);
  }

  .project-summary strong {
    color: var(--foreground);
    font-family: var(--font-mono);
    font-size: inherit;
    letter-spacing: inherit;
  }

  .project-link {
    border: 1px solid color-mix(in oklch, var(--border) 85%, transparent);
    border-radius: 999px;
    padding: 0.7rem 0.95rem;
    color: var(--foreground);
    transition:
      border-color 180ms var(--interaction-ease),
      color 180ms var(--interaction-ease),
      background-color 180ms var(--interaction-ease);
  }

  .project-link:hover,
  .project-link:focus-visible {
    border-color: color-mix(in oklch, var(--accent) 45%, var(--border));
    background: color-mix(in oklch, var(--card) 68%, transparent);
    color: var(--accent);
    outline: none;
  }

  @media (max-width: 860px) {
    .project-stage {
      min-height: clamp(23rem, 90vw, 34rem);
    }

    .project-card {
      width: min(28rem, 88vw);
      transform:
        translate(-50%, -50%)
        translateY(calc(var(--active-offset) * 1.2rem))
        rotate(calc(var(--active-offset) * 3deg))
        scale(calc(1 - var(--distance) * 0.08));
    }

    .project-controls {
      align-items: flex-start;
      flex-direction: column;
    }

    .project-summary {
      flex-wrap: wrap;
      justify-content: flex-start;
    }
  }
</style>
