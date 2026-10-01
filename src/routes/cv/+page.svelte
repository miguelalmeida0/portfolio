<script lang="ts">
  import { destinationLink } from '$lib/navigation/destination-link';
  import '$lib/components/experience/profile-pages.css';
  import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
  import { cvExperience, cvEducation, cvLanguages, cvSkills, professionalRecommendation, site } from '$lib/content/folio';
  import { projects } from '$lib/experience/projects';
</script>
<svelte:head>
  <title>CV — Miguel Almeida</title>
  <meta name="description" content="Miguel Almeida’s experience, skills and education. Frontend development at F24, independent products, and a background in UX design." />
  <meta property="og:title" content="CV — Miguel Almeida" />
</svelte:head>
<article class="wind-shell profile-page cv-page">
  <header class="profile-top">
    <div class="profile-surface profile-primary cv-intro"><p class="profile-meta">Experience / Berlin, Germany</p><h1 class="cv-name">Miguel Almeida.</h1><p class="cv-role" data-ask-id="role">Frontend developer<br />&amp; design engineer.</p><p class="cv-stack" data-ask-id="stack"><span>JavaScript · React</span><span class="stack-divider"> · </span><span>Svelte · TypeScript</span></p></div>
    <div class="profile-surface profile-support cv-summary">
      <p class="profile-lead" data-ask-id="f24">Four years at F24: original Svelte frontend through production, then continued delivery in React.</p>
      <a href="/portfolio.pdf" class="profile-button" {...destinationLink("/portfolio.pdf")}><ArrowUpRight size={18} aria-hidden="true" /> Open CV PDF</a>
      <p class="pdf-note">PDF: earlier project selection. Current work is below.</p>
      <a href={'mailto:'+site.email} class="profile-link cv-email" {...destinationLink('mailto:'+site.email)}>{site.email}</a>
    </div>
  </header>
  <div class="cv-evidence">
    <div class="profile-surface cv-main">
      <section id="experience" aria-labelledby="experience-title">
        <h2 id="experience-title" class="profile-meta">Professional experience</h2>
        {#each cvExperience as role, i}
          <div class="cv-job" data-ask-id={`cv-job-${i}`}>
            <p class="cv-date">{role.years} / {role.company} / {role.location}</p>
            <h3 class="cv-job-title">{role.role}</h3>
            <ul class="cv-bullets">
              {#each role.bullets as bullet}<li class="cv-bullet">{bullet}</li>{/each}
            </ul>
          </div>
        {/each}
        <a href="/work/f24#production-decision" class="profile-link" {...destinationLink("/work/f24#production-decision")}>Read about my work at F24 </a>
      </section>
      <section class="cv-projects" aria-labelledby="projects-title">
        <h2 id="projects-title" class="profile-meta">Independent work</h2>
        {#each ['second-voice-ai', 'flow', 'leu'].map(slug => projects.find(p => p.slug === slug)!) as project}
          <a href={'/work/'+project.slug} class="cv-project" data-ask-id={`project-${project.slug}`} {...destinationLink('/work/'+project.slug)}>
            <div><h3 class="cv-project-title">{project.name}</h3><p class="cv-project-description">{project.summary}</p></div>
          </a>
        {/each}
      </section>
    </div>
    <aside class="profile-surface profile-support cv-sidebar">
      <section id="skills" data-ask-id="cv-skills"><h2 class="profile-meta">Core skills</h2><ul class="cv-skills">{#each cvSkills as skill}<li>{skill}</li>{/each}</ul></section>
      <section id="education" data-ask-id="cv-education"><h2 class="profile-meta">Education</h2>{#each cvEducation as item}<div class="cv-education"><p class="cv-date">{item.year}</p><h3 class="mt-2 font-semibold">{item.title}</h3><p class="mt-1 text-sm leading-relaxed text-muted">{item.place}</p></div>{/each}</section>
      <section id="languages" data-ask-id="cv-languages"><h2 class="profile-meta">Languages</h2><ul class="space-y-3 text-sm">{#each cvLanguages as language}<li>{language}</li>{/each}</ul></section>
      <figure id="recommendation" class="cv-recommendation" data-ask-id="cv-recommendation"><blockquote class="font-sans text-xl leading-relaxed">“{professionalRecommendation.quote}”</blockquote><figcaption class="mt-5 text-sm"><span class="font-semibold">{professionalRecommendation.name}</span><br /><span class="text-muted">{professionalRecommendation.role}</span></figcaption></figure>
      <a href="/story" class="profile-link" {...destinationLink("/story")}>A little more about me </a>
    </aside>
  </div>
</article>
<style>
  h1 { margin-top: 24px; font-size: clamp(40px, 3.62vw, 58px); }
  .cv-role { margin-top: 22px; font-size: 34px; font-weight: 600; line-height: 1.15; letter-spacing: -.025em; color: var(--forest); }
  .cv-stack { margin-top: 28px; font-size: 18px; font-weight: 600; line-height: 1.5; }
  .cv-stack > span { white-space: nowrap; }
  .cv-summary { display: flex; flex-direction: column; align-items: flex-start; justify-content: center; }
  .cv-summary .profile-button { margin-top: 24px; }
  .pdf-note { margin-top: 12px; font-size: 12px; line-height: 1.5; color: var(--muted); }
  .cv-email { margin-top: 8px; max-width: 100%; overflow-wrap: anywhere; font-size: 15px; }
  .cv-evidence { display: grid; grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr); gap: var(--card-gap); align-items: start; margin-top: 60px; }
  .cv-date { font-size: 14px; line-height: 1.5; color: var(--muted); }
  .cv-job { margin-top: 28px; }
  .cv-job + .cv-job { padding-top: 28px; border-top: 1px solid var(--rule-ink); }
  .cv-job h3 { margin-top: 12px; }
  .cv-bullets { margin-block: 22px; padding-left: 20px; list-style: disc; }
  .cv-bullets li { padding-left: 4px; font-size: 17px; line-height: 1.6; }
  .cv-bullets li + li { margin-top: 14px; }
  .cv-bullets li::marker { color: var(--plum); }
  .cv-projects { margin-top: 32px; padding-top: 32px; border-top: 1px solid var(--rule-ink); }
  .cv-project { display: block; padding-top: 24px; }
  .cv-project h3 { font-size: 24px; }
  .cv-project:hover h3 { color: var(--plum); text-decoration: underline; text-underline-offset: 5px; }
  .cv-project-description { margin-top: 8px; font-size: 16px; line-height: 1.55; color: var(--muted); }
  .cv-sidebar > section + section, .cv-recommendation { margin-top: 32px; padding-top: 32px; border-top: 1px solid var(--rule-ink); }
  .cv-skills { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px 16px; margin-top: 22px; font-size: 17px; line-height: 1.45; }
  .cv-education { margin-top: 22px; }
  .cv-education h3 { margin-top: 8px; font-size: 20px; line-height: 1.35; letter-spacing: -.01em; }
  .cv-sidebar .profile-meta + ul:not(.cv-skills) { margin-top: 22px; }
  .cv-sidebar > .profile-link { margin-top: 24px; }
  @media (min-width: 768px) and (max-width: 1099px) {
    .cv-evidence { gap: 24px; }
    .cv-role { font-size: 30px; }
    .cv-stack { font-size: 17px; }
    .cv-skills { grid-template-columns: minmax(0, 1fr); }
  }
  @media (max-width: 767px) {
    h1 { margin-top: 20px; font-size: clamp(32px, 8.7vw, 44px); }
    .cv-role { margin-top: 18px; font-size: 28px; }
    .cv-stack { margin-top: 22px; font-size: 16px; max-width: 27ch; }
    .cv-stack > span { display: block; }
    .cv-stack .stack-divider { display: none; }
    .cv-summary .profile-button { width: 100%; margin-top: 20px; }
    .cv-evidence { grid-template-columns: minmax(0, 1fr); gap: 20px; margin-top: 40px; }
    .cv-bullets li { font-size: 16px; }
    .cv-job { margin-top: 24px; }
    .cv-skills { font-size: 16px; }
  }
  @media (min-width: 768px) and (max-width: 899px) {
    .profile-top { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
    .cv-stack > span { display: block; }
    .cv-stack .stack-divider { display: none; }
    .cv-evidence { grid-template-columns: minmax(0, 1fr); }
    .cv-skills { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
</style>
