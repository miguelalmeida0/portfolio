<script lang="ts">
  import { getContext, onMount } from 'svelte';
  import { motionState } from '$lib/motion/policy';
  import { LINE_M, type LineService } from './service';
  import { createJourneyController } from './journey-controller';
  import { createJourneyRenderer } from './journey-renderer';
  import { smooth } from './journey-geometry';
  let { suppressed=false } = $props<{suppressed?:boolean}>();
  const service=getContext<LineService>(LINE_M);
  let svg: SVGSVGElement;
  onMount(()=>{
    const controller=createJourneyController(),renderer=createJourneyRenderer(svg);
    let root:HTMLElement|undefined,frame=0,dirty=true,failed=false,destroyed=false,idle=true;
    let geometry: {top:number;bottom:number}|undefined;
    let circles:HTMLElement[]=[];
    const media=matchMedia('(min-width: 900px) and (pointer: fine) and (hover: hover)');
    function measure(){
      if(!root)return;
      circles=[root.querySelector<HTMLElement>('[data-thread-dock]')!,...root.querySelectorAll<HTMLElement>('[data-stop] > span:first-child')];
      const origin=circles[0].getBoundingClientRect();
      const bounds=root.getBoundingClientRect();
      const stops=[...root.querySelectorAll<HTMLElement>('[data-stop] > span:first-child')].map(el=>{const r=el.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2+scrollY};});
      if(!origin.width || stops.length!==4)throw new Error('Line M anchors unavailable');
      geometry={top:bounds.top+scrollY,bottom:bounds.bottom+scrollY};
      controller.updateScroll({documentY:scrollY,viewportHeight:innerHeight,timeMs:performance.now()});
      controller.setGeometry({origin:{x:origin.x+origin.width/2,y:origin.y+origin.height/2+scrollY},stops,width:document.documentElement.clientWidth,height:innerHeight,maximum:Math.max(1,document.documentElement.scrollHeight-innerHeight),footerTop:geometry.top,footerBottom:geometry.bottom,mobile:!media.matches});
      dirty=false;
    }
    function tick(time:number){
      frame=0;if(destroyed||failed||document.hidden)return;
      try {
        if(dirty)measure();if(!geometry)return;
        controller.updateScroll({documentY:scrollY,viewportHeight:innerHeight,timeMs:time});
        controller.setVisible(geometry.bottom>scrollY && geometry.top<scrollY+innerHeight,!!root?.contains(document.activeElement));
        // rAF's timestamp can precede a scroll event in this rendering cycle.
        // Use the same monotonic clock as wake() for an immediate positive step.
        controller.step(performance.now());
        const state=controller.snapshot();
        renderer.render(state,scrollY);service.publish();
        circles.forEach((circle,i)=>circle.style.setProperty('--train-clearance',String(state.stationVisibility[i]??1)));
        document.documentElement.style.setProperty('--line-m-thumb-opacity',String(1-smooth(state.morph/.04)));
        if(state.reduced)delete document.documentElement.dataset.lineMTraveller;
        else document.documentElement.dataset.lineMTraveller=state.morph===0?'thumb':state.onScrollbar?'rail':state.owner==='scroll'?'journey':'manual';
        if(controller.needsFrame())wake();else idle=true;
      } catch(error){failed=true;svg.style.display='none';delete document.documentElement.dataset.lineMTraveller;document.documentElement.style.removeProperty('--line-m-thumb-opacity');console.warn('Line M decoration unavailable',error);}
    }
    function wake(){if(!frame&&!failed&&!destroyed&&!document.hidden){if(idle){controller.resumeClock(performance.now());idle=false;}frame=requestAnimationFrame(tick);}}
    function layout(){dirty=true;wake();}
    const resize=new ResizeObserver(layout);resize.observe(document.body);
    const stopRoot=service.observeRoot(value=>{if(root)resize.unobserve(root);root=value;if(root)resize.observe(root);geometry=undefined;layout();});
    const detach=service.attach(controller,wake);
    const stopPolicy=motionState.subscribe(state=>{controller.setReducedMotion(state.reduced);wake();});
    function visibility(){cancelAnimationFrame(frame);frame=0;idle=true;controller.suspend();if(!document.hidden)layout();}
    window.addEventListener('scroll',wake,{passive:true});window.addEventListener('resize',layout,{passive:true});window.addEventListener('pageshow',layout);
    // A focused contact can remain selected after wheel-scrolling it offscreen.
    // Losing that focus must wake an otherwise idle owner to rejoin the thumb.
    document.addEventListener('focusin',wake);document.addEventListener('focusout',wake);
    document.addEventListener('visibilitychange',visibility);media.addEventListener('change',layout);
    return()=>{destroyed=true;cancelAnimationFrame(frame);resize.disconnect();stopRoot();detach();stopPolicy();controller.destroy();renderer.destroy();circles.forEach(circle=>circle.style.removeProperty('--train-clearance'));delete document.documentElement.dataset.lineMTraveller;document.documentElement.style.removeProperty("--line-m-thumb-opacity");window.removeEventListener('scroll',wake);window.removeEventListener('resize',layout);window.removeEventListener('pageshow',layout);document.removeEventListener('focusin',wake);document.removeEventListener('focusout',wake);document.removeEventListener('visibilitychange',visibility);media.removeEventListener('change',layout);};
  });
</script>
<svg bind:this={svg} data-line-m-journey aria-hidden="true" class="no-print" class:suppressed></svg>
<style>
  svg { position:fixed;inset:0;width:100%;height:100%;overflow:hidden;pointer-events:none;z-index:45;font-family:inherit; }
  .suppressed { visibility:hidden; }
  :global(html[data-presentation='pending']) svg { visibility:hidden; }
  @media print { svg {display:none;} }
</style>
