<script lang="ts">
  import { onMount, tick } from 'svelte';

  import { MIGUEL_LLM_MAX_QUESTION_LENGTH } from '$lib/miguel-llm/guardrails';
  import type { MiguelLLMAnswer as MiguelAnswer, MiguelLLMMode } from '$lib/miguel-llm/types';
  import MiguelLLMAnswer from './MiguelLLMAnswer.svelte';
  import MiguelLLMInput from './MiguelLLMInput.svelte';
  import MiguelLLMStatus from './MiguelLLMStatus.svelte';

  export let open = false;
  export let mode: MiguelLLMMode = 'recruiter';

  const MAX_SESSION_QUESTIONS = 5;
  const SESSION_USAGE_KEY = 'miguel-llm-question-count';
  const PREVIOUS_SESSION_USAGE_KEYS = ['miguel-llm-question-count-v2'];
  type MiguelLLMMessage =
    | { role: 'user'; text: string }
    | { role: 'assistant'; answer: MiguelAnswer };

  const questionsByMode: Record<MiguelLLMMode, string[]> = {
    recruiter: [
      'What is Miguel’s strongest technical project?',
      'What did Miguel build in Camera Harness?',
      'What reliability work has Miguel done?',
      'What role is Miguel best suited for?'
    ],
    engineer: [
      'What is Camera Harness’s biggest architectural lesson?',
      'How does Ask choose visual evidence?',
      'What does Microscope actually do?',
      'What architecture did Miguel build in Atlas?'
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

  $: suggestedQuestions = questionsByMode[mode];
  $: questionsRemaining = Math.max(0, MAX_SESSION_QUESTIONS - questionCount);
  $: questionLimitReached = questionsRemaining <= 0;
  $: usageError = questionLimitReached
    ? `MiguelLLM is limited to ${MAX_SESSION_QUESTIONS} questions per browser session.`
    : error;
  $: runtimeStatus = answer ? formatRuntimeStatus(answer) : '';

  onMount(() => {
    questionCount = readQuestionCount();
  });

  function readQuestionCount() {
    if (typeof sessionStorage === 'undefined') return 0;

    const storedCounts = [SESSION_USAGE_KEY, ...PREVIOUS_SESSION_USAGE_KEYS].map((key) =>
      Number(sessionStorage.getItem(key))
    );
    const highestCount = Math.max(0, ...storedCounts.filter((count) => Number.isFinite(count)));

    return Math.min(Math.max(highestCount, 0), MAX_SESSION_QUESTIONS);
  }

  function recordQuestionUse() {
    questionCount = Math.min(readQuestionCount() + 1, MAX_SESSION_QUESTIONS);

    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(SESSION_USAGE_KEY, String(questionCount));
    }
  }

  $: if (open && !lastOpenState) {
    lastOpenState = true;
    if (typeof document !== 'undefined') {
      previousActiveElement = document.activeElement as HTMLElement;
    }
    question = '';
    tick().then(() => dialogElement?.focus());
  }

  $: if (!open && lastOpenState) {
    lastOpenState = false;
    previousActiveElement?.focus?.();
  }

  const closeDrawer = () => {
    open = false;
  };

  const resetConversation = () => {
    answer = null;
    messages = [];
    error = '';
    question = '';
  };

  const ask = async (nextQuestion: string) => {
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
      error = `MiguelLLM is limited to ${MAX_SESSION_QUESTIONS} questions per browser session.`;
      return;
    }

    recordQuestionUse();
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
        body: JSON.stringify({ question: trimmedQuestion, mode, recentAnswers })
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

      if (payload.error) error = payload.error;
      if (nextAnswer) {
        answer = nextAnswer;
        messages = [...messages, { role: 'assistant', answer: nextAnswer }];
      }
      if (!nextAnswer && !payload.error) error = 'MiguelLLM could not answer that yet.';
    } catch {
      error = 'MiguelLLM could not reach the local portfolio route.';
    } finally {
      loading = false;
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

    if (event.shiftKey && document.activeElement === first) {
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
      return 'Local notes mode';
    }

    const provider = value.provider === 'cerebras' ? 'Cerebras mode' : 'OpenAI mode';
    return `${provider} · ${value.model}`;
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
  <div class="drawer-shell" role="presentation">
    <button class="drawer-backdrop" type="button" aria-label="Close MiguelLLM" on:click={closeDrawer}></button>

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
          <span class="drawer-brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M12 2.7c.9 4.7 3.6 7.4 8.3 8.3-4.7.9-7.4 3.6-8.3 8.3-.9-4.7-3.6-7.4-8.3-8.3 4.7-.9 7.4-3.6 8.3-8.3Z" />
              <path d="M18.7 3.7c.34 1.8 1.38 2.84 3.18 3.18-1.8.34-2.84 1.38-3.18 3.18-.34-1.8-1.38-2.84-3.18-3.18 1.8-.34 2.84-1.38 3.18-3.18Z" />
            </svg>
          </span>
          <div>
            <h2 id="miguel-llm-drawer-title">MiguelLLM</h2>
            {#if runtimeStatus}
              <p class="runtime-status">{runtimeStatus}</p>
            {/if}
          </div>
        </div>
        <div class="drawer-actions">
          <button class="icon-button" type="button" aria-label="Reset MiguelLLM conversation" on:click={resetConversation}>
            ↻
          </button>
          <button class="icon-button" type="button" aria-label="Close MiguelLLM" on:click={closeDrawer}>
            ×
          </button>
        </div>
      </div>

      <div class:has-conversation={messages.length || loading} class="chat-scroll">
        {#if !messages.length && !loading}
          <div class="starter">
            <h3>What would you like to know?</h3>
            <div class="starter-questions" aria-label="Suggested MiguelLLM questions">
              {#each suggestedQuestions.slice(0, 3) as suggestedQuestion}
                <button type="button" disabled={questionLimitReached} on:click={() => ask(suggestedQuestion)}>
                  <span aria-hidden="true">↳</span>
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
                <MiguelLLMAnswer answer={message.answer} />
              {/if}
            {/each}
            {#if loading}
              <div class="typing-dots" aria-label="MiguelLLM is typing">
                <span></span>
                <span></span>
                <span></span>
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
      </div>
    </div>
  </div>
{/if}

<style>
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

  .drawer-brand-mark {
    display: grid;
    width: 1.5rem;
    height: 1.5rem;
    flex: 0 0 auto;
    place-items: center;
    border: 0;
    border-radius: 999px;
    background: var(--llm-surface-raised);
    color: var(--llm-accent);
  }

  .drawer-brand-mark svg {
    width: 0.92rem;
    height: 0.92rem;
    fill: currentColor;
  }

  h2 {
    margin: 0;
    color: var(--llm-ink);
    font-family: var(--font-mono);
    font-size: 0.9rem;
    font-weight: 860;
    letter-spacing: 0.22em;
    line-height: 1.1;
    text-transform: uppercase;
  }

  .drawer-brand .runtime-status {
    margin: 0.26rem 0 0;
    color: var(--llm-muted-soft);
    font-family: var(--font-mono);
    font-size: 0.66rem;
    font-weight: 760;
    letter-spacing: 0.12em;
    text-transform: uppercase;
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

  .starter-questions button span {
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
      height: 100svh;
      margin: 0;
      border-radius: 0;
      border-inline: 0;
    }

    .drawer-header,
    .chat-scroll,
    .chat-composer {
      padding-inline: 1.2rem;
    }
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
