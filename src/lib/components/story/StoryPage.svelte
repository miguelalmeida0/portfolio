<script lang="ts">
  import { onMount, tick } from 'svelte';
  import data from '$lib/story/story.json';
  import { createSceneRunner, autoplay, type SceneId } from '$lib/story/scenes';
  import { format } from '$lib/story/reading';
  import { scrollToElement } from '$lib/motion/smooth-scroll';
  import { destinationLink } from '$lib/navigation/destination-link';
  import ScenePanel from './ScenePanel.svelte';
  import ShortVersion from './ShortVersion.svelte';
  import Progress from './Progress.svelte';
  import StoryNavigation from './StoryNavigation.svelte';
  import './story.css';
  import './scenes.css';
  let root: HTMLElement;
  let current = $state(0), mobile = $state(false), reduced = $state(false), mounted = $state(false);
  const runners = data.questions.map(question => createSceneRunner(question.id as SceneId));
  const seen = new Set<number>();
  let previous = -1;
  $effect(() => {
    if (!mounted) return;
    if (previous >= 0 && previous < 8) runners[previous].cancel();
    previous = current;
    if (current < 8 && !seen.has(current)) {
      seen.add(current);
      if (!reduced && !document.hidden) void runners[current].run(autoplay[data.questions[current].id as SceneId]);
    }
  });
  function run(index: number, action: number) { void runners[index].run([action], reduced); }
  function sections() { return Array.from(root.querySelectorAll<HTMLElement>('[data-story-section]')); }
  function go(index: number) {
    const next = Math.max(0, Math.min(8, index)), section = sections()[next];
    if (!section) return;
    scrollToElement(section, { offset: 40, focus: true, duration: reduced ? 0 : undefined });
  }
  onMount(() => {
    const size = matchMedia('(max-width: 1099px)'), motion = matchMedia('(prefers-reduced-motion: reduce)');
    const layout = () => { mobile = size.matches; };
    const preference = () => { reduced = motion.matches; if (reduced) runners.forEach(r => r.cancel()); };
    layout(); preference(); mounted = true;
    let frame = 0;
    const update = () => {
      frame = 0;
      const elements = sections();
      const line = innerHeight * .42;
      let index = 0, distance = Infinity;
      elements.forEach((element, i) => { const box = element.getBoundingClientRect(); const d = Math.abs(box.top + Math.min(box.height, innerHeight) * .35 - line); if (d < distance) { distance = d; index = i; } });
      if (root.getBoundingClientRect().bottom <= innerHeight + 4) index = 8;
      current = index;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const resize = async () => { layout(); await tick(); schedule(); };
    const hidden = () => { if (document.hidden) runners.forEach(r => r.cancel()); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', resize);
    motion.addEventListener('change', preference); size.addEventListener('change', resize); document.addEventListener('visibilitychange', hidden);
    schedule();
    return () => {
      runners.forEach(r => r.cancel()); cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', resize);
      motion.removeEventListener('change', preference); size.removeEventListener('change', resize); document.removeEventListener('visibilitychange', hidden);
    };
  });
</script>
<article bind:this={root} class="story-split" aria-label={data.ui.title}>
  <h1 class="sr-only">{data.ui.title}</h1>
  {#if !mobile}<div class="story-visual"><ScenePanel index={Math.min(current, 7)} complete={current === 8} {runners} {run} /></div>{/if}
  <Progress {current} {go} ready={mounted} />
  <div class="story-scroll"><div class="story-reading">
    {#each data.questions as question, i}
      <section class="story-question" data-story-section data-current={current === i || undefined} aria-labelledby={`story-${question.id}`}>
        <p class="question-number">{format(data.ui.question, { n: i + 1, total: 8 })}</p><h2 id={`story-${question.id}`}>{question.question}</h2><p class="story-lead">{question.lead}</p><p class="story-answer" data-ask-id={`story-${question.id}`}>{question.answer}</p>
        {#if i === 7}<ul class="story-tools">{#each data.tools as tool}<li>{tool}</li>{/each}</ul>{/if}
        {#if mobile}<ScenePanel index={i} inline active={current === i} {runners} {run} />{:else}<div class="story-inline-placeholder" aria-hidden="true"></div>{/if}
        <StoryNavigation ready={mounted} index={i} {go} current={current === i} />
      </section>
    {/each}
    <section class="story-question story-ending" data-story-section data-current={current === 8 || undefined} aria-labelledby="story-end">
      <div class="ending-content"><p class="question-number">{data.ending.label}</p><h2 id="story-end">{data.ending.question}</h2><p class="story-answer">{data.ending.answer}</p>
      <div class="ending-actions"><StoryNavigation ready={mounted} index={8} {go} current={current === 8} ending />{#each data.ending.ctas as cta}<a class:primary={'primary' in cta && cta.primary} href={cta.href} {...destinationLink(cta.href)}>{cta.label}</a>{/each}</div>
      <p class="reward-cue">The short version. Keep scrolling when you’re ready.</p></div>
      {#if mobile}<div class="mobile-summary" data-story-panel data-complete={current === 8 || undefined}><ShortVersion complete={current === 8} /></div>{/if}
    </section>
  </div></div>
</article>
