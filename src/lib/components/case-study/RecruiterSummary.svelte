<script lang="ts">
  import { onMount } from 'svelte';
  import type { RecruiterBrief } from '$lib/content/recruiter-briefs';
  export let brief: RecruiterBrief;
  export let compact = false;
  let expanded = false;
  onMount(() => { expanded = !compact && window.matchMedia('(min-width: 761px)').matches; });
</script>

<section class="recruiter-summary" class:compact aria-label="Project at a glance">
  <div class="summary-label">At a glance</div>
  <div class="summary-main">
    <div><h2>My ownership</h2><p>{brief.ownership}</p></div>
    <div><h2>Result</h2><p>{brief.result}</p></div>
  </div>
  <details bind:open={expanded}>
    <summary>Problem & key decision</summary>
    <div class="summary-detail">
      <div><h3>The problem</h3><p>{brief.problem}</p></div>
      <div><h3>Key decision</h3><p>{brief.decision}</p></div>
    </div>
  </details>
  <div class="proof"><a href={brief.proof.href}>{brief.proof.label} →</a><span>{brief.proof.note}</span></div>
</section>

<style>
  .recruiter-summary { width: 100%; margin: 32px auto 0; padding: 24px 0; border-block: 1px solid rgb(244 234 220 / 0.16); }
  .compact { margin-top: 1.5rem; padding-block: 1.25rem 0; border-bottom: 0; }
  .compact .summary-main, .compact .summary-detail { grid-template-columns: 1fr; gap: 1rem; }
  .compact .summary-label { display: none; }
  .compact .proof { display: grid; gap: 0.25rem; }
  .summary-label { color: var(--accent); font-size: var(--text-label); margin-bottom: 18px; }
  .summary-main, .summary-detail { display: grid; grid-template-columns: 1fr 1fr; gap: 24px 48px; }
  h2, h3 { margin: 0 0 8px; font-size: var(--text-label); font-weight: 600; color: rgb(244 234 220 / 0.56); }
  p { margin: 0; max-width: 58ch; font-size: 15px; line-height: 1.55; }
  details { margin-top: 12px; }
  summary { cursor: pointer; width: fit-content; padding: 12px 0; font-size: var(--text-label); color: rgb(244 234 220 / 0.75); }
  .summary-detail { padding-block: 8px 20px; }
  .proof { display: flex; flex-wrap: wrap; gap: 8px 20px; align-items: baseline; margin-top: 10px; font-size: var(--text-label); }
  .proof a { min-height: 32px; display: inline-flex; align-items: center; color: var(--accent); font-weight: 600; }
  .proof span { color: rgb(244 234 220 / 0.55); }
  a:focus-visible, summary:focus-visible { outline: 2px solid var(--ring); outline-offset: 4px; }
  @media (max-width: 640px) { .summary-main, .summary-detail { grid-template-columns: 1fr; gap: 18px; } .recruiter-summary { padding-block: 20px; margin-top: 24px; } p { font-size: var(--text-small); } .proof { display: grid; gap: 0; } }
</style>
