<script lang="ts">
  import { onMount } from 'svelte';

  import CopyEmailAction from '$lib/components/shared/CopyEmailAction.svelte';
  import { site } from '$lib/content/folio';

  const directContacts = [
    { label: 'Email', value: site.email, copyValue: site.email },
    { label: 'LinkedIn', value: '/in/miguelalmeida1', href: site.linkedin },
    { label: 'GitHub', value: '/miguelalmeida0', href: site.github },
    { label: 'CV', value: 'Download PDF', href: '/portfolio.pdf', download: 'miguel-almeida-cv.pdf' },
    { label: 'Phone', value: site.phone, href: 'tel:+351918500305' }
  ];

  let now = '--:-- Berlin';

  const updateNow = () => {
    const parts = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
      timeZone: 'Europe/Berlin',
      timeZoneName: 'short'
    }).formatToParts(new Date());

    const byType = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    now = `${byType.hour}:${byType.minute} ${byType.timeZoneName ?? 'Berlin'}`;
  };

  const askMiguelLLM = () => {
    window.dispatchEvent(
      new CustomEvent('miguel-llm:open', {
        detail: {
          mode: 'recruiter'
        }
      })
    );
  };

  onMount(() => {
    updateNow();
    const interval = window.setInterval(updateNow, 30_000);
    return () => {
      window.clearInterval(interval);
    };
  });
</script>

