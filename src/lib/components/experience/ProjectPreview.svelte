<script lang="ts">
  import type { Project } from '$lib/experience/projects';
  import LinkButton from './LinkButton.svelte';
  import ProductLoop from './ProductLoop.svelte';
  let { project, active = true }: { project: Project; active?: boolean } = $props();
  let imageError = $state(false);
</script>
<div class="grid gap-6 pb-8 min-[51.25rem]:grid-cols-2 min-[51.25rem]:gap-10">
  {#if project.slug === 'f24'}
    <div class="flex min-h-64 flex-col justify-between border-y border-rule py-6 sm:min-h-72 sm:py-8" aria-label="F24 experience summary">
      <p class="text-sm font-medium text-muted">F24 · 2022–2026 · production</p>
      <div>
        <p class="display-type text-[clamp(2.75rem,6vw,4.75rem)] leading-none text-forest">Svelte → React</p>
        <p class="mt-4 max-w-[31ch] font-serif text-lg leading-relaxed">Built the original frontend from first mockups to production, then continued product delivery in React with the wider team.</p>
      </div>
    </div>
  {:else}
  <div class="min-w-0 overflow-clip rounded-xl bg-ivory">
    {#if project.video}<ProductLoop src={project.video} poster={project.image} label={project.alt} {active} startAt={project.slug === 'leu' ? 1.55 : 0} />
    {:else if imageError}<div class="flex min-h-60 items-center justify-center p-8 text-center font-serif text-xl">The project image is unavailable. You can still read the full case study below.</div>
    {:else if project.slug === 'vigia'}<img src="/projects/vigia/intelligence-focus.webp" alt="VIGIA incident context beside its intelligence brief." width="930" height="420" loading="lazy" decoding="async" onerror={() => imageError = true} class="aspect-[2.2/1] h-auto w-full object-cover" />
    {:else}<img src={project.image} alt={project.alt} width="1200" height="750" loading="lazy" decoding="async" onerror={() => imageError = true} class="aspect-[1.5] h-auto w-full object-cover object-top" />{/if}
  </div>
  {/if}
  <div class="flex flex-col items-start justify-center">
    <p class="mb-4 text-sm font-medium text-muted">{project.period}</p>
    <h3 class="display-type text-[clamp(1.5rem,1.1rem+1vw,2rem)] leading-[1.12]">{project.summary}</h3>
    <div class="mt-5 flex flex-wrap gap-x-6 gap-y-2"><LinkButton href={'/work/'+project.slug} label={project.slug === 'f24' ? 'Read F24 case study' : 'Read case study'} />{#if project.live}<LinkButton href={project.live.href} label="Explore the project" external secondary />{/if}</div>
  </div>
</div>
