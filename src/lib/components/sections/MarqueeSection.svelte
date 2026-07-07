<script lang="ts">
  import { tokens } from '$lib/design/tokens';

  export let items: string[];

  const repeatedItems = [...items, ...items, ...items];
</script>

<section class={tokens.patterns.marqueeShell} aria-label="Journal topics">
  <div class={tokens.patterns.marqueeTrack}>
    {#each repeatedItems as item, index}
      <span class={tokens.patterns.marqueeItem}>
        <span>{item}</span>
        <span aria-hidden="true">✦</span>
      </span>
    {/each}
  </div>
</section>
