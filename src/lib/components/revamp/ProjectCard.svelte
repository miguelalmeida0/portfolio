<script lang="ts" module>
  export type ProjectCardProps = {
    imgSrc: string;
    imageAlt: string;
    title: string;
    description: string;
    link: string;
    linkText?: string;
  };
</script>

<script lang="ts">
  export let imgSrc: ProjectCardProps['imgSrc'];
  export let imageAlt: ProjectCardProps['imageAlt'];
  export let title: ProjectCardProps['title'];
  export let description: ProjectCardProps['description'];
  export let link: ProjectCardProps['link'];
  export let linkText: ProjectCardProps['linkText'] = 'View project';
</script>

<article class="project-card">
  <a href={link} class="project-card-media" aria-label={linkText}>
    <img src={imgSrc} alt={imageAlt} loading="lazy" />
  </a>

  <div class="project-card-copy">
    <h3>{title}</h3>
    <p>{description}</p>

    <a href={link} class="project-card-link">
      <span>{linkText}</span>
      <span class="project-card-arrow" aria-hidden="true">→</span>
    </a>
  </div>
</article>

<style>
  .project-card {
    position: relative;
    display: flex;
    min-width: 0;
    min-height: 100%;
    overflow: hidden;
    flex-direction: column;
    border: 1px solid rgb(244 234 220 / 0.12);
    border-radius: 8px;
    background: #151515;
    color: #f4eadc;
    transition:
      border-color 220ms var(--interaction-ease),
      box-shadow 220ms var(--interaction-ease),
      transform 220ms var(--interaction-ease);
  }

  .project-card:hover,
  .project-card:focus-within {
    border-color: rgb(244 234 220 / 0.24);
    box-shadow: 0 26px 70px -46px rgb(0 0 0 / 0.9);
    transform: translate3d(0, -0.35rem, 0);
  }

  .project-card-media {
    display: block;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    background: #0b0b0b;
  }

  .project-card-media img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
    transition: transform 520ms var(--interaction-ease);
  }

  .project-card:hover .project-card-media img,
  .project-card:focus-within .project-card-media img {
    transform: scale(1.055);
  }

  .project-card-media:focus-visible,
  .project-card-link:focus-visible {
    outline: 2px solid var(--ring);
    outline-offset: 3px;
  }

  .project-card-copy {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: clamp(1.25rem, 2vw, 1.75rem);
  }

  .project-card-copy h3 {
    margin: 0;
    color: #f7f1e7;
    font-family: var(--font-sans);
    font-size: clamp(1.35rem, 2vw, 1.85rem);
    font-weight: 800;
    line-height: 1.04;
    letter-spacing: 0;
  }

  .project-card-copy p {
    margin: clamp(0.85rem, 1.6vw, 1.15rem) 0 0;
    flex: 1;
    color: rgb(244 234 220 / 0.66);
    font-size: clamp(0.98rem, 1.22vw, 1.14rem);
    line-height: 1.52;
  }

  .project-card-link {
    display: inline-flex;
    width: fit-content;
    align-items: center;
    gap: 0.65rem;
    margin-top: clamp(1.25rem, 2vw, 1.65rem);
    color: #f4eadc;
    font-size: 0.96rem;
    font-weight: 800;
    line-height: 1;
    transition: color 180ms var(--interaction-ease);
  }

  .project-card-link:hover {
    color: var(--accent);
  }

  .project-card-arrow {
    display: inline-block;
    font-size: 1.45em;
    line-height: 0.75;
    transition: transform 180ms var(--interaction-ease);
  }

  .project-card-link:hover .project-card-arrow,
  .project-card-link:focus-visible .project-card-arrow {
    transform: translate3d(0.22rem, 0, 0);
  }

  @media (max-width: 640px) {
    .project-card-copy {
      padding: 1.15rem;
    }
  }
</style>
