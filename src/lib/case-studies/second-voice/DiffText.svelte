<script>
import {renderOps,accessibleDiff} from './diff'; let {ops,mode='marked'}=$props();
</script>
{#each renderOps(ops) as token}<span aria-hidden="true" class={token.classes} style:--n={token.index}>{#if token.space}<i class="sp">{' '}</i>{/if}<b>{token.word}</b></span>{/each}

<span class="diff-accessible">{accessibleDiff(ops,mode)}</span>
<style>
.diff-accessible { position:absolute !important; width:1px !important; height:1px !important; padding:0 !important; margin:-1px !important; overflow:hidden !important; clip-path:inset(50%) !important; white-space:normal !important; border:0 !important; }
</style>
