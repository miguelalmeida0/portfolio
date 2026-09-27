<script lang="ts">
  import ArrowDownRight from '@lucide/svelte/icons/arrow-down-right';
  import { portfolioProjects } from '$lib/content/portfolio-index';
  let { selected, onselect }: { selected: number; onselect: (index: number) => void } = $props();
</script>
<section id="work" aria-label="Selected work" class="px-[4.4%] pb-[3vw] pt-3 sm:pt-8">
  <h1 class="sr-only">Miguel Almeida — Frontend Engineer. Selected work.</h1>
  {#each portfolioProjects as project, index}
    <button type="button" aria-pressed={selected === index} aria-controls="project-display" onclick={() => onselect(index)} class="group relative flex w-full cursor-pointer items-center gap-[2%] py-1 text-left focus-visible:outline-2 focus-visible:outline-offset-4 {selected === index ? 'text-folio-plum' : 'text-folio-ink'}">
      <span class="w-[4%] shrink-0 text-[clamp(.7rem,2.1vw,1.6rem)] tabular-nums">0{index + 1} /</span>
      <span class="min-w-0 shrink-0 whitespace-nowrap text-[clamp(2rem,10.4vw,10.5rem)] leading-[1.12] font-black tracking-[-.065em] {selected === index ? 'underline decoration-[.065em] underline-offset-[.14em]' : ''}">{project.name}</span>
      <span class="hidden min-w-0 flex-1 border-b border-current opacity-70 md:block"></span>
      {#if selected === index}<ArrowDownRight class="pointer-events-none absolute right-[24%] bottom-1 translate-y-full hidden size-[4.5vw] md:block" strokeWidth={1.5} aria-hidden="true" />{/if}
      <span class="hidden shrink-0 whitespace-nowrap text-[clamp(.75rem,1.45vw,1.3rem)] lg:block">{project.category}</span>
    </button>
  {/each}
</section>

