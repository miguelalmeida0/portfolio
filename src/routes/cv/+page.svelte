<script lang="ts">
  import pdfUrl from '$lib/assets/miguel-almeida-cv.pdf?url';
  import CopyEmailAction from '$lib/components/shared/CopyEmailAction.svelte';
  import FadeIn from '$lib/components/shared/FadeIn.svelte';

  type ExperienceEntry = {
    range: string;
    roleHtml: string;
    company: string;
    body: string;
  };

  type ContactEntry = {
    text: string;
    href?: string;
    copyValue?: string;
  };

  type StudyEntry = {
    year: string;
    title: string;
    org: string;
  };

  let posterVisible = true;

  const chromeTitle = 'CV / The Sheet · Practical view';
  const posterTagline =
    'Mid-level frontend engineer building calm product UI, reusable systems, and production design-system work.';

  const profileHtml =
    'Early passion for technology, then UX, then code. Currently at <em class="not-italic">F24</em> in Berlin, shipping critical communication software used by thousands of users worldwide.';

  const contact: ContactEntry[] = [
    { text: 'miguelalmeida1592@gmail.com', copyValue: 'miguelalmeida1592@gmail.com' },
    { text: '+351 918 500 305', href: 'tel:+351918500305' },
    { text: 'linkedin.com/in/miguelalmeida1', href: 'https://www.linkedin.com/in/miguelalmeida1/' },
    { text: 'Berlin, Germany' }
  ];

  const languages = [
    { label: 'English', level: 'Fluent' },
    { label: 'Portuguese', level: 'Native' },
    { label: 'German', level: 'Working' }
  ];

  const experience: ExperienceEntry[] = [
    {
      range: '2026 to Now',
      roleHtml: 'Software Engineer, <em class="not-italic">Mid-level</em>',
      company: 'F24',
      body: 'Owning more of the frontend layer while keeping critical product UI calm, legible, and dependable.'
    },
    {
      range: '2023 to 2025',
      roleHtml: 'Frontend Engineer, <em class="not-italic">Product Lead</em>',
      company: 'F24',
      body: 'Helped take a product from zero to more than a thousand users, shaping the interface system and day-to-day frontend direction.'
    },
    {
      range: '2022 to 2023',
      roleHtml: 'Frontend Engineer',
      company: 'F24',
      body: 'Built production UI in a mission-critical environment and learned the discipline of software people genuinely depend on.'
    },
    {
      range: '2021 to 2022',
      roleHtml: 'Freelance Developer',
      company: 'Independent',
      body: 'Delivered small web projects under real constraints and strengthened the craft through iteration, detail, and shipping.'
    },
    {
      range: 'Before 2020',
      roleHtml: 'Aviation',
      company: 'Previous chapter',
      body: 'The first education in calm systems, clear communication, and boring reliability.'
    }
  ];

  const stack = [
    'JavaScript',
    'Svelte',
    'TypeScript',
    'React',
    'Tailwind',
    'Figma',
    'Design Systems',
    'Accessibility'
  ];

  const studies: StudyEntry[] = [
    {
      year: '2014 to 2017',
      title: 'Bachelor, Hotel Management',
      org: 'Estoril Higher Institute'
    },
    {
      year: '2021',
      title: 'Full-Stack Web Development',
      org: 'CareerFoundry'
    },
    {
      year: '2020',
      title: 'Diploma, UX Design',
      org: 'UX Design Institute'
    }
  ];

  const figures = [
    { value: '0 to 1,000+', caption: 'active users on a product built from scratch' },
    { value: '4 years', caption: 'shipping production UI in critical communication software' },
    { value: 'Berlin', caption: 'remote or hybrid CET with EU work authorization' }
  ];

</script>

<svelte:head>
  <title>CV / The Sheet — Miguel Almeida · Frontend Engineer · Berlin</title>
  <meta
    name="description"
    content="Practical CV view for Miguel Almeida, a frontend engineer in Berlin shipping critical communication software used by thousands of users worldwide."
  />
  <meta property="og:title" content="CV / The Sheet — Miguel Almeida · Frontend Engineer · Berlin" />
  <meta
    property="og:description"
    content="A practical CV page for Miguel Almeida, frontend engineer and product UI builder based in Berlin."
  />
</svelte:head>

