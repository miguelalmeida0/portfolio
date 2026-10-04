<script>
let {items,value,onchange}=$props(); function key(e,i){const d=['ArrowRight','ArrowDown'].includes(e.key)?1:['ArrowLeft','ArrowUp'].includes(e.key)?-1:0;if(!d)return;e.preventDefault();const n=(i+d+items.length)%items.length;onchange(items[n].id);e.currentTarget.parentElement.querySelectorAll('button')[n].focus();}
</script>
{#each items as item,i}<button type="button" role="radio" data-id={item.id} aria-checked={value===item.id} tabindex={value===item.id?0:-1} onclick={()=>onchange(item.id)} onkeydown={e=>key(e,i)}>{item.name}</button>{/each}
