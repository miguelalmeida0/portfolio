<script lang="ts">
  import SiteHeader from "$lib/components/revamp/SiteHeader.svelte";
  /*
   * The résumé is deliberately still. Only the identity block settles; the roles,
   * dates, stack lists and recommendation stay exactly where they render, so the
   * document reads, scrolls, prints and downloads like a document.
   */
  import { reveal } from '$lib/motion/actions/reveal';
  import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
  import ArrowRight from '@lucide/svelte/icons/arrow-right';
  import Download from '@lucide/svelte/icons/download';
  import Mail from '@lucide/svelte/icons/mail';
  import MapPin from '@lucide/svelte/icons/map-pin';
  import Building2 from '@lucide/svelte/icons/building-2';
  import Code2 from '@lucide/svelte/icons/code-2';
  import Users from '@lucide/svelte/icons/users';
  import Layers from '@lucide/svelte/icons/layers';
  import TrendingUp from '@lucide/svelte/icons/trending-up';
  import Globe from '@lucide/svelte/icons/globe';
  import MousePointer2 from '@lucide/svelte/icons/mouse-pointer-2';
  import GraduationCap from '@lucide/svelte/icons/graduation-cap';
  import Zap from '@lucide/svelte/icons/zap';
  import MessageCircle from '@lucide/svelte/icons/message-circle';
  import Quote from '@lucide/svelte/icons/quote';
  import { cvExperience, cvEducation, cvLanguages, cvStack, professionalRecommendation, site } from '$lib/content/folio';
  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(site.email)}&su=${encodeURIComponent("Role opportunity")}`;
  const technicalFocus = [...cvStack, 'Browser media APIs', 'Async lifecycle ownership', 'Applied AI interfaces'];
</script>

<svelte:head>
  <title>CV — Miguel Almeida · Frontend Engineer</title>
  <meta name="description" content="Miguel Almeida’s engineering experience, education, and technical focus. Business applications from first mockups to production, React migration, and frontend delivery leadership." />
</svelte:head>

<a class="skip-link" href="#experience">Skip to experience</a>
<SiteHeader />
<main class="cv-sheet page-gutter">
  <header>
    <div class="intro">
      <div class="identity"><p use:reveal>Miguel Almeida</p><h1 use:reveal={{ delay: 60 }}>Mid-level Frontend Engineer</h1><span class="location"><MapPin size={17} aria-hidden="true" />Berlin, Germany</span>
        <div class="identity-actions"><a class="pill download" href="/portfolio.pdf" download="miguel-almeida-cv.pdf"><Download size={17} aria-hidden="true" />Download PDF</a></div>
      </div>
      <div class="intro-details">
        <p class="overview">A concise overview of my experience, skills and education.<br />For more context and details, check out the <a href="/story">Story</a>.</p>
        <div class="contact-links" aria-label="Contact details">
          <a href={gmailComposeUrl} target="_blank" rel="noopener noreferrer" aria-label="Email Miguel in Gmail (opens a new tab)"><Mail size={19} aria-hidden="true" /><span>{site.email}</span></a>
          <a href={site.linkedin} target="_blank" rel="noopener noreferrer"><img src="/images/linkedin.svg" width="18" height="18" alt="" /><span>LinkedIn</span><ArrowUpRight size={15} aria-hidden="true" /></a>
          <a href={site.github} target="_blank" rel="noopener noreferrer"><img src="/images/github.svg" width="19" height="19" alt="" /><span>GitHub</span><ArrowUpRight size={15} aria-hidden="true" /></a>
        </div>
      </div>
    </div>
  </header>
  <section id="experience" aria-label="Experience" class="experience">
    {#each cvExperience as item, index}
      <article class="role" class:current={index === 0}>
        <div class="role-date"><time>{item.years}</time><span class="timeline-dot" aria-hidden="true"></span></div>
        <div class="role-content">
          <header class="role-header">
            <div class="employer-icon" aria-hidden="true">{#if index === 0}<Building2 size={26} />{:else}<Code2 size={26} />{/if}</div>
            <div><h2>{item.role}</h2><p>{item.company} · {item.location}, Germany</p></div>
          </header>
          {#if index === 0}
            <div class="delivery-card">
              <div class="delivery-copy">
                <p>Built a business application’s frontend from scratch, from initial mockups through to production. The application is now used by hundreds of companies.</p>
                <ul class="role-signals"><li><Users size={23} aria-hidden="true" /><span>From mockups to production</span></li><li><Layers size={23} aria-hidden="true" /><span>React migration</span></li><li><TrendingUp size={23} aria-hidden="true" /><span>Frontend delivery lead</span></li></ul>
              </div>
              <a class="delivery-image" href="/story#hackathon" aria-label="Read about leading the frontend for F24’s first shared AI service"><img src="/projects/f24-ai-hackathon/team-demo-640.webp" srcset="/projects/f24-ai-hackathon/team-demo-640.webp 640w, /projects/f24-ai-hackathon/team-demo-1024.webp 1024w" sizes="(max-width: 800px) 90vw, 45vw" width="1600" height="1000" alt="Miguel and the hackathon team beside the shared AI service demonstration." decoding="async" /><span>Shared AI service · the team<ArrowUpRight size={14} aria-hidden="true" /></span></a>
            </div>
            <details class="role-detail"><summary>Engineering scope</summary><ul>{#each item.bullets.slice(1) as bullet}<li>{bullet}</li>{/each}</ul></details>
          {:else}
            <ul class="role-signals freelance-signals"><li><Globe size={22} aria-hidden="true" /><span>Websites & product UI</span></li><li><MousePointer2 size={22} aria-hidden="true" /><span>Design implementation</span></li></ul>
            <details class="role-detail"><summary>Delivery scope</summary><ul>{#each item.bullets as bullet}<li>{bullet}</li>{/each}</ul></details>
          {/if}
        </div>
      </article>
    {/each}
  </section>
  <div class="credentials">
    <section aria-labelledby="education-title"><h2 id="education-title"><GraduationCap size={21} aria-hidden="true" />Education</h2>{#each cvEducation as item}<div class="study"><p>{item.year}</p><h3>{item.title}</h3><p>{item.place}</p></div>{/each}</section>
    <section aria-labelledby="skills-title"><h2 id="skills-title"><Zap size={20} aria-hidden="true" />Technical focus</h2><ul class="skill-list">{#each technicalFocus as skill}<li>{skill}</li>{/each}</ul></section>
    <section aria-labelledby="languages-title"><h2 id="languages-title"><MessageCircle size={20} aria-hidden="true" />Languages</h2><ul class="language-list">{#each cvLanguages as language}<li><span>{language.split(' · ')[0]}</span><span>{language.split(' · ')[1]}</span></li>{/each}</ul></section>
  </div>
  <footer class="recommendation">
    <figure><Quote class="quote-icon" size={25} aria-hidden="true" /><blockquote>“{professionalRecommendation.quote}”</blockquote><figcaption><strong>{professionalRecommendation.name}</strong><span>Previous team lead · F24</span></figcaption></figure>
    <div class="contact-panel">
      <div class="contact-person"><img src="/images/avatar.webp" alt="Pixel portrait of Miguel Almeida" width="64" height="64" loading="lazy" decoding="async" /><div><strong>Miguel Almeida</strong><span>Frontend Engineer · Berlin</span></div></div>
      <a class="contact-address" href={gmailComposeUrl} target="_blank" rel="noopener noreferrer">{site.email}</a>
      <a class="contact-cta" href={gmailComposeUrl} target="_blank" rel="noopener noreferrer" aria-label="Contact Miguel in Gmail (opens a new tab)">Contact Miguel<ArrowRight size={18} aria-hidden="true" /></a>
    </div>
  </footer>
</main>

<style>
  .cv-sheet { --cv-rule: rgb(244 234 220 / 0.12); --cv-cell-padding: clamp(1.25rem, 3vw, 3rem); width: 100%; min-height: 100svh; margin: 0; padding-block: clamp(6.25rem, 8vw, 7.5rem) 2rem; background: #050505; color: #f4eadc; }
  h1,h2,h3,p,ul,figure,blockquote { margin: 0; }
  ul { padding: 0; list-style: none; }
  a { color: inherit; } a:hover { color: var(--accent); }
  a:focus-visible, summary:focus-visible { outline: 2px solid var(--ring); outline-offset: 5px; }
  :global(.cv-sheet svg) { flex-shrink: 0; }
  .skip-link { position: fixed; top: 8px; left: 8px; z-index: 100; padding: 12px; background: #f4eadc; color: #080909; transform: translateY(-200%); } .skip-link:focus { transform: translateY(0); }
  .pill { display: inline-flex; align-items: center; justify-content: center; gap: 10px; min-height: 40px; padding: 0.5rem 1rem; border: 1px solid rgb(244 234 220 / 0.25); border-radius: 999px; font-size: var(--text-label); font-weight: 600; white-space: nowrap; } .download { min-height: 44px; }
  .identity-actions { margin-top: 1.25rem; }
  .download:hover { background: #f4eadc; color: #080909; border-color: #f4eadc; }
  .intro { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0; align-items: center; padding-block: 2rem 2.5rem; }
  .identity { min-width: 0; padding-right: var(--cv-cell-padding); }
  .intro-details { min-width: 0; align-self: stretch; display: flex; flex-direction: column; justify-content: center; padding-left: var(--cv-cell-padding); border-left: 1px solid var(--cv-rule); }
  .identity .location { margin-top: 1rem; color: #aaa69f; }
  .identity p { font-size: var(--text-small); font-weight: 600; }
  h1 { font-family: var(--font-serif); font-size: var(--text-page); max-width: 15ch; font-weight: 400; line-height: 1.12; letter-spacing: -0.04em; margin-top: 0.75rem; }
  .overview { color: #b4b1ab; font-size: var(--text-body); line-height: 1.6; } .overview a { text-decoration: underline; text-underline-offset: 4px; }
  .contact-links { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.75rem; margin-top: 1.5rem; }
  .contact-links a { min-width: 0; padding: 0.75rem 1rem; border: 1px solid var(--cv-rule); border-radius: 8px; }
  .contact-links a:hover { background: #141515; border-color: #aaa69f; }
  .contact-links a:first-child { grid-column: 1 / -1; }
  .contact-links a, .location { display: inline-flex; align-items: center; gap: 9px; min-height: 32px; font-size: var(--text-label); color: #c9c5be; } .contact-links a span { overflow-wrap: anywhere; } .contact-links img { filter: invert(1); flex-shrink: 0; }
  .experience { border-top: 1px solid var(--cv-rule); scroll-margin-top: 2rem; }
  .role { display: grid; grid-template-columns: minmax(0,1fr); gap: 1rem; padding-block: 2rem; border-bottom: 1px solid var(--cv-rule); }
  .role-date { position: relative; padding-left: 18px; color: #c7c2b9; font-size: var(--text-label); } .current .role-date { color: var(--accent); }
  .timeline-dot { position: absolute; left: 0; top: 5px; width: 7px; height: 7px; border-radius: 50%; background: #e7ded1; } .current .timeline-dot { background: var(--accent); }
  .role-content { min-width: 0; } .role-header { display: flex; align-items: center; gap: 1.25rem; }
  .employer-icon { width: 52px; height: 52px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1px solid rgb(244 234 220 / 0.24); border-radius: 9px; background: #161717; } .current .employer-icon { background: #f4eadc; color: #184966; }
  .role-header h2 { font-size: var(--text-card); font-weight: 600; line-height: 1.3; } .role-header p { margin-top: 6px; color: #9e9b95; font-size: var(--text-small); }
  .delivery-card { margin-top: 1.5rem; display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); overflow: hidden; border: 1px solid var(--cv-rule); border-radius: 12px; background: #111212; }
  .delivery-copy { padding: var(--cv-cell-padding); display: flex; flex-direction: column; align-items: start; justify-content: center; gap: 1.5rem; } .delivery-copy p { color: #c4c0b9; font-size: var(--text-small); line-height: 1.6; }
  .delivery-image { position: relative; display: block; min-width: 0; align-self: center; border-left: 1px solid var(--cv-rule); height: clamp(14rem, 21vw, 22rem); } .delivery-image > img { display: block; width: 100%; height: 100%; min-height: 0; object-fit: contain; }
  .delivery-image > span { position: absolute; bottom: 10px; left: 10px; right: 10px; display: flex; align-items: center; justify-content: space-between; gap: 8px; background: rgb(8 9 9 / 0.9); padding: 8px 10px; font-size: 0.7rem; color: #f4eadc; }
  .role-signals { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 1rem; width: 100%; padding-top: 1.25rem; border-top: 1px solid var(--cv-rule); } .role-signals li { display: flex; gap: 0.65rem; align-items: center; font-size: var(--text-label); line-height: 1.5; color: #bcb8b1; } .role-signals :global(svg) { color: #e6ddd0; }
  .freelance-signals { margin-top: 1.5rem; grid-template-columns: repeat(2, minmax(0,1fr)); }
  .role-detail { margin-top: 0.75rem; color: #aaa69f; font-size: var(--text-label); } .role-detail summary { width: fit-content; cursor: pointer; min-height: 36px; padding-block: 8px; } .role-detail ul { list-style: disc; padding: 0.5rem 0 0 1.25rem; max-width: 75ch; } .role-detail li { padding-bottom: 0.5rem; line-height: 1.6; } .role:not(.current) .role-detail { grid-column: 1/-1; margin-top: 0; }
  .credentials { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 0; padding-block: 2rem; border-bottom: 1px solid var(--cv-rule); } .credentials section { min-width: 0; padding-inline: var(--cv-cell-padding); } .credentials section:first-child { padding-left: 0; } .credentials section:last-child { padding-right: 0; } .credentials section + section { border-left: 1px solid var(--cv-rule); }
  .credentials h2 { display: flex; align-items: center; gap: 10px; color: var(--accent); font-size: var(--text-small); font-weight: 600; margin-bottom: 1.25rem; }
  .study + .study { margin-top: 1.25rem; } .study p { color: #9e9b95; font-size: var(--text-label); line-height: 1.5; } .study h3 { font-size: var(--text-small); font-weight: 600; margin-block: 5px; line-height: 1.4; }
  .skill-list { display: flex; flex-wrap: wrap; gap: 7px; } .skill-list li, .language-list li { border: 1px solid var(--cv-rule); border-radius: 9px; padding: 6px 11px; background: #141515; font-size: var(--text-label); color: #cbc6be; line-height: 1.4; }
  .language-list { display: grid; gap: 8px; } .language-list li { display: flex; justify-content: space-between; gap: 1rem; padding: 0.8rem 1rem; } .language-list li span:last-child { color: #95928c; }
  .recommendation { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); align-items: center; gap: 0; padding-top: 2rem; } .recommendation figure { display: grid; grid-template-columns: 25px minmax(0,1fr); column-gap: 1.25rem; max-width: 43rem; padding-right: var(--cv-cell-padding); } :global(.quote-icon) { color: var(--accent); }
  .contact-panel { margin-left: var(--cv-cell-padding); padding: clamp(1.25rem, 2vw, 2rem); border: 1px solid var(--cv-rule); border-radius: 12px; background: #111212; display: grid; gap: 1rem; min-width: 0; }
  .contact-person { display: flex; align-items: center; gap: 1rem; }
  .contact-person img { flex-shrink: 0; border-radius: 8px; }
  .contact-person div { display: grid; gap: 0.3rem; }
  .contact-person strong { font-size: var(--text-body); font-weight: 600; }
  .contact-person span { color: #aaa69f; font-size: var(--text-small); }
  .contact-address { font-size: var(--text-small); overflow-wrap: anywhere; }
  blockquote { color: #c4bfb7; font-size: var(--text-small); line-height: 1.65; } figcaption { display: grid; grid-column: 2; gap: 5px; margin-top: 1.5rem; font-size: var(--text-label); } figcaption strong { font-weight: 600; } figcaption span { color: #99958e; }
  .contact-cta { width: 100%; display: inline-flex; align-items: center; justify-content: center; gap: 2rem; min-height: 48px; padding: 0.75rem 1.75rem; border-radius: 999px; background: #f4eadc; color: #080909; white-space: nowrap; font-size: var(--text-small); font-weight: 650; } .contact-cta:hover { background: #ffffff; color: #080909; } .contact-cta:focus-visible { background: #ffffff; color: #080909; outline: 2px solid #ffffff; outline-offset: 4px; } .contact-cta:active { background: #e6ded2; color: #080909; }
  @media (max-width: 1100px) {
    .role-signals { grid-template-columns: 1fr; gap: 0.75rem; }
    .freelance-signals { grid-template-columns: repeat(2, minmax(0,1fr)); }
  }
  @media (max-width: 800px) {
    .intro { grid-template-columns: 1fr; gap: 1.5rem; padding-block: 2rem; }
    .identity { padding-right: 0; }
    .intro-details { border-left: 0; border-top: 1px solid var(--cv-rule); padding: 1.5rem 0 0; }
    .delivery-card { grid-template-columns: 1fr; }
    .delivery-image { height: auto; border-left: 0; border-top: 1px solid var(--cv-rule); }
    .delivery-image > img { height: auto; max-height: 22rem; }
    .credentials { grid-template-columns: repeat(2, minmax(0,1fr)); }
    .credentials section:last-child { grid-column: 1/-1; border-left: 0; padding: 1.25rem 0 0; border-top: 1px solid var(--cv-rule); }
    .recommendation { grid-template-columns: 1fr; align-items: start; gap: 1.5rem; }
    .recommendation figure { padding-right: 0; }
    .contact-panel { margin-left: 0; }
  }
  @media (max-width: 560px) {
    .cv-sheet { padding-top: 6rem; }
    h1 { font-size: 2rem; }
    .contact-links a { padding: 0.75rem; }
    .role { grid-template-columns: 1fr; gap: 1rem; padding-block: 1.5rem; }
    .role-date { padding: 0 0 0 18px; border-right: 0; }
    .timeline-dot { top: 5px; left: 0; right: auto; width: 7px; height: 7px; }
    .role-header { gap: 0.85rem; align-items: start; }
    .role-header h2 { font-size: 1.125rem; }
    .employer-icon { width: 42px; height: 42px; }
    .delivery-copy { padding: 1.25rem; }
    .freelance-signals { grid-template-columns: 1fr; }
    .credentials { grid-template-columns: 1fr; gap: 1.5rem; }
    .credentials section { padding-inline: 0; }
    .credentials section + section { padding: 1.5rem 0 0; border-left: 0; border-top: 1px solid var(--cv-rule); }
    .contact-cta { width: 100%; }
  }
  @media print { .identity-actions, .contact-panel, .skip-link { display: none; } .cv-sheet { width: 100%; margin: 0; border: 0; } }
</style>