<main class="cv-page min-h-screen bg-background text-foreground font-display">
  <section class="relative flex min-h-[100svh] flex-col px-6 py-5 sm:px-8">
    <div class="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
      <a
        href="/"
        class="interactive-link transition-colors hover:text-foreground"
      >
        ← Index
      </a>
      <span class="hidden text-center sm:inline">{chromeTitle}</span>
      <a
        href={pdfUrl}
        download="miguel-almeida-cv.pdf"
        class="interactive-button button-solid inline-flex items-center gap-2 rounded-full px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.22em] focus-visible:ring-2 focus-visible:ring-ring/45 sm:px-5 sm:py-3"
      >
        Download PDF
      </a>
    </div>

    <div
      class="pointer-events-none absolute left-4 top-1/2 hidden font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground md:block"
      style="writing-mode: vertical-rl; transform: translateY(-50%) rotate(180deg);"
    >
      Berlin · DE · 52.5°N
    </div>
    <div
      class="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground md:block"
      style="writing-mode: vertical-rl;"
    >
      04 / 2026 · Edition Nº 04
    </div>

    <div class="mx-auto flex w-full max-w-[1440px] flex-1 items-center justify-center text-center">
      <div
        class="max-w-[980px]"
        style={`opacity:${posterVisible ? 1 : 0};transform:translate3d(0, ${posterVisible ? 0 : 24}px, 0);transition:opacity 1.1s cubic-bezier(0.22, 1, 0.36, 1), transform 1.1s cubic-bezier(0.22, 1, 0.36, 1);`}
      >
        <h1 class="text-[clamp(2.75rem,10vw,9rem)] font-medium leading-[0.85] tracking-[-0.04em] text-foreground">
          <span class="block">Miguel</span>
          <span class="block text-accent">Almeida</span>
        </h1>
        <p class="mt-8 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground sm:text-[11px]">
          CV / The Sheet · A practical hiring view
        </p>
      </div>
    </div>

    <div
      class="mx-auto flex w-full max-w-[1440px] flex-col gap-5 pb-1 sm:flex-row sm:items-end sm:justify-between"
      style={`opacity:${posterVisible ? 1 : 0};transform:translate3d(0, ${posterVisible ? 0 : 24}px, 0);transition:opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.6s, transform 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.6s;`}
    >
      <p class="max-w-[42rem] text-[clamp(1.15rem,1.9vw,1.45rem)] leading-tight text-foreground">
        {posterTagline}
      </p>
      <a
        href="#sheet"
        class="interactive-link group inline-flex items-center gap-2 self-start font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground hover:text-foreground sm:self-auto"
      >
        <span>↓ The Sheet</span>
      </a>
    </div>
  </section>

  <section id="sheet" class="px-6 py-20 sm:px-8 sm:py-24 md:py-28">
    <div class="mx-auto max-w-[1280px]">
      <FadeIn as="header" className="border-b-2 border-foreground/90 pb-4">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <h2 class="text-[clamp(1.65rem,3vw,2.45rem)] leading-none tracking-[-0.03em] text-foreground">
            Miguel Almeida <em class="not-italic text-accent">/ CV / The Sheet</em>
          </h2>
          <span class="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            p. 01 / 01
          </span>
        </div>
      </FadeIn>

      <div class="mt-10 grid gap-x-6 gap-y-10 md:grid-cols-12 md:gap-x-8">
        <div class="space-y-10 md:col-span-3">
          <FadeIn as="section" className="space-y-4">
            <div class="border-b border-foreground/15 pb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
              Profile
            </div>
            <p class="max-w-[20rem] text-[1.08rem] leading-[1.55] text-foreground">
              {@html profileHtml}
            </p>
          </FadeIn>

          <FadeIn as="section" delay={0.04} className="space-y-4">
            <div class="border-b border-foreground/15 pb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
              Contact
            </div>
            <div class="space-y-2.5 font-mono text-[10.5px] leading-relaxed tracking-[0.1em] text-foreground">
              {#each contact as item}
                {#if item.copyValue}
                  <CopyEmailAction email={item.copyValue} variant="compact" testId="cv-email-copy" />
                {:else if item.href}
                  <a
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    class="interactive-link block break-all transition-colors hover:text-accent"
                  >
                    {item.text}
                  </a>
                {:else}
                  <p>{item.text}</p>
                {/if}
              {/each}
            </div>
          </FadeIn>

          <FadeIn as="section" delay={0.08} className="space-y-4">
            <div class="border-b border-foreground/15 pb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
              Status
            </div>
            <div class="inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-foreground">
              <span class="inline-flex h-2 w-2 rounded-full bg-accent"></span>
              Mid-level
            </div>
          </FadeIn>

          <FadeIn as="section" delay={0.12} className="space-y-4">
            <div class="border-b border-foreground/15 pb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
              Languages
            </div>
            <div class="space-y-2.5">
              {#each languages as item}
                <div class="flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground">
                  <span>{item.label}</span>
                  <span class="text-muted-foreground">{item.level}</span>
                </div>
              {/each}
            </div>
          </FadeIn>
        </div>

        <div class="md:col-span-6 md:border-x md:border-foreground/15 md:px-6 lg:px-8">
          <FadeIn as="section">
            <div class="border-b border-foreground/15 pb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
              Experience
            </div>

            <ol class="mt-3 space-y-0">
              {#each experience as item, index}
                <li class={index === 0 ? '' : 'border-t border-foreground/15'}>
                  <FadeIn
                    as="div"
                    delay={index * 0.05}
                    className="grid grid-cols-[64px_1fr] gap-x-5 py-6"
                  >
                    <div class="pt-1 font-mono text-[10px] uppercase tracking-[0.24em] text-accent">
                      {item.range}
                    </div>
                    <div class="space-y-3">
                      <h3 class="text-[clamp(1.25rem,2vw,1.8rem)] leading-[1.02] tracking-[-0.02em] text-foreground">
                        {@html item.roleHtml}
                        <span class="ml-2 inline font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                          @ {item.company}
                        </span>
                      </h3>
                      <p class="max-w-[36rem] text-[1rem] leading-[1.55] text-muted-foreground">
                        {item.body}
                      </p>
                    </div>
                  </FadeIn>
                </li>
              {/each}
            </ol>
          </FadeIn>
        </div>

        <div class="space-y-10 md:col-span-3">
          <FadeIn as="section" delay={0.04} className="space-y-4">
            <div class="border-b border-foreground/15 pb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
              Stack
            </div>
            <div class="grid grid-cols-1 gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground lg:grid-cols-2">
              {#each stack as item}
                <div class="min-w-0 break-words">{item}</div>
              {/each}
            </div>
          </FadeIn>

          <FadeIn as="section" delay={0.08} className="space-y-4">
            <div class="border-b border-foreground/15 pb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
              Education
            </div>
            <div class="space-y-5">
              {#each studies as item}
                <div class="space-y-1.5">
                  <div class="font-mono text-[10px] uppercase tracking-[0.24em] text-accent">{item.year}</div>
                  <div class="text-[1.05rem] leading-tight text-foreground">{item.title}</div>
                  <div class="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{item.org}</div>
                </div>
              {/each}
            </div>
          </FadeIn>

          <FadeIn as="section" delay={0.12} className="space-y-4">
            <div class="border-b border-foreground/15 pb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
              Figures
            </div>
            <div class="space-y-5">
              {#each figures as item}
                <div class="space-y-1.5">
                  <div class="text-[clamp(2.2rem,3.8vw,3.05rem)] leading-none tracking-[-0.04em] text-accent">
                    {item.value}
                  </div>
                  <p class="text-base leading-snug text-muted-foreground">
                    {item.caption}
                  </p>
                </div>
              {/each}
            </div>
          </FadeIn>

          <FadeIn as="section" delay={0.16} className="space-y-4">
            <a
              href="mailto:miguelalmeida1592@gmail.com?subject=Role%20opportunity"
              class="interactive-button group inline-flex w-full items-center justify-between gap-6 rounded-none bg-foreground px-6 py-4 font-mono text-[11.5px] font-medium uppercase leading-none tracking-[0.16em] text-background focus-visible:ring-2 focus-visible:ring-ring/45 hover:bg-accent hover:text-accent-foreground sm:text-xs"
            >
              <span>Write to me</span>
              <svg
                viewBox="0 0 24 24"
                class="h-[18px] w-[18px] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M7 17 17 7" />
                <path d="M8 7h9v9" />
              </svg>
            </a>
          </FadeIn>
        </div>
      </div>

      <FadeIn as="footer" delay={0.18} className="mt-12 border-t-2 border-foreground/90 pt-4">
        <div class="flex items-center justify-end font-mono text-[9.5px] uppercase tracking-[0.24em] text-muted-foreground">
          <span>Berlin · 04 / 2026</span>
        </div>
      </FadeIn>
    </div>
  </section>
</main>
