<script lang="ts">
 import {craftLinks,type CraftPage} from './site';
 let {page='home'}:{page?:CraftPage}=$props();
</script>
<header class="mast" data-craft-nav>
 <a class="name" href="/hero-lab/bearing" aria-label="Miguel Almeida — Home">Miguel Almeida<span>Berlin</span></a>
 <nav aria-label="Main navigation">{#each craftLinks('bearing',page) as item}<a href={item.href} aria-current={item.current?'page':undefined}>{item.label}</a>{/each}</nav>
 <a class="reach" href="#contact">Get in touch <span aria-hidden="true">↗</span></a>
</header>
<style>
.mast{height:84px;padding:0 5vw;display:flex;align-items:center;gap:48px;border-bottom:1px solid var(--craft-rule);background:var(--craft-paper);position:relative;z-index:40}.name{font-weight:700;text-decoration:none;font-size:17px}.name span{font-weight:400;margin-left:20px;font-size:12px}nav{display:flex;gap:30px;margin-left:auto}nav a,.reach{display:flex;align-items:center;min-height:44px;text-decoration:none;font-size:14px;position:relative}nav a::after{content:'';position:absolute;bottom:5px;left:0;right:0;height:2px;background:currentColor;transform:scaleX(0);transform-origin:left;transition:transform .25s}nav a:hover::after,nav a[aria-current]::after{transform:scaleX(1)}.reach{gap:18px}
@media(max-width:800px){.mast{height:112px;padding:16px 22px 8px;flex-wrap:wrap;gap:4px 16px}.name{width:100%;display:flex;justify-content:space-between}.name span{margin:0}nav{margin:0;gap:26px}.reach{display:none}nav a{font-size:14px}}
</style>
