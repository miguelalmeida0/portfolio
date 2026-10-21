import { introScrollGate } from './intro-scroll-gate';
import { resetScrollMotion } from './smooth-scroll';
import { motionState, prefersReducedMotion } from './policy';

type Box = { x: number; y: number; width: number; height: number };
const box = (el: Element): Box => { const {x,y,width,height}=el.getBoundingClientRect(); return {x,y,width,height}; };
const ease = (t: number) => { t=Math.max(0,Math.min(1,t)); return t*t*t*(t*(t*6-15)+10); };


/** The existing name-to-photo sequence, registered to the live Turntable front. */
export function turntableIntroduction(node: HTMLElement) {
  const root=document.documentElement, site=document.getElementById('portfolio-content');
  if(root.dataset.presentation!=='pending' || !site) return {};
  const person=node.querySelector<HTMLElement>('[data-intro-person]')!;
  const type=node.querySelector<SVGElement>('[data-intro-body]')!;
  const source=node.querySelector<HTMLImageElement>('[data-intro-source]')!;
  const backdrop=node.querySelector<HTMLElement>('[data-intro-backdrop]')!;
  const hadInert=site.inert;
  let target: HTMLElement | null=null, live: HTMLImageElement | null=null;
  let visibility='', opacity='', transition='', done=false, gestureOwned=false, frame=0;
  const background=document.body.style.backgroundColor;
  let clock: Animation | undefined;
  let unsubscribe=()=>{};
  let releaseScroll=()=>{};
  let destination: Box;
  let observer: ResizeObserver | undefined;
  let deadline: ReturnType<typeof setTimeout>;

  const finish=()=>{
    if(done)return;
    done=true;
    if(live){
      live.style.visibility=visibility;live.style.opacity=opacity;live.style.transition=transition;
      delete live.dataset.introPhoto;
    }
    document.body.style.backgroundColor=background;
    site.inert=hadInert;
    root.dataset.presentation='complete';
    delete root.dataset.introHydrated;
    if(root.dataset.introRestoration){
      history.scrollRestoration=root.dataset.introRestoration as ScrollRestoration;
      delete root.dataset.introRestoration;
    }
    clock?.cancel();cancelAnimationFrame(frame);clearTimeout(deadline);observer?.disconnect();
    if(!gestureOwned || prefersReducedMotion())releaseScroll();
    window.removeEventListener('keydown',keydown,true);
    window.removeEventListener('pointerdown',pointerdown,true);
    window.removeEventListener('touchend',finish,true);
    window.removeEventListener('touchcancel',finish,true);
    window.removeEventListener('resize',resize);
    window.removeEventListener('popstate',finish,true);
    window.removeEventListener('pagehide',finish,true);
    document.removeEventListener('visibilitychange',hidden);
    unsubscribe();
  };
  const keydown=()=>finish();
  const pointerdown=(event:PointerEvent)=>{if(event.pointerType!=='touch')finish();};
  const hidden=()=>{if(document.hidden)finish();};
  const time=()=>Number(clock?.currentTime||0);
  function measure(){
    if(!live)return;
    const next=box(live);
    if(!next.width||!next.height)throw new Error('Portrait has no geometry');
    destination=next;
    backdrop.style.maskImage='linear-gradient(#000 0 0),url("'+source.currentSrc+'")';
    backdrop.style.maskSize='100% 100%,'+next.width+'px '+next.height+'px';
    backdrop.style.maskPosition='0 0,'+next.x+'px '+next.y+'px';
    backdrop.style.maskRepeat='no-repeat';
    backdrop.style.maskComposite='exclude';
  }
  function render(t:number){
    // Reveal in place. The live image owns both the size and the position;
    // there is no centered intro pose, travel, growth or resize interpolation.
    measure();
    const next=destination;
    person.style.cssText='visibility:visible;left:'+next.x+'px;top:'+next.y+'px;width:'+next.width+'px;height:'+next.height+'px;transform:none;';
    const material=ease((t-2700)/750);
    type.style.opacity=String(1-material);
    if(live)live.style.opacity=String(material);
    node.dataset.stage=t>=2850?'transfer':'approach';
  }
  const resize=()=>{if(done||!clock)return;try{measure();render(time());}catch{finish();}};
  root.dataset.introHydrated='true';
  site.inert=true;
  window.scrollTo({top:0,behavior:'instant'});resetScrollMotion();
  releaseScroll=introScrollGate(()=>{gestureOwned=true;root.dataset.introShortcut=String(Date.now());finish();});
  window.addEventListener('keydown',keydown,true);
  window.addEventListener('pointerdown',pointerdown,{capture:true,passive:true});
  window.addEventListener('touchend',finish,{capture:true,passive:true});
  window.addEventListener('touchcancel',finish,{capture:true,passive:true});
  window.addEventListener('resize',resize,{passive:true});
  window.addEventListener('popstate',finish,{capture:true,passive:true});
  window.addEventListener('pagehide',finish,{capture:true,passive:true});
  document.addEventListener('visibilitychange',hidden);
  deadline=setTimeout(finish,6500);
  unsubscribe=motionState.subscribe(({reduced})=>{if(reduced)finish();});

  async function start(){
    try{
      await source.decode();
      // The header replaces its SSR DOM and measures its fonts asynchronously.
      // Select only the hydrated, measured image, never a detached SSR target.
      while(!done){
        live=site!.querySelector<HTMLImageElement>('.mah:not([data-layout="auto"]) .mah-photo-front');
        if(live)break;
        await new Promise<void>(resolve=>requestAnimationFrame(()=>resolve()));
      }
      if(done||!live)return;
      await live.decode();
      if(done)return;
      if(live.currentSrc!==source.currentSrc)throw new Error('Portrait source differs');
      target=live.closest<HTMLElement>('.mah-photo')!;
      // Reveal the real image in its original DOM and rendering context.
      // The backdrop's alpha cutout exposes it; there is no duplicate to swap.
      visibility=live.style.visibility;opacity=live.style.opacity;transition=live.style.transition;
      live.dataset.introPhoto='';
      live.style.visibility='visible';live.style.transition='none';
      document.body.style.backgroundColor='#E2EDBA';
      measure();render(0);
      root.dataset.presentation='running';
      clock=backdrop.animate([{opacity:1,offset:0},{opacity:1,offset:2850/3600},{opacity:0,offset:3450/3600},{opacity:0,offset:1}],{duration:3600,fill:'forwards'});
      clock.onfinish=finish;
      const advance=()=>{if(done)return;render(time());frame=requestAnimationFrame(advance);};
      frame=requestAnimationFrame(advance);
      observer=new ResizeObserver(resize);observer.observe(target);observer.observe(live);
      clearTimeout(deadline);deadline=setTimeout(finish,6000);
    }catch{finish();}
  }
  void start();
  return {destroy:finish};
}
