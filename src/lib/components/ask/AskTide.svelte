<script lang="ts">
  let { closing }: { closing: boolean } = $props();
  function portal(node: HTMLElement) { document.body.append(node); return { destroy() { node.remove(); } }; }
</script>
<div use:portal class="ask-effects" aria-hidden="true">
  <div class="ask-tide" class:is-in={!closing} class:is-out={closing}></div>
  <div class="ask-halo"></div>
  <div class="ask-chip"><span data-chip-question></span><span class="action">Click to ask</span></div>
</div>
