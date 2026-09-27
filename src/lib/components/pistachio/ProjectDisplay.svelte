<script lang="ts">
  import ArrowLeft from '@lucide/svelte/icons/arrow-left';
  import ArrowRight from '@lucide/svelte/icons/arrow-right';
  import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
  import { portfolioProjects } from '$lib/content/portfolio-index';
  import SecondVoiceEmbed from './SecondVoiceEmbed.svelte';
  let { selected, onselect }: { selected: number; onselect: (index: number) => void } = $props();
  const project = $derived(portfolioProjects[selected]);
</script>
<section id="project-display" aria-label="Project preview">
  <div hidden={selected !== 1}><SecondVoiceEmbed /></div>
  {#if selected !== 1}
    <a href={project.href} class="block bg-folio-black"><img src={project.image} alt={project.alt} class="aspect-[1.65] w-full object-cover" width="1600" height="900" /></a>
  {/if}
  <div class="mx-[4.4%] grid items-center gap-5 border-b border-folio-ink py-6 md:grid-cols-[auto_1fr_auto]">
    <div class="flex items-center gap-4 text-sm">
      <button type="button" aria-label="Previous project" onclick={() => onselect((selected + 3) % 4)} class="flex min-h-11 cursor-pointer items-center gap-2 hover:text-folio-plum"><ArrowLeft size={18} /><span class="hidden lg:inline">Previous</span></button>
      <span class="text-folio-plum tabular-nums">0{selected + 1} / 04</span>
      <button type="button" aria-label="Next project" onclick={() => onselect((selected + 1) % 4)} class="min-h-11 cursor-pointer hover:text-folio-plum"><ArrowRight size={18} /></button>
    </div>
    <div aria-live="polite"><h2 class="text-xl font-bold tracking-tight sm:text-3xl">{project.name}</h2><p class="mt-1 text-sm sm:text-base">{project.description}</p></div>
    <div class="flex items-center gap-5 text-sm">
      <a class="inline-flex min-h-[48px] items-center gap-2 rounded-lg bg-folio-plum px-5 text-folio-paper" href={project.href}>{selected === 0 ? 'Read the story' : 'Case study'}<ArrowUpRight size={16} /></a>
      {#if project.live}<a class="inline-flex min-h-[48px] items-center gap-2 hover:underline" href={project.live} target="_blank" rel="noopener noreferrer">Open live app<ArrowUpRight size={16} /></a>{/if}
    </div>
  </div>
</section>

