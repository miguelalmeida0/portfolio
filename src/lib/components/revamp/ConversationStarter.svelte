<script lang="ts">
  import { onMount } from 'svelte';

  import pdfUrl from '$lib/assets/miguel-almeida-cv.pdf?url';
  import CopyEmailAction from '$lib/components/shared/CopyEmailAction.svelte';
  import { site } from '$lib/content/folio';

  const directContacts = [
    { label: 'Email', value: site.email, copyValue: site.email },
    { label: 'LinkedIn', value: '/in/miguelalmeida1', href: site.linkedin },
    { label: 'CV', value: 'Download PDF', href: pdfUrl, download: 'miguel-almeida-cv.pdf' },
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

  onMount(() => {
    updateNow();
    const interval = window.setInterval(updateNow, 30_000);
    return () => {
      window.clearInterval(interval);
    };
  });
</script>

<section id="contact" class="page-gutter scroll-mt-24 py-16 pb-24 sm:py-20 sm:pb-28 md:scroll-mt-28 md:py-28">
  <div class="mx-auto max-w-[1400px]">
    <div class="mb-6 flex flex-wrap items-baseline justify-between gap-3 sm:mb-8">
      <span class="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
        Contact · Berlin
      </span>
      <span class="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
        Berlin · {now}
      </span>
    </div>

    <div class="mb-7 max-w-3xl">
      <h2 class="mb-3 font-display text-[clamp(2rem,5.5vw,3.75rem)] font-medium leading-[0.98] tracking-tight">
        Want the practical version?
      </h2>
      <p class="max-w-2xl text-base leading-relaxed text-foreground/76 sm:text-lg">
        Email is the fastest path. LinkedIn, the CV, and phone are one click away.
      </p>
    </div>

    <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
      {#each directContacts as item}
        {#if item.copyValue}
          <CopyEmailAction
            email={item.copyValue}
            label={item.label}
            testId="direct-email-copy"
            className="rounded-lg border border-border/75"
          />
        {:else}
          <a
            href={item.href}
            download={item.download}
            target={item.href?.startsWith('http') ? '_blank' : undefined}
            rel={item.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            class="interactive-surface flex min-h-[168px] min-w-0 flex-col justify-center gap-5 rounded-lg border border-border/75 px-7 py-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/45 hover:bg-card/40 sm:px-9"
          >
            <span class="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
              {item.label}
            </span>
            <span class="min-w-0 break-words font-display text-[clamp(1.12rem,1.35vw,1.55rem)] leading-tight tracking-[-0.01em] text-foreground">
              {item.value}
            </span>
          </a>
        {/if}
      {/each}
    </div>

    <footer class="mt-16 flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground sm:mt-24">
      <span>© 2026 Miguel Almeida</span>
      <span>From Berlin, with care.</span>
    </footer>
  </div>
</section>
