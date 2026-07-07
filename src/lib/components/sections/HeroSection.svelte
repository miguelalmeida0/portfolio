<script lang="ts">
  import type { SiteProfile } from '$lib/types/portfolio';

  import { tokens } from '$lib/design/tokens';
  import { cn } from '$lib/utils/cn';

  import ButtonLink from '$lib/components/shared/ButtonLink.svelte';

  export let site: SiteProfile;

  type PointerBucket = keyof typeof tokens.motion.pointerBucketsSubject;

  let subjectBucket: PointerBucket = 'center';

  const splitLead = (headline: string) => {
    const splitIndex = headline.lastIndexOf(' ');

    if (splitIndex <= 0) {
      return [headline];
    }

    return [headline.slice(0, splitIndex), headline.slice(splitIndex + 1)];
  };

  let leadLines = splitLead(site.headlineLead);
  $: leadLines = splitLead(site.headlineLead);

  const resolveBucket = (xRatio: number, yRatio: number): PointerBucket => {
    const horizontal = xRatio < 0.35 ? 'west' : xRatio > 0.65 ? 'east' : '';
    const vertical = yRatio < 0.35 ? 'north' : yRatio > 0.65 ? 'south' : '';

    if (!horizontal && !vertical) {
      return 'center';
    }

    return `${vertical}${horizontal}` as PointerBucket;
  };

  const handlePointerMove = (event: MouseEvent) => {
    const bounds = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const xRatio = (event.clientX - bounds.left) / bounds.width;
    const yRatio = (event.clientY - bounds.top) / bounds.height;
    const bucket = resolveBucket(xRatio, yRatio);

    subjectBucket = bucket;
  };

  const resetParallax = () => {
    subjectBucket = 'center';
  };
</script>

<section
  id="top"
  class={tokens.layout.hero}
  aria-labelledby="hero-title"
  on:mousemove={handlePointerMove}
  on:mouseleave={resetParallax}
>
  <div class={tokens.layout.heroStage}>
    <div class={tokens.patterns.heroSurface} aria-hidden="true"></div>
    <div class={tokens.patterns.heroSurfaceFeather} aria-hidden="true"></div>
    <div class={tokens.patterns.heroAtmosphere} aria-hidden="true"></div>
    <div class={tokens.patterns.heroNoise} aria-hidden="true"></div>
    <div class={tokens.patterns.heroVignette} aria-hidden="true"></div>

    <div class={tokens.layout.heroGrid}>
      <div class={tokens.layout.heroCopy}>
        <div class={tokens.layout.heroTagRow}>
          <span class={tokens.surfaces.tag}>{site.role}</span>
          <span class={tokens.surfaces.tag}>{site.journalMark}</span>
        </div>

        <p class={tokens.typography.heroEyebrow}>{site.eyebrow}</p>

        <div class="flex max-w-[72rem] flex-col items-start">
          <h1 id="hero-title" class="sr-only">{site.headlineLead} {site.headlineAccent}</h1>
          {#each leadLines as line}
            <div class={cn(tokens.typography.heroTitleLead, tokens.patterns.heroTitleHighlight)}>
              {line}
            </div>
          {/each}
          <div class={cn(tokens.typography.heroTitleAccent, tokens.patterns.heroTitleHighlight, tokens.patterns.heroTitleHighlightOffset)}>
            {site.headlineAccent}
          </div>
        </div>

        <p class={tokens.typography.heroSummary}>{site.summary}</p>

        <div class={tokens.layout.heroCtaRow}>
          <ButtonLink href={site.primaryCta.href} label={site.primaryCta.label} variant="primary" className="min-w-0" />
          <ButtonLink href={site.secondaryCta.href} label={site.secondaryCta.label} variant="secondary" className="min-w-0" />
        </div>

        <div class={tokens.layout.heroMetaRow}>
          <span class={cn(tokens.surfaces.tag, 'w-full justify-center sm:justify-start')}>{site.location}</span>
          <span class={cn(tokens.surfaces.tag, 'w-full justify-center sm:justify-start')}>{site.availability}</span>
        </div>

        <div class={tokens.layout.statGrid}>
          {#each site.stats as stat, index}
            <article class={tokens.patterns.statCard}>
              <span
                class={cn(
                  tokens.patterns.statLine,
                  index === 0
                    ? 'bg-[#31769A]'
                    : index === 1
                      ? 'bg-[#A1C3DA]'
                      : 'bg-[#AECBDF]'
                )}
              ></span>
              <div class="flex h-full flex-col gap-6">
                <p class={tokens.typography.statValue}>{stat.value}</p>
                <p class={tokens.typography.statLabel}>{stat.label}</p>
                <p class={cn(tokens.typography.bodySoft, 'mt-auto')}>{stat.note}</p>
              </div>
            </article>
          {/each}
        </div>
      </div>

      <div class={tokens.layout.heroVisual}>
        <div class={cn(tokens.patterns.heroSubjectWrap, tokens.motion.pointerBucketsSubject[subjectBucket])}>
          <div class={tokens.patterns.heroPanel}>
            <div class={tokens.patterns.heroPanelGlow} aria-hidden="true"></div>

            <div class={tokens.patterns.heroPanelImageWrap}>
              <img
                class={tokens.patterns.heroPanelImage}
                src={site.portraitSrc}
                alt={site.portraitAlt}
                loading="eager"
                decoding="async"
                fetchpriority="high"
              />
              <div class={tokens.patterns.heroPanelImageShade} aria-hidden="true"></div>
            </div>

            <a
              class={tokens.patterns.heroPanelLink}
              href={site.linkedinHref}
              target="_blank"
              rel="noreferrer"
              aria-label="Miguel Almeida on LinkedIn"
            >
              <span class={tokens.patterns.heroPanelLinkIcon} aria-hidden="true">
                <svg viewBox="0 0 24 24" class="h-4 w-4 fill-current">
                  <path d="M6.94 8.75V19H3.56V8.75h3.38ZM5.25 4C6.33 4 7 4.72 7 5.67C7 6.6 6.35 7.33 5.29 7.33H5.27C4.23 7.33 3.56 6.6 3.56 5.67C3.56 4.72 4.25 4 5.25 4ZM20.44 12.73V19h-3.37v-5.88c0-1.47-.53-2.48-1.84-2.48c-1.01 0-1.61.68-1.87 1.34c-.1.23-.12.55-.12.87V19H9.87s.04-9.68 0-10.25h3.37v1.45l-.02.03h.02v-.03c.45-.69 1.25-1.66 3.05-1.66c2.23 0 3.91 1.46 3.91 4.59Z" />
                </svg>
              </span>
              <span class="flex flex-col items-start">
                <span class="text-[0.7rem] uppercase tracking-[0.24em] text-[#AECBDF]">LinkedIn</span>
                <span class="text-[0.92rem] text-[#F1F8FC]">miguelalmeida1</span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
