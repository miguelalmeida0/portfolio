<script lang="ts">
  import type { ManifestoContent } from '$lib/types/portfolio';

  import { tokens } from '$lib/design/tokens';

  import Reveal from '$lib/components/shared/Reveal.svelte';

  export let manifesto: ManifestoContent;
</script>

<section class={tokens.layout.manifesto} aria-labelledby="manifesto-title">
  <Reveal delay={tokens.motion.stagger.xs}>
    <div class="flex flex-col gap-5">
      <p class={tokens.typography.sectionEyebrow}>{manifesto.eyebrow}</p>

      <h2 id="manifesto-title" class="flex flex-wrap gap-x-4 gap-y-2">
        {#each manifesto.fragments as fragment}
          <span class={fragment.italic ? tokens.typography.manifestoWordItalic : tokens.typography.manifestoWord}>
            {fragment.text}
          </span>
        {/each}
      </h2>
    </div>
  </Reveal>

  <Reveal delay={tokens.motion.stagger.sm}>
    <div class="flex flex-col gap-5">
      <p class={tokens.typography.sectionEyebrow}>{manifesto.figure}</p>
      <article class={tokens.patterns.quoteCard}>
        <p>{manifesto.quote}</p>
        <p class={tokens.patterns.quoteNote}>{manifesto.note}</p>
      </article>
    </div>
  </Reveal>
</section>
