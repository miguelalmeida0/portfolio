import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';

// This runs only in the separate diagnostic copy of the homepage.
function startMotionDiagnostics(build){
 const errors=[],observations=[],samples=[];
 let nativeFrameResponded=false;
 const recordError=message=>{if(errors.length<12)errors.push(String(message).slice(0,500));};
 addEventListener('error',event=>recordError(`${event.message} (line ${event.lineno}, column ${event.colno})`));
 addEventListener('unhandledrejection',event=>recordError(event.reason?.message||event.reason));
 const NativeObserver=window.IntersectionObserver;
 if(NativeObserver){
  let sequence=0;
  window.IntersectionObserver=class extends NativeObserver{
   constructor(callback,options){
    const observerId=++sequence;
    super((entries,observer)=>{
     for(const entry of entries){
      if(!entry.target.classList.contains('project-scene'))continue;
      observations.push({observer:observerId,project:entry.target.closest('.project')?.id,ratio:entry.intersectionRatio,intersecting:entry.isIntersecting});
      if(observations.length>32)observations.shift();
     }
     callback.call(observer,entries,observer);
    },options);
   }
  };
 }
 const storageFlag=key=>{try{return sessionStorage.getItem(key)==='true';}catch{return 'unavailable';}};
 const renderSelectors={needle:['.nd-query','.nd-field','.nd-gallery','.nd-focus','.nd-details'],f24:['.rule-typed','.rule-preview','.rule-error','.rule-success','.save-copy'],'second-voice':['.sv-result>span','.sv-transfer'],leu:['.leu-room','.leu-rain i']};
 const renderingValues=(scene,computed=false)=>(renderSelectors[scene.closest('.project')?.id]||[]).map(selector=>{
  const element=scene.querySelector(selector);if(!element)return{selector,missing:true};
  const style=computed?getComputedStyle(element):element.style;
  return{selector,transform:style.transform,opacity:style.opacity,display:style.display,filmTransform:style.getPropertyValue('--film-transform'),text:element.matches('.rule-typed,.save-copy')?element.textContent:undefined};
 });
 const capture=phase=>{
  const snapshot={
   phase,elapsedMs:Math.round(performance.now()),visibility:document.visibilityState,
   viewport:{width:innerWidth,height:innerHeight},
   mobile:matchMedia('(max-width:767px)').matches,reducedMotion:matchMedia('(prefers-reduced-motion:reduce)').matches,
   savedPause:storageFlag('portfolio-previews-paused'),fullMotionChoice:storageFlag('portfolio-previews-motion-allowed'),
   dependencies:{gsap:!!window.gsap,scrollTrigger:!!window.ScrollTrigger,intersectionObserver:!!NativeObserver,resizeObserver:!!window.ResizeObserver},
   dialogOpen:!!document.querySelector('#case-dialog')?.open,
   ticker:window.gsap?.ticker?{frame:gsap.ticker.frame,time:gsap.ticker.time,globalPaused:gsap.globalTimeline?.paused?.()??null}:null,
   projects:[...document.querySelectorAll('.project-scene')].map(scene=>({
    id:scene.closest('.project')?.id,initialized:scene.hasAttribute('data-film-time'),
    enabled:scene.classList.contains('mobile-film'),playing:scene.dataset.filmPlaying||'unset',time:scene.dataset.filmTime||'unset',
    scale:scene.style.getPropertyValue('--scene-scale'),renderingValues:renderingValues(scene)
   }))
  };
  samples.push(snapshot);if(samples.length>6)samples.shift();
  return snapshot;
 };
 const boot=()=>{
  const panel=document.querySelector('[data-motion-diagnostics]');
  const status=panel.querySelector('[data-motion-status]'),report=panel.querySelector('[data-motion-report]');
  panel.open=false;
  let measuredBounds=null;
  const render=()=>{
   const latest=samples.at(-1),previous=samples.at(-2);
   let state='no-visibility',message='No project visibility signal';
   if(!latest.mobile){state='desktop';message='The browser is using the desktop layout';}
   else if(latest.projects.every(project=>!project.initialized)){
    state='initialization-failed';message='The project animation controller did not start';
   }else if(latest.savedPause===true){state='paused';message='A saved pause is stopping the previews';}
   else if(latest.visibility!=='visible'){state='background';message='The browser reports this page as hidden';}
   else if(latest.dialogOpen){state='dialog';message='An open case study is pausing the previews';}
   else{
    const requested=latest.projects.filter(project=>project.playing==='true');
    if(requested.length&&previous){
     const advanced=requested.some(project=>{
      const before=previous.projects.find(other=>other.id===project.id);
      return before?.initialized&&project.time!==before.time;
     });
     state=advanced?'running':'stalled';
     message=advanced?'The animation clock is advancing':'Playback says playing, but the clock is stopped';
    }
   }
   status.dataset.motionStatus=state;status.textContent=message;
   report.textContent=JSON.stringify({build,state,errors,nativeFrameResponded,samples,observations,measuredBounds},null,2);
  };
  const collect=()=>{capture('manual-before');setTimeout(()=>{capture('manual-after');render();},700);};
  panel.querySelector('[data-motion-capture]').addEventListener('click',collect);
  panel.querySelector('[data-motion-measure]').addEventListener('click',()=>{
   measuredBounds=[...document.querySelectorAll('.project-scene')].map(scene=>{
    const rect=scene.getBoundingClientRect();return{id:scene.closest('.project')?.id,top:rect.top,bottom:rect.bottom,width:rect.width,height:rect.height,display:getComputedStyle(scene).display,renderingValues:renderingValues(scene,true)};
   });
   collect();
  });
  panel.querySelector('[data-motion-copy]').addEventListener('click',async event=>{
   const button=event.currentTarget;
   try{await navigator.clipboard.writeText(report.textContent);button.textContent='Copied';}
   catch{button.textContent='Select the report below';}
  });
  capture('ready');
  setTimeout(()=>capture('settled'),1000);
  setTimeout(()=>{
   // Capture before opening the panel: its paint can wake a stalled observer.
   capture('before-report-paint');render();panel.open=true;
   requestAnimationFrame(()=>{nativeFrameResponded=true;render();});
  },2200);
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
}

export function motionDiagnosticsPage(html){
 assert.equal(html.split('</head>').length,2,'Expected one homepage head');
 assert.equal(html.split('</body>').length,2,'Expected one homepage body');
 const build=createHash('sha256').update(html).digest('hex').slice(0,12);
 const style=`<style>
 .motion-diagnostics{position:fixed;z-index:2147483647;left:12px;right:12px;bottom:12px;max-height:60svh;overflow:auto;padding:12px 16px;background:#f6f3eb;color:#102d88;border:1px solid #102d88;font:14px/1.45 system-ui,sans-serif;text-align:left}
 .motion-diagnostics summary{min-height:32px;cursor:pointer;font-weight:600}
 .motion-diagnostics p{margin:10px 0}.motion-diagnostics pre{white-space:pre-wrap;overflow-wrap:anywhere;font:11px/1.45 monospace;max-height:30svh;overflow:auto;user-select:text}
 .motion-diagnostics button{min-height:44px;padding:8px 12px;margin:4px 8px 4px 0;background:transparent;color:inherit;border:1px solid currentColor;border-radius:0;font:inherit}
 </style>`;
 const panel=`<details class="motion-diagnostics" data-motion-diagnostics open><summary>Motion diagnostics · ${build}</summary><p data-motion-status="not-started">JavaScript has not started</p><p>Copy this report to identify where playback stops. It stays in this browser and is not sent anywhere.</p><button type="button" data-motion-capture>Capture again</button><button type="button" data-motion-measure>Measure visibility</button><button type="button" data-motion-copy>Copy report</button><pre data-motion-report>JavaScript is disabled or blocked, or the diagnostic script has not started.</pre></details>`;
 return html.replace('</head>',`<meta name="robots" content="noindex,nofollow">${style}<script>(${startMotionDiagnostics.toString()})(${JSON.stringify(build)});</script></head>`).replace('</body>',`${panel}</body>`);
}
