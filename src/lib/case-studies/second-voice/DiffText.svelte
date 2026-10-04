<script>
import {renderOps} from './diff'; let {ops}=$props();
</script>
{#each renderOps(ops) as token}<span class={token.classes} style:--n={token.index}>{#if token.space}<i class="sp">{' '}</i>{/if}<b>{token.word}</b></span>{/each}
