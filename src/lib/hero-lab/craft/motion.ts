import { opening } from '../typographic/pages/motion';
import type {LabSetup} from '../runtime';

/** Shared lifecycle belongs to labMotion; these are deliberately distinct authored timelines. */
export const counterformMotion: LabSetup=(root,{compact},{gsap})=>{
 if(import.meta.env.DEV || import.meta.env.VITE_CANON_PREVIEW === "1")(window as unknown as {__CANON_GSAP__:typeof gsap}).__CANON_GSAP__=gsap;
 const q=gsap.utils.selector(root);
 const intro=opening(root,gsap);
 intro.timeline.vars.defaults={...intro.timeline.vars.defaults,ease:"power3.out"};
 intro.timeline
  .from(q('[data-frame-top]'),{xPercent:compact?-12:-22,duration:1.25},0)
  .from(q('[data-craft-portrait]'),{y:compact?32:64,duration:1.1},.08)
  .from(q('[data-frame-bottom]'),{xPercent:compact?12:20,duration:1.25},.22)
  .from(q('[data-proof]'),{y:16,opacity:0,stagger:.08,duration:.55},.28);
 gsap.timeline({scrollTrigger:{trigger:root,start:'top top',end:'bottom top',scrub:.35},defaults:{ease:'none'}})
  .to(q('[data-frame-top]'),{xPercent:-8,duration:1},0)
  .to(q('[data-frame-bottom]'),{xPercent:6,duration:1},0)
  .to(q('[data-portrait-wrap]'),{y:compact?18:48,duration:1},0);
 return intro.dispose;
};
export const bearingMotion: LabSetup=(root,{compact},{gsap})=>{
 if(import.meta.env.DEV || import.meta.env.VITE_CANON_PREVIEW === "1")(window as unknown as {__CANON_GSAP__:typeof gsap}).__CANON_GSAP__=gsap;
 const q=gsap.utils.selector(root);
 const intro=opening(root,gsap);
 intro.timeline.vars.defaults={...intro.timeline.vars.defaults,ease:"power3.inOut"};
 intro.timeline
  .from(q('[data-bearing-rule]'),{scaleX:0,transformOrigin:'left',duration:.8},0)
  .from(q('[data-bearing-word]'),{x:(i:number)=>i%2?(compact?12:34):(compact?-10:-28),duration:.9,stagger:.1},.08)
  .from(q('[data-craft-portrait]'),{x:compact?18:65,duration:1.1},.15)
  .from(q('[data-career-link]'),{y:18,opacity:0,duration:.55,stagger:.1},.5);
 gsap.timeline({scrollTrigger:{trigger:root,start:'top top',end:'bottom top',scrub:.25},defaults:{ease:'none'}})
  .to(q('[data-bearing-title]'),{y:compact?-18:-65,duration:1},0)
  .to(q('[data-portrait-wrap]'),{y:compact?14:32,duration:1},0)
  .fromTo(q('[data-career-rule]'),{scaleX:.15},{scaleX:1,transformOrigin:'left',duration:.5,immediateRender:false},0);
 return intro.dispose;
};
export const throughlineMotion: LabSetup=(root,{compact},{gsap})=>{
 if(import.meta.env.DEV || import.meta.env.VITE_CANON_PREVIEW === "1")(window as unknown as {__CANON_GSAP__:typeof gsap}).__CANON_GSAP__=gsap;
 const q=gsap.utils.selector(root);
 const intro=opening(root,gsap);
 intro.timeline.vars.defaults={...intro.timeline.vars.defaults,ease:"power4.out"};
 intro.timeline
  .from(q('[data-sentence]'),{yPercent:105,duration:1.05,stagger:.12},.02)
  .from(q('[data-craft-portrait]'),{y:compact?35:75,scale:.94,transformOrigin:'center bottom',duration:1.3},.1)
  .from(q('[data-sentence-proof]'),{x:24,opacity:0,duration:.7},.5);
 gsap.timeline({scrollTrigger:{trigger:root,start:'top top',end:'bottom top',scrub:.4},defaults:{ease:'none'}})
  .to(q('[data-sentence-flow]'),{y:compact?-30:-100,duration:1},0)
  .to(q('[data-portrait-wrap]'),{y:compact?12:60,duration:1},0)
  .to(q('[data-through-rule]'),{scaleX:.35,transformOrigin:'left',duration:1},0);
 return intro.dispose;
};
