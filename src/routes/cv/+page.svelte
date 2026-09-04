<script lang="ts">
  import CopyEmailAction from '$lib/components/shared/CopyEmailAction.svelte';
  import {
    cvEducation,
    cvExperience,
    cvLanguages,
    cvStack,
    site
  } from '$lib/content/folio';
</script>

<svelte:head>
  <title>Résumé / Miguel Almeida · Frontend Engineer</title>
  <meta
    name="description"
    content="Miguel Almeida, frontend engineer working across product UI, design systems, reliability, browser architecture, and experimental multimodal interfaces."
  />
</svelte:head>

<a class="skip-link" href="#experience">Skip to experience</a>

<main class="cv-page">
  <header class="cv-header page-gutter">
    <nav aria-label="Résumé navigation">
      <a href="/">← Portfolio</a>
      <a href="/portfolio.pdf" download="miguel-almeida-cv.pdf">Download PDF</a>
    </nav>

    <div class="cv-heading">
      <div class="identity">
        <h1>Miguel Almeida</h1>
        <h2>Mid-level Frontend Engineer</h2>
        <p class="location">Berlin, Germany</p>
      </div>

      <div class="contact-line" aria-label="Contact details">
        <CopyEmailAction email={site.email} variant="compact" testId="cv-email-copy" />
        <a href={site.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
        <a href={site.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
      </div>

      <div class="credential">
        <span>Education</span>
        <strong>Professional Diploma in UX Design</strong>
        <p>UX Design Institute · 2020–2021</p>
      </div>
    </div>
  </header>

  <div class="cv-body page-gutter">
    <section id="experience" class="experience" aria-labelledby="experience-title">
      <header>
        <h2 id="experience-title">Experience</h2>
      </header>

      <ol>
        {#each cvExperience as item}
          <li>
            <div class="role-meta">
              <time>{item.years}</time>
              <span>{item.location}</span>
            </div>
            <article>
              <h3>{item.role}</h3>
              <p class="company">{item.company}</p>
              <ul>
                {#each item.bullets as bullet}
                  <li>{bullet}</li>
                {/each}
              </ul>
            </article>
          </li>
        {/each}
      </ol>
    </section>

    <aside aria-label="Résumé details">
      <section>
        <h2>Selected engineering work</h2>
        <a href="/work/camera-harness">
          <strong>Camera Harness</strong>
          <span>Evidence boundaries for live multimodal interfaces</span>
        </a>
        <a href="/work/atlas">
          <strong>Atlas</strong>
          <span>Deterministic risk before model explanation</span>
        </a>
        <a href="/work/ghostwriter">
          <strong>Ghostwriter</strong>
          <span>Registration, migration, session, and CSP reliability</span>
        </a>
      </section>

      <section>
        <h2>Technical focus</h2>
        <ul class="plain-list">
          {#each cvStack as skill}<li>{skill}</li>{/each}
          <li>Browser media APIs</li>
          <li>Async lifecycle ownership</li>
          <li>Applied AI interfaces</li>
        </ul>
      </section>

      <section>
        <h2>Education</h2>
        {#each cvEducation as item}
          <div class="study">
            <span>{item.year}</span>
            <strong>{item.title}</strong>
            <p>{item.place}</p>
          </div>
        {/each}
      </section>

      <section>
        <h2>Languages</h2>
        <ul class="plain-list">
          {#each cvLanguages as language}<li>{language}</li>{/each}
        </ul>
      </section>
    </aside>
  </div>

  <footer class="page-gutter">
    <p>Résumé content is mirrored in the downloadable PDF. PDF tagging remains limited by the current generator.</p>
    <a href="mailto:{site.email}?subject=Role%20opportunity">Contact Miguel →</a>
  </footer>
</main>

<style>
  :global(.cv-page) {
    --background: #050505;
    --foreground: #f4eadc;
    --muted-foreground: #9a948b;
    --accent: #e8a878;
    --border: rgb(244 234 220 / 0.16);
    min-height: 100svh;
    background: #050505;
    color: var(--foreground);
  }

  .skip-link {
    position: fixed;
    top: 0.75rem;
    left: 0.75rem;
    z-index: 100;
    padding: 0.75rem 1rem;
    background: var(--foreground);
    color: #050505;
    transform: translateY(-160%);
  }

  .skip-link:focus {
    transform: translateY(0);
  }

  .cv-header {
    width: min(100%, 92rem);
    margin-inline: auto;
    padding-block: clamp(1.5rem, 3vw, 2.5rem);
    border-bottom: 1px solid var(--border);
  }

  nav {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: clamp(1.8rem, 3.5vw, 3rem);
  }

  nav a,
  footer a {
    display: inline-flex;
    min-height: 2.75rem;
    align-items: center;
    color: rgb(244 234 220 / 0.66);
    font-size: 0.88rem;
    font-weight: 720;
  }

  a:hover,
  a:focus-visible {
    color: var(--foreground);
    outline: none;
  }

  a:focus-visible {
    box-shadow: 0 2px 0 var(--ring);
  }

  .cv-heading {
    display: grid;
    grid-template-columns: minmax(15rem, 1.2fr) minmax(14rem, 0.9fr) minmax(8rem, 0.45fr);
    gap: clamp(1.5rem, 5vw, 5rem);
    align-items: start;
  }

  .identity {
    display: grid;
    gap: 0.35rem;
  }

  .identity h2,
  .experience header h2 {
    color: rgb(244 234 220 / 0.6);
    font-family: var(--font-mono);
    font-size: 0.76rem;
    font-weight: 760;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  h1,
  h2,
  h3,
  p {
    margin: 0;
  }

  h1 {
    font-size: clamp(1.25rem, 1.8vw, 1.6rem);
    font-weight: 760;
    letter-spacing: -0.02em;
    line-height: 1.05;
  }

  .contact-line {
    display: grid;
    align-content: start;
    gap: 0.15rem;
  }

  .contact-line :global(button),
  .contact-line a,
  .location {
    display: inline-flex;
    min-height: 2rem;
    align-items: center;
    color: rgb(244 234 220 / 0.62);
    font-size: 0.78rem;
  }

  .location {
    margin: 0;
    color: rgb(244 234 220 / 0.46);
  }

  .credential {
    display: grid;
    gap: 0.25rem;
  }

  .credential span {
    color: var(--accent);
    font-family: var(--font-mono);
    font-size: 0.68rem;
    font-weight: 760;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .credential strong {
    color: var(--foreground);
    font-size: 0.86rem;
    line-height: 1.3;
  }

  .credential p {
    color: rgb(244 234 220 / 0.5);
    font-size: 0.76rem;
    line-height: 1.4;
  }

  .cv-body {
    display: grid;
    width: min(100%, 92rem);
    margin-inline: auto;
    grid-template-columns: minmax(0, 1.5fr) minmax(18rem, 0.5fr);
    gap: clamp(2.5rem, 7vw, 7rem);
    padding-block: clamp(2.5rem, 5vw, 4.5rem);
  }

  .experience > header {
    margin-bottom: 1rem;
  }

  .experience header h2 {
    color: var(--accent);
  }

  .experience > ol {
    margin: 0;
    padding: 0;
    border-top: 1px solid var(--border);
    list-style: none;
  }

  .experience > ol > li {
    display: grid;
    grid-template-columns: minmax(7rem, 0.28fr) minmax(0, 1fr);
    gap: clamp(1rem, 4vw, 4rem);
    padding-block: 1.25rem;
    border-bottom: 1px solid var(--border);
  }

  .role-meta {
    display: grid;
    align-content: start;
    gap: 0.45rem;
    color: var(--accent);
    font-family: var(--font-mono);
    font-size: 0.76rem;
    letter-spacing: 0.08em;
  }

  .role-meta span {
    color: rgb(244 234 220 / 0.42);
  }

  .experience article h3 {
    font-size: clamp(1.05rem, 1.5vw, 1.3rem);
    line-height: 1.18;
  }

  .company {
    margin-top: 0.3rem;
    color: rgb(244 234 220 / 0.5);
    font-size: 0.88rem;
    font-weight: 720;
  }

  .experience article ul {
    display: grid;
    gap: 0.55rem;
    margin: 1rem 0 0;
    padding-left: 1.2rem;
    color: rgb(244 234 220 / 0.68);
    font-size: 0.88rem;
    line-height: 1.52;
  }

  aside {
    display: grid;
    align-content: start;
    gap: 2.5rem;
  }

  aside section {
    padding-top: 1rem;
    border-top: 1px solid var(--border);
  }

  aside h2 {
    margin-bottom: 1rem;
    color: var(--accent);
    font-family: var(--font-mono);
    font-size: 0.76rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  aside a {
    display: grid;
    min-height: 4.2rem;
    align-content: center;
    gap: 0.25rem;
    padding-block: 0.65rem;
    border-bottom: 1px solid var(--border);
  }

  aside a strong {
    font-size: 1rem;
  }

  aside a span,
  .study p {
    color: rgb(244 234 220 / 0.52);
    font-size: 0.82rem;
    line-height: 1.4;
  }

  .plain-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .plain-list li {
    border: 1px solid var(--border);
    padding: 0.45rem 0.6rem;
    color: rgb(244 234 220 / 0.66);
    font-size: 0.82rem;
  }

  .study {
    display: grid;
    gap: 0.3rem;
    margin-top: 1rem;
  }

  .study span {
    color: var(--accent);
    font-family: var(--font-mono);
    font-size: 0.75rem;
  }

  .study strong {
    font-size: 0.95rem;
  }

  footer {
    display: flex;
    width: min(100%, 92rem);
    justify-content: space-between;
    gap: 2rem;
    margin-inline: auto;
    padding-block: 2rem 4rem;
    border-top: 1px solid var(--border);
  }

  footer p {
    max-width: 45rem;
    color: rgb(244 234 220 / 0.46);
    font-size: 0.82rem;
    line-height: 1.5;
  }

  @media (max-width: 850px) {
    .cv-heading,
    .cv-body {
      grid-template-columns: 1fr;
    }

    .cv-heading {
      gap: 1rem;
    }

    .contact-line {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem 1rem;
    }
  }

  @media (max-width: 600px) {
    .experience > ol > li {
      grid-template-columns: 1fr;
      gap: 0.8rem;
    }

    footer {
      display: grid;
    }
  }

  @media print {
    .skip-link,
    nav,
    footer {
      display: none;
    }

    .cv-page {
      background: white;
      color: black;
    }
  }
</style>
