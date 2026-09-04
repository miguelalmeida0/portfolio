<script lang="ts">
  import { onMount } from 'svelte';

  import type { MiguelLLMMode } from '$lib/miguel-llm/types';
  import MiguelLLMDrawer from './MiguelLLMDrawer.svelte';

  let drawerOpen = false;
  let selectedMode: MiguelLLMMode = 'recruiter';

  const openDrawer = () => {
    drawerOpen = true;
  };

  onMount(() => {
    const handleOpen = (event: Event) => {
      const detail = (event as CustomEvent<{ question?: string; mode?: MiguelLLMMode }>).detail;
      if (detail?.mode) selectedMode = detail.mode;
      openDrawer();
    };

    window.addEventListener('miguel-llm:open', handleOpen as EventListener);

    return () => {
      window.removeEventListener('miguel-llm:open', handleOpen as EventListener);
    };
  });
</script>

<div id="miguel-llm" class="miguel-llm-card" aria-labelledby="miguel-llm-title">
  <button
    type="button"
    class="llm-trigger"
    aria-label="Open MiguelLLM"
    on:click={() => openDrawer()}
  >
    <span class="llm-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" role="img">
        <path d="M12 2.7c.9 4.7 3.6 7.4 8.3 8.3-4.7.9-7.4 3.6-8.3 8.3-.9-4.7-3.6-7.4-8.3-8.3 4.7-.9 7.4-3.6 8.3-8.3Z" />
        <path d="M18.7 3.7c.34 1.8 1.38 2.84 3.18 3.18-1.8.34-2.84 1.38-3.18 3.18-.34-1.8-1.38-2.84-3.18-3.18 1.8-.34 2.84-1.38 3.18-3.18Z" />
      </svg>
    </span>
    <span id="miguel-llm-title">MiguelLLM</span>
  </button>
</div>

<MiguelLLMDrawer bind:open={drawerOpen} bind:mode={selectedMode} />

<style>
  .miguel-llm-card {
    width: fit-content;
  }

  .llm-trigger {
    display: inline-flex;
    min-height: 2.55rem;
    align-items: center;
    gap: 0.55rem;
    border: 1px solid rgb(194 218 233 / 0.18);
    border-radius: 999px;
    background:
      linear-gradient(180deg, rgb(23 52 71 / 0.86), rgb(11 23 33 / 0.8)),
      #122a39;
    padding: 0.38rem 0.78rem 0.38rem 0.42rem;
    color: var(--foreground);
    cursor: pointer;
    font-family: var(--font-display);
    font-size: 0.95rem;
    font-weight: 780;
    letter-spacing: 0;
    line-height: 1;
    box-shadow: 0 14px 48px rgb(0 0 0 / 0.22);
    backdrop-filter: blur(14px);
    transition:
      transform 180ms var(--interaction-ease),
      border-color 180ms var(--interaction-ease),
      background-color 180ms var(--interaction-ease),
      box-shadow 180ms var(--interaction-ease);
  }

  .llm-icon {
    display: grid;
    width: 1.72rem;
    height: 1.72rem;
    place-items: center;
    border-radius: 999px;
    background: #c2dae9;
    color: #17384b;
  }

  .llm-icon svg {
    width: 1rem;
    height: 1rem;
    fill: currentColor;
  }

  .llm-trigger:hover,
  .llm-trigger:focus-visible {
    border-color: rgb(194 218 233 / 0.42);
    background:
      linear-gradient(180deg, rgb(23 52 71 / 0.94), rgb(11 23 33 / 0.86)),
      #122a39;
    transform: translateY(-1px);
    box-shadow: 0 18px 40px rgb(0 0 0 / 0.24);
    outline: 2px solid var(--ring);
    outline-offset: 2px;
  }

  @media (max-width: 900px) {
    .miguel-llm-card {
      width: fit-content;
    }
  }

  @media (max-width: 680px) {
    .llm-trigger {
      min-height: 2.45rem;
      padding-right: 0.7rem;
      font-size: 0.88rem;
    }
  }
</style>
