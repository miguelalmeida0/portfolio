<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { quintOut } from 'svelte/easing';
  import { fade, fly } from 'svelte/transition';
  import { ArrowUpRight, Menu, X } from '@lucide/svelte';

  import { navigation } from '$lib/content/folio';
  import { scrollToHash } from '$lib/utils/anchors';

  let activeTarget = '';
  let menuOpen = false;

  onMount(() => {
    const syncLocation = () => {
      const { hash, pathname } = window.location;
      activeTarget = pathname === '/' && hash ? hash : pathname;
      menuOpen = false;
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') menuOpen = false;
    };

    const closeOnDesktop = () => {
      if (window.innerWidth > 760) menuOpen = false;
    };

    syncLocation();
    window.addEventListener('hashchange', syncLocation);
    window.addEventListener('popstate', syncLocation);
    window.addEventListener('keydown', closeOnEscape);
    window.addEventListener('resize', closeOnDesktop);

    return () => {
      window.removeEventListener('hashchange', syncLocation);
      window.removeEventListener('popstate', syncLocation);
      window.removeEventListener('keydown', closeOnEscape);
      window.removeEventListener('resize', closeOnDesktop);
    };
  });

  $: activeHref =
    activeTarget ||
    ($page.url.pathname === '/' && $page.url.hash ? $page.url.hash : $page.url.pathname);

  $: if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('mobile-menu-open', menuOpen);
  }

  onDestroy(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('mobile-menu-open');
    }
  });

  const navigate = async (event: MouseEvent, href: string) => {
    menuOpen = false;
    if (!href.startsWith('#')) return;

    if ($page.url.pathname !== '/') {
      return;
    }

    event.preventDefault();
    activeTarget = href;
    await goto(href, {
      replaceState: true,
      keepFocus: true,
      noScroll: true
    });
    scrollToHash(href, 0, 0);
  };
</script>

