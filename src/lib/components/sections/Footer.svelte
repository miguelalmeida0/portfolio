<script lang="ts">
  import { tokens } from '$lib/design/tokens';

  export let name: string;
  export let note: string;

  const year = new Date().getFullYear();
</script>

<footer class={tokens.layout.footer}>
  <p class={tokens.typography.footer}>
    {year} {name}.{#if note} {note}{/if}
  </p>
  <p class={tokens.typography.footer}>From Berlin, with care.</p>
</footer>
