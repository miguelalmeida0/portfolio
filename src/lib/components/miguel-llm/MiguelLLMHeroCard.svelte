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
    aria-label="Open portfolio guide"
    on:click={() => openDrawer()}
  >
    <span id="miguel-llm-title">Portfolio guide</span>
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
      transform var(--interaction-duration) var(--interaction-ease),
      background-color var(--interaction-duration) var(--interaction-ease),
      box-shadow var(--interaction-duration) var(--interaction-ease);
  }

  .llm-trigger:hover {
    background:
      linear-gradient(180deg, rgb(23 52 71 / 0.94), rgb(11 23 33 / 0.86)),
      #122a39;
    transform: translateY(-1px);
    box-shadow: 0 18px 40px rgb(0 0 0 / 0.24);
  }

  .llm-trigger:focus-visible {
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
