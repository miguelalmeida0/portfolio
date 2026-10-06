<script lang="ts">
  import { destinationLink } from '$lib/navigation/destination-link';
  import '$lib/components/experience/profile-pages.css';
  import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
  import { cvBio, cvHighlights, cvSignals, cvExperience, cvEducation, cvLanguages, cvSkills, professionalRecommendation, site } from '$lib/content/folio';
  import { cvProjects } from '$lib/content/cv-projects';
</script>
<svelte:head>
  <title>CV — Miguel Almeida</title>
  <meta name="description" content="Miguel Almeida’s experience, skills and education. Frontend development at F24, independent products, and a background in UX design." />
  <meta property="og:title" content="CV — Miguel Almeida" />
</svelte:head>
<article class="wind-shell profile-page cv-page">
  <header class="profile-top">
    <div class="profile-surface profile-primary cv-intro"><p class="profile-meta">Experience / Berlin, Germany</p><h1 class="cv-name">Miguel Almeida.</h1><p class="cv-role">Frontend engineer.</p><p class="cv-stack">Product architecture<br />Design engineering</p><p class="cv-intro-line">I build the interfaces teams rely on when seconds matter.</p></div>
    <div class="profile-surface profile-support cv-summary">
      <p class="cv-summary-text" data-ask-id="cv-summary">{cvBio}</p>
      <a href="/cv/pdf" class="profile-button" {...destinationLink("/cv/pdf")}><ArrowUpRight size={18} aria-hidden="true" /> Open CV PDF</a>
      <a href="/files/miguel-almeida-cv.pdf" download="Miguel-Almeida-CV.pdf" class="profile-link cv-download">Download PDF</a>
      <a href={'mailto:'+site.email} class="profile-link cv-email" {...destinationLink('mailto:'+site.email)}>{site.email}</a>
    </div>
  </header>
  <dl class="cv-highlights" aria-label="Career highlights">
    {#each cvHighlights as highlight}
      <div><dt>{highlight.label}</dt><dd><strong>{highlight.value}</strong><span>{highlight.detail}</span></dd></div>
    {/each}
  </dl>
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
        <h2 id="projects-title" class="profile-meta">Selected engineering work</h2>
        {#each cvProjects as project}
          <div class="cv-project" data-ask-id={`cv-project-${project.slug}`}>
            <h3 class="cv-project-title"><a href={project.href} {...destinationLink(project.href)}>{project.name}</a></h3>
            <p class="cv-project-description">{project.description}</p>
            <p class="cv-project-stack">{project.stack}</p>
            <ul class="cv-bullets">{#each project.bullets as bullet}<li>{bullet}</li>{/each}</ul>
            {#if project.live}
              <a href={project.live} class="profile-link cv-live" {...destinationLink(project.live)}>Live app <ArrowUpRight size={16} aria-hidden="true" /></a>
            {/if}
          </div>
        {/each}
      </section>
    </div>
    <aside class="profile-surface profile-support cv-sidebar">
      <section id="signals"><h2 class="profile-meta">Core signals</h2><dl class="cv-signals">{#each cvSignals as signal}<div><dt>{signal.title}</dt><dd>{signal.detail}</dd></div>{/each}</dl></section>
      <section id="skills" data-ask-id="cv-skills"><h2 class="profile-meta">Stack</h2><ul class="cv-skills">{#each cvSkills as skill}<li>{skill}</li>{/each}</ul></section>
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
  .cv-intro-line { margin-top: 28px; max-width: 30ch; font-size: 22px; line-height: 1.35; }
  .cv-summary-text { font-size: 18px; line-height: 1.6; }
  .cv-download { min-height: 44px; display: inline-flex; align-items: center; margin-top: 8px; }
  .cv-highlights { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 24px; margin-top: 36px; }
  .cv-highlights > div { display: flex; flex-direction: column; border-top: 1px solid var(--rule-ink); padding-top: 18px; }
  .cv-highlights dt { font-size: 13px; text-transform: uppercase; letter-spacing: .06em; }
  .cv-highlights dd { display: contents; }
  .cv-highlights strong { order: -1; font-size: clamp(30px,3vw,46px); letter-spacing: -.04em; line-height: 1.2; margin-bottom: 8px; }
  .cv-highlights dd span { color: var(--muted); font-size: 14px; margin-top: 4px; }
  .cv-signals { margin-top: 22px; display: grid; gap: 18px; }
  .cv-signals dt { font-weight: 600; }
  .cv-signals dd { color: var(--muted); font-size: 15px; margin-top: 4px; }
  .cv-summary { display: flex; flex-direction: column; align-items: flex-start; justify-content: center; }
  .cv-summary .profile-button { margin-top: 24px; }
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
  .cv-project h3 a:hover { color: var(--plum); text-decoration: underline; text-underline-offset: 5px; }
  .cv-live { min-height: 44px; margin-top: 8px; display: inline-flex; align-items: center; gap: 8px; }
  .cv-project-description { margin-top: 8px; font-size: 16px; line-height: 1.55; color: var(--muted); }
  .cv-project-stack { margin-top: 6px; font-size: 14px; line-height: 1.6; color: var(--muted); }
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
    .cv-highlights { grid-template-columns: repeat(2,minmax(0,1fr)); gap: 24px 16px; }
    .cv-summary .profile-button { width: 100%; margin-top: 20px; }
    .cv-evidence { grid-template-columns: minmax(0, 1fr); gap: 20px; margin-top: 40px; }
    .cv-bullets li { font-size: 16px; }
    .cv-job { margin-top: 24px; }
    .cv-skills { font-size: 16px; }
  }
  @media (min-width: 768px) and (max-width: 899px) {
    .profile-top { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
    .cv-evidence { grid-template-columns: minmax(0, 1fr); }
    .cv-skills { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
</style>
