<script lang="ts">
  import { onDestroy, onMount, tick } from 'svelte';
  import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
  import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
  import X from '@lucide/svelte/icons/x';
  import { projectQuestions, projectTitles, resolveProject } from '$lib/miguel-llm/projectContext';
  import { recruiterBriefs } from '$lib/content/recruiter-briefs';

  import { MIGUEL_LLM_MAX_QUESTION_LENGTH } from '$lib/miguel-llm/guardrails';
  import type { MiguelLLMAnswer as MiguelAnswer, MiguelLLMMode } from '$lib/miguel-llm/types';
  import MiguelLLMAnswer from './MiguelLLMAnswer.svelte';
  import MiguelLLMInput from './MiguelLLMInput.svelte';
  import MiguelLLMStatus from './MiguelLLMStatus.svelte';

  export let open = false;
  export let mode: MiguelLLMMode = 'recruiter';
  export let projectSlug: string | undefined = undefined;

  const MAX_SESSION_QUESTIONS = 5;
  const SESSION_USAGE_KEY = 'miguel-llm-question-count';
  const PREVIOUS_SESSION_USAGE_KEYS = ['miguel-llm-question-count-v2'];
  type MiguelLLMMessage =
    | { role: 'user'; text: string }
    | { role: 'assistant'; answer: MiguelAnswer };

  const questionsByMode: Record<MiguelLLMMode, string[]> = {
    recruiter: [
      'Which project should I start with?',
      'What did Miguel personally build?',
      'What production frontend experience does he have?'
    ],
    engineer: [
      'What is Camera Harness’s biggest architectural lesson?',
      'How does Ask choose visual evidence?',
      'What does Microscope actually do?',
      'How does Ghostwriter handle failure?'
    ],
    design: [
      'How does Miguel combine design and engineering?',
      'How is uncertainty shown in Camera Harness?',
      'Why use floating labels instead of boxes?',
      'What should I inspect first?'
    ],
    curious: [
      'Does Camera Harness run fully locally?',
      'Why AI products?',
      'What is the integration drift lesson?',
      'Give me the non-corporate version.'
    ]
  };

  let dialogElement: HTMLElement;
  let previousActiveElement: HTMLElement | null = null;
  let lastOpenState = false;
  let question = '';
  let loading = false;
  let error = '';
  let answer: MiguelAnswer | null = null;
  let messages: MiguelLLMMessage[] = [];
  let questionCount = 0;
  let requestController: AbortController | undefined;
  let requestVersion = 0;
  let lastQuestion = '';
  let chatScroll: HTMLElement;
  let activeProject: string | undefined = projectSlug;
  let savedBodyOverflow: string | undefined;

  $: suggestedQuestions = projectQuestions(activeProject).length ? projectQuestions(activeProject) : questionsByMode[mode];
  $: questionsRemaining = Math.max(0, MAX_SESSION_QUESTIONS - questionCount);
  $: questionLimitReached = questionsRemaining <= 0;
  $: usageError = questionLimitReached
    ? `The portfolio guide is limited to ${MAX_SESSION_QUESTIONS} questions per browser session.`
    : error;
  $: runtimeStatus = answer ? formatRuntimeStatus(answer) : '';

  onMount(() => {
    questionCount = readQuestionCount();
  });

  function cancelRequest() { requestVersion += 1; requestController?.abort(); loading = false; }
  function restoreScroll() { if (typeof document !== 'undefined' && savedBodyOverflow !== undefined) { document.body.style.overflow = savedBodyOverflow; savedBodyOverflow = undefined; } }
  onDestroy(() => { cancelRequest(); restoreScroll(); });

  $: if (chatScroll && (messages.length || loading)) { tick().then(() => chatScroll?.scrollTo({ top: chatScroll.scrollHeight, behavior: 'auto' })); }

  function readQuestionCount() {
    if (typeof sessionStorage === 'undefined') return 0;

    let storedCounts: number[];
    try { storedCounts = [SESSION_USAGE_KEY, ...PREVIOUS_SESSION_USAGE_KEYS].map((key) => Number(sessionStorage.getItem(key))); }
    catch { return questionCount; }
    const highestCount = Math.max(0, ...storedCounts.filter((count) => Number.isFinite(count)));

    return Math.min(Math.max(highestCount, 0), MAX_SESSION_QUESTIONS);
  }

  function recordQuestionUse() {
    questionCount = Math.min(readQuestionCount() + 1, MAX_SESSION_QUESTIONS);

    if (typeof sessionStorage !== 'undefined') {
      try { sessionStorage.setItem(SESSION_USAGE_KEY, String(questionCount)); } catch { /* The guide also works with storage disabled. */ }
    }
  }

  $: if (open && !lastOpenState) {
    lastOpenState = true;
    if (typeof document !== 'undefined') {
      previousActiveElement = document.activeElement as HTMLElement;
      savedBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    activeProject = projectSlug;
    question = '';
    tick().then(() => dialogElement?.focus());
  }

  $: if (!open && lastOpenState) {
    lastOpenState = false;
    cancelRequest();
    restoreScroll();
    previousActiveElement?.focus?.();
  }

  const closeDrawer = () => {
    open = false;
  };

  const resetConversation = () => {
    cancelRequest();
    answer = null;
    messages = [];
    error = '';
    question = '';
  };

  const ask = async (nextQuestion: string) => {
    if (loading) return;
    const trimmedQuestion = nextQuestion.trim();

    if (trimmedQuestion.length < 4) {
      error = 'Ask a short portfolio question.';
      return;
    }

    if (trimmedQuestion.length > MIGUEL_LLM_MAX_QUESTION_LENGTH) {
      error = `Keep the question under ${MIGUEL_LLM_MAX_QUESTION_LENGTH} characters.`;
      return;
    }

    if (questionLimitReached) {
      error = `The portfolio guide is limited to ${MAX_SESSION_QUESTIONS} questions per browser session.`;
      return;
    }

    activeProject = resolveProject(trimmedQuestion, activeProject);
    lastQuestion = trimmedQuestion;
    const version = ++requestVersion;
    requestController = new AbortController();
    const timeout = setTimeout(() => requestController?.abort(), 18000);
    loading = true;
    error = '';
    messages = [...messages, { role: 'user', text: trimmedQuestion }];
    question = '';

    try {
      const recentAnswers = messages
        .filter(
          (message): message is Extract<MiguelLLMMessage, { role: 'assistant' }> =>
            message.role === 'assistant'
        )
        .slice(-3)
        .map((message) => message.answer.shortAnswer);
      const response = await fetch('/api/miguel-llm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question: trimmedQuestion, mode, recentAnswers, projectSlug: activeProject }),
        signal: requestController.signal
      });

      const payload = (await response.json()) as Partial<MiguelAnswer> & {
        error?: string;
        answer?: MiguelAnswer;
      };
      const nextAnswer = isMiguelAnswer(payload)
        ? payload
        : payload.answer && isMiguelAnswer(payload.answer)
          ? payload.answer
          : null;

      if (version !== requestVersion) return;
      if (response.status === 400) { error = payload.error || 'Please rephrase that portfolio question.'; question = trimmedQuestion; return; }
      if (!response.ok) throw new Error(payload.error || 'The live guide is unavailable.');
      if (payload.error) error = payload.error;
      if (nextAnswer) {
        recordQuestionUse();
        answer = nextAnswer;
        messages = [...messages, { role: 'assistant', answer: nextAnswer }];
      }
      if (!nextAnswer) throw new Error('No readable answer returned.');
    } catch {
      if (version !== requestVersion) return;
      const brief = activeProject ? recruiterBriefs[activeProject] : undefined;
      const offlineAnswer: MiguelAnswer = {
        runtime: 'local-fallback', provider: 'local-fallback', model: 'saved-portfolio-notes', questionMode: mode,
        shortAnswer: brief ? `Saved project overview: ${brief.problem}` : 'The live guide is unavailable. You can still read Miguel’s work, résumé, and contact details directly.',
        bullets: brief ? [brief.ownership] : [],
        sources: activeProject ? [`${projectTitles[activeProject]}|/work/${activeProject}`, 'Résumé|/cv'] : ['Selected work|/#work', 'Résumé|/cv', 'Contact Miguel|/#contact'],
        suggestedNextQuestions: [], confidence: 'medium'
      };
      answer = offlineAnswer;
      messages = [...messages, { role: 'assistant', answer: offlineAnswer }];
      error = 'Showing saved notes. This attempt did not use a question.';
    } finally {
      clearTimeout(timeout);
      if (version === requestVersion) loading = false;
    }
  };

  const handleKeydown = (event: KeyboardEvent) => {
    if (!open) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      closeDrawer();
      return;
    }

    if (event.key !== 'Tab' || !dialogElement) return;

    const focusable = Array.from(
      dialogElement.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((element) => !element.hasAttribute('disabled') && element.offsetParent !== null);

    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogElement)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  function isMiguelAnswer(value: unknown): value is MiguelAnswer {
    if (!value || typeof value !== 'object') return false;

    const candidate = value as Partial<MiguelAnswer>;

    return (
      (candidate.runtime === 'api' || candidate.runtime === 'local-fallback') &&
      typeof candidate.provider === 'string' &&
      typeof candidate.model === 'string' &&
      typeof candidate.questionMode === 'string' &&
      typeof candidate.shortAnswer === 'string' &&
      Array.isArray(candidate.bullets) &&
      Array.isArray(candidate.sources) &&
      Array.isArray(candidate.suggestedNextQuestions)
    );
  }

  function formatRuntimeStatus(value: MiguelAnswer) {
    if (value.runtime === 'local-fallback' || value.provider === 'local-fallback') {
      return 'From portfolio notes';
    }

    return 'Portfolio notes · AI-assisted';
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
  <div class="drawer-shell" role="presentation">
    <button class="drawer-backdrop" type="button" aria-label="Close portfolio guide" on:click={closeDrawer}></button>

    <div
      bind:this={dialogElement}
      class="drawer-panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="miguel-llm-drawer-title"
      tabindex="-1"
    >
      <div class="drawer-header">
        <div class="drawer-brand">
          <div>
            <h2 id="miguel-llm-drawer-title">Portfolio guide</h2>
            {#if runtimeStatus}
              <p class="runtime-status">{runtimeStatus}</p>
            {/if}
          </div>
        </div>
        <div class="drawer-actions">
          <button class="icon-button" type="button" aria-label="Reset portfolio guide conversation" on:click={resetConversation}>
            <RotateCcw size={18} aria-hidden="true" />
          </button>
          <button class="icon-button" type="button" aria-label="Close portfolio guide" on:click={closeDrawer}>
            <X size={20} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div bind:this={chatScroll} class:has-conversation={messages.length || loading} class="chat-scroll">
        {#if !messages.length && !loading}
          <div class="starter">
            <h3>What would you like to know?</h3>
            {#if activeProject}<p class="project-context">Exploring {projectTitles[activeProject]}</p>{/if}
            <div class="starter-questions" aria-label="Suggested portfolio questions">
              {#each suggestedQuestions.slice(0, 3) as suggestedQuestion}
                <button type="button" disabled={questionLimitReached} on:click={() => ask(suggestedQuestion)}>
                  <ArrowUpRight size={15} aria-hidden="true" />
                  {suggestedQuestion}
                </button>
              {/each}
            </div>
          </div>
        {:else}
          <div class="conversation-stack" aria-live="polite">
            {#each messages as message}
              {#if message.role === 'user'}
                <div class="user-message-row">
                  <p class="user-message">{message.text}</p>
                </div>
              {:else}
                <MiguelLLMAnswer answer={message.answer} onNavigate={closeDrawer} />
              {/if}
            {/each}
            {#if loading}
              <div class="typing-dots" aria-label="Portfolio guide is typing">
                <span></span>
                <span></span>
                <span></span>
              </div>
            {/if}
            {#if answer && !loading && !error && !questionLimitReached}
              <div class="followup-questions" aria-label="Follow-up questions">
                {#each answer.suggestedNextQuestions.slice(0, 2) as followup}<button type="button" on:click={() => ask(followup)}>{followup}</button>{/each}
              </div>
            {/if}
          </div>
        {/if}
      </div>

      <div class="chat-composer">
        <MiguelLLMInput
          bind:value={question}
          {loading}
          disabled={questionLimitReached}
          maxLength={MIGUEL_LLM_MAX_QUESTION_LENGTH}
          onSubmit={ask}
        />
        <MiguelLLMStatus error={usageError} />
        {#if error && lastQuestion && !questionLimitReached}<button type="button" class="retry-question" disabled={loading} on:click={() => ask(lastQuestion)}>Try the live guide again</button>{/if}
        {#if questionLimitReached}<nav class="guide-exit" aria-label="Continue without the guide"><a href="/cv" on:click={closeDrawer}>Read résumé</a><a href="/#contact" on:click={closeDrawer}>Contact Miguel</a></nav>{/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .project-context { font-size: 13px; color: #aaa29b; margin: 12px 0 0; }
  .followup-questions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 20px; }
  .followup-questions button, .retry-question { padding: 10px 12px; border: 1px solid #474039; border-radius: 8px; background: transparent; color: #e9dfd5; text-align: left; cursor: pointer; font-size: 12px; line-height: 1.5; }
  .retry-question { margin-top: 8px; }
  .guide-exit { display: flex; gap: 20px; font-size: 13px; padding-top: 12px; }
  .guide-exit a { text-decoration: underline; text-underline-offset: 4px; }
  .followup-questions button:focus-visible, .retry-question:focus-visible, .guide-exit a:focus-visible { outline: 2px solid var(--ring); outline-offset: 3px; }
  .drawer-shell {
    position: fixed;
    inset: 0;
    z-index: 80;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    color: #f5eee8;
  }

  .drawer-backdrop {
    position: absolute;
    inset: 0;
    border: 0;
    background: rgb(6 3 2 / 0.5);
    backdrop-filter: blur(8px);
    cursor: pointer;
  }

  .drawer-panel {
    --llm-accent: #f5eee8;
    --llm-border: rgb(245 238 232 / 0.105);
    --llm-ink: #f5eee8;
    --llm-ink-strong: #fff8f0;
    --llm-input-border: #2b2521;
    --llm-muted: #a9a19a;
    --llm-muted-soft: #716a64;
    --llm-ring: rgb(245 238 232 / 0.36);
    --llm-shadow: rgb(0 0 0 / 0.46);
    --llm-surface: #15100d;
    --llm-surface-raised: #211c18;
    --llm-surface-soft: #120e0b;

    position: relative;
    z-index: 1;
    display: grid;
    grid-template-rows: auto minmax(0, 1fr) auto;
    width: min(100%, 28rem);
    height: 100svh;
    max-height: none;
    margin-right: 0;
    overflow: hidden;
    border: 1px solid rgb(245 238 232 / 0.11);
    border-right: 0;
    border-radius: 0 0 0 0.55rem;
    background: var(--llm-surface-soft);
    color: var(--llm-ink);
    box-shadow: -18px 0 80px var(--llm-shadow);
    outline: none;
  }

  .drawer-panel:focus-visible {
    box-shadow:
      0 0 0 2px #02070a,
      0 0 0 5px var(--llm-ring),
      -18px 0 80px var(--llm-shadow);
  }

  .drawer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    min-height: 3.55rem;
    border-bottom: 1px solid var(--llm-border);
    background: var(--llm-surface-soft);
    padding: 0 1.38rem;
  }

  .drawer-brand {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 0.86rem;
  }

  h2 {
    margin: 0;
    color: var(--llm-ink);
    font-family: var(--font-sans);
    font-size: 0.95rem;
    font-weight: 700;
    letter-spacing: 0;
    line-height: 1.1;
  }

  .drawer-brand .runtime-status {
    margin: 0.26rem 0 0;
    color: var(--llm-muted-soft);
    font-family: var(--font-sans);
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0;
  }

  .drawer-actions {
    display: flex;
    align-items: center;
    gap: 0.62rem;
  }

  .icon-button {
    display: grid;
    width: 1.75rem;
    height: 1.75rem;
    place-items: center;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: #b6aea7;
    cursor: pointer;
    font-family: var(--font-display);
    font-size: 1.45rem;
    font-weight: 400;
    line-height: 1;
  }

  .icon-button:hover,
  .icon-button:focus-visible {
    color: var(--llm-ink-strong);
    outline: 2px solid var(--llm-ring);
    outline-offset: 2px;
  }

  .chat-scroll {
    display: grid;
    gap: 1rem;
    overflow: auto;
    align-content: end;
    background: transparent;
    padding: 1.55rem 1.75rem 2.35rem;
  }

  .chat-scroll.has-conversation {
    align-content: start;
    padding-top: 1.55rem;
  }

  .chat-composer {
    display: grid;
    gap: 0.7rem;
    background: var(--llm-surface-soft);
    padding: 0 1.75rem 1.48rem;
  }

  .starter {
    display: grid;
    gap: 2.35rem;
  }

  .starter h3 {
    margin: 0;
    color: var(--llm-ink);
    font-family: var(--font-display);
    font-size: clamp(1.72rem, 3.1vw, 1.98rem);
    font-weight: 760;
    letter-spacing: -0.02em;
    line-height: 1.14;
  }

  .starter-questions {
    display: grid;
    gap: 0.8rem;
  }

  .starter-questions button {
    display: flex;
    width: 100%;
    align-items: center;
    gap: 1.32rem;
    border: 0;
    border-radius: 1rem;
    background: transparent;
    color: #aaa29b;
    cursor: pointer;
    font-family: var(--font-display);
    font-size: 1.05rem;
    font-weight: 690;
    letter-spacing: 0;
    line-height: 1.25;
    padding: 0.86rem 1rem;
    text-align: left;
    text-transform: none;
    transition:
      background-color 160ms var(--interaction-ease),
      color 160ms var(--interaction-ease);
  }

  .starter-questions button:hover,
  .starter-questions button:focus-visible {
    background: #1a1512;
    color: var(--llm-ink-strong);
    outline: none;
  }

  .starter-questions button :global(svg) {
    color: #716a64;
    min-width: 1rem;
  }

  .conversation-stack {
    display: grid;
    gap: 2.5rem;
  }

  .user-message-row {
    display: flex;
    justify-content: flex-end;
  }

  .user-message {
    max-width: min(74%, 17rem);
    min-width: 2.4rem;
    min-height: 2.4rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    border-radius: 1.2rem;
    background: var(--llm-surface-raised);
    padding: 0.45rem 0.95rem;
    color: var(--llm-ink);
    font-family: var(--font-display);
    font-size: 1rem;
    font-weight: 760;
    line-height: 1.15;
    overflow-wrap: anywhere;
  }

  .conversation-stack :global(.llm-answer) {
    margin-top: 0.34rem;
  }

  .typing-dots {
    display: flex;
    gap: 0.42rem;
    padding-top: 0.1rem;
  }

  .typing-dots span {
    width: 0.38rem;
    height: 0.38rem;
    border-radius: 999px;
    background: #716a64;
  }

  .starter-questions button:disabled {
    cursor: not-allowed;
    opacity: 0.42;
  }

  @media (max-width: 680px) {
    .drawer-shell {
      align-items: flex-end;
      justify-content: center;
    }

    .drawer-panel {
      width: 100%;
      height: 100dvh;
      margin: 0;
      border-radius: 0;
      border-inline: 0;
    }

    .drawer-header,
    .chat-scroll,
    .chat-composer {
      padding-inline: 1.2rem;
    }

    .chat-composer { padding-bottom: max(16px, env(safe-area-inset-bottom)); }
    .drawer-header { padding-top: max(12px, env(safe-area-inset-top)); }
  }

  @media (prefers-reduced-motion: no-preference) {
    .drawer-backdrop {
      animation: backdrop-in 180ms ease both;
    }

    .drawer-panel {
      animation: drawer-in 260ms var(--interaction-ease) both;
    }
  }

  @keyframes backdrop-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes drawer-in {
    from {
      transform: translate3d(0, 0.45rem, 0) scale(0.985);
    }
    to {
      transform: translate3d(0, 0, 0);
    }
  }
</style>
