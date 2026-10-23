<script lang="ts">
  import type {Snippet} from 'svelte';
  import { cvBio, cvHighlights, cvSignals, cvExperience, cvEducation, cvLanguages, cvSkills, professionalRecommendation, site } from '$lib/content/folio';
  import { cvProjects } from '$lib/content/cv-projects';
  import { destinationLink } from '$lib/navigation/destination-link';
  import { labMotion } from '$lib/hero-lab/runtime';
  import TypographicNav from '../TypographicNav.svelte';
  import { d1Href as originalHref, type D1Page } from '../site';
  import D1Action from './D1Action.svelte';
  import D1Title from './D1Title.svelte';
  import { cvMotion } from './cv-motion';
  import AskTopic from '$lib/components/ask/AskTopic.svelte';
  import { askController } from '$lib/ask/state';
  import './d1-pages.css';

  let {previewBase='',navigation}:{previewBase?:string;navigation?:Snippet}=$props();
  const d1Href = (href: string, page: D1Page) => {
    const target = originalHref(href, page);
    return previewBase && /^\/(?:story|cv)?(?:[?#]|$)/.test(target)
      ? previewBase + (target === '/' ? '' : target) : target;
  };
  const role = 'Frontend engineer.';
</script>

<div class="d1-page" id="top" data-lab-root data-direction="typographic" data-d1-page="cv" use:labMotion={cvMotion}>
  {#if navigation}{@render navigation()}{:else}<TypographicNav page="cv" />{/if}

  <section class="c-intro" data-hero-stage data-cv-intro aria-labelledby="cv-name">
    <div class="c-heading">
      <p class="c-meta" data-meta>Berlin, Germany</p>
      <D1Title tag="h1" id="cv-name" text="Experience." class="c-name" />
      <p class="c-role" data-meta><AskTopic area="cv-role" label={role} /></p>
      <p class="c-line" data-meta>I build the interfaces teams rely on when seconds matter.</p>
      <p class="c-stack" data-meta><AskTopic area="cv-signal-1" label="Product architecture" /><AskTopic area="cv-signal-3" label="Design engineering" /></p>
    </div>
    <div class="c-actions">
      <div class="c-buttons">
        <div class="c-action-arrival" data-cv-action>
          <a class="c-pdf-action c-pdf-open" href="/cv/pdf" {...destinationLink('/cv/pdf')}>
            <span class="c-action-label">Open CV PDF</span>
            <span class="c-action-icon" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M8 24 24 8M8 8h16v16" /></svg></span>
          </a>
        </div>
        <div class="c-action-arrival" data-cv-action>
          <a class="c-pdf-action c-pdf-download" href="/files/Miguel_Almeida_CV.pdf" download="Miguel_Almeida_CV.pdf" {...destinationLink('/files/Miguel_Almeida_CV.pdf', 'Miguel_Almeida_CV.pdf')}>
            <span class="c-action-label">Download PDF</span>
            <span class="c-action-icon" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M16 5v18m-7-7 7 7 7-7M6 27h20" /></svg></span>
          </a>
        </div>
      </div>
    </div>
    <span class="c-intro-rule" data-cv-rule aria-hidden="true"></span>
  </section>

  <!-- Evidence first; the detailed summary follows the at-a-glance metrics. -->
  <section class="c-summary" id="cv-highlights" aria-label="Summary" tabindex="-1">
    <dl class="c-highlights" aria-label="Career highlights">
      {#each cvHighlights as highlight, i}
        <div>
          <span class="h-rule" data-rule aria-hidden="true"></span>
          <dt>{highlight.label}</dt>
          <dd><strong><button class="metric-ask" type="button" data-ask-id={`cv-highlight-${i}`} disabled={!$askController} aria-label={`Ask about ${highlight.label}: ${highlight.value}`} onclick={() => $askController?.explain(`cv-highlight-${i}`)}><span aria-hidden="true" data-count={highlight.value}>{highlight.value}</span><span class="sr-only">{highlight.value}</span><span class="metric-hint" aria-hidden="true">↗</span></button></strong><span class="h-detail">{highlight.detail}</span></dd>
        </div>
      {/each}
    </dl>
    <p class="c-bio" data-settle data-ask-id="cv-summary">{cvBio}</p>
    <a href={'mailto:' + site.email} class="c-email" {...destinationLink('mailto:' + site.email)}>{site.email}</a>
  </section>

  <div class="c-body">
    <div class="c-main">
      <section id="experience" aria-labelledby="experience-title">
        <D1Title id="experience-title" text="Professional experience" />
        {#each cvExperience as entry, i}
          <div class="c-job" data-ask-id={`cv-job-${i}`} data-current-reading>
            <span class="c-rule" data-rule aria-hidden="true"></span>
            <div data-current-surface>
            <p class="c-date">{entry.years} / {entry.company} / {entry.location}</p>
            <h3 class="c-h3" data-settle>{entry.role}</h3>
            <ul class="c-bullets">
              {#each entry.bullets as bullet}<li data-settle>{bullet}</li>{/each}
            </ul>
            </div>
          </div>
        {/each}
        <D1Action href="/work/f24#migration" label="Read about the Svelte-to-React migration" variant="line" />
      </section>

      <section id="projects" class="c-projects" aria-labelledby="projects-title">
        <D1Title id="projects-title" text="Selected engineering work" />
        {#each cvProjects as project}
          <div class="c-project" data-ask-id={`cv-project-${project.slug}`} data-current-reading>
            <span class="c-rule" data-rule aria-hidden="true"></span>
            <div data-current-surface>
            <h3 class="c-h3 c-project-title" data-settle><a href={project.href} {...destinationLink(project.href)}>{project.name}</a></h3>
            <p class="c-project-description">{project.description}</p>
            <p class="c-project-stack">{project.stack}</p>
            <ul class="c-bullets">{#each project.bullets as bullet}<li data-settle>{bullet}</li>{/each}</ul>
            {#if project.live}
              <D1Action href={project.live} label="Live app" variant="line" external />
            {/if}
            </div>
          </div>
        {/each}
      </section>
    </div>

    <aside class="c-aside">
      <section id="signals" aria-labelledby="signals-title">
        <h2 id="signals-title" class="c-h2" data-rise-title><span class="mask"><span data-rise-word>Core signals</span></span></h2>
        <dl class="c-signals">{#each cvSignals as signal, i}<div data-settle data-ask-id={`cv-signal-${i}`}><dt>{signal.title}</dt><dd>{signal.detail}</dd></div>{/each}</dl>
      </section>
      <section id="skills" data-ask-id="cv-skills" aria-labelledby="skills-title" tabindex="-1">
        <h2 id="skills-title" class="c-h2" data-rise-title><span class="mask"><span data-rise-word>Stack</span></span></h2>
        <ul class="c-skills">{#each cvSkills as skill}<li>{skill}</li>{/each}</ul>
      </section>
      <section id="education" data-ask-id="cv-education" aria-labelledby="education-title" tabindex="-1">
        <h2 id="education-title" class="c-h2" data-rise-title><span class="mask"><span data-rise-word>Education</span></span></h2>
        {#each cvEducation as item}<div class="c-education" data-settle><p class="c-date">{item.year}</p><h3>{item.title}</h3><p class="c-place">{item.place}</p></div>{/each}
      </section>
      <section id="languages" data-ask-id="cv-languages" aria-labelledby="languages-title">
        <h2 id="languages-title" class="c-h2" data-rise-title><span class="mask"><span data-rise-word>Languages</span></span></h2>
        <ul class="c-languages">{#each cvLanguages as language}<li>{language}</li>{/each}</ul>
      </section>
      <figure id="recommendation" class="c-recommendation" data-ask-id="cv-recommendation" data-settle>
        <blockquote>“{professionalRecommendation.quote}”</blockquote>
        <figcaption><span class="c-who">{professionalRecommendation.name}</span><br /><span class="c-place">{professionalRecommendation.role}</span></figcaption>
      </figure>
      <D1Action href={d1Href('/story', 'cv')} label="A little more about me" variant="line" />
    </aside>
  </div>
</div>

<style>
  .d1-page { background: var(--paper); color: var(--ink); font-family: var(--hero-font); }

  .c-intro { position: relative; display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(280px, .8fr); align-items: center; gap: 24px 48px; padding: 116px var(--page-x) 32px; background: var(--lime); }
  .c-heading { min-width: 0; max-width: 64rem; }
  .c-meta { font: 600 var(--d1-meta)/1.4 var(--d1-body); letter-spacing: .06em; text-transform: uppercase; }
  .c-heading :global(.c-name) { margin-top: 10px; font-size: clamp(48px, 5.2vw, 80px); line-height: 1.05; }
  .c-role { margin-top: 8px; font: 600 var(--d1-lead)/1.4 var(--d1-body); }
  .c-line { margin-top: 8px; max-width: 48ch; font: 400 var(--d1-body-size)/1.5 var(--d1-body); }
  .c-stack { display: flex; flex-wrap: wrap; gap: 4px 20px; margin-top: 8px; font: 400 var(--d1-meta)/1.5 var(--d1-body); color: var(--muted); }
  .c-actions { min-width: 0; }
  .c-buttons { display: grid; gap: 12px; }
  .c-action-arrival { min-width: 0; }
  .c-pdf-action { --icon-fill: var(--paper); --icon-ink: var(--plum); position: relative; isolation: isolate; display: flex; align-items: center; justify-content: space-between; gap: 20px; min-height: 92px; padding: 18px 24px; overflow: hidden; background: var(--plum); color: var(--paper); text-decoration: none; font: 700 clamp(26px, 2.6vw, 40px)/1.1 var(--d1-display); letter-spacing: .025em; text-transform: uppercase; transition: transform .3s cubic-bezier(.16,1,.3,1); }
  .c-pdf-download { --icon-fill: var(--lime); --icon-ink: var(--ink); background: var(--ink); color: var(--lime); }
  /* Stable fills distinguish the choices; the hovered action alone gains a rule and lit icon. */
  .c-pdf-action::before { content: ''; position: absolute; inset: auto 24px 10px; height: 2px; background: currentColor; transform: scaleX(0); transform-origin: left; transition: transform .4s cubic-bezier(.16,1,.3,1); }
  .c-action-label { transition: transform .4s cubic-bezier(.16,1,.3,1); }
  .c-action-icon { display: grid; place-items: center; flex: none; width: 48px; height: 48px; border: 1px solid currentColor; }
  .c-action-icon svg { width: 32px; height: 32px; fill: none; stroke: currentColor; stroke-width: 2; transition: transform .4s cubic-bezier(.16,1,.3,1); }
  .c-pdf-action:focus-visible { outline: 3px solid var(--ink); outline-offset: 4px; }
  .c-pdf-action:focus-visible::before { transform: scaleX(1); }
  .c-pdf-action:focus-visible .c-action-icon { background: var(--icon-fill); color: var(--icon-ink); border-color: var(--icon-fill); }
  .c-pdf-open:focus-visible svg { transform: translate(3px, -3px); }
  .c-pdf-download:focus-visible svg { transform: translateY(3px); }
  @media (hover: hover) and (pointer: fine) {
    .c-pdf-action:hover { transform: translateY(-3px); }
    .c-pdf-action:hover::before { transform: scaleX(1); }
    .c-pdf-action:hover .c-action-icon { background: var(--icon-fill); color: var(--icon-ink); border-color: var(--icon-fill); }
    .c-pdf-action:hover .c-action-label { transform: translateX(4px); }
    .c-pdf-open:hover svg { transform: translate(3px, -3px); }
    .c-pdf-download:hover svg { transform: translateY(3px); }
  }
  .c-pdf-action:active { transform: translateY(1px) scale(.985); }
  .c-email { display: flex; align-items: center; justify-content: center; width: fit-content; max-width: 100%; min-height: 44px; margin: 12px auto 0; color: var(--lime); font: 500 var(--d1-meta)/1.4 var(--d1-body); text-decoration: underline; text-underline-offset: 5px; overflow-wrap: anywhere; }
  .c-email:hover { color: var(--paper); }
  .c-email:focus-visible { outline: 2px solid var(--lime); outline-offset: 4px; }
  .c-intro-rule { position: absolute; bottom: 0; left: var(--page-x); right: var(--page-x); height: 2px; background: var(--ink); transform-origin: left; }

  /* The first screen prioritizes PDF access and measurable evidence. */
  .c-summary { padding: 28px var(--page-x) 36px; background: var(--forest); color: var(--paper); }
  .c-summary:focus { outline: none; }
  .c-bio { max-width: 68ch; margin: 32px auto 0; padding-top: 24px; border-top: 1px solid rgb(249 247 238 / .2); text-align: center; text-wrap: pretty; font: 400 var(--d1-body-size)/1.65 var(--d1-body); }
  .c-highlights { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 24px clamp(20px, 2.5vw, 48px); max-width: 1440px; margin: 0 auto; }
  .c-highlights > div { position: relative; display: flex; flex-direction: column; padding-top: 20px; text-align: center; }
  .h-rule { position: absolute; top: 0; left: 0; right: 0; height: 2px; background: rgb(249 247 238 / .4); }
  .c-highlights dt { order: 2; margin-top: 12px; font: 400 13px/1.3 'Lab Mono', monospace; letter-spacing: .05em; text-transform: uppercase; color: var(--lime); }
  .c-highlights dd { display: contents; }
  .c-highlights strong { order: 1; font: 700 clamp(56px, 5.5vw, 88px)/1 'Lab Antonio', 'Arial Narrow', sans-serif; font-variant-numeric: tabular-nums; color: var(--lime); }
  .h-detail { order: 3; margin-top: 6px; font-size: 16px; color: #E1E8DF; }
  .metric-ask { position: relative; display: inline-flex; align-items: center; padding: 0; border: 0; background: none; color: inherit; font: inherit; cursor: pointer; }
  .metric-hint { position: absolute; left: 100%; top: 0; margin-left: 4px; font: 500 16px/1 var(--d1-body); transition: transform .25s ease; }
  .metric-ask:is(:hover, :focus-visible) { color: var(--paper); }
  .metric-ask:is(:hover, :focus-visible) .metric-hint { transform: translate(2px, -2px); }
  .metric-ask:focus-visible { outline: 2px solid var(--lime); outline-offset: 5px; }
  .metric-ask:disabled { cursor: wait; }
  :global(html.ask-on) .c-summary :global([data-ask-id]) { color: var(--paper); background: rgb(228 237 191 / .14); }
  :global(html.ask-on) .c-summary :global([data-ask-id].is-quoted) { color: var(--ink); background: var(--lime); }

  /* Reading body: ruled columns, no cards. */
  .c-body { display: grid; grid-template-columns: minmax(0, 1.65fr) minmax(0, 1fr); gap: clamp(40px, 6vw, 120px); padding: 44px var(--page-x) clamp(64px, 7vw, 112px); }
  .c-main > section + section { margin-top: clamp(72px, 7vw, 120px); }
  .c-job, .c-project { position: relative; margin-top: 36px; padding-top: 28px; }
  .c-rule { position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--ink); }
  .c-date { font: 400 13px/1.5 'Lab Mono', monospace; letter-spacing: .03em; text-transform: uppercase; color: var(--muted); }
  .c-h3 { margin-top: 12px; font: 700 var(--d1-subsection)/1.1 'Lab Antonio', 'Arial Narrow', sans-serif; text-transform: uppercase; letter-spacing: .005em; }
  .c-project-title a { color: inherit; text-decoration: none; background: linear-gradient(var(--plum), var(--plum)) 0 100% / 0 3px no-repeat; transition: background-size .5s cubic-bezier(.16,1,.3,1), color .3s; }
  .c-project-title a:is(:hover, :focus-visible) { color: var(--plum); background-size: 100% 3px; }
  .c-project-title a:focus-visible { outline: 3px solid var(--plum); outline-offset: 4px; }
  .c-bullets { margin: 20px 0 8px; padding: 0; list-style: none; }
  .c-bullets li { position: relative; padding-left: 26px; font-size: 17px; line-height: 1.6; }
  .c-bullets li::before { content: ''; position: absolute; left: 0; top: .62em; width: 10px; height: 10px; background: var(--plum); }
  .c-bullets li + li { margin-top: 14px; }
  .c-project-description { margin-top: 10px; font-size: 18px; font-weight: 600; }
  .c-project-stack { margin-top: 6px; font: 400 13px/1.6 'Lab Mono', monospace; color: var(--muted); }

  .c-aside > * + * { margin-top: 56px; }
  .c-h2 { margin: 0; padding-bottom: 14px; border-bottom: 2px solid var(--ink); font: 700 var(--d1-subsection)/1.1 'Lab Antonio', 'Arial Narrow', sans-serif; text-transform: uppercase; }
  .c-h2 .mask { display: inline-block; overflow: clip; vertical-align: top; }
  .c-h2 .mask > span { display: inline-block; }
  .c-signals { display: grid; gap: 18px; margin-top: 22px; }
  .c-signals dt { font-weight: 700; font-size: 17px; }
  .c-signals dd { margin-top: 2px; color: var(--muted); font-size: 15px; }
  .c-skills { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 24px; margin: 14px 0 0; padding: 0; list-style: none; }
  .c-skills li { padding: 10px 0; border-bottom: 1px solid var(--rule-ink); font: 700 20px/1.1 'Lab Antonio', 'Arial Narrow', sans-serif; letter-spacing: .04em; text-transform: uppercase; }
  .c-education { margin-top: 22px; }
  .c-education h3 { margin-top: 6px; font-size: 20px; line-height: 1.3; font-weight: 700; }
  .c-place { margin-top: 2px; color: var(--muted); font-size: 15px; }
  .c-languages { margin: 18px 0 0; padding: 0; list-style: none; display: grid; gap: 10px; font-size: 17px; }
  .c-recommendation { margin-inline: 0; padding: 32px; background: var(--lime); }
  .c-recommendation blockquote { margin: 0; font: 500 22px/1.45 var(--hero-font); }
  .c-recommendation figcaption { margin-top: 20px; font-size: 15px; }
  .c-who { font-weight: 700; }

  @media (max-width: 1023px) {
    .c-intro { padding: 92px 20px 24px; gap: 20px; }
    .c-body { grid-template-columns: minmax(0, 1fr); }
    .c-intro-rule { left: 20px; right: 20px; }
  }
  @media (max-width: 767px) {
    .c-intro { grid-template-columns: minmax(0, 1fr); gap: 16px; padding-top: 88px; }
    .c-heading :global(.c-name) { margin-top: 8px; font-size: clamp(42px, 12vw, 64px); }
    .c-role { margin-top: 6px; font-size: 20px; }
    .c-line { margin-top: 6px; font-size: 16px; }
    .c-stack { gap: 4px 16px; font-size: 13px; }
    .c-buttons { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
    .c-pdf-action { flex-direction: column-reverse; align-items: flex-start; gap: 10px; min-height: 100px; padding: 14px; font-size: clamp(19px, 5.2vw, 26px); }
    .c-action-icon { width: 28px; height: 28px; border: 0; }
    .c-action-icon svg { width: 28px; height: 28px; }
    .c-bio { text-align: left; }
    .c-summary, .c-body { padding-inline: 20px; }
    .c-summary { padding-top: 24px; }
    .c-highlights { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px 16px; }
    .c-highlights > div { padding-top: 16px; }
    .c-highlights strong { font-size: 48px; }
    .c-highlights dt { font-size: 12px; margin-top: 8px; }
    .h-detail { font-size: 14px; }
    .c-bullets li { font-size: 16px; }
    .c-recommendation { padding: 24px 20px; }
  }
  @media (prefers-reduced-motion: reduce) { .c-project-title a { transition: none; } }
  @media (prefers-reduced-motion: reduce) {
    .c-pdf-action, .c-pdf-action::before, .c-action-label, .c-action-icon svg, .metric-hint { transition: none; }
  }
  :global(html[data-motion='reduced']) .metric-hint { transition: none; }
  :global(html[data-motion='reduced']) .c-pdf-action,
  :global(html[data-motion='reduced']) .c-pdf-action::before,
  :global(html[data-motion='reduced']) .c-action-label,
  :global(html[data-motion='reduced']) .c-action-icon svg { transition: none; }
</style>
