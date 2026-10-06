<script lang="ts">
  import { destinationLink } from '$lib/navigation/destination-link';
  import { INTRO, FOOTER, REFUSAL, DEFAULT_HEADING } from '$lib/ask/plan';
  import type { AskView } from '$lib/ask/types';
  import type { AskController } from '$lib/ask/state';
  let { controller, view }: { controller: AskController; view: AskView } = $props();
  let question = $state('');
  let start: { x: number; y: number } | undefined;
  function submit(event: SubmitEvent) { event.preventDefault(); if (question.trim()) { void controller.free(question); question = ''; } }
  function swipeStart(event: TouchEvent) {
    // Swipe only from the sheet's handle/header, never from its scrolling answer or input.
    if ((event.target as Element).closest('button, input')) return;
    const touch = event.touches[0]; start = { x: touch.clientX, y: touch.clientY };
  }
  function swipeEnd(event: TouchEvent) {
    const touch = event.changedTouches[0];
    if (start && touch.clientY - start.y > 80 && Math.abs(touch.clientX - start.x) < 60) controller.close();
    start = undefined;
  }
</script>
<section class="ask-panel" data-ask-panel aria-label="Ask MiguelLLM" inert={view.state === 'closing'} data-scroll-native>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="ask-panel-top" ontouchstart={swipeStart} ontouchend={swipeEnd} ontouchcancel={() => start = undefined}>
    <div class="ask-handle" aria-hidden="true"></div>
  </div>
  <p class="ask-mode-label">Ask MiguelLLM · portfolio guide</p>
  <div class="ask-heading" role="status" aria-live="polite" aria-atomic="true">{view.question}</div>
  <!-- Keyboard users need to focus this region to scroll long answers. -->
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <div class="ask-answer-scroll" data-scroll-native tabindex="0" role="region" aria-label="Answer and sources">
    <div class="ask-answer" data-ask-answer>
      {#if !view.knowledge && !view.complete && !view.loading && !view.error}<p class="ask-intro">{INTRO}</p>{/if}
      {#if view.error}<p class="ask-intro">{view.error}</p>{/if}
      {#if view.loading}<p class="ask-intro">Connecting this topic to Miguel’s work…</p>{/if}
      {#if view.refusal}<p class="ask-intro">{REFUSAL}</p>{/if}
      {#if view.knowledge}
        <div class="ask-knowledge" data-ask-knowledge>
          <p class="ask-phrase">{view.knowledge.paragraphs[0]}</p>
          {#if view.knowledge.paragraphs.length > 1 || view.knowledge.bullets.length}
            {#key view.question}<details class="ask-detail"><summary>Read the detail</summary>
              {#each view.knowledge.paragraphs.slice(1) as paragraph}<p>{paragraph}</p>{/each}
              {#if view.knowledge.bullets.length}<ul>{#each view.knowledge.bullets as bullet}<li>{bullet}</li>{/each}</ul>{/if}
            </details>{/key}
          {/if}
        </div>
      {/if}
      {#if view.fragments.some(f => f.quoted)}<p class="ask-context">On this page:
        {#each view.fragments as fragment}
          {#if fragment.quoted}<span class="ask-phrase">“<mark>{fragment.step.quote}</mark>”<sup>{fragment.number}</sup></span>{/if}
        {/each}
      </p>{/if}
      {#if view.complete && !view.refusal && !view.knowledge?.conversational}<p class="ask-answer-footer ask-phrase">{FOOTER}</p>{/if}
    </div>
    <div class="sr-only" aria-live="polite" aria-atomic="true" data-ask-announcement>{view.complete ? 'Answer ready. Details and sources are available below.' : view.error || (view.question === DEFAULT_HEADING ? INTRO : '')}</div>
    {#if view.error}<button class="ink-link" type="button" onclick={() => controller.free(view.question)}>Try again</button>{/if}
    {#if view.knowledge?.sources.length}<nav class="ask-sources" aria-label="Answer sources">{#each view.knowledge.sources as source}
      <a href={source.split('|')[1]} {...destinationLink(source.split('|')[1])}>{source.split('|')[0]}</a>
    {/each}</nav>{/if}
    {#if view.complete && view.knowledge?.followups?.length}<nav class="ask-followups" aria-label="Follow-up questions">{#each view.knowledge.followups as next}<button type="button" onclick={() => controller.free(next)}>{next}</button>{/each}</nav>{/if}
  </div>
  <div class="ask-try"><span>Try</span>
    <button data-ask-try type="button" onclick={() => controller.ask('w-f24')}>F24</button>
    <button data-ask-try type="button" onclick={() => controller.ask('w-sv')}>Second Voice</button>
    <button data-ask-try type="button" onclick={() => controller.ask('stack')}>His stack</button>
    <button data-ask-try type="button" onclick={() => controller.ask('role')}>Design background</button>
  </div>
  <form class="ask-form" onsubmit={submit}>
    <input aria-label="Type your own question" placeholder="Or type your own question…" autocomplete="off" maxlength="320" bind:value={question} />
    <button class="action-button hover:bg-ink" type="submit" aria-label="Ask your question" disabled={!question.trim()}>Ask</button>
  </form>
</section>
<button type="button" class="ask-close" aria-label="Close and return to the page — Back to the page Esc" onclick={controller.close}>Back to the page <kbd>Esc</kbd></button>

<style>
  .ask-mode-label { margin:0 0 12px; color:var(--color-plum); font-size:14px; font-weight:600; }
  .ask-detail { margin-top:12px; }
  .ask-detail summary { min-height:44px; display:list-item; cursor:pointer; padding:10px 0; color:var(--color-plum); text-decoration:underline; text-underline-offset:4px; }
  .ask-detail p, .ask-detail li { margin-top:12px; }
  .ask-followups { display: flex; flex-direction: column; align-items: flex-start; gap: .2rem; margin-top: .5rem; }
  .ask-followups button { min-height: 28px; text-align: left; font: inherit; font-size: .9rem; color: var(--color-plum); text-decoration: underline; text-underline-offset: 4px; cursor: pointer; }
  @media (max-width: 767px) { .ask-followups button { min-height: 40px; } }
</style>
