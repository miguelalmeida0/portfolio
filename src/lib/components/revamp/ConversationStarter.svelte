<script lang="ts">
  import Mail from '@lucide/svelte/icons/mail';
  import CopyEmailAction from '$lib/components/shared/CopyEmailAction.svelte';
  import MotionToggle from '$lib/components/shared/MotionToggle.svelte';
  import { reveal } from '$lib/motion/actions/reveal';
  import { site } from '$lib/content/folio';
</script>
<section id="contact" class="page-gutter" aria-labelledby="contact-title">
  <div class="inner">
    <p class="eyebrow" use:reveal={{ threshold: 0.1 }}>Contact</p>
    <span class="contact-rule" use:reveal={{ variant: 'rule', threshold: 0.1, delay: 60 }} aria-hidden="true"></span>
    <div class="main">
      <div><h2 id="contact-title" use:reveal={{ threshold: 0.1, delay: 80 }}>Let’s talk about<br />the work.</h2><p class="intro" use:reveal={{ threshold: 0.1, delay: 150 }}>For frontend and design-engineering conversations, email me directly.</p></div>
      <div class="details">
        <div class="identity"><img src="/images/avatar.webp" alt="Pixel portrait of Miguel Almeida" width="140" height="140" loading="lazy" decoding="async" /><div><h3>Miguel Almeida</h3><p>Frontend Engineer<br />Berlin, Germany</p></div></div>
        <nav aria-label="Contact Miguel">
          <div class="email-row"><a href={'mailto:' + site.email}><Mail size={26} aria-hidden="true" /><span>{site.email}</span></a><CopyEmailAction email={site.email} label="email" variant="button" responsiveIcon testId="direct-email-copy" /></div>
          <a href={site.linkedin} target="_blank" rel="noopener noreferrer"><img class="brand-icon" src="/images/linkedin.svg" alt="LinkedIn" width="26" height="26" loading="lazy" /><span>linkedin.com/in/miguelalmeida1/</span></a>
          <a href={site.github} target="_blank" rel="noopener noreferrer"><img class="brand-icon" src="/images/github.svg" alt="GitHub" width="26" height="26" loading="lazy" /><span>github.com/miguelalmeida0</span></a>
        </nav>
      </div>
    </div>
    <footer>
      <a href="/portfolio.pdf" download="miguel-almeida-cv.pdf">Download résumé <span class="motion-arrow" aria-hidden="true">↗</span></a>
      <span class="build-note">Built with Svelte 5 · SvelteKit · TypeScript · Tailwind</span>
      <MotionToggle />
      <span>Miguel Almeida · Berlin</span>
    </footer>
  </div>
</section>
<style>
  section { padding-block: clamp(4rem, 7vw, 7rem) 2.5rem; background: #050505; color: var(--foreground); }
  .inner { width: 100%; margin-inline: auto; }
  h2, h3, p { margin: 0; }
  .eyebrow { color: var(--accent); font-size: var(--text-label); font-weight: 600; }
  /* The accent rule that closes the page, the same gesture as the work wall's. */
  .contact-rule { display: block; width: min(11rem, 38vw); height: 1px; margin-top: 0.85rem; background: color-mix(in srgb, var(--accent) 62%, transparent); transform-origin: left center; }
  .main { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,38rem); align-items: center; gap: clamp(2rem, 7vw, 8rem); padding-block: 2.5rem 5rem; }
  h2 { font-family: var(--font-serif); font-size: var(--text-page); font-weight: 400; letter-spacing: -0.04em; line-height: 1.08; }
  .intro { margin-top: 1.75rem; max-width: 40ch; color: rgb(244 234 220 / 0.72); font-size: var(--text-lead); line-height: 1.6; }
  .details { min-width: 0; width: 100%; justify-self: end;  }
  .identity { display: flex; align-items: center; gap: clamp(1.2rem, 2.5vw, 2.5rem); margin-bottom: 2rem; }
  .identity img { width: clamp(80px, 9vw, 140px); height: auto; flex-shrink: 0; }
  h3 { font-family: var(--font-serif); font-weight: 400; font-size: var(--text-section); line-height: 1.2; }
  .identity p { margin-top: 0.7rem; font-size: var(--text-lead); color: rgb(244 234 220 / 0.72); line-height: 1.5; }
  nav { display: grid; gap: 0.65rem; }
  nav a { display: flex; min-height: 44px; align-items: center; gap: 1rem; min-width: 0; font-size: var(--text-body); color: rgb(244 234 220 / 0.85); }
  nav a span:last-child { overflow-wrap: anywhere; }
  nav :global(svg) { flex-shrink: 0; }
  .brand-icon { flex-shrink: 0; filter: invert(1); }
  .email-row { display: flex; align-items: center; gap: 0.25rem; }
  .email-row > a { flex: 0 1 auto; }
  .email-row :global(button) { flex-shrink: 0; }
  a:hover { color: var(--accent); }
  a:focus-visible { outline: 2px solid var(--ring); outline-offset: 4px; }
  footer { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; border-top: 1px solid rgb(244 234 220 / 0.2); padding-top: 1.5rem; font-size: 0.9rem; color: rgb(244 234 220 / 0.7); }
  footer a { min-height: 44px; display: flex; align-items: center; }
  footer span { align-self: center; }
  .build-note { color: rgb(244 234 220 / 0.48); }
  @media (max-width: 850px) { .main { grid-template-columns: 1fr; gap: 2.5rem; padding-bottom: 2.5rem; } .identity img { width: 88px; } }
  @media (max-width: 480px) { h2 { font-size: 2.5rem; } .intro { font-size: 0.95rem; margin-top: 1rem; } footer { font-size: 0.75rem; flex-wrap: wrap; } nav a { gap: 0.7rem; } }
</style>
