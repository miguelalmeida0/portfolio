<script lang="ts">
  import { onMount } from 'svelte';

  import CinematicIntro from '$lib/components/revamp/CinematicIntro.svelte';
  import CopyEmailAction from '$lib/components/shared/CopyEmailAction.svelte';
  import FadeIn from '$lib/components/shared/FadeIn.svelte';
  import { site } from '$lib/content/folio';

  type Chapter = {
    year: string;
    title: string;
    body: string;
    note: string;
  };

  const chapters: Chapter[] = [
    {
      year: 'Before',
      title: 'Aviation taught me checklist thinking and calm communication.',
      body:
        'Procedures, checklists, and clear communication mattered because mistakes had consequences. That now shows up in how I think about empty states, QA passes, handoffs, and interfaces that need to behave predictably.',
      note: 'I still trust boring reliable systems more than clever surprises.'
    },
    {
      year: '2020',
      title: 'UX gave me a way to question the interface before building it.',
      body:
        'The UX Design Institute gave structure to user flows, hierarchy, and product reasoning. It also made me care about what happens after the mockup, when real state, real copy, and real constraints meet the screen.',
      note: 'The practical habit: ask why before turning a layout into code.'
    },
    {
      year: '2021',
      title: 'Freelance work turned design curiosity into frontend discipline.',
      body:
        'I crossed the gap from Figma to shipped UI through HTML, CSS, JavaScript, and client constraints. The early work was imperfect, but it taught me to debug layout, listen to feedback, and keep improving after the first version works.',
      note: 'The practical habit: ship, inspect, repair, repeat.'
    },
    {
      year: '2022',
      title: 'F24 made the work production-grade.',
      body:
        'F24 builds critical communication and crisis-management software for organisations across Europe. I joined a product team and learned code review, design handoff, release discipline, and the responsibility of shipping software people actually depend on.',
      note: 'Reusable components > clever components.'
    },
    {
      year: '2023 to 2025',
      title: 'I helped build a product from scratch to thousands of users.',
      body:
        'From first files to a production app used by thousands of operators, I helped shape frontend architecture, component patterns, and the daily UI decisions that make a complex product easier to trust.',
      note: 'The practical habit: every repeated state deserves a durable pattern.'
    },
    {
      year: '2026',
      title: "I'm promoted to mid-level software engineer after shipping the product.",
      body:
        'F24 promotes me to mid-level after the product work ships. The next standard is the same: hard frontend problems, clear product thinking, and reliability as part of the design.',
      note: 'Based in Berlin. Remote or hybrid CET works.'
    }
  ];

  let activeIndex = 0;
  let progress = 0;
  let chapterElements: HTMLElement[] = [];

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const idx = Number((entry.target as HTMLElement).dataset.index);
          activeIndex = idx;
        }
      },
      {
        rootMargin: '-40% 0px -50% 0px',
        threshold: 0
      }
    );

    chapterElements.forEach((element) => element && observer.observe(element));

    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      progress = scrollable > 0 ? window.scrollY / scrollable : 0;
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', updateProgress);
    };
  });
</script>

<svelte:head>
  <title>The Story / Miguel Almeida</title>
  <meta
    name="description"
    content="A slow-written letter about how I got here. Frontend engineer, Berlin, building calm interfaces for complex tools."
  />
  <meta property="og:title" content="The Story — Miguel Almeida" />
  <meta
    property="og:description"
    content="A scroll-narrated career letter about UX, aviation, F24, and production frontend work."
  />
</svelte:head>

