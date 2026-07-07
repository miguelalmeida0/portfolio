<script lang="ts">
  import { onMount } from 'svelte';

  import type { NavItem } from '$lib/types/portfolio';
  import { tokens } from '$lib/design/tokens';
  import { cn } from '$lib/utils/cn';

  export let siteName: string;
  export let journalMark: string;
  export let links: NavItem[];
  export let contactHref: string;

  let activeHref: NavItem['href'] = links[0]?.href ?? '#work';

  onMount(() => {
    const sections = links
      .map((link) => document.getElementById(link.href.slice(1)))
      .filter((section): section is HTMLElement => section instanceof HTMLElement);

    const observer = new IntersectionObserver(
      (entries) => {
        const best = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (best) {
          activeHref = `#${best.target.id}` as NavItem['href'];
        }
      },
      {
        threshold: [0.2, 0.5, 0.72],
        rootMargin: '-18% 0px -54% 0px'
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
    };
  });
</script>

<div class={tokens.layout.nav}>
  <nav class={cn(tokens.surfaces.nav, tokens.surfaces.navShell, 'relative w-full rounded-[2rem] px-5 py-4 sm:rounded-full sm:px-5 sm:py-4')} aria-label="Primary">
    <div class="flex min-w-0 items-center justify-between gap-3 min-[1180px]:grid min-[1180px]:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] min-[1180px]:gap-5 xl:gap-6">
      <a class="flex min-w-0 items-baseline gap-2 sm:gap-3 xl:gap-5" href="#top">
        <span class={cn(tokens.typography.navBrand, 'min-w-0 whitespace-nowrap pb-[0.08em]')}>
          {siteName}
        </span>
        <span class={cn(tokens.typography.navMeta, 'hidden shrink-0 whitespace-nowrap min-[900px]:inline-flex')}>
          {journalMark}
        </span>
      </a>

      <div class={cn(tokens.layout.navLinks, 'hidden min-[1180px]:flex justify-self-center')}>
        {#each links as link}
          <a
            class={cn(
              tokens.typography.navLink,
              activeHref === link.href && 'text-[#F1F8FC]'
            )}
            href={link.href}
            aria-current={activeHref === link.href ? 'page' : undefined}
          >
            {link.label}
          </a>
        {/each}
      </div>

      <div class="hidden min-[1480px]:flex min-w-0 justify-end">
        <a class={tokens.surfaces.navButtonAccent} href={contactHref}>Let's talk</a>
      </div>
    </div>
  </nav>
</div>
