<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  import { site } from '$lib/content/folio';

  let popupBlocked = false;

  onMount(() => {
    const opened = window.open(site.linkedin, '_blank');

    if (opened) {
      opened.opener = null;
      window.setTimeout(() => {
        goto('/cv', { replaceState: true });
      }, 120);
      return;
    }

    popupBlocked = true;
  });
</script>

<svelte:head>
  <title>Opening LinkedIn — Miguel Almeida</title>
  <meta
    name="description"
    content="Bridge page that opens Miguel Almeida's LinkedIn profile in a new tab and keeps the CV available."
  />
</svelte:head>

<main class="page-gutter flex min-h-screen items-center justify-center py-16">
  <div class="surface-card max-w-xl rounded-[28px] px-8 py-10 text-center">
    <div class="eyebrow">Opening profile</div>
    <h1 class="mt-5 font-display text-[clamp(2.8rem,6vw,4.4rem)] leading-[0.95] tracking-[-0.05em] text-foreground">
      LinkedIn,
      <span class="not-italic text-accent"> in a new tab.</span>
    </h1>

    <p class="mt-5 text-base leading-relaxed text-foreground/76">
      {#if popupBlocked}
        Your browser blocked the automatic new tab. Use the button below and the CV stays one click away.
      {:else}
        If nothing happens in a moment, use the button below.
      {/if}
    </p>

    <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
      <a
        href={site.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        class="interactive-button button-solid inline-flex items-center gap-2 rounded-full px-5 py-3 font-sans text-[12px] font-semibold focus-visible:ring-2 focus-visible:ring-ring/45"
      >
        Open LinkedIn
      </a>

      <a
        href="/cv"
        class="interactive-button inline-flex items-center gap-2 rounded-full border border-border/60 px-5 py-3 font-sans text-[12px] font-semibold text-foreground focus-visible:ring-2 focus-visible:ring-ring/45 hover:bg-card/60"
      >
        Back to CV
      </a>
    </div>
  </div>
</main>
