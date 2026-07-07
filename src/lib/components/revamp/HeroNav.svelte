<script lang="ts">
  import { page } from '$app/stores';

  import { navigation } from '$lib/content/folio';
  import { scrollToHash } from '$lib/utils/anchors';

  const navigate = async (event: MouseEvent, href: string) => {
    if (!href.startsWith('#')) return;

    if ($page.url.pathname !== '/') {
      return;
    }

    event.preventDefault();
    scrollToHash(href, 96, 0);
  };

  const isActive = (href: string) => {
    if (href.startsWith('/')) {
      return $page.url.pathname === href;
    }

    return $page.url.pathname === '/' && $page.url.hash === href;
  };
</script>

<header class="hero-nav" data-testid="site-header">
  <div class="hero-nav-inner">
    <a href="/" class="brand interactive-link">
      Miguel<span>.</span>
    </a>

    <nav class="primary-nav" data-testid="primary-navigation" aria-label="Primary">
      {#each navigation as item}
        <a
          href={item.href.startsWith('#') && $page.url.pathname !== '/' ? `/${item.href}` : item.href}
          on:click={(event) => navigate(event, item.href)}
          class:active={isActive(item.href)}
        >
          {item.label}
        </a>
      {/each}
    </nav>

    <div class="hero-actions">
      <a
        href="#contact"
        on:click={(event) => navigate(event, '#contact')}
        class="mobile-contact interactive-button"
      >
        Contact
      </a>
    </div>
  </div>
</header>

<style>
  .hero-nav {
    position: fixed;
    inset: 0 0 auto;
    z-index: 50;
    border-bottom: 1px solid var(--hero-border, var(--border));
    background: var(--hero-nav-bg, var(--background));
    color: var(--hero-fg, var(--foreground));
    backdrop-filter: blur(20px);
    transition:
      background-color 0.32s ease,
      border-color 0.32s ease,
      color 0.32s ease;
  }

  .hero-nav-inner {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 1rem;
    width: min(100%, 1540px);
    margin-inline: auto;
    padding: 1rem clamp(1.25rem, 4vw, 4.5rem);
  }

  .brand {
    width: fit-content;
    font-family: var(--font-display);
    font-size: clamp(1.25rem, 2vw, 1.55rem);
    font-weight: 700;
    letter-spacing: -0.04em;
  }

  .brand span {
    color: var(--hero-accent, var(--accent));
  }

  .primary-nav {
    display: flex;
    align-items: center;
    gap: 0.18rem;
    border: 1px solid var(--hero-border, var(--border));
    border-radius: 999px;
    background: var(--hero-pill-bg, var(--card));
    padding: 0.42rem;
  }

  .primary-nav a {
    border-radius: 999px;
    padding: 0.5rem 0.78rem;
    font-family: var(--font-mono);
    font-size: 0.66rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--hero-muted, var(--muted-foreground));
    transition:
      color 180ms var(--interaction-ease),
      background-color 180ms var(--interaction-ease),
      transform 180ms var(--interaction-ease);
  }

  .primary-nav a:hover,
  .primary-nav a:focus-visible,
  .primary-nav a.active {
    background: var(--hero-pill-active, var(--muted));
    color: var(--hero-fg, var(--foreground));
    transform: translateY(-1px);
  }

  .hero-actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 0.6rem;
  }

  .mobile-contact {
    display: none;
    border-radius: 999px;
    background: var(--hero-fg, var(--foreground));
    padding: 0.72rem 0.9rem;
    font-family: var(--font-mono);
    font-size: 0.62rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--hero-bg, var(--background));
  }

  @media (max-width: 860px) {
    .hero-nav-inner {
      grid-template-columns: 1fr auto;
    }

    .primary-nav {
      display: none;
    }

    .mobile-contact {
      display: inline-flex;
    }
  }

  @media (max-width: 520px) {
    .hero-nav-inner {
      padding: 0.78rem 1rem;
    }
  }
</style>
