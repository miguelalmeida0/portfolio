<script lang="ts">
  import {craftLinks, type CraftPage} from './site';
  let {page='home'}:{page?:CraftPage}=$props();
</script>
<header class="rail" data-craft-nav>
  <a class="identity" href="/hero-lab/counterform" aria-label="Miguel Almeida — Home">MIGUEL<br/> ALMEIDA<span>Berlin</span></a>
  <nav aria-label="Main navigation">
    {#each craftLinks('counterform',page) as item,i}<a href={item.href} aria-current={item.current?'page':undefined}><span class="number" aria-hidden="true">0{i+1}</span>{item.label}<span class="indicator" aria-hidden="true">↗</span></a>{/each}
  </nav>
  <a class="reach" href="#contact">Get in touch <span aria-hidden="true">↗</span></a>
</header>
<style>
.rail{position:fixed;z-index:50;top:0;bottom:0;left:0;width:168px;padding:32px 22px;background:var(--craft-paper);color:var(--craft-ink);border-right:1px solid var(--craft-rule);display:flex;flex-direction:column;}
.identity{font:700 26px/.98 var(--craft-display);text-decoration:none;letter-spacing:-.03em;}.identity span{display:block;font:400 13px/1.5 var(--hero-font);margin-top:12px;letter-spacing:0}nav{display:grid;gap:6px;margin-top:clamp(70px,17vh,180px)}nav a{display:flex;align-items:center;gap:8px;min-height:48px;text-decoration:none;border-bottom:1px solid transparent;font-size:15px;}.number{font-size:10px;opacity:.6}.indicator{margin-left:auto;opacity:0;transform:translate(-4px,4px);transition:opacity .2s,transform .2s}nav a:hover .indicator,nav a[aria-current] .indicator{opacity:1;transform:none}nav a[aria-current]{border-color:currentColor}.reach{margin-top:auto;font-size:13px;display:flex;justify-content:space-between;align-items:center;min-height:48px;text-decoration:none}
@media(max-width:800px){.rail{width:auto;right:0;bottom:auto;padding:16px 20px 8px;border-right:0;border-bottom:1px solid var(--craft-rule)}.identity{font-size:22px;display:flex;gap:5px;align-items:baseline}.identity br{display:none}.identity span{margin:0 0 0 auto;font-size:12px}nav{display:flex;justify-content:space-between;margin-top:8px;gap:14px}nav a{font-size:14px;min-height:44px;gap:5px}.indicator,.reach{display:none}.number{font-size:9px}}
</style>
