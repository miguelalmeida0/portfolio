<script lang="ts">
  import type { IndexEntry } from '$lib/types/portfolio';

  import { toneClasses, tokens } from '$lib/design/tokens';

  import Reveal from '$lib/components/shared/Reveal.svelte';

  export let entries: IndexEntry[];
</script>

<section class={tokens.layout.index} aria-labelledby="index-title">
  <div id="index" class="flex flex-col gap-3">
    <p class={tokens.typography.sectionEyebrow}>Approach</p>
    <h2 id="index-title">
      <span class={tokens.typography.sectionTitle}>How I</span>
      {' '}
      <span class={tokens.typography.sectionTitleItalic}>work.</span>
    </h2>
  </div>

  <div class={tokens.layout.indexGrid}>
    {#each entries as entry, index}
      <Reveal className="h-full" delay={tokens.motion.stagger.xs + index * tokens.motion.stagger.xs}>
        <article class={toneClasses[entry.tone]}>
          <div class="flex h-full w-full flex-col gap-6">
            <div class="flex items-start justify-between gap-4">
              <h3 class={tokens.typography.indexTitle}>{entry.title}</h3>
              <span class={tokens.typography.numeral}>{entry.numeral}</span>
            </div>

            <p class={entry.tone === 'cream' ? tokens.typography.bodyInk : tokens.typography.body}>
              {entry.body}
            </p>

            <div class="mt-auto flex flex-wrap gap-2">
              {#each entry.chips as chip}
                <span class={tokens.patterns.chip}>{chip}</span>
              {/each}
            </div>
          </div>
        </article>
      </Reveal>
    {/each}
  </div>
</section>
