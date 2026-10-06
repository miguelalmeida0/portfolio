<script lang="ts">
  import { findProject } from '$lib/experience/projects';
  let { slug }: { slug: string } = $props();
  const project = $derived(findProject(slug)!);
</script>

<section class="case-design" id="design-rationale" aria-labelledby="design-rationale-title">
  <h2 id="design-rationale-title">The design decisions.</h2>
  <p class="case-design-intro">{project.problem}</p>
  <div class="case-decisions">
    {#each project.decisions as decision}
      <article>
        <h3>{decision.title}</h3>
        <p>{decision.detail}</p>
        <p class="case-tradeoff"><strong>The tradeoff.</strong> {decision.tradeoff}</p>
      </article>
    {/each}
  </div>
  <details class="case-boundary"><summary>Outcome and limits</summary><p>{project.outcome}</p><p>{project.limitation}</p></details>
</section>
