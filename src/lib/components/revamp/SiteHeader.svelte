<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  import { navigation } from '$lib/content/folio';
  import { scrollToHash } from '$lib/utils/anchors';

  let activeHash = '';

  onMount(() => {
    const syncHash = () => {
      activeHash = window.location.hash;
    };

    syncHash();
    window.addEventListener('hashchange', syncHash);

    return () => {
      window.removeEventListener('hashchange', syncHash);
    };
  });

  $: currentHash = $page.url.hash || activeHash;

  const navigate = async (event: MouseEvent, href: string) => {
    if (!href.startsWith('#')) return;

    if ($page.url.pathname !== '/') {
      return;
    }

    event.preventDefault();
    activeHash = href;
    window.history.replaceState(window.history.state, '', href);
    scrollToHash(href, 96, 0);
  };

  const isActive = (href: string) => {
    if (href.startsWith('/')) {
      return $page.url.pathname === href;
    }

    return $page.url.pathname === '/' && currentHash === href;
  };
</script>

<header class="site-header" data-testid="site-header">
  <nav class="top-nav" data-testid="primary-navigation" aria-label="Primary">
    {#each navigation as item}
      <a
        href={item.href.startsWith('#') && $page.url.pathname !== '/' ? `/${item.href}` : item.href}
        on:click={(event) => navigate(event, item.href)}
        aria-current={isActive(item.href) ? 'page' : undefined}
        class:active={isActive(item.href)}
        data-nav-item
        data-nav-id={item.label.toLowerCase()}
        data-nav-target={item.href}
        data-nav-active={isActive(item.href)}
        data-nav-selected={isActive(item.href)}
      >
        {item.label}
      </a>
    {/each}
  </nav>
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

  .top-nav {
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
    font-family: var(--font-mono);
    font-size: clamp(0.6rem, 0.62vw, 0.7rem);
    font-weight: 800;
    line-height: 1;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgb(244 234 220 / 0.68);
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

  @media (max-width: 760px) {
    .site-header {
      justify-content: center;
      padding: 0.62rem 0.5rem 0;
    }

    .top-nav {
      display: flex;
      justify-content: center;
      gap: 0.08rem;
      width: 100%;
      max-width: calc(100vw - 1rem);
      padding: 0.32rem;
    }

    .top-nav a {
      flex: 1 1 0;
      min-width: 0;
      max-width: 5.9rem;
      min-height: 1.95rem;
      padding-inline: 0.3rem;
      font-size: 0.58rem;
      letter-spacing: 0.14em;
    }
  }

  @media print {
    .site-header {
      display: none;
    }
  }
</style>
