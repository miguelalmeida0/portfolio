<script lang="ts">
 import {hero} from '../content';
 import Portrait from './Portrait.svelte';
 import CounterformNav from './CounterformNav.svelte';
 import {labMotion} from '../runtime';
 import {counterformMotion} from './motion';
</script>
<CounterformNav/>
<section class="frame" id="top" data-craft-opening data-d1-page="counterform" data-lab-root use:labMotion={counterformMotion} aria-labelledby="craft-title">
 <div class="topline"><p>{hero.greeting}</p><span>Frontend engineering &amp; product design</span></div>
 <h1 id="craft-title" aria-label={hero.roleLabel}>
  <span class="top-type" data-frame-top aria-hidden="true">FRONTEND<br class="mobile-break"/> ENGINEER</span>
  <span class="bottom-type" data-frame-bottom aria-hidden="true"><span>&amp; PRODUCT</span><span>DESIGNER.</span></span>
 </h1>
 <div class="portrait-window" data-portrait-wrap><Portrait sizes="(max-width:800px) 72vw, 38vw"/></div>
 <div class="left-proof craft-proof" data-proof><p>{hero.experience}</p><p>{hero.stackLine}</p></div>
 <div class="right-proof craft-proof" data-proof><p>{hero.impact}</p><a class="craft-action" data-craft-cv href="/hero-lab/counterform/cv">{hero.cv.label}<span aria-hidden="true">↗</span></a></div>
 <a class="frame-work" href="#work">Selected Work <span aria-hidden="true">↓</span></a>
</section>
<style>
.frame{margin-left:168px;min-height:900px;height:100svh;overflow:clip;padding:34px 4.5vw 0;position:relative;background:var(--craft-paper)}.topline{display:flex;justify-content:space-between;align-items:center;font-size:14px;position:relative;z-index:4}.topline p{margin:0}.topline>span{font-size:12px}.top-type{position:absolute;top:112px;left:4.5vw;right:4.5vw;z-index:3;font:700 clamp(74px,8.25vw,160px)/1.02 var(--craft-display);letter-spacing:-.04em;white-space:nowrap;border-top:1px solid var(--craft-rule);padding-top:24px}h1{font-family:var(--craft-display)}.mobile-break{display:none}.portrait-window{position:absolute;left:27%;right:19%;top:240px;bottom:190px;z-index:1}.bottom-type{position:absolute;left:4.5vw;right:4.5vw;bottom:95px;display:flex;gap:.2em;justify-content:center;align-items:end;z-index:3;font:700 clamp(48px,5.7vw,100px)/1.1 var(--craft-display);letter-spacing:-.03em;pointer-events:none}.bottom-type span:first-child{max-width:none;white-space:nowrap}.bottom-type span:last-child{writing-mode:horizontal-tb;font-size:clamp(48px,5.7vw,100px);line-height:1}.left-proof{position:absolute;left:4.5vw;top:39%;max-width:200px;z-index:4}.left-proof p:first-child{font-weight:650}.left-proof p+p{font-size:13px;max-width:16ch;line-height:1.7}.right-proof{position:absolute;right:4.5vw;top:36%;max-width:180px;z-index:4}.right-proof p{font-size:14px}.right-proof a{width:100%;margin-top:20px}.frame-work{position:absolute;bottom:26px;left:4.5vw;right:4.5vw;display:flex;justify-content:space-between;align-items:center;min-height:48px;border-top:1px solid var(--craft-rule);font-size:13px;text-decoration:none}
@media(min-width:1800px){.frame{height:1050px}}
@media(max-width:1100px) and (min-width:801px){.left-proof{max-width:150px}.right-proof{max-width:145px}.portrait-window{left:25%;right:15%;top:250px}.bottom-type{font-size:55px}.topline>span{display:none}.top-type{font-size:7.5vw}}
@media(max-width:800px){.frame{margin-left:0;min-height:850px;height:auto;padding:132px 20px 0;display:grid;grid-template-columns:1fr 1fr;gap:0 24px}.topline{grid-column:1/-1;font-size:14px}.topline>span{display:none}h1{display:contents;font-family:var(--craft-display)}.top-type{position:relative;inset:auto;grid-column:1/-1;font-size:clamp(54px,14.7vw,110px);line-height:1.05;letter-spacing:-.025em;margin-top:16px;padding-top:16px}.mobile-break{display:block}.left-proof{position:relative;inset:auto;grid-column:1;margin-top:20px;max-width:100%;font-size:13px}.left-proof p+p{font-size:11px;max-width:none;margin-top:12px}.right-proof{position:relative;inset:auto;grid-column:2;max-width:none;margin-top:20px}.right-proof p{font-size:12px;margin-bottom:12px}.right-proof a{margin:0;font-size:15px}.portrait-window{position:relative;inset:auto;grid-column:1/-1;height:340px;width:78%;margin:0 auto;border-bottom:1px solid var(--craft-rule)}.bottom-type{position:relative;inset:auto;grid-column:1/-1;display:flex;gap:10px;justify-content:space-between;align-items:center;font-size:clamp(28px,7.3vw,54px);margin:16px 0 8px}.bottom-type span:first-child{max-width:none;white-space:nowrap}.bottom-type span:last-child{writing-mode:horizontal-tb;transform:none;font-size:inherit}.frame-work{position:relative;inset:auto;grid-column:1/-1;font-size:12px;margin-top:8px}}
@media(max-width:800px){.topline{grid-row:1}.top-type{grid-row:2}.left-proof,.right-proof{grid-row:3}.portrait-window{grid-row:4}.bottom-type{grid-row:5}.frame-work{grid-row:6}}
</style>
