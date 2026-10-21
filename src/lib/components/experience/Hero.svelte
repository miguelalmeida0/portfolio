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
      <p class="experience font-semibold">4+ years building production software.</p>
      <p class="hero-stack" data-ask-id="stack">React&nbsp;· TypeScript&nbsp;· Svelte&nbsp;· JavaScript</p>
    </div>
    <div class="bottom-group">
      <div class="supporting-copy">
        <p class="experience" data-ask-id="f24">Built a product used by hundreds of companies.</p>
      </div>
      <div class="hero-actions">
        <a href="/cv" class="primary" data-ask-id="cv" {...destinationLink("/cv")}>
          <span class="cv-label">View CV</span>
          <span class="cv-reveal" aria-hidden="true">View CV</span>
          <span class="cv-orbit" aria-hidden="true">
            <svg class="cv-arrow cv-arrow-out" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" focusable="false"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
            <svg class="cv-arrow cv-arrow-in" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" focusable="false"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
          </span>
        </a>
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
  .hero-actions { display: flex; align-items: center; gap: 24px; }
  .hero-actions a { display: inline-flex; align-items: center; justify-content: center; gap: 5px; font-size: 17px; line-height: 1; min-height: 52px; }
  .hero-actions .primary {
    --cv-duration: 450ms;
    --cv-ease: cubic-bezier(0.785, 0.135, 0.15, 0.86);
    --cv-scale: 1;
    --cv-icon: calc(36px * var(--cv-scale));
    --cv-inset: calc(5px * var(--cv-scale));
    --cv-padding: 0 calc(61px * var(--cv-scale)) 0 calc(22px * var(--cv-scale));
    --cv-clip: inset(calc(50% - var(--cv-icon) / 2) var(--cv-inset) calc(50% - var(--cv-icon) / 2) calc(100% - var(--cv-icon) - var(--cv-inset)) round 999px);
    --cv-orbit-bg: var(--cv-fill);
    --cv-orbit-ink: var(--plum);
    --cv-arrow-out: translate(-50%, -50%) scale(1);
    --cv-arrow-in: translate(-170%, -50%) scale(0);
    position: relative;
    isolation: isolate;
    box-sizing: border-box;
    flex-shrink: 0;
    justify-content: flex-start;
    min-height: calc(48px * var(--cv-scale));
    padding: var(--cv-padding);
    overflow: hidden;
    border: calc(2px * var(--cv-scale)) solid var(--plum);
    border-radius: var(--r-pill);
    background: var(--plum);
    color: var(--cv-label);
    font-weight: 700;
    white-space: nowrap;
    text-decoration: none;
    touch-action: manipulation;
  }
  .primary span, .cv-arrow { pointer-events: none; }
  .cv-label { position: relative; }
  /* Clip the cream surface and its plum label together: text never fades
     through an intermediate color or appears on the wrong background. */
  .cv-reveal {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    padding: var(--cv-padding);
    background: var(--cv-fill);
    color: var(--plum);
    clip-path: var(--cv-clip);
    transition: clip-path var(--cv-duration) var(--cv-ease);
  }
  .cv-orbit {
    position: absolute;
    right: var(--cv-inset);
    top: 50%;
    width: var(--cv-icon);
    height: var(--cv-icon);
    transform: translateY(-50%);
    overflow: hidden;
    border-radius: 50%;
    background: var(--cv-orbit-bg);
    color: var(--cv-orbit-ink);
  }
  .cv-arrow {
    position: absolute;
    top: 50%;
    left: 50%;
    width: calc(19px * var(--cv-scale));
    height: calc(19px * var(--cv-scale));
    transition: transform var(--cv-duration) var(--cv-ease);
  }
  .cv-arrow-out { transform: var(--cv-arrow-out); }
  .cv-arrow-in { transform: var(--cv-arrow-in); }
  .primary:is(:focus-visible, :active) {
    --cv-clip: inset(0 0 0 0 round 999px);
    --cv-orbit-bg: var(--plum);
    --cv-orbit-ink: var(--cv-fill);
    --cv-arrow-out: translate(65%, -50%) scale(0);
    --cv-arrow-in: translate(-50%, -50%) scale(1);
  }
  @media (hover: hover) and (pointer: fine) {
    .primary:hover {
      --cv-clip: inset(0 0 0 0 round 999px);
      --cv-orbit-bg: var(--plum);
      --cv-orbit-ink: var(--cv-fill);
      --cv-arrow-out: translate(65%, -50%) scale(0);
      --cv-arrow-in: translate(-50%, -50%) scale(1);
    }
  }
  .primary:focus-visible { outline: 3px solid var(--plum); outline-offset: 4px; }
  /* Match the approved physical geometry within the site's 80% desktop zoom.
     Keep the inherited typography at its existing size. */
  @media screen and (min-width: 1024px) {
    .hero-actions .primary { --cv-scale: 1.25; }
  }
  @media (prefers-reduced-motion: reduce) {
    .cv-reveal, .cv-arrow { transition: none; }
  }
  .secondary { font-weight: 600; }
  .secondary:hover { color: var(--plum); }
  @media (min-width: 1024px) and (max-width: 1279px) { .wind-hero { grid-template-columns: minmax(0, 1fr) 44%; } }
  @media (max-width: 1023px) { .wind-hero { grid-template-columns: minmax(0, 1fr); } }
  @media (min-width: 768px) and (max-width: 1023px) { .content-card { height: 420px; } }
  @media (max-width: 767px) {
    .wind-hero { margin-top: 28px; gap: 20px; }
    .content-card { height: auto; padding: 28px 24px 24px; gap: 32px; border-radius: 22px; }
    .top-group { gap: 14px; }
    .greeting { font-size: 17px; }
    .content-card { --type-home-display-mobile: clamp(32px, 8.2vw, 39px); }
    .content-card :global(h1) { line-height: 1.08; }
    .experience { font-size: 17px; line-height: 1.45; }
    .bottom-group { gap: 18px; }
    .supporting-copy { padding-top: 18px; }
    .hero-actions { gap: 8px; }
    .hero-actions .primary { border-radius: var(--r-pill); }
    .hero-actions .secondary { min-height: 48px; }
    .hero-stack { font-size: 15px; line-height: 1.5; letter-spacing: -.01em; }
    .content-card .experience { font-size: 16px; }
    .content-card .greeting { font-size: 16px; }
    .content-card .top-group { gap: 13px; }
    .content-card .bottom-group { gap: 16px; }
    .content-card .supporting-copy { padding-top: 15px; }
    .content-card .hero-actions { gap: 5px; }
    .content-card .hero-actions .secondary { min-height: 44px; font-size: 15px; }
    .content-card .hero-actions .primary { min-height: 52px; font-size: 16px; }
    .hero-actions { flex-direction: column; gap: 12px; }
    .hero-actions a { width: 100%; min-height: 52px; }
  }
</style>