<header class="site-header" data-testid="site-header">
  <nav class="top-nav" data-testid="primary-navigation" aria-label="Primary">
    {#each navigation as item}
      <a
        href={item.href.startsWith('#') && $page.url.pathname !== '/' ? `/${item.href}` : item.href}
        on:click={(event) => navigate(event, item.href)}
        aria-current={activeHref === item.href ? (item.href.startsWith('#') ? 'location' : 'page') : undefined}
        class:active={activeHref === item.href}
        data-nav-item
        data-nav-id={item.label.toLowerCase()}
        data-nav-target={item.href}
        data-nav-active={activeHref === item.href}
        data-nav-selected={activeHref === item.href}
      >
        {item.label}
      </a>
    {/each}
  </nav>

  <div class="mobile-bar">
    <a class="mobile-wordmark" href="/" aria-label="Miguel Almeida, homepage">
      Miguel Almeida
    </a>
    <button
      class="menu-toggle"
      class:menu-open={menuOpen}
      type="button"
      aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
      aria-controls="mobile-navigation"
      aria-expanded={menuOpen}
      on:click={() => (menuOpen = !menuOpen)}
    >
      <span class="menu-icon menu-icon-open" aria-hidden="true">
        <Menu size={22} strokeWidth={1.7} />
      </span>
      <span class="menu-icon menu-icon-close" aria-hidden="true">
        <X size={22} strokeWidth={1.8} aria-hidden="true" />
      </span>
    </button>
  </div>

  {#if menuOpen}
    <div
      class="mobile-panel-shell"
      transition:fade={{ duration: 180 }}
      role="presentation"
    >
      <button
        class="mobile-scrim"
        type="button"
        aria-label="Dismiss navigation menu"
        on:click={() => (menuOpen = false)}
      ></button>
      <nav
        id="mobile-navigation"
        class="mobile-panel"
        aria-label="Mobile primary"
        transition:fly={{ y: -18, duration: 320, easing: quintOut }}
      >
        <div class="mobile-menu-list">
          {#each navigation as item, index}
            <a
              href={item.href.startsWith('#') && $page.url.pathname !== '/' ? `/${item.href}` : item.href}
              on:click={(event) => navigate(event, item.href)}
              aria-current={activeHref === item.href ? (item.href.startsWith('#') ? 'location' : 'page') : undefined}
              class:active={activeHref === item.href}
              style={`--menu-index: ${index}`}
            >
              <span class="mobile-menu-label">{item.label}</span>
              <ArrowUpRight class="mobile-menu-arrow" size={23} strokeWidth={1.6} aria-hidden="true" />
            </a>
          {/each}
        </div>
      </nav>
    </div>
  {/if}
</header>

<style>
  .site-header {
    --nav-canvas: #0e100f;
    --nav-cream: #fffce1;
    --nav-muted: #7c7c6f;
    --nav-line: #42433d;
    --nav-frame: #a8a8a8;
    --nav-accent: #f4eadc;

    position: fixed;
    inset: 0 0 auto;
    z-index: 50;
    display: flex;
    justify-content: center;
    padding: clamp(0.72rem, 1.6svh, 1.2rem) clamp(0.85rem, 3vw, 3rem) 0;
    border: 0;
    background: transparent;
    color: var(--nav-cream);
    pointer-events: none;
  }

  .site-header::before {
    position: absolute;
    inset: 0 0 auto;
    height: clamp(5.5rem, 9svh, 6.5rem);
    background: linear-gradient(
      180deg,
      #050505 0%,
      #050505 62%,
      rgb(5 5 5 / 0) 100%
    );
    content: '';
    pointer-events: none;
  }

  .top-nav {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.12rem;
    border: 1px solid rgb(244 234 220 / 0.16);
    border-radius: 999px;
    background: rgb(0 0 0 / 0.42);
    padding: 0.38rem;
    box-shadow: 0 16px 40px rgb(0 0 0 / 0.2);
    backdrop-filter: blur(14px);
    pointer-events: auto;
  }

  .top-nav a {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: clamp(4.85rem, 6.7vw, 6.7rem);
    min-height: clamp(1.72rem, 2vw, 2rem);
    border: 0;
    border-radius: 999px;
    background: transparent;
    padding: 0 0.9rem;
    font-family: var(--font-display);
    font-size: clamp(0.75rem, 0.78vw, 0.84rem);
    font-weight: 900;
    line-height: 1;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: rgb(244 234 220 / 0.82);
    outline: none;
    box-shadow: none;
    transition:
      background-color 180ms var(--interaction-ease),
      color 180ms var(--interaction-ease),
      transform 180ms var(--interaction-ease);
  }

  .top-nav a:hover,
  .top-nav a:focus-visible,
  .top-nav a.active {
    background: rgb(244 234 220 / 0.12);
    color: var(--nav-cream);
  }

  .top-nav a:focus-visible {
    box-shadow:
      0 0 0 2px var(--nav-canvas),
      0 0 0 4px var(--nav-accent);
  }

  .mobile-bar,
  .mobile-panel-shell {
    display: none;
  }

  @media (max-width: 760px) {
    .site-header {
      padding:
        max(0.72rem, env(safe-area-inset-top))
        max(0.85rem, env(safe-area-inset-right))
        0
        max(0.85rem, env(safe-area-inset-left));
    }

    .top-nav {
      display: none;
    }

    .site-header::before {
      display: none;
    }

    .mobile-bar {
      position: relative;
      z-index: 5;
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: space-between;
      pointer-events: auto;
    }

    .mobile-wordmark {
      color: rgb(244 234 220 / 0.72);
      font-family: var(--font-mono);
      font-size: 0.68rem;
      font-weight: 460;
      letter-spacing: 0.08em;
      line-height: 1;
      text-transform: uppercase;
      transition: color 180ms ease;
    }

    .mobile-wordmark:hover,
    .mobile-wordmark:focus-visible {
      color: var(--nav-cream);
    }

    .menu-toggle:focus-visible,
    .mobile-panel a:focus-visible {
      outline: 2px solid var(--ring);
      outline-offset: 3px;
    }

    .menu-toggle {
      position: relative;
      display: block;
      flex: 0 0 auto;
      width: 2.75rem;
      height: 2.75rem;
      border: 0;
      border-radius: 50%;
      background: transparent;
      color: var(--nav-cream);
      cursor: pointer;
      transition:
        color 220ms ease,
        transform 420ms cubic-bezier(0.22, 1, 0.36, 1);
    }

    .menu-toggle:hover {
      color: var(--accent);
    }

    .menu-toggle:active {
      transform: scale(0.94);
    }

    .menu-icon {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      transition:
        opacity 220ms ease,
        transform 480ms cubic-bezier(0.22, 1, 0.36, 1);
    }

    .menu-icon-open {
      opacity: 1;
      transform: rotate(0deg) scale(1);
    }

    .menu-icon-close {
      opacity: 0;
      transform: rotate(-90deg) scale(0.52);
    }

    .menu-toggle.menu-open {
      color: var(--nav-cream);
    }

    .menu-toggle.menu-open .menu-icon-open {
      opacity: 0;
      transform: rotate(90deg) scale(0.52);
    }

    .menu-toggle.menu-open .menu-icon-close {
      opacity: 1;
      transform: rotate(0deg) scale(1);
    }

    .mobile-panel-shell {
      position: fixed;
      inset: 0;
      z-index: 3;
      display: block;
      overflow: hidden;
      pointer-events: none;
    }

    .mobile-scrim {
      position: absolute;
      inset: 0;
      display: block;
      width: 100%;
      height: 100%;
      border: 0;
      background: rgb(0 0 0 / 0.62);
      cursor: pointer;
      pointer-events: auto;
      backdrop-filter: blur(7px);
    }

    .mobile-panel {
      position: relative;
      width: 100%;
      max-height: min(24rem, 70svh);
      overflow-y: auto;
      overscroll-behavior: contain;
      border-bottom: 1px solid rgb(244 234 220 / 0.16);
      background: #070707;
      padding: max(4.75rem, calc(env(safe-area-inset-top) + 4.1rem)) 0.95rem 1rem;
      box-shadow: 0 22px 52px rgb(0 0 0 / 0.44);
      pointer-events: auto;
    }

    .mobile-menu-list {
      width: 100%;
      max-width: 40rem;
      margin-inline: auto;
      border-top: 1px solid rgb(244 234 220 / 0.14);
    }

    .mobile-panel a {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      min-height: 3.35rem;
      align-items: center;
      gap: 0.85rem;
      border-bottom: 1px solid rgb(244 234 220 / 0.14);
      color: rgb(244 234 220 / 0.62);
      opacity: 0;
      animation: menu-link-enter 520ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
      animation-delay: calc(80ms + var(--menu-index) * 65ms);
      transition:
        color 180ms ease,
        padding-inline 380ms cubic-bezier(0.22, 1, 0.36, 1);
    }

    .mobile-panel a:hover,
    .mobile-panel a:focus-visible,
    .mobile-panel a.active {
      color: var(--nav-cream);
      padding-inline: 0.35rem;
    }

    .mobile-menu-label {
      font-family: var(--font-display);
      font-size: 1rem;
      font-weight: 720;
      letter-spacing: 0;
      line-height: 1;
    }

    :global(.mobile-menu-arrow) {
      color: rgb(244 234 220 / 0.32);
      transition:
        color 180ms ease,
        transform 380ms cubic-bezier(0.22, 1, 0.36, 1);
    }

    .mobile-panel a:hover :global(.mobile-menu-arrow),
    .mobile-panel a:focus-visible :global(.mobile-menu-arrow),
    .mobile-panel a.active :global(.mobile-menu-arrow) {
      color: var(--accent);
      transform: translate(0.22rem, -0.22rem);
    }

    @keyframes menu-link-enter {
      from {
        opacity: 0;
        transform: translateY(1rem);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .menu-toggle,
      .menu-icon,
      .mobile-panel a,
      :global(.mobile-menu-arrow) {
        transition: none;
      }

      .mobile-panel a {
        opacity: 1;
        animation: none;
      }
    }
  }

  :global(html.mobile-menu-open) {
    overflow: hidden;
  }

  @media print {
    .site-header {
      display: none;
    }
  }
</style>
