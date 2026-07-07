<script lang="ts">
  const stats = [
    { n: '3+', label: 'Years building', note: 'Shipping product UI' },
    { n: '2', label: 'Core areas', note: 'Product · systems' },
    { n: '1000s', label: 'Users', note: 'Enterprise workflows' },
    { n: '∞', label: 'Iterations', note: 'Calm by default' }
  ];
</script>

<section class="page-gutter py-16 sm:py-20 md:py-24">
  <div class="mx-auto grid max-w-[1400px] grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
    {#each stats as stat}
      <article
        class="interactive-surface group min-w-0 overflow-hidden rounded-2xl border border-border bg-card/50 p-4 backdrop-blur hover:border-accent/40 hover:bg-card/80 sm:p-5 md:p-6"
      >
        <div class="mb-4 h-px w-8 bg-accent transition-all group-hover:w-16 sm:mb-6 sm:w-10"></div>
        <div class="text-[clamp(1.75rem,7vw,3.75rem)] font-semibold leading-none tracking-[-0.035em] break-words text-foreground">
          {stat.n}
        </div>
        <div class="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground sm:mt-4">
          {stat.label}
        </div>
        <div class="mt-2 text-xs text-foreground/80 sm:mt-3 sm:text-sm">{stat.note}</div>
      </article>
    {/each}
  </div>
</section>
