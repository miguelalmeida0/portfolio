<script lang="ts">
  export let error = '';
</script>

{#if error}
  <div class="status" aria-live="polite">
    <span class="status-error">{error}</span>
  </div>
{/if}

<style>
  .status {
    min-height: 0;
    color: var(--llm-muted, rgb(216 234 244 / 0.68));
    font-family: var(--font-display);
    font-size: 0.78rem;
    font-weight: 500;
    letter-spacing: 0;
    line-height: 1.35;
    text-transform: none;
  }

  .status-error {
    color: #f0a8b8;
  }
</style>
