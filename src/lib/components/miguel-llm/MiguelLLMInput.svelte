<script lang="ts">
  import { MIGUEL_LLM_MAX_QUESTION_LENGTH } from '$lib/miguel-llm/guardrails';

  export let value = '';
  export let loading = false;
  export let disabled = false;
  export let maxLength = MIGUEL_LLM_MAX_QUESTION_LENGTH;
  export let placeholder = 'Ask anything about Miguel...';
  export let onSubmit: (question: string) => void = () => {};
</script>

<form
  class="llm-input"
  on:submit|preventDefault={() => {
    if (!loading && !disabled) onSubmit(value);
  }}
>
  <label for="miguel-llm-question">Ask MiguelLLM</label>
  <div class="input-row">
    <input
      id="miguel-llm-question"
      type="text"
      bind:value
      maxlength={maxLength}
      {placeholder}
      disabled={loading || disabled}
    />
    <button type="submit" disabled={loading || disabled || value.trim().length < 4}>
      {loading ? 'Reading' : 'Ask'}
    </button>
  </div>
</form>

<style>
  .llm-input {
    display: grid;
    gap: 0.5rem;
  }

  .llm-input label {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  .input-row {
    position: relative;
    display: block;
    min-height: 2.78rem;
    border: 1px solid var(--llm-input-border, #2b2521);
    border-radius: 999px;
    background: #030303;
    box-shadow: inset 0 1px 0 rgb(255 247 236 / 0.035);
  }

  input {
    display: block;
    width: 100%;
    min-height: 2.68rem;
    border: 0;
    border-radius: 999px;
    background: transparent;
    padding: 0 3.55rem 0 1.55rem;
    color: var(--llm-ink, #f5eee8);
    caret-color: var(--llm-ink, #f5eee8);
    font-family: var(--font-display);
    font-size: 1rem;
    font-weight: 620;
    line-height: 1;
    outline: none;
    text-align: left;
  }

  input::placeholder {
    color: #69625d;
    opacity: 1;
  }

  input:focus-visible {
    box-shadow: none;
  }

  button {
    display: grid;
    position: absolute;
    top: 50%;
    right: 0.45rem;
    width: 2.05rem;
    min-width: 2.05rem;
    min-height: 2.05rem;
    place-items: center;
    transform: translateY(-50%);
    border: 0;
    border-radius: 999px;
    background: #625d58;
    color: transparent;
    cursor: pointer;
    font-family: var(--font-mono);
    font-size: 0;
    font-weight: 860;
    letter-spacing: 0;
    text-transform: none;
  }

  button::before {
    color: #050505;
    content: "↑";
    font-family: var(--font-display);
    font-size: 1.36rem;
    font-weight: 780;
    line-height: 1;
  }

  button:hover,
  button:focus-visible {
    outline: 2px solid rgb(245 238 232 / 0.34);
    outline-offset: 2px;
  }

  button:not(:disabled) {
    background: #f4f2ef;
    cursor: pointer;
    opacity: 1;
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 1;
  }

  @media (max-width: 560px) {
    button {
      right: 0.55rem;
    }
  }
</style>
