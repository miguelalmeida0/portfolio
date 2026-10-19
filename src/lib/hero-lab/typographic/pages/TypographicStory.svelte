<script lang="ts">
  import { onMount, type Snippet } from 'svelte';
  import {page as routePage} from '$app/stores';
  import data from '$lib/story/story.json';
  import { createSceneRunner, type SceneId } from '$lib/story/scenes';
  import { prefersReducedMotion } from '$lib/motion/policy';
  import { reveal } from '$lib/motion/actions/reveal';
  import ScenePanel from '$lib/components/story/ScenePanel.svelte';
  import ShortVersion from '$lib/components/story/ShortVersion.svelte';
  import '$lib/components/story/story.css';
  import '$lib/components/story/scenes.css';
  import { labMotion } from '$lib/hero-lab/runtime';
  import TypographicNav from '../TypographicNav.svelte';
  import { d1Href as originalHref, type D1Page } from '../site';
  import D1Action from './D1Action.svelte';
  import D1Title from './D1Title.svelte';
  import { storyMotion } from './story-motion';
  import { storyOpening } from './story-opening';
  import AskTopic from '$lib/components/ask/AskTopic.svelte';
  import './d1-pages.css';

  let {previewBase='', navigation}:{previewBase?:string;navigation?:Snippet}=$props();
  const d1Href = (href: string, page: D1Page) => {
    const target = originalHref(href, page);
    return previewBase && /^\/(?:story|cv)?(?:[?#]|$)/.test(target)
      ? previewBase + (target === '/' ? '' : target) : target;
  };
  let introStep = $state(0);
  $effect(()=>{
    const chapter=$routePage.url.searchParams.get('chapter');
    if(previewBase && chapter !== null && /^[0-2]$/.test(chapter)) introStep=Number(chapter);
  });
  function moveIntro(event: KeyboardEvent, index: number) {
    const next = event.key === 'ArrowDown' || event.key === 'ArrowRight' ? (index + 1) % 3
      : event.key === 'ArrowUp' || event.key === 'ArrowLeft' ? (index + 2) % 3
      : event.key === 'Home' ? 0 : event.key === 'End' ? 2 : undefined;
    if (next === undefined) return;
    event.preventDefault(); introStep = next;
    document.getElementById(`journey-step-${next}`)?.focus({ preventScroll: true });
  }
  const sections = [
    { id: 'story-summary', label: 'Short version' },
    { id: 'story-hi', label: 'Background' },
    { id: 'story-f24', label: 'Work' },
    { id: 'story-own', label: 'Projects' }
  ];

  // Chapter state, as on the production Story page.
  let root: HTMLElement;
  let current = $state('hi');
  let ready = $state(false);
  const runners = data.questions.map(question => createSceneRunner(question.id as SceneId));
  function run(index: number, action: number) {
    void runners[index].run([action], prefersReducedMotion());
  }
  onMount(() => {
    ready = true;
    const visible = new Set<HTMLElement>();
    // Observation only: no input listeners, scroll writes, snapping or timed holds.
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const section = entry.target as HTMLElement;
        if (entry.isIntersecting) visible.add(section);
        else { visible.delete(section); runners[Number(section.dataset.storyIndex)]?.cancel(); }
      }
      const nearest = [...visible].sort((a, b) =>
        Math.abs(a.getBoundingClientRect().top - 100) - Math.abs(b.getBoundingClientRect().top - 100))[0];
      if (nearest) current = nearest.dataset.chapter || 'hi';
    }, { rootMargin: '-80px 0px -35% 0px', threshold: 0 });
    root.querySelectorAll<HTMLElement>('[data-story-section]').forEach(section => observer.observe(section));
    const hidden = () => { if (document.hidden) runners.forEach(runner => runner.cancel()); };
    document.addEventListener('visibilitychange', hidden);
    return () => {
      observer.disconnect();
      runners.forEach(runner => runner.cancel());
      document.removeEventListener('visibilitychange', hidden);
    };
  });
