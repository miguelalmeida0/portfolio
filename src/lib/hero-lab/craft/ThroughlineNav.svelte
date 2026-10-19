<script lang="ts">
 import {onMount} from 'svelte';
 import {craftLinks,type CraftPage} from './site';
 let {page='home'}:{page?:CraftPage}=$props();
 let section=$state('Introduction');
 onMount(()=>{
  const nodes=[...document.querySelectorAll('[data-craft-opening],#work,#contact')];
  const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting)section=entry.target.id==='work'?'Selected Work':entry.target.id==='contact'?'Contact':'Introduction';},{rootMargin:'-20% 0px -60% 0px'});
  nodes.forEach(node=>observer.observe(node));return()=>observer.disconnect();
 });
</script>
<nav class="reading" data-craft-nav aria-label="Main navigation">
 <a class="monogram" href="/hero-lab/throughline" aria-label="Miguel Almeida — Home">MA<span aria-hidden="true">/</span></a>
 <span class="place">{page==='home'?section:page==='story'?'The story':'Experience'}</span>
 <div class="destinations">{#each craftLinks('throughline',page) as item}<a href={item.href} aria-current={item.current?'page':undefined}>{item.label}</a>{/each}</div>
 <a class="reach" href="#contact">Contact <span aria-hidden="true">↗</span></a>
</nav>
<style>
.reading{position:fixed;bottom:0;left:0;right:0;z-index:60;background:var(--craft-paper);color:var(--craft-ink);border-top:1px solid var(--craft-rule);display:flex;align-items:center;gap:28px;padding:10px 4vw calc(10px + env(safe-area-inset-bottom));min-height:70px}.reading a{text-decoration:none;min-height:44px;display:flex;align-items:center;font-size:14px}.monogram{font:700 28px/1 var(--craft-display)!important;gap:20px}.monogram span{font:300 28px/1 var(--hero-font);opacity:.35}.place{font-size:12px;min-width:110px}.destinations{display:flex;gap:34px;margin-left:auto}.destinations a{position:relative}.destinations a[aria-current]::before{content:'';width:4px;height:4px;background:currentColor;border-radius:50%;margin-right:8px}.reach{gap:20px;margin-left:36px}.reading a:hover{text-decoration:underline;text-underline-offset:5px}
@media(max-width:800px){.reading{padding:7px 20px calc(7px + env(safe-area-inset-bottom));min-height:64px;gap:12px}.monogram{font-size:24px!important}.monogram span,.place,.reach{display:none}.destinations{gap:24px}.destinations a{font-size:13px}.destinations a[aria-current]::before{margin-right:4px}}
</style>
