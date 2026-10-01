<script lang="ts">
  import { askView, askController } from '$lib/ask/state';
  import AskPanel from './AskPanel.svelte';
  import AskTide from './AskTide.svelte';
  import '$lib/ask/ask.css';
  let { floating = false } = $props<{ floating?: boolean }>();
  let left = $state(false);
</script>
{#if $askView.state !== 'idle' && $askController}
  <div class:ask-floating={floating} class:ask-docked-left={floating && left}>
  <AskPanel controller={$askController} view={$askView} />
  {#if floating}<button class="ask-dock-toggle" type="button" onclick={() => left = !left} aria-label={left ? 'Move guide to the right' : 'Move guide to the left'}>{left ? 'Move right' : 'Move left'}</button>{/if}
  <AskTide closing={$askView.state === 'closing'} />
  </div>
{/if}
