<script lang="ts">
  import HeroPortrait from './HeroPortrait.svelte';
</script>

<section id="top" class="hero-section" aria-labelledby="hero-title">
  <div class="hero-stage">
    <HeroPortrait />

    <div class="hero-context" aria-label="Portfolio summary">
      <p class="hero-kicker">Berlin / Remote</p>
      <p class="hero-positioning">
        Product UI. Reusable systems.
      </p>
      <p class="hero-proof">
        <span>TypeScript</span>
        <span>Svelte</span>
        <span>React</span>
        <span>Design Systems</span>
        <span>F24</span>
      </p>
      <div class="hero-actions" aria-label="Primary action">
        <a href="#work" class="hero-action hero-action-primary">View work</a>
      </div>
    </div>

    <div class="hero-title-lockup">
      <h1 id="hero-title" aria-label="Miguel Almeida">
        <span class="title-row title-first" aria-hidden="true">Miguel</span>
        <span class="title-row title-last" aria-hidden="true">
          Almeida
        </span>
      </h1>

      <p class="hero-role">Mid-level frontend engineer</p>
    </div>
  </div>
</section>

<style>
  .hero-section {
    --hero-bg: #000;
    --hero-cream: #f4eadc;
    --hero-red: #e91f2d;

    position: relative;
    min-height: 100svh;
    overflow: hidden;
    background: var(--hero-bg);
    color: var(--hero-cream);
    isolation: isolate;
  }

  .hero-stage {
    position: relative;
    display: grid;
    place-items: center;
    min-height: 100svh;
    background: var(--hero-bg);
  }

  .hero-context {
    position: absolute;
    left: clamp(1.25rem, 4vw, 4.5rem);
    top: clamp(7.4rem, 17svh, 10.5rem);
    z-index: 4;
    display: grid;
    gap: clamp(0.9rem, 1.6vw, 1.2rem);
    max-width: min(35rem, 42vw);
    color: var(--hero-cream);
  }

  .hero-kicker,
  .hero-proof {
    margin: 0;
    font-family: var(--font-mono);
    font-size: clamp(0.64rem, 0.72vw, 0.78rem);
    font-weight: 700;
    letter-spacing: 0.16em;
    line-height: 1.4;
    text-transform: uppercase;
  }

  .hero-kicker {
    color: rgb(244 234 220 / 0.74);
  }

  .hero-positioning {
    margin: 0;
    max-width: 33rem;
    color: var(--hero-cream);
    font-family: var(--font-mori);
    font-size: clamp(1.08rem, 1.8vw, 1.65rem);
    font-weight: 700;
    line-height: 1.16;
  }

  .hero-proof {
    display: flex;
    flex-wrap: wrap;
    gap: 0.44rem 0.72rem;
    color: rgb(244 234 220 / 0.68);
    letter-spacing: 0.12em;
  }

  .hero-proof span {
    display: inline-flex;
    align-items: center;
    gap: 0.72rem;
  }

  .hero-proof span:not(:last-child)::after {
    content: '/';
    color: rgb(244 234 220 / 0.28);
  }

  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.7rem;
    pointer-events: auto;
  }

  .hero-action {
    display: inline-flex;
    min-height: 2.75rem;
    align-items: center;
    justify-content: center;
    border: 1px solid rgb(244 234 220 / 0.32);
    border-radius: 999px;
    background: rgb(0 0 0 / 0.48);
    padding: 0 1rem;
    color: var(--hero-cream);
    font-family: var(--font-mono);
    font-size: 0.68rem;
    font-weight: 800;
    letter-spacing: 0.14em;
    line-height: 1;
    text-transform: uppercase;
    transition:
      background-color 180ms var(--interaction-ease),
      border-color 180ms var(--interaction-ease),
      color 180ms var(--interaction-ease),
      transform 180ms var(--interaction-ease);
  }

  .hero-action:hover,
  .hero-action:focus-visible {
    border-color: var(--hero-cream);
    background: var(--hero-cream);
    color: var(--hero-bg);
    outline: none;
    transform: translate3d(0, -1px, 0);
  }

  .hero-action:focus-visible {
    box-shadow:
      0 0 0 2px var(--hero-bg),
      0 0 0 4px rgb(244 234 220 / 0.7);
  }

  .hero-action-primary {
    border-color: var(--hero-cream);
    background: var(--hero-cream);
    color: var(--hero-bg);
  }

  .hero-title-lockup {
    position: absolute;
    left: 50%;
    bottom: clamp(1.35rem, 4svh, 3rem);
    z-index: 3;
    display: grid;
    justify-items: center;
    gap: clamp(0.5rem, 1svh, 0.8rem);
    width: min(92vw, 72rem);
    text-align: center;
    transform: translateX(-50%);
    pointer-events: none;
  }

  h1 {
    margin: 0;
    display: grid;
    gap: clamp(0.06em, 0.9svh, 0.12em);
    font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', var(--font-mori), sans-serif;
    font-size: clamp(4.75rem, min(10.5vw, 18svh), 11rem);
    font-weight: 900;
    line-height: 0.66;
    letter-spacing: 0;
    text-transform: uppercase;
  }

  .title-row {
    display: block;
    white-space: nowrap;
  }

  .title-first {
    color: var(--hero-cream);
  }

  .title-last {
    color: var(--hero-red);
  }

  .hero-role {
    margin: 0;
    padding: 0.62rem clamp(1rem, 1.6vw, 1.45rem);
    border: 1px solid rgb(244 234 220 / 0.34);
    border-radius: 100px;
    background: rgb(0 0 0 / 0.42);
    color: var(--hero-cream);
    font-family: var(--font-mori);
    font-size: clamp(0.72rem, min(0.8vw, 1.65svh), 0.92rem);
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    backdrop-filter: blur(10px);
  }

  @media (max-width: 900px) {
    .hero-context {
      left: 50%;
      top: clamp(5.8rem, 9.4svh, 7.2rem);
      justify-items: center;
      width: min(90vw, 36rem);
      max-width: none;
      text-align: center;
      transform: translateX(-50%);
    }

    .hero-positioning {
      max-width: 34rem;
      font-size: clamp(1rem, 3.1vw, 1.35rem);
    }

    .hero-proof,
    .hero-actions {
      justify-content: center;
    }

    .hero-title-lockup {
      bottom: clamp(1.45rem, 4.2svh, 2.6rem);
      width: min(92vw, 36rem);
    }

    h1 {
      font-size: clamp(3.35rem, min(14vw, 13svh), 5.7rem);
      gap: 0.06em;
      line-height: 0.8;
    }

    .hero-role {
      padding: 0.6rem 0.95rem;
      font-size: clamp(0.68rem, 2.6vw, 0.82rem);
      letter-spacing: 0.12em;
    }
  }

  @media (max-width: 420px) {
    .hero-context {
      top: clamp(5.95rem, 9svh, 6.45rem);
      gap: 0.58rem;
      width: min(92vw, 23rem);
    }

    .hero-kicker {
      font-size: 0.58rem;
      letter-spacing: 0.13em;
    }

    .hero-positioning {
      font-size: 0.94rem;
      line-height: 1.22;
    }

    .hero-proof {
      display: none;
    }

    .hero-action {
      min-height: 2.42rem;
      padding-inline: 0.78rem;
      font-size: 0.58rem;
      letter-spacing: 0.1em;
    }

    h1 {
      font-size: clamp(2.95rem, 15vw, 4rem);
      gap: 0.04em;
      line-height: 0.84;
    }
  }
</style>
