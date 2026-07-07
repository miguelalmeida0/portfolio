<script lang="ts">
  import RevealHeading from './RevealHeading.svelte';

  const steps = [
    {
      n: '1',
      title: 'Build',
      body: 'Turn product intent into precise, accessible UI that holds up in real workflows.',
      tone: 'card'
    },
    {
      n: '2',
      title: 'Scale',
      body: 'Shape patterns, naming and reuse so a team can move faster without making the interface noisier.',
      tone: 'ink'
    },
    {
      n: '3',
      title: 'Collaborate',
      body: 'Work close to design and product, share early, and keep the important details visible.',
      tone: 'accent'
    }
  ] as const;
</script>

<section id="approach" class="page-gutter py-16 sm:py-20 md:py-28">
  <div class="mx-auto max-w-[1400px]">
    <div class="mb-8 md:mb-12">
      <RevealHeading
        className="font-display text-[clamp(2rem,7vw,5rem)] leading-[0.95] tracking-tight"
      >
        How I <em class="not-italic text-accent">work.</em>
      </RevealHeading>
    </div>

    <div class="grid gap-2.5 md:grid-cols-3 md:gap-3">
      {#each steps as step}
        <div
          class={`flex min-h-0 flex-col rounded-[1.35rem] p-5 sm:p-6 md:min-h-[230px] md:justify-between md:rounded-2xl md:p-7 lg:min-h-[250px] lg:p-8 ${
            step.tone === 'ink'
              ? 'bg-foreground text-background'
              : step.tone === 'accent'
                ? 'bg-accent text-accent-foreground'
                : 'border border-border bg-card/60 text-foreground backdrop-blur'
          }`}
        >
          <div class="flex items-start justify-between">
            <h3 class="font-display text-[clamp(1.65rem,7vw,2.65rem)] font-semibold leading-none break-words md:text-[clamp(1.75rem,3vw,2.65rem)]">
              {step.title}
            </h3>
            <span class="ml-4 shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] opacity-60 md:font-display md:text-lg md:tracking-normal">
              {step.n}
            </span>
          </div>
          <p class="mt-4 max-w-[42rem] text-sm leading-relaxed opacity-88 sm:text-[0.95rem] md:mt-8 md:max-w-none">
            {step.body}
          </p>
        </div>
      {/each}
    </div>
  </div>
</section>
