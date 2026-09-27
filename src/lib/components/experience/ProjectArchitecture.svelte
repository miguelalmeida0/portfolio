<script lang="ts">
  import type { ProjectSystem } from '$lib/experience/project-systems';
  let { system }: { system: ProjectSystem } = $props();
</script>
<section id="architecture" class="scroll-mt-8 border-b border-rule py-10 sm:py-14">
  <p class="label-type mb-4 text-plum">Behind the interface</p>
  <h2 class="text-3xl font-bold tracking-[-.035em] sm:text-4xl">Architecture & tools.</h2>
  <p class="mt-5 max-w-prose text-base leading-relaxed sm:text-lg">{system.summary}</p>
  <dl>
    {#each system.tools as group}
      <div class="grid gap-2 border-t border-rule py-5 sm:grid-cols-[8rem_1fr] sm:gap-5">
        <dt class="pt-0.5 text-sm text-muted">{group.area}</dt>
        <dd>
          <p class="font-semibold leading-relaxed">{group.names}</p>
          <p class="mt-2 text-sm leading-relaxed text-muted">{group.purpose}</p>
        </dd>
      </div>
    {/each}
  </dl>
  <ol aria-label="System flow" class="my-8 grid border-y border-rule sm:grid-cols-2 min-[70rem]:grid-cols-4">
    {#each system.flow as step, index}
      <li class="min-w-0 border-b border-rule/60 py-5 pr-5 last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0 min-[70rem]:border-b-0 min-[70rem]:border-l min-[70rem]:pl-5 min-[70rem]:first:border-l-0 min-[70rem]:first:pl-0">
        <span class="font-serif text-sm text-plum">0{index + 1}</span>
        <h3 class="mt-2 text-base font-bold">{step.name}</h3>
        <p class="mt-2 text-sm leading-relaxed text-muted">{step.detail}</p>
      </li>
    {/each}
  </ol>
  <p class="mt-3 border-l-2 border-plum pl-4 text-sm leading-relaxed">{system.quality}</p>
</section>