<section id="contact" class="contact-section page-gutter scroll-mt-0 py-14 pb-20 sm:py-16 sm:pb-24 md:py-20">
  <div class="mx-auto max-w-[1400px]">
    <div class="contact-meta mb-6 flex flex-wrap items-baseline justify-between gap-3 sm:mb-8">
      <span class="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
        Contact · Berlin
      </span>
      <span class="contact-clock font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
        Berlin · {now}
      </span>
    </div>

    <div class="contact-intro mb-7 max-w-3xl">
      <h2 class="mb-3 font-display text-[clamp(1.75rem,3.5vw,2.75rem)] font-medium leading-[1.05] tracking-tight">
        Want the practical version?
      </h2>
      <p class="max-w-2xl text-base leading-relaxed text-foreground/76 sm:text-lg">
        Email is the fastest path. LinkedIn, the CV, and phone are one click away.
      </p>
    </div>

    <div class="contact-grid grid gap-3 md:grid-cols-2 xl:grid-cols-5">
      {#each directContacts as item}
        {#if item.copyValue}
          <CopyEmailAction
            email={item.copyValue}
            label={item.label}
            testId="direct-email-copy"
            className="contact-email rounded-lg border border-border/75"
          />
        {:else}
          <a
            href={item.href}
            download={item.download}
            target={item.href?.startsWith('http') ? '_blank' : undefined}
            rel={item.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            class="contact-link interactive-surface flex min-h-[168px] min-w-0 flex-col justify-center gap-5 rounded-lg border border-border/75 px-7 py-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/45 hover:bg-card/40 sm:px-9"
          >
            <span class="font-mono text-xs uppercase tracking-[0.18em] text-accent">
              {item.label}
            </span>
            <span class="min-w-0 break-words font-display text-[clamp(1.12rem,1.35vw,1.55rem)] leading-tight tracking-[-0.01em] text-foreground">
              {item.value}
            </span>
          </a>
        {/if}
      {/each}
    </div>

    <section class="llm-shortcut mt-5 rounded-lg border border-border/75 bg-card/35 p-5 sm:p-6" aria-labelledby="contact-llm-title">
      <div class="grid gap-4 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center">
        <div>
          <span class="font-mono text-xs font-bold uppercase tracking-[0.18em] text-accent">
            Optional shortcut
          </span>
          <h3 id="contact-llm-title" class="mt-2 font-display text-[clamp(1.25rem,2vw,1.7rem)] font-semibold leading-tight">
            Not sure if I fit?
          </h3>
          <p class="mt-3 max-w-xl text-sm leading-relaxed text-foreground/70 sm:text-base">
            Ask MiguelLLM before you email. Direct contact stays the fastest path.
          </p>
        </div>
        <div class="shortcut-actions flex flex-wrap gap-2">
          <button
            type="button"
            class="contact-llm-chip"
            on:click={askMiguelLLM}
          >
            Design systems fit
          </button>
          <button
            type="button"
            class="contact-llm-chip"
            on:click={askMiguelLLM}
          >
            Product UI fit
          </button>
          <button
            type="button"
            class="contact-llm-chip"
            on:click={askMiguelLLM}
          >
            Interview prep
          </button>
          <button
            type="button"
            class="contact-llm-chip"
            on:click={askMiguelLLM}
          >
            30 sec summary
          </button>
        </div>
      </div>
    </section>

    <footer class="contact-footer mt-16 flex flex-wrap items-center justify-between gap-4 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground sm:mt-24">
      <span>© 2026 Miguel Almeida</span>
      <span>From Berlin, with care.</span>
    </footer>
  </div>
</section>

<style>
  .contact-llm-chip {
    min-height: 2.45rem;
    border: 1px solid rgb(244 234 220 / 0.14);
    border-radius: 999px;
    background: rgb(244 234 220 / 0.045);
    padding: 0 0.82rem;
    color: rgb(244 234 220 / 0.78);
    cursor: pointer;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 820;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    transition:
      background-color 180ms var(--interaction-ease),
      border-color 180ms var(--interaction-ease),
      color 180ms var(--interaction-ease);
  }

  .contact-llm-chip:hover,
  .contact-llm-chip:focus-visible {
    border-color: rgb(232 168 120 / 0.5);
    background: rgb(232 168 120 / 0.1);
    color: var(--foreground);
    outline: 2px solid var(--ring);
    outline-offset: 2px;
  }

  @media (max-width: 700px) {
    .contact-section {
      padding-top: 2.75rem;
      padding-bottom: 3.25rem;
    }

    .contact-meta {
      margin-bottom: 1rem;
    }

    .contact-meta span {
      font-size: 0.56rem;
      letter-spacing: 0.12em;
    }

    .contact-clock {
      display: none;
    }

    .contact-intro {
      margin-bottom: 1.15rem;
    }

    .contact-intro h2 {
      margin-bottom: 0;
      font-size: 1.35rem;
      line-height: 1.08;
    }

    .contact-intro p {
      display: none;
    }

    .contact-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.62rem;
    }

    :global(.contact-email) {
      grid-column: 1 / -1;
      min-height: 6.4rem !important;
      gap: 0.7rem !important;
      padding: 1rem !important;
    }

    .contact-link {
      min-height: 5.65rem;
      gap: 0.55rem;
      padding: 0.9rem;
      border-radius: 0.75rem;
    }

    .contact-link > span:first-child {
      font-size: 0.56rem;
      letter-spacing: 0.12em;
    }

    .contact-link > span:last-child {
      font-size: clamp(0.78rem, 3.7vw, 0.94rem);
      line-height: 1.2;
    }

    .llm-shortcut {
      margin-top: 0.75rem;
      border-radius: 0.75rem;
      padding: 1rem;
    }

    .llm-shortcut > div {
      gap: 0.85rem;
    }

    .llm-shortcut span {
      font-size: 0.56rem;
      letter-spacing: 0.13em;
    }

    .llm-shortcut h3 {
      margin-top: 0.35rem;
      font-size: 1.05rem;
    }

    .llm-shortcut p {
      display: none;
    }

    .shortcut-actions {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.45rem;
    }

    .contact-llm-chip {
      min-height: 2.35rem;
      padding: 0.45rem 0.55rem;
      font-size: 0.56rem;
      letter-spacing: 0.045em;
      line-height: 1.2;
    }

    .contact-footer {
      margin-top: 2.5rem;
      gap: 0.6rem;
      font-size: 0.55rem;
      letter-spacing: 0.12em;
    }
  }
</style>
