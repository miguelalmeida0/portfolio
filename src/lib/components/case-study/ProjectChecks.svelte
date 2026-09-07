<script lang="ts">
  import { projectChecks } from '$lib/content/project-checks';
  export let slug: string;
  $: check = projectChecks[slug];
</script>

{#if check}
  <section id="evidence" class="checks" aria-label="Engineering evidence">
    <div><span class="status">{check.status}</span><strong>{check.value}</strong><h2>{check.label}</h2></div>
    <div class="method"><p>{check.description}</p><a href={check.source}>Read conditions & source record →</a></div>
  </section>
{/if}

<style>
  .checks { width: 100%; margin: 32px auto; display: grid; grid-template-columns: 0.7fr 1.3fr; gap: 32px; padding: clamp(24px, 3vw, 40px); border: 1px solid rgb(244 234 220 / 0.18); background: #10100e; border-radius: 8px; scroll-margin-top: 100px; }
  .status { display: block; font-size: 12px; color: var(--accent); margin-bottom: 20px; }
  strong { font-size: clamp(32px, 3vw, 44px); font-weight: 500; letter-spacing: -0.045em; }
  h2 { margin: 8px 0 0; font-size: 14px; font-weight: 500; }
  .method { align-self: center; }
  p { max-width: 65ch; margin: 0; font-size: 14px; line-height: 1.65; color: rgb(244 234 220 / 0.68); }
  a { display: inline-flex; align-items: center; min-height: 44px; margin-top: 12px; color: var(--accent); font-size: 12px; }
  a:focus-visible { outline: 2px solid var(--ring); outline-offset: 3px; }
  @media (max-width: 640px) { .checks { grid-template-columns: 1fr; gap: 20px; } }
</style>