</script>

<div class="d1-page" id="top" data-lab-root data-direction="typographic" data-d1-page="story" use:labMotion={storyMotion}>
  {#if navigation}{@render navigation()}{:else}<TypographicNav page="story" {sections} />{/if}

  <section class="s-stage" data-hero-stage data-s-stage aria-labelledby="story-title">
    <header class="story-welcome">
      <p class="story-hello" data-meta>{storyOpening.greeting}</p>
      <h1 id="story-title" class="story-opening-title">{#each storyOpening.lines as line}<span class="opening-mask"><span data-story-line>{line}</span></span>{/each}</h1>
      <p class="story-opening-copy" data-meta>{storyOpening.introduction}</p>
    </header>

    <figure class="story-photo" data-story-photo data-arm>
      <div class="story-photo-frame"><img src="/projects/f24/hackathon-team.webp" width="1000" height="749"
        alt="Miguel and the F24 hackathon team beside their presentation, with a colleague joining remotely."
        fetchpriority="high" decoding="async" /></div>
      <figcaption>At F24, building together.</figcaption>
    </figure>

    <div class="journey" role="tablist" aria-label="Career journey" aria-orientation="horizontal">
      {#each storyOpening.chapters as step, i}
        <button type="button" class="j-row" data-j-row role="tab" id={`journey-step-${i}`} aria-selected={introStep === i} aria-controls={`journey-panel-${i}`} tabindex={introStep === i ? 0 : -1} onclick={() => introStep = i} onkeydown={event => moveIntro(event, i)}>
          <span class="j-cell" data-j-cell>
            <span class="j-label" data-j-label>{step.period}</span>
            <span class="j-word" data-j-word>{step.title}</span>
          </span>
        </button>
      {/each}
    </div>

    <div class="s-intro" data-s-intro>
      <div class="intro-panels">
        {#each storyOpening.chapters as step, i}
          <div class="intro-panel" id={`journey-panel-${i}`} role="tabpanel" aria-labelledby={`journey-step-${i}`} tabindex="0" hidden={introStep !== i} inert={introStep !== i}>
            <h2 class="intro-chapter-title">{step.heading}</h2>
            <div class="s-copy" data-ask-id={step.area}>{#each step.paragraphs as paragraph}<p>{paragraph}</p>{/each}</div>
            <AskTopic area={step.area} label={`Ask about ${step.title.toLowerCase()}`} explicit />
            {#if i < 2}<button class="journey-next" type="button" onclick={() => { introStep = i + 1; document.getElementById(`journey-step-${i + 1}`)?.focus({ preventScroll: true }); }}>Next: {storyOpening.chapters[i + 1].title}<span aria-hidden="true">→</span></button>{/if}
          </div>
        {/each}
      </div>
    </div>

    <div class="band" data-band data-arm>
      <D1Title tag="h2" text="A little more of the story." class="band-title" />
      <a class="band-link" href="#story-summary">Start with the short version <span aria-hidden="true">↓</span></a>
    </div>
  </section>

  <article bind:this={root} class="story-split story-editorial d1-story" data-story-ready={ready || undefined} aria-labelledby="story-title">
    <section class="story-summary story-summary-first" data-story-section data-chapter="summary" aria-labelledby="story-summary"><ShortVersion /></section>
    <div class="story-layout">
      <aside class="story-index">
        <p class="story-eyebrow">{data.editorial.indexTitle}</p>
        <nav aria-label="Story chapters">
          {#each data.questions as question, i}
            <a href={`#story-${question.id}`} aria-current={current === question.id ? 'location' : undefined}><span>{String(i + 1).padStart(2, '0')}</span>{data.editorial.topics[i]}</a>
          {/each}
          <a class="summary-link" href="#story-summary" aria-current={current === 'summary' ? 'location' : undefined}><span aria-hidden="true">↳</span>{data.editorial.summaryLink}</a>
        </nav>
      </aside>
      <div class="story-chapters">
        {#each data.questions as question, i}
          <section class="story-question" id={`story-${question.id}`} tabindex="-1" data-story-section data-story-index={i} data-chapter={question.id} aria-labelledby={`story-${question.id}-title`}>
            <span class="chapter-rule" data-rule aria-hidden="true"></span>
            <div class="story-copy">
              <p class="question-number">{String(i + 1).padStart(2, '0')} / 08</p>
              <D1Title id={`story-${question.id}-title`} text={question.question} size="chapter" />
              <p class="story-lead" data-settle>{question.lead}</p>
              <p class="story-answer" data-settle data-ask-id={`story-${question.id}`}>{question.answer}</p>
              {#if i === 7}<ul class="story-tools" data-settle>{#each data.tools as tool}<li>{tool}</li>{/each}</ul>{/if}
            </div>
            <div data-current-reading><div data-current-surface><ScenePanel index={i} {runners} {run} {ready} /></div></div>
          </section>
        {/each}
      </div>
    </div>
    <section class="story-ending" aria-labelledby="story-end" use:reveal={{ variant: 'settle', threshold: 0.08, skipInitialViewport: true }}>
      <p class="story-eyebrow">{data.ending.label}</p>
      <D1Title id="story-end" text={data.ending.question} size="display" />
      <p class="story-answer">{data.ending.answer}</p>
      <div class="ending-actions">
        {#each data.ending.ctas as cta}
          {@const href = d1Href(cta.href, 'story')}
          <D1Action {href} label={cta.label} variant={'primary' in cta && cta.primary ? 'block' : 'line'} on="forest" />
        {/each}
      </div>
    </section>
  </article>
</div>

<style>
  .d1-page { background: var(--paper); color: var(--ink); font-family: var(--hero-font); }
  .s-stage { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); grid-template-rows: auto auto 1fr auto; gap: 32px clamp(32px, 5vw, 88px); padding: 144px var(--page-x) 0; background: var(--lime); }
  .story-welcome { grid-column: 1; grid-row: 1; min-width: 0; }
  .story-hello { margin-bottom: 20px; font: 600 var(--d1-lead)/1.4 var(--d1-body); }
  .story-opening-title { margin: 0; font: 700 clamp(44px, 5.4vw, 96px)/1.05 var(--d1-display); letter-spacing: -.015em; text-transform: uppercase; }
  .opening-mask { display: block; overflow: clip; padding-block: .05em; margin-block: -.05em; }
  .opening-mask > span { display: block; }
  .story-opening-copy { max-width: 48ch; margin-top: 28px; font: 400 var(--d1-lead)/1.55 var(--d1-body); text-wrap: pretty; }
  .story-photo { grid-column: 2; grid-row: 1 / span 3; align-self: start; position: sticky; top: 128px; width: 100%; margin: 24px 0 40px; }
  .story-photo-frame { overflow: clip; border-radius: 36px 36px 6px 36px; }
  .story-photo img { display: block; width: 100%; height: auto; aspect-ratio: 1000 / 749; }
  .story-photo figcaption { margin-top: 16px; font: 500 var(--d1-meta)/1.5 var(--d1-body); color: var(--forest); }
  .journey { grid-column: 1; grid-row: 2; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; min-width: 0; margin-top: 8px; }
  .j-row { position: relative; min-width: 0; padding: 18px 0; border: 0; border-top: 1px solid var(--rule-ink); background: none; color: var(--ink); text-align: left; cursor: pointer; }
  .j-row::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: var(--plum); transform: scaleX(0); transform-origin: left; transition: transform .35s cubic-bezier(.16,1,.3,1); }
  .j-row[aria-selected='true'] { color: var(--plum); }
  .j-row[aria-selected='true']::after { transform: scaleX(1); }
  .j-row:focus-visible, .journey-next:focus-visible { outline: 2px solid var(--plum); outline-offset: 6px; }
  .j-cell { display: grid; gap: 9px; overflow: clip; }
  .j-label { font: 500 13px/1.4 var(--d1-body); }
  .j-word { display: block; min-width: 0; padding-block: .06em; font: 700 clamp(25px, 2.5vw, 40px)/1.1 var(--d1-display); text-transform: uppercase; letter-spacing: 0; }
  .s-intro { grid-column: 1; grid-row: 3; min-width: 0; margin-bottom: 32px; }
  .intro-panels { display: grid; }
  .intro-panel { grid-area: 1 / 1; }
  .intro-panel[hidden] { display: block; visibility: hidden; pointer-events: none; }
  .intro-panel:focus-visible { outline: 2px solid var(--plum); outline-offset: 6px; }
  .intro-chapter-title { margin: 0 0 18px; font: 600 clamp(24px, 2vw, 32px)/1.2 var(--d1-body); letter-spacing: -.02em; }
  .s-copy { max-width: 54ch; margin-bottom: 20px; font: 400 var(--d1-body-size)/1.65 var(--d1-body); text-wrap: pretty; }
  .s-copy p + p { margin-top: 16px; }
  .journey-next { display: flex; align-items: center; gap: 16px; min-height: 48px; margin-top: 20px; padding: 0; border: 0; background: none; color: var(--plum); font: 600 17px/1.3 var(--d1-body); cursor: pointer; }
  .journey-next span { transition: transform .25s ease; }
  .journey-next:is(:hover, :focus-visible) span { transform: translateX(5px); }
  .d1-page:global([data-lab-motion='full']) .intro-panel:not([hidden]) { animation: intro-arrive .45s cubic-bezier(.16,1,.3,1); }
  @keyframes intro-arrive { from { opacity: .35; transform: translateY(12px); } to { opacity: 1; transform: none; } }
  .band { grid-column: 1 / -1; grid-row: 4; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 24px 40px; margin-inline: calc(-1 * var(--page-x)); padding: 40px var(--page-x); background: var(--forest); color: var(--paper); transform-origin: left center; }
  .band :global(.band-title) { font-size: clamp(40px, 5vw, 80px); line-height: 1.05; }
  .band-link { display: inline-flex; align-items: center; gap: 10px; min-height: 52px; color: var(--paper); font: 700 var(--d1-action)/1.2 var(--d1-display); letter-spacing: .04em; text-transform: uppercase; text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 7px; }
  .band-link:focus-visible { outline: 3px solid var(--lime); outline-offset: 4px; }
  @media (max-width: 1023px) {
    .s-stage { grid-template-columns: minmax(0, 1fr); grid-template-rows: auto; gap: 28px; padding: 112px 24px 0; }
    .story-welcome, .journey, .s-intro, .story-photo, .band { grid-column: 1; grid-row: auto; }
    .story-photo { position: relative; top: auto; width: min(100%, 620px); margin: 0; }
    .story-photo-frame { border-radius: 24px 24px 4px 24px; }
    .story-opening-copy { max-width: 58ch; }
    .j-label { font-size: 12px; }
    .journey { gap: 12px; }
    .band { margin-inline: -24px; padding: 32px 24px; }
  }
  @media (max-width: 380px) { .s-stage { padding-inline: 20px; } .band { margin-inline: -20px; padding-inline: 20px; } .j-label { min-height: 2.8em; } }
  @media (prefers-reduced-motion: reduce) { .j-row::after, .journey-next span { transition: none; } .intro-panel { animation: none !important; } .story-photo { position: relative; top: auto; } }
  :global(html[data-motion='reduced']) .j-row::after,
  :global(html[data-motion='reduced']) .journey-next span { transition: none; }
  :global(html[data-motion='reduced']) .intro-panel { animation: none; }
  :global(html[data-motion='reduced']) .story-photo { position: relative; top: auto; }
</style>