<main class="relative min-h-screen">
  <CinematicIntro />

  <div
    class="fixed left-0 right-0 top-0 z-40 h-px origin-left bg-accent"
    style={`transform:scaleX(${progress});`}
  ></div>

  <header class="fixed inset-x-0 top-0 z-30 border-b border-border/40 bg-background/70 px-4 py-4 backdrop-blur-xl sm:px-6 sm:py-5 md:px-10">
    <div class="mx-auto flex max-w-[1100px] items-center justify-between gap-3">
      <a
        href="/"
        class="interactive-link inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground sm:text-[11px]"
      >
        ← Back to portfolio
      </a>
      <span class="hidden font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground sm:inline">
        ✦ A letter · read at your pace
      </span>
      <span class="font-mono text-[10px] uppercase tracking-[0.22em] text-accent tabular-nums">
        {String(activeIndex + 1).padStart(2, '0')} / {String(chapters.length).padStart(2, '0')}
      </span>
    </div>
  </header>

  <article class="px-5 pb-32 pt-32 sm:px-6 sm:pt-40 md:px-10">
    <FadeIn as="div" className="mx-auto mb-20 max-w-[820px] sm:mb-32">
      <p class="mb-6 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
        ✦ Berlin · 26 / 2026
      </p>
      <h1 class="font-display text-[clamp(2.25rem,7vw,5rem)] leading-[0.95] tracking-[-0.02em] text-foreground">
        Dear reader,
      </h1>
      <p class="mt-8 max-w-[640px] font-display text-xl leading-relaxed text-foreground/85 sm:text-2xl">
        The short version sits on the CV. This is the longer version, focused on the habits that
        make me safer to hire.
      </p>
    </FadeIn>

    <div class="relative mx-auto grid max-w-[1100px] gap-8 lg:grid-cols-12 lg:gap-12">
      <aside class="hidden h-[calc(100vh-10rem)] self-start lg:sticky lg:top-32 lg:col-span-3 lg:block">
        <div class="mb-4 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          Index
        </div>
        <ol class="space-y-3 border-l border-border/60 pl-4">
          {#each chapters as chapter, index}
            <li>
              <a
                href={`#ch-${index}`}
                class={`block font-mono text-[11px] uppercase tracking-[0.18em] transition-colors ${
                  activeIndex === index
                    ? 'text-accent'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span class="tabular-nums">{chapter.year}</span>
              </a>
            </li>
          {/each}
        </ol>
        <div class="mt-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
          <span class="size-1.5 rounded-full bg-accent animate-pulse"></span>
          You are here
        </div>
      </aside>

      <div class="space-y-28 sm:space-y-36 lg:col-span-9">
        {#each chapters as chapter, index}
          <section
            id={`ch-${index}`}
            bind:this={chapterElements[index]}
            data-index={index}
            class="story-chapter relative grid gap-6 sm:grid-cols-[auto_1fr] sm:gap-10"
            style={`transition-delay:${index * 0.04}s;`}
          >
            <div class="sm:sticky sm:top-32 sm:self-start">
              <div class="font-display text-5xl leading-none text-accent tabular-nums sm:text-6xl">
                {chapter.year}
              </div>
              <div class="mt-3 h-px w-12 bg-border"></div>
            </div>

            <div class="max-w-[640px]">
              <h2 class="mb-5 font-display text-[clamp(1.5rem,3.5vw,2.5rem)] leading-tight tracking-[-0.01em] text-foreground">
                {chapter.title}
              </h2>
              <p class="font-display text-lg leading-[1.7] text-foreground/85 sm:text-xl">
                {chapter.body}
              </p>
              <div class="mt-6 inline-flex items-start gap-3 border-l-2 border-accent/60 py-1 pl-4">
                <span class="mt-0.5 shrink-0 font-mono text-[9px] uppercase tracking-[0.28em] text-accent">
                  Field note
                </span>
                <span class="font-display text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {chapter.note}
                </span>
              </div>
            </div>
          </section>
        {/each}
      </div>
    </div>

    <FadeIn
      as="div"
      className="mx-auto mt-32 max-w-[820px] border-t border-border/60 pt-12 sm:mt-44"
    >
      <p class="mb-4 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
        ✦ Yours,
      </p>
      <div class="font-display text-[clamp(2.5rem,8vw,5.5rem)] leading-none text-foreground">
        Miguel<span class="not-italic text-accent">.</span>
      </div>
      <p class="mt-8 max-w-[560px] font-display text-lg text-foreground/80 sm:text-xl">
        If anything here resonated, I'd love to hear from you. The door's open.
      </p>

      <div class="mt-12 border-y border-border/60 py-10 sm:py-12">
        <div class="grid gap-10 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-16">
          <div class="max-w-[24rem]">
            <p class="mb-4 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
              ✦ Next step
            </p>
            <h2 class="font-display text-[clamp(1.85rem,4.2vw,3.35rem)] leading-[0.98] tracking-[-0.03em] text-foreground">
              If you'd rather keep it <em class="not-italic text-accent">practical.</em>
            </h2>
            <p class="mt-5 font-display text-lg leading-relaxed text-foreground/78 sm:text-xl">
              Copy my email, visit LinkedIn, or open the CV.
            </p>
          </div>

          <div class="border-t border-border/60">
            <CopyEmailAction email={site.email} variant="line" testId="story-email-copy" />

            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              class="interactive-row group block border-b border-border/60 py-5 hover:text-accent"
            >
              <div class="grid gap-2 sm:grid-cols-[88px_minmax(0,1fr)_auto] sm:items-start sm:gap-6">
                <div class="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                  LinkedIn
                </div>
                <div class="font-display text-[clamp(1.15rem,1.45vw,1.45rem)] leading-[1.05] tracking-[-0.02em] text-foreground">
                  /in/miguelalmeida1
                </div>
                <div class="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground transition-colors group-hover:text-accent">
                  Open ↗
                </div>
              </div>
            </a>

            <a
              href="/cv"
              class="interactive-row group block border-b border-border/60 py-5 hover:text-accent"
            >
              <div class="grid gap-2 sm:grid-cols-[88px_minmax(0,1fr)_auto] sm:items-start sm:gap-6">
                <div class="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                  CV
                </div>
                <div class="font-display text-[clamp(1.15rem,1.45vw,1.45rem)] leading-[1.05] tracking-[-0.02em] text-foreground">
                  Open the CV
                </div>
                <div class="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground transition-colors group-hover:text-accent">
                  View ↗
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>

      <div class="mt-16 flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
        <span>2026</span>
        <span>Berlin · 52.52° N</span>
      </div>
    </FadeIn>
  </article>
</main>

<style>
  .story-chapter {
    opacity: 0;
    transform: translateY(32px);
    animation: story-chapter-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }

  @keyframes story-chapter-in {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
