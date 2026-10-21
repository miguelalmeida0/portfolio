<script lang="ts">
  import { renderActionLabel } from './action-label';
  let { label }: { label: string } = $props();
</script>
{@html renderActionLabel(label)}
