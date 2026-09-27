<script lang="ts">
  import Minus from '@lucide/svelte/icons/minus';
  import Plus from '@lucide/svelte/icons/plus';
  import { projects } from '$lib/experience/projects';
  import { SECOND_VOICE_URL } from '$lib/experience/voice-bridge';
  import LinkButton from './LinkButton.svelte';
  import Studio from './Studio.svelte';
  import ProjectPreview from './ProjectPreview.svelte';
  import { onDestroy, tick } from 'svelte';
  import { PROJECT_TRANSITION_MS, scrollToPosition } from '$lib/motion/smooth-scroll';
  import { workSignature } from '$lib/motion/signature';
  let active = $state<string | null>('second-voice-ai');
  let cancelAnchor: (() => void) | undefined;
  onDestroy(() => cancelAnchor?.());
  let selection = 0;

  function projectMeta(project: (typeof projects)[number]) {
    const metadata: Record<string, string> = {
      leu: 'Native learning · iOS & AI systems · 2026',
      'second-voice-ai': 'Literary rewriting · design & frontend · 2026',
      f24: 'Product frontend · design engineering · 2022–2026',
      vigia: 'Crisis intelligence · product & frontend · 2026',
      'mirror-ai': 'Visual selection · interaction & frontend · 2026'
    };
    return metadata[project.slug] ?? project.period;
  }
  async function selectProject(slug: string, toggle = false) {
    cancelAnchor?.();
    const version = ++selection;
    const opening = active !== slug;
    if (toggle && !opening) { active = null; return; }
    const trigger = document.getElementById('project-trigger-'+slug);
    if (!trigger) return;
    const closingHeight = [...document.querySelectorAll<HTMLElement>('[data-project-panel]')]
      .filter(panel => Boolean(panel.compareDocumentPosition(trigger) & Node.DOCUMENT_POSITION_FOLLOWING))
      .reduce((height, panel) => height + panel.getBoundingClientRect().height, 0);
    const destination = window.scrollY + trigger.getBoundingClientRect().top - closingHeight - 40;
    active = slug;
    await tick();
    if (version === selection) cancelAnchor = scrollToPosition(destination, PROJECT_TRANSITION_MS);
  }
</script>
<section id="work" use:workSignature aria-label="Selected work" class="shell relative border-t border-rule pt-5 pb-8 [overflow-anchor:none]">
  <span data-work-rule aria-hidden="true" class="pointer-events-none absolute inset-x-0 -top-px h-0.5 origin-left bg-plum"></span>
  <p class="mb-3 text-sm font-medium text-muted sm:mb-1">Work</p>
  <nav aria-label="Project overview" class="mb-2 flex flex-wrap gap-x-6 border-b border-rule/60 pb-2 text-sm">
    {#each projects as project}
      <button type="button" aria-pressed={active === project.slug} onclick={() => selectProject(project.slug)} class="min-h-11 underline-offset-4 hover:text-plum hover:underline {active === project.slug ? 'font-semibold text-plum underline' : 'text-muted'}">{project.name}</button>
    {/each}
  </nav>
  {#each projects as project, index}
    {@const open = active === project.slug}
    <article id={'project-'+project.slug} class={index > 0 ? 'border-t border-rule' : ''}>
      <h2>
        <button type="button" id={'project-trigger-'+project.slug} aria-expanded={open} aria-controls={'project-content-'+project.slug} onclick={() => selectProject(project.slug, true)}
          class="group grid min-h-20 w-full grid-cols-[minmax(0,1fr)_2.75rem] items-center gap-x-3 py-4 text-left {index > 0 ? 'min-[64rem]:grid-cols-[minmax(0,1fr)_minmax(11rem,.7fr)_2.75rem]' : ''} {open ? 'text-plum' : 'text-ink hover:text-plum'}">
          <span class="min-w-0 {index===0 ? 'display-type text-[clamp(2rem,1.35rem+2.5vw,3.5rem)]' : 'display-type text-[clamp(1.65rem,1.25rem+1.5vw,2.5rem)]'}"><span class="relative inline-block">{project.name}{#if index === 0}<span data-project-signature aria-hidden="true" class="pointer-events-none absolute inset-x-0 -bottom-2 h-0.5 origin-left bg-current"></span>{/if}</span></span>
          <span class="{index > 0 ? 'min-[64rem]:col-start-3 min-[64rem]:row-start-1' : 'col-start-2 row-start-1'} flex size-11 items-center justify-center self-start sm:self-center">{#if open}<Minus aria-hidden="true" size={24} strokeWidth={1.5} />{:else}<Plus aria-hidden="true" size={24} strokeWidth={1.5} />{/if}</span>
          {#if index > 0}<span class="col-start-1 mt-1 text-sm leading-relaxed font-normal tracking-normal text-muted min-[64rem]:col-start-2 min-[64rem]:row-start-1 min-[64rem]:mt-0 min-[64rem]:self-center">{projectMeta(project)}</span>{/if}
        </button>
      </h2>
      <div data-project-panel id={'project-content-'+project.slug} aria-labelledby={'project-trigger-'+project.slug} inert={!open} aria-hidden={!open} style:transition-duration={`${PROJECT_TRANSITION_MS}ms`} class="grid transition-[grid-template-rows,opacity] ease-[cubic-bezier(.37,0,.63,1)] {open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}">
        <div class="min-h-0 overflow-clip">
          {#if project.slug === 'second-voice-ai'}
            <div class="mb-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 sm:pl-12">
              <p class="font-serif text-lg leading-snug">One passage. Four voices. Compare the changes.</p>
              <div class="flex flex-wrap items-center gap-x-5 gap-y-2">
                <LinkButton href="/work/second-voice-ai" label="Case study" secondary />
                <LinkButton href={SECOND_VOICE_URL} label="Open full app" external />
              </div>
            </div>
            <div class="pb-7"><Studio /></div>
          {:else}<ProjectPreview {project} active={open} />{/if}
        </div>
      </div>
    </article>
  {/each}
</section>
