<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { afterNavigate, goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { quintOut } from 'svelte/easing';
  import { fade, fly } from 'svelte/transition';
  import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
  import Menu from '@lucide/svelte/icons/menu';
  import X from '@lucide/svelte/icons/x';

  import { navigation } from '$lib/content/folio';
  import { scrollToHash } from '$lib/utils/anchors';

  let activeTarget = '';
  let menuOpen = false;
  let headerElement: HTMLElement;
  /** The section the visitor is actually looking at, or '' when none is in view. */
  let visibleSection = '';

  afterNavigate(() => {
    activeTarget = $page.url.pathname === '/' ? ($page.url.hash || '/') : $page.url.pathname;
    menuOpen = false;
  });

  onMount(() => {
    const syncLocation = () => {
      const { hash, pathname } = window.location;
      activeTarget = pathname === '/' && hash ? hash : pathname;
      menuOpen = false;
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (!menuOpen) return;
      const toggle = headerElement.querySelector<HTMLButtonElement>('.menu-toggle');
      if (event.key === 'Escape') {
        menuOpen = false;
        toggle?.focus();
      }
      if (event.key === 'Tab') {
        const links = Array.from(headerElement.querySelectorAll<HTMLElement>('.menu-toggle, .mobile-panel a'));
        const first = links[0];
        const last = links.at(-1);
        if (!first || !last) return;
        if (event.shiftKey && (document.activeElement === first || !links.includes(document.activeElement as HTMLElement))) {
          event.preventDefault(); last.focus();
        } else if (!event.shiftKey && (document.activeElement === last || !links.includes(document.activeElement as HTMLElement))) {
          event.preventDefault(); first.focus();
        }
      }
    };

    const closeOnDesktop = () => {
      if (window.innerWidth > 760) menuOpen = false;
    };

    /*
     * The active navigation state follows what is really on screen rather than the
     * last hash the visitor clicked. Only the in-page targets take part; `/story` and
     * `/cv` are separate routes and keep their ordinary `aria-current="page"`.
     */
    const sectionTargets = navigation
      .filter((item) => item.href.startsWith('#'))
      .map((item) => item.href);

    let sectionObserver: IntersectionObserver | undefined;

    if ('IntersectionObserver' in window) {
      const ratios = new Map<string, number>();

      sectionObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            ratios.set(
              `#${entry.target.id}`,
              entry.isIntersecting ? entry.intersectionRatio : 0
            );
          }

          let best = '';
          let bestRatio = 0;
          for (const [href, ratio] of ratios) {
            if (ratio > bestRatio) {
              best = href;
              bestRatio = ratio;
            }
          }

          visibleSection = best;
        },
        { threshold: [0, 0.2, 0.5, 0.8], rootMargin: '-20% 0px -40% 0px' }
      );

      for (const href of sectionTargets) {
        const section = document.querySelector(href);
        if (section) sectionObserver.observe(section);
      }
    }

    syncLocation();
    window.addEventListener('hashchange', syncLocation);
    window.addEventListener('popstate', syncLocation);
    window.addEventListener('keydown', closeOnEscape);
    window.addEventListener('resize', closeOnDesktop);

    return () => {
      sectionObserver?.disconnect();
      window.removeEventListener('hashchange', syncLocation);
      window.removeEventListener('popstate', syncLocation);
      window.removeEventListener('keydown', closeOnEscape);
      window.removeEventListener('resize', closeOnDesktop);
    };
  });

  $: activeHref =
    ($page.url.pathname === '/' && visibleSection) ||
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
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
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

<header bind:this={headerElement} class="site-header" data-testid="site-header">
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
    padding: max(28px, env(safe-area-inset-top)) 20px 0;
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
    min-width: 102px;
    min-height: 30px;
    border: 0;
    border-radius: 999px;
    background-color: transparent;
    padding: 0 0.9rem;
    font-family: var(--font-display);
    font-size: 11px; text-transform: uppercase;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0;
    color: rgb(244 234 220 / 0.82);
    outline: none;
    box-shadow: none;
  }

  /*
   * Selection wipes in from the leading edge rather than fading, so a pointer moving
   * across the bar reads as direction rather than as four independent lights. It is
   * painted as a background gradient, which means it sits under the label with no
   * extra element, no stacking games and nothing in the pill shifting.
   *
   * `background-size` carries the wipe; `background-position` keeps it anchored left.
   */
  .top-nav a {
    /*
     * The fill carries a little of the site's warm accent at its leading edge and
     * cools to cream — enough that the bar reads as part of this portfolio's palette
     * rather than a generic grey pill, and far too little to compete with the label.
     */
    background-image: linear-gradient(
      90deg,
      color-mix(in srgb, var(--accent) 22%, transparent) 0%,
      rgb(244 234 220 / 0.12) 62%
    );
    background-repeat: no-repeat;
    background-position: left center;
    background-size: 0% 100%;
    transition:
      background-size var(--motion-indicator) var(--motion-ease-feedback),
      color var(--motion-indicator) var(--motion-ease-feedback);
  }

  .top-nav a:hover,
  .top-nav a:focus-visible {
    background-size: 100% 100%;
    color: var(--nav-cream);
  }

  /*
   * The section you are actually in is a state, not a hover: it is already filled,
   * slightly stronger, and it does not animate on arrival.
   */
  .top-nav a.active {
    background-image: linear-gradient(
      90deg,
      color-mix(in srgb, var(--accent) 30%, transparent) 0%,
      rgb(244 234 220 / 0.18) 62%
    );
    background-size: 100% 100%;
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
      font-family: var(--font-sans);
      font-size: 0.8rem;
      font-weight: 600;
      letter-spacing: 0;
      line-height: 1;
      transition: color var(--interaction-duration) var(--interaction-ease);
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
      animation: menu-link-enter 300ms var(--motion-settle) forwards;
      animation-delay: calc(40ms + var(--menu-index) * 38ms);
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
        transform: translateY(0.55rem);
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

    :global(html[data-motion='reduced']) .menu-toggle,
    :global(html[data-motion='reduced']) .menu-icon,
    :global(html[data-motion='reduced']) :global(.mobile-menu-arrow) {
      transition: none;
    }

    :global(html[data-motion='reduced']) .mobile-panel a {
      opacity: 1;
      animation: none;
    }
  }

  /*
   * Reduced motion keeps the same selection state, it just arrives at once: the
   * token collapse in motion.css already zeroes `--motion-indicator`, and this
   * covers the case where only the OS preference is set.
   */
  @media (prefers-reduced-motion: reduce) {
    .top-nav a {
      transition: none;
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
