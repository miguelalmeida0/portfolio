<script lang="ts">
  import type { ExperienceItem } from '$lib/types/portfolio';

  import { tokens } from '$lib/design/tokens';

  import Reveal from '$lib/components/shared/Reveal.svelte';

  export let items: ExperienceItem[];
</script>

<section class={tokens.layout.experience} aria-labelledby="experience-title">
  <div id="experience" class="flex flex-col gap-3">
    <p class={tokens.typography.sectionEyebrow}>Experience</p>
    <h2 id="experience-title">
      <span class={tokens.typography.sectionTitle}>Two roles,</span>
      {' '}
      <span class={tokens.typography.sectionTitleItalic}>one home.</span>
    </h2>
  </div>

  <div class={tokens.layout.experienceList}>
    {#each items as item, index}
      <Reveal delay={tokens.motion.stagger.xs + index * tokens.motion.stagger.xs}>
        <article class={tokens.layout.experienceRow}>
          <p class={tokens.typography.workNumber}>{item.year}</p>
          <div class="flex flex-col gap-3">
            <h3 class={tokens.typography.workTitle}>{item.title}</h3>
            <p class={tokens.typography.workMeta}>
              {item.company} - {item.place}
            </p>
          </div>
          <p class={tokens.typography.body}>{item.body}</p>
        </article>
      </Reveal>
    {/each}
  </div>
</section>
