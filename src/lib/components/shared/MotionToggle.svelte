<script lang="ts">
  import { motionState, setMotionSetting } from '$lib/motion/policy';

  /**
   * The site's own motion control.
   *
   * It follows the operating system by default and can only ever reduce motion
   * further — when the OS asks for reduced motion the Full option is disabled, so a
   * site preference can never override an accessibility setting. Only the preference
   * is stored; nothing is reported anywhere.
   */
  $: state = $motionState;
  $: lockedBySystem = state.systemReduced || state.saveData;
  $: systemNote = state.systemReduced
    ? 'Your system asks for reduced motion.'
    : state.saveData
      ? 'Your browser asks to save data.'
      : '';
</script>

<div class="motion-toggle">
  <span class="motion-label" id="motion-preference-label">Motion</span>
  <div class="motion-options" role="group" aria-labelledby="motion-preference-label">
    <button
      type="button"
      data-testid="motion-full"
      aria-pressed={!state.reduced}
      disabled={lockedBySystem}
      title={lockedBySystem ? systemNote : 'Full motion'}
      on:click={() => setMotionSetting('system')}
    >
      Full
    </button>
    <button
      type="button"
      data-testid="motion-reduced"
      aria-pressed={state.reduced}
      on:click={() => setMotionSetting('reduced')}
    >
      Reduced
    </button>
  </div>
  {#if lockedBySystem}
    <span class="motion-note">{systemNote}</span>
  {/if}
</div>

<style>
  .motion-toggle {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.55rem;
    color: rgb(244 234 220 / 0.6);
    font-family: var(--font-sans);
    font-size: 0.78rem;
  }

  .motion-label {
    font-weight: 600;
    letter-spacing: 0.01em;
  }

  .motion-options {
    display: inline-flex;
    align-items: center;
    gap: 1px;
    border: 1px solid rgb(244 234 220 / 0.2);
    border-radius: 999px;
    padding: 2px;
  }

  button {
    min-height: 1.85rem;
    border: 0;
    border-radius: 999px;
    background: transparent;
    padding: 0 0.7rem;
    color: rgb(244 234 220 / 0.68);
    cursor: pointer;
    font-family: inherit;
    font-size: 0.75rem;
    font-weight: 650;
    line-height: 1;
    transition:
      background-color var(--motion-feedback) var(--motion-ease-feedback),
      color var(--motion-feedback) var(--motion-ease-feedback);
  }

  button[aria-pressed='true'] {
    background: rgb(244 234 220 / 0.14);
    color: var(--foreground);
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }

  button:focus-visible {
    outline: 2px solid var(--ring);
    outline-offset: 2px;
  }

  .motion-note {
    color: rgb(244 234 220 / 0.5);
  }

  @media (prefers-reduced-motion: reduce) {
    button {
      transition: none;
    }
  }
</style>
