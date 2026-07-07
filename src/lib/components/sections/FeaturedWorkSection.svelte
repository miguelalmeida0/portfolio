<script lang="ts">
  import type { FeaturedProject } from '$lib/types/portfolio';

  import { tokens } from '$lib/design/tokens';

  import Reveal from '$lib/components/shared/Reveal.svelte';

  export let projects: FeaturedProject[];
</script>

<section class={tokens.layout.work} aria-labelledby="work-title">
  <div class={tokens.layout.workHeader}>
    <div id="work" class="flex flex-col gap-3">
      <p class={tokens.typography.sectionEyebrow}>Selected work</p>
      <h2 id="work-title">
        <span class={tokens.typography.sectionTitle}>A small</span>
        {' '}
        <span class={tokens.typography.sectionTitleItalic}>catalogue.</span>
      </h2>
    </div>
  </div>

  <div class={tokens.layout.workList}>
    {#each projects as project, index}
      <Reveal delay={tokens.motion.stagger.xs + index * tokens.motion.stagger.xs}>
        <article class={tokens.patterns.workRow}>
          <div class={tokens.patterns.workOrbit} aria-hidden="true">
            <div class={tokens.patterns.workOrbitAura}></div>
            <div class={tokens.patterns.workOrbitTrackWarm}></div>
            <div class={tokens.patterns.workOrbitTrackClay}></div>
            <div class={tokens.patterns.workOrbitSpinPrimary}>
              <span class={tokens.patterns.workOrbitDotWarm}></span>
            </div>
            <div class={tokens.patterns.workOrbitSpinSecondary}>
              <span class={tokens.patterns.workOrbitDotClay}></span>
            </div>
          </div>

          <div class={tokens.layout.workRow}>
            <p class={tokens.typography.workNumber}>{project.number}</p>

            <div class="flex flex-col gap-4">
              <h3>
                <span class={tokens.typography.workTitle}>{project.title}</span>
                {' '}
                <span class={tokens.typography.workTitleItalic}>{project.titleItalic}</span>
              </h3>

              <div class="flex flex-wrap gap-2">
                {#each project.tags as tag}
                  <span class={tokens.patterns.workTag}>{tag}</span>
                {/each}
              </div>
            </div>

            <div class="flex flex-col gap-4">
              <p class={tokens.typography.workMeta}>{project.period}</p>
              <p class={tokens.typography.body}>{project.summary}</p>
              <a class={tokens.surfaces.tag + ' w-fit'} href={project.href}>
                Read the chronicle
              </a>
            </div>
          </div>
        </article>
      </Reveal>
    {/each}
  </div>
</section>
