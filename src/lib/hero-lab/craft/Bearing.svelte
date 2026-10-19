<script lang="ts">
 import {hero} from '../content';
 import {storyOpening} from '../typographic/pages/story-opening';
 import Portrait from './Portrait.svelte';
 import BearingNav from './BearingNav.svelte';
 import {labMotion} from '../runtime';
 import {bearingMotion} from './motion';
</script>
<BearingNav/>
<section class="bearing" id="top" data-craft-opening data-d1-page="bearing" data-lab-root use:labMotion={bearingMotion} aria-labelledby="craft-title">
 <div class="heading" data-bearing-title>
  <p class="hello">{hero.greeting}</p>
  <h1 id="craft-title" aria-label={hero.roleLabel}><span class="craft-clip"><span data-bearing-word>FRONTEND</span></span><span class="craft-clip"><span data-bearing-word>ENGINEER</span></span><span class="small-line craft-clip"><span data-bearing-word>&amp; PRODUCT DESIGNER.</span></span></h1>
  <div class="proof craft-proof"><p>{hero.experience}</p><p>{hero.stackLine}</p><p class="mobile-impact">{hero.impact}</p></div>
  <a class="craft-action" data-craft-cv href="/hero-lab/bearing/cv">{hero.cv.label}<span aria-hidden="true">↗</span></a>
 </div>
 <figure class="portrait-column" data-portrait-wrap><Portrait sizes="(max-width:800px) 42vw, 40vw"/><figcaption>{hero.impact}</figcaption></figure>
 <span class="bearing-rule" data-bearing-rule aria-hidden="true"></span>
 <nav class="career" aria-label="Explore my career">
  <div class="career-heading"><span>My path</span><a href="/hero-lab/bearing/story">Read the story <span aria-hidden="true">↗</span></a></div>
  <div class="career-links">{#each storyOpening.chapters as chapter,i}<a data-career-link href={`/hero-lab/bearing/story?chapter=${i}#journey-step-${i}`}><span class="period">{chapter.period}</span><strong>{chapter.title}</strong><span aria-hidden="true">↗</span></a>{/each}</div>
  <span class="career-rule" data-career-rule aria-hidden="true"></span>
 </nav>
</section>
<style>
.mobile-impact{display:none}@media(max-width:800px){.proof .mobile-impact{display:block;grid-column:1/-1;font-size:13px;margin:0}}
.bearing{padding:42px 5vw 0;min-height:calc(100svh - 84px);display:grid;grid-template-columns:1.1fr .9fr;column-gap:6vw;overflow:clip}.hello{font-size:15px;margin:0 0 26px}.heading{position:relative;z-index:3;padding-bottom:48px}h1{font-family:var(--craft-display);font-size:clamp(80px,10.2vw,190px);line-height:1.06;letter-spacing:-.03em}h1 [data-bearing-word]{display:block}h1 .craft-clip{overflow:visible}.small-line{font-size:clamp(28px,3.6vw,64px);letter-spacing:-.01em;margin-top:10px}.proof{margin-top:38px;display:grid;grid-template-columns:1fr 1fr;gap:28px;max-width:610px}.proof p:first-child{font-weight:650}.proof p+p{margin:0;font-size:14px}.heading>.craft-action{width:205px;margin-top:24px}.portrait-column{position:relative;margin:0;align-self:end;height:600px;max-height:65vh;display:flex;flex-direction:column;justify-content:end}.portrait-column :global(.portrait){height:calc(100% - 65px);width:100%}figcaption{border-top:1px solid var(--craft-rule);padding:15px 0;font-size:13px;line-height:1.5;max-width:320px;position:relative;z-index:2}.bearing-rule{grid-column:1/-1;display:block;height:1px;background:var(--craft-ink)}.career{grid-column:1/-1;padding:22px 0 32px;position:relative}.career-heading{display:flex;justify-content:space-between;align-items:center;font-size:12px;margin-bottom:22px}.career-heading a{display:flex;align-items:center;gap:24px;min-height:28px;text-decoration:none}.career-links{display:grid;grid-template-columns:repeat(3,1fr)}.career-links a{position:relative;min-height:75px;display:grid;grid-template-columns:1fr auto;align-items:center;gap:8px;padding-right:32px;text-decoration:none}.career-links a+a{border-left:1px solid var(--craft-rule);padding-left:32px}.period{grid-column:1/-1;font-size:12px}.career-links strong{font:500 34px/1.1 var(--hero-font);letter-spacing:-.035em}.career-links a>span:last-child{font-size:24px;transition:transform .25s}.career-links a:hover>span:last-child{transform:translate(3px,-3px)}.career-rule{position:absolute;bottom:0;left:0;right:0;height:3px;background:var(--craft-ink)}
@media(max-width:1100px) and (min-width:801px){.bearing{column-gap:2vw}h1{font-size:10vw}.proof{display:block}.proof p+p{margin-top:12px}.portrait-column{height:580px}}
@media(max-width:800px){.bearing{padding:28px 22px 0;min-height:0;grid-template-columns:1.1fr .9fr;column-gap:0}.hello{font-size:13px;margin-bottom:22px;white-space:nowrap}.heading{display:contents}h1{grid-column:1;grid-row:2;font-size:clamp(40px,10.8vw,75px);line-height:1.18;position:relative;z-index:3;align-self:center}.hello{grid-column:1/-1}.small-line{font-size:clamp(19px,5vw,32px);line-height:1.3;max-width:9ch;margin-top:10px}.portrait-column{grid-column:2;grid-row:2;margin:0;height:270px;max-height:none;width:125%;margin-left:-12%;align-self:end}.portrait-column :global(.portrait){height:100%}figcaption{display:none}.proof{grid-column:1/-1;margin-top:26px;gap:20px;font-size:14px;max-width:none}.proof p+p{font-size:12px;line-height:1.6}.heading>.craft-action{grid-column:1/-1;width:100%;margin:20px 0 24px}.career{padding-top:20px;padding-bottom:12px}.career-heading{margin-bottom:5px}.career-links{display:block}.career-links a,.career-links a+a{border-left:0;border-bottom:1px solid var(--craft-rule);padding:13px 0;min-height:72px;grid-template-columns:1fr 1fr 20px;gap:14px}.period{grid-column:auto;font-size:11px}.career-links strong{font-size:24px}.career-links a>span:last-child{font-size:20px}.career-links a:last-child{border-bottom:0}}
</style>
