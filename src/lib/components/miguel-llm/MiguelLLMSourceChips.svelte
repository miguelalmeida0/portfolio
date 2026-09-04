<script lang="ts">
  export let sources: string[] = [];
</script>

{#if sources.length}
  <ul class="source-chips" aria-label="Answer sources">
    {#each sources as source}
      {@const [label, href] = source.split('|')}
      <li>
        {#if href}
          <a href={href}>{label} →</a>
        {:else}
          <span>{label}</span>
        {/if}
      </li>
    {/each}
  </ul>
{/if}

<style>
  .source-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .source-chips li {
    display: contents;
  }

  .source-chips a,
  .source-chips span {
    display: inline-flex;
    min-height: 2.35rem;
    align-items: center;
    border: 1px solid rgb(194 218 233 / 0.14);
    border-radius: 999px;
    background: rgb(194 218 233 / 0.07);
    padding: 0.36rem 0.52rem;
    color: rgb(241 248 252 / 0.7);
    font-family: var(--font-display);
    font-size: 0.78rem;
    font-weight: 540;
    letter-spacing: 0;
    line-height: 1.1;
    text-transform: none;
  }

  .source-chips a:hover,
  .source-chips a:focus-visible {
    border-color: var(--llm-accent);
    color: var(--llm-ink);
    outline: none;
  }

  .source-chips a:focus-visible {
    box-shadow: 0 0 0 2px var(--llm-ring);
  }
</style>
