<script lang="ts">
 import {hero} from '../content';
 import Portrait from './Portrait.svelte';
 import ThroughlineNav from './ThroughlineNav.svelte';
 import {labMotion} from '../runtime';
 import {throughlineMotion} from './motion';
</script>
<ThroughlineNav/>
<section class="throughline" id="top" data-craft-opening data-d1-page="throughline" data-lab-root use:labMotion={throughlineMotion} aria-labelledby="craft-title">
 <header class="byline"><a href="/hero-lab/throughline">Miguel Almeida</a><span>Berlin</span><a href="#contact">Get in touch <span aria-hidden="true">↗</span></a></header>
 <div class="portrait-axis" data-portrait-wrap><Portrait sizes="(max-width:800px) 38vw, 34vw"/></div>
 <div class="sentence" data-sentence-flow>
  <p class="hello">{hero.greeting}</p>
  <h1 id="craft-title" aria-label={hero.roleLabel}><span class="craft-clip first"><span data-sentence>Frontend</span></span><span class="craft-clip second"><span data-sentence>engineer</span></span><span class="craft-clip third"><span data-sentence>&amp; product</span></span><span class="craft-clip fourth"><span data-sentence>designer.</span></span></h1>
  <div class="sentence-proof" data-sentence-proof><p>{hero.experience}</p><p>{hero.impact}</p><p class="sentence-stack">{hero.stackLine}</p><a class="craft-action" data-craft-cv href="/hero-lab/throughline/cv">{hero.cv.label}<span aria-hidden="true">↗</span></a></div>
 </div>
 <a class="continue" href="#work"><span>Selected Work</span><span aria-hidden="true">↓</span><span class="through-rule" data-through-rule aria-hidden="true"></span></a>
</section>
<style>
.throughline{background:var(--craft-deep);color:var(--craft-paper);min-height:830px;height:calc(100svh - 70px);padding:0 5vw;overflow:clip}.byline{display:flex;gap:20px;align-items:center;height:84px;border-bottom:1px solid rgba(230,237,188,.3);position:relative;z-index:4;font-size:14px}.byline a{text-decoration:none;min-height:44px;display:flex;align-items:center}.byline>a:first-child{font-weight:650}.byline>span{font-size:12px}.byline>a:last-child{margin-left:auto;gap:24px;font-size:12px}.portrait-axis{position:absolute;left:3vw;bottom:60px;width:37vw;height:calc(100% - 170px);z-index:1;opacity:.95}.sentence{margin-left:33%;position:relative;z-index:2;padding:35px 0 110px}.hello{font-size:14px;margin:0 0 24px 4px}.sentence h1{font:700 clamp(90px,7.8vw,170px)/1.03 var(--craft-display);letter-spacing:-.04em}.sentence h1 [data-sentence]{display:block}.first{margin-left:0}.second{margin-left:16%}.third{margin-left:0}.fourth{margin-left:27%}.sentence-proof{display:grid;grid-template-columns:1fr 1fr;gap:16px 36px;margin:24px 0 0 27%;font-size:13px;line-height:1.6}.sentence-proof p{margin:0}.sentence-proof .sentence-stack{grid-column:1/-1;font-size:12px}.sentence-proof .craft-action{grid-column:1/-1;width:100%;margin-top:0;font-size:15px;min-height:44px}.continue{position:absolute;bottom:24px;left:5vw;right:70%;display:flex;justify-content:space-between;align-items:center;min-height:44px;text-decoration:none;font-size:12px;z-index:3}.through-rule{position:absolute;top:0;left:0;right:0;height:1px;background:rgba(230,237,188,.5)}
@media(max-width:1100px) and (min-width:801px){.throughline{min-height:900px}.sentence-proof{margin-left:14%;gap:12px 20px}.sentence h1{font-size:9.5vw}.portrait-axis{width:41vw;left:0}}
@media(max-width:800px){.throughline{padding:0 22px;min-height:860px;height:auto;display:grid;grid-template-columns:38% 62%;align-content:start;padding-bottom:90px}.byline{grid-column:1/-1;height:70px;font-size:13px}.byline>a:last-child{display:none}.byline>span{margin-left:auto}.portrait-axis{position:relative;inset:auto;grid-column:1;grid-row:3;height:280px;width:135%;margin-left:-20px;align-self:start;margin-top:0}.sentence{display:contents}.hello{grid-column:1/-1;margin:22px 0 0;font-size:13px;grid-row:2;align-self:start;z-index:3;padding-bottom:20px}.sentence h1{grid-column:2;grid-row:3;font-size:clamp(47px,12vw,80px);margin-top:20px;line-height:1.2;position:relative;z-index:3;letter-spacing:-.025em}.first,.second,.third,.fourth{margin-left:0}.third{margin-left:-55%;margin-top:42px}.fourth{margin-left:-25%}.sentence-proof{grid-column:1/-1;margin:30px 0 0;gap:16px 26px;font-size:14px}.sentence-proof .sentence-stack{font-size:12px}.sentence-proof .craft-action{margin-top:8px}.continue{bottom:22px;left:22px;right:22px}.throughline{min-height:700px}}
</style>
