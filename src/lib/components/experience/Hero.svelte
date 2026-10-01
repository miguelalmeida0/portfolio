<script lang="ts">
  import { destinationLink } from '$lib/navigation/destination-link';
  import WindHeadline from './hero/WindHeadline.svelte';
  import PortraitCard from './hero/PortraitCard.svelte';
</script>
<section aria-labelledby="intro-heading" class="wind-shell wind-hero" data-align="left">
  <div class="content-card" data-hero-card>
    <div class="top-group">
      <div class="greeting-row">
        <p class="greeting" data-ask-id="hi">Hi, I’m Miguel.</p>
      </div>
      <WindHeadline />
      <p class="hero-stack" data-ask-id="stack">React&nbsp;· TypeScript&nbsp;· Svelte&nbsp;· JavaScript</p>
    </div>
    <div class="bottom-group">
      <div class="supporting-copy">
        <p class="experience" data-ask-id="f24">Built a product used by thousands of companies.</p>
        <p class="quality" data-ask-id="quality">Playwright · accessibility</p>
      </div>
      <div class="hero-actions">
        <a href="/cv" class="primary" data-ask-id="cv" {...destinationLink("/cv")}>View CV <span aria-hidden="true">→</span></a>
        <a href="#contact" class="secondary" data-ask-id="touch" {...destinationLink("#contact")}>Get in touch <span aria-hidden="true">→</span></a>
      </div>
    </div>
  </div>
  <PortraitCard />
</section>
<style>
  .wind-hero { display: grid; grid-template-columns: 640px minmax(0, 1fr); gap: var(--card-gap); margin-top: 56px; color: var(--ink); font-family: var(--hero-font); }
  .content-card { min-width: 0; height: 500px; padding: 36px 36px 32px; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; border-radius: var(--card-radius); background: var(--lime); }
  .top-group, .bottom-group { display: flex; flex-direction: column; gap: 16px; }
  .bottom-group { gap: 18px; }
  .greeting-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
  .greeting { font-size: 19px; line-height: 1.4; font-weight: 400; }
  .hero-stack { font-size: 24px; line-height: 1.35; font-weight: 600; color: var(--ink); text-wrap: balance; }
  .supporting-copy { display: flex; flex-direction: column; gap: 6px; }
  .experience { font-size: 18px; line-height: 1.4; }
  .quality { font-size: 15px; line-height: 1.4; color: var(--muted); }
  .hero-actions { display: flex; align-items: center; gap: 24px; }
  .hero-actions a { display: inline-flex; align-items: center; justify-content: center; gap: 5px; font-size: 17px; line-height: 1; min-height: 52px; }
  .primary { padding: 0 24px; border-radius: 10px; background: var(--plum); color: var(--paper); font-weight: 700; }
  .primary:hover { background: var(--plum-700); }
  .primary:focus-visible { outline: 3px solid var(--paper); outline-offset: 2px; box-shadow: 0 0 0 7px var(--plum); }
  .secondary { font-weight: 600; }
  .secondary:hover { color: var(--plum); }
  @media (min-width: 1024px) and (max-width: 1279px) { .wind-hero { grid-template-columns: minmax(0, 1fr) 44%; } }
  @media (max-width: 1023px) { .wind-hero { grid-template-columns: minmax(0, 1fr); } }
  @media (min-width: 768px) and (max-width: 1023px) { .content-card { height: 420px; } }
  @media (max-width: 767px) {
    .wind-hero { margin-top: 28px; gap: 20px; }
    .content-card { height: auto; padding: 24px 20px; gap: 28px; }
    .hero-stack { font-size: 22px; }
    .hero-actions { flex-direction: column; gap: 12px; }
    .hero-actions a { width: 100%; min-height: 52px; }
  }
</style>
