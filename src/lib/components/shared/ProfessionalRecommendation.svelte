<script lang="ts">
  import { professionalRecommendation as recommendation } from '$lib/content/folio';
</script>

<figure class="recommendation" aria-label="Professional recommendation">
  <figcaption><span>From a previous team lead</span><strong>{recommendation.name}</strong></figcaption>
  <blockquote>“{recommendation.quote}”</blockquote>
  <details>
    <summary>More from Richard</summary>
    <p>“{recommendation.additionalQuote}”</p>
  </details>
</figure>

<style>
  .recommendation { margin: 0; padding: clamp(24px, 4vw, 48px) 0; border-block: 1px solid rgb(244 234 220 / 0.16); }
  figcaption { display: flex; flex-wrap: wrap; gap: 8px 20px; align-items: baseline; margin-bottom: 20px; font-size: 13px; }
  figcaption span { color: var(--accent); }
  figcaption strong { font-weight: 600; }
  blockquote { max-width: 65ch; margin: 0; color: var(--foreground); font-family: var(--font-serif); font-size: var(--text-card); line-height: 1.55; letter-spacing: -0.025em; }
  details { margin-top: 20px; max-width: 740px; color: rgb(244 234 220 / 0.68); font-size: 14px; line-height: 1.65; }
  summary { width: fit-content; cursor: pointer; padding-block: 8px; }
  summary:focus-visible { outline: 2px solid var(--ring); outline-offset: 4px; }
  p { margin: 12px 0 0; }
</style>
