<script lang="ts">
  import type { ProjectSystem } from '$lib/experience/project-systems';
  let { system }: { system: ProjectSystem } = $props();
</script>
<section id="architecture" class="section-space scroll-mt-8 border-b border-rule">
  <h2 class="section-title text-plum">Architecture & tools.</h2>
  <p class="mt-4 max-w-4xl text-sm leading-relaxed sm:text-base">{system.summary}</p>
  <ol aria-label="System flow" class="architecture-flow">
    {#each system.flow as step, index}
      <li><span class="text-xs text-plum">0{index + 1}</span><h3>{step.name}</h3><p>{step.detail}</p></li>
    {/each}
  </ol>
  <p class="border-l-2 border-plum pl-4 text-sm leading-relaxed">{system.quality}</p>
  <details class="architecture-details mt-5">
  <summary class="ink-link text-sm font-semibold text-plum">Implementation decisions <span aria-hidden="true">＋</span></summary>
  <dl class="mt-3 grid gap-x-10 min-[60rem]:grid-cols-2">
    {#each system.tools as group}
      <div class="grid gap-2 border-t border-rule py-4 sm:grid-cols-[8rem_1fr] sm:gap-5">
        <dt class="pt-0.5 text-sm text-muted">{group.area}</dt>
        <dd>
          <p class="font-semibold leading-relaxed">{group.names}</p>
          <p class="mt-2 text-sm leading-relaxed text-muted">{group.purpose}</p>
        </dd>
      </div>
    {/each}
  </dl>
  </details>
</section>

<style>
  .architecture-flow { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); margin-block: 24px; border-block: 1px solid var(--color-rule); }
  .architecture-flow li { padding: 18px; border-left: 1px solid var(--color-rule); }
  .architecture-flow li:first-child { padding-left: 0; border-left: 0; }
  .architecture-flow h3 { margin-top: 6px; font-size: 15px; font-weight: 600; }
  .architecture-flow p { margin-top: 6px; font-size: 13px; line-height: 1.6; color: var(--color-muted); }
  summary { display: flex; justify-content: space-between; list-style: none; border-top: 1px solid var(--color-rule); }
  summary::-webkit-details-marker { display: none; }
  details[open] summary span { transform: rotate(45deg); }
  @media (max-width: 699px) {
    .architecture-flow { grid-template-columns: 1fr 1fr; margin-block: 20px; }
    .architecture-flow li { padding: 14px 12px; }
    .architecture-flow li:nth-child(odd) { padding-left: 0; border-left: 0; }
    .architecture-flow li:nth-child(n+3) { border-top: 1px solid var(--color-rule); }
  }
</style>
