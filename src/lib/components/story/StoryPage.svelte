<script lang="ts">
  import { onMount } from 'svelte';
  import data from '$lib/story/story.json';
  import { createSceneRunner, type SceneId } from '$lib/story/scenes';
  import { prefersReducedMotion } from '$lib/motion/policy';
  import { destinationLink } from '$lib/navigation/destination-link';
  import ScenePanel from './ScenePanel.svelte';
  import ShortVersion from './ShortVersion.svelte';
  import './story.css';
  import './scenes.css';
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

<article bind:this={root} class="story-split story-editorial" data-story-ready={ready || undefined} aria-labelledby="story-title">
  <nav class="story-exits" aria-label="Story exits">
    <a href="/#top" aria-label="Back to home"><span aria-hidden="true">‹</span> Back</a>
  </nav>
  <header class="story-intro">
    <div class="story-intro-text">
      <h1 id="story-title">{data.editorial.title}</h1>
      <p class="story-intro-copy">{data.editorial.intro}</p>
      <a class="story-hero-link" href="#story-summary">Start with the short version <span aria-hidden="true">↓</span></a>
    </div>
    <figure class="story-intro-photo">
      <picture>
        <source type="image/avif" srcset="/images/wind-full-720.avif 720w, /images/wind-full-1086.avif 1086w" sizes="(max-width: 799px) 260px, 340px" />
        <source type="image/webp" srcset="/images/wind-full-720.webp 720w, /images/wind-full-1086.webp 1086w" sizes="(max-width: 799px) 260px, 340px" />
        <img src="/images/miguel-contact-editorial.webp" width="1086" height="1448" alt="Portrait of Miguel Almeida" loading="eager" decoding="async" />
      </picture>
    </figure>
  </header>
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
          <div class="story-copy">
            <p class="question-number">{String(i + 1).padStart(2, '0')} / 08</p>
            <h2 id={`story-${question.id}-title`}>{question.question}</h2>
            <p class="story-lead">{question.lead}</p>
            <p class="story-answer" data-ask-id={`story-${question.id}`}>{question.answer}</p>
            {#if i === 7}<ul class="story-tools">{#each data.tools as tool}<li>{tool}</li>{/each}</ul>{/if}
          </div>
          <ScenePanel index={i} {runners} {run} {ready} />
        </section>
      {/each}
      <section class="story-ending" aria-labelledby="story-end">
        <p class="story-eyebrow">{data.ending.label}</p>
        <h2 id="story-end">{data.ending.question}</h2>
        <p class="story-answer">{data.ending.answer}</p>
        <div class="ending-actions">{#each data.ending.ctas as cta}<a class:primary={'primary' in cta && cta.primary} href={cta.href} {...destinationLink(cta.href)}>{cta.label}<span aria-hidden="true">↗</span></a>{/each}</div>
      </section>
    </div>
  </div>
</article>
