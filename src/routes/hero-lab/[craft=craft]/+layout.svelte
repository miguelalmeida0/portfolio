<script>
 import '$lib/hero-lab/lab.css';
 import '$lib/hero-lab/typographic/typographic.css';
 import '$lib/hero-lab/craft/craft.css';
 import {page} from '$app/stores';
</script>
<div data-craft={$page.params.craft} data-direction="typographic"><slot/></div>
