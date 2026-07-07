<script lang="ts">
  import { page } from '$app/stores';
</script>

<svelte:head>
  <title>Page not found — Miguel Almeida</title>
  <meta
    name="description"
    content="The page you were looking for could not be found. Return to Miguel Almeida's portfolio."
  />
</svelte:head>

<main class="page-gutter flex min-h-screen items-center justify-center pb-24 pt-24">
  <div class="surface-card max-w-xl rounded-[28px] px-8 py-10 text-center">
    <div class="eyebrow">404 · Not found</div>
    <h1 class="mt-5 font-display text-[clamp(3rem,8vw,5rem)] leading-[0.95] tracking-[-0.05em] text-foreground">
      Wrong page.
    </h1>
    <p class="mt-5 text-lg leading-relaxed text-foreground/76">
      That route does not exist in the portfolio. The calm option is to head back home and keep reading from there.
    </p>
    <div class="mt-8">
      <a
        href="/"
        class="interactive-button button-solid inline-flex items-center gap-2 rounded-full px-5 py-3 font-mono text-[10px] uppercase tracking-[0.22em] focus-visible:ring-2 focus-visible:ring-ring/45"
      >
        Return home
      </a>
    </div>
  </div>
</main>
