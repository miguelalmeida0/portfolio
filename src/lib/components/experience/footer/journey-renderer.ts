import { mix, smooth } from './journey-geometry';
import type { JourneyController } from './journey-controller';
const NS='http://www.w3.org/2000/svg';
/** Three persistent instances, ported from the approved compact S-Bahn. */
export function createJourneyRenderer(svg: SVGSVGElement) {
  function node(tag: string, attributes: Record<string,string|number>, parent: Element) {
    const el=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attributes))el.setAttribute(k,String(v));parent.appendChild(el);return el;
  }
  // The measured route guides the cars only. Painting that route creates a
  // detached scrollbar-like line, especially while entry is partially scrolled.
  const group=node('g',{'data-train':'','data-motion-owner':'journey'},svg);
  const cars=[0,1,2].map(i=>{
    const holder=node('g',{'data-car':i},group),body=node('g',{},holder);
    const shell=node('rect',{x:-50,y:-18,width:100,height:36,rx:10,fill:'#5b153c'},body);
    const details=node('g',{},body);
    node('path',{d:'M-47 11 H47 Q45 18 38 18 H-38 Q-47 18-47 11Z',fill:'#5b153c'},details);
    for(const x of [-37,-13])node('rect',{x,y:-10,width:17,height:12,rx:3,fill:'#f9f7ef'},details);
    node('rect',{x:12,y:-11,width:13,height:24,rx:2,fill:'#52643e'},details);
    const doors=[13,18.5].map(x=>node('rect',{'data-door':'',x,y:-10,width:5.5,height:22,rx:1,fill:'#d6e5aa'},details));
    node('rect',{x:30,y:i===0?-9:-10,width:14,height:i===0?14:12,rx:3,fill:i===0?'#5b153c':'#f9f7ef'},details);
    if(i===0){const text=node('text',{x:37,y:1.5,'text-anchor':'middle','font-size':10,'font-weight':750,'font-family':'Arial,sans-serif',fill:'#f9f7ef'},details);text.textContent='M';}
    const wheels=node('g',{},details);
    for(const cx of [-32,32])node('circle',{cx,cy:17,r:3,fill:'#122a22'},wheels);
    return {holder,body,shell,details,doors,wheels};
  });
  for(const car of [...cars].reverse())group.appendChild(car.holder);
  return {
    render(state: ReturnType<JourneyController['snapshot']>, scroll: number) {
      group.setAttribute('data-phase',state.phase);
      const m=state.reduced?1:state.morph,scale=state.scale;
      // Hand back to the actual operable thumb at the exact unmorphed state.
      group.setAttribute('opacity',String(smooth(m/.04)));
      const r=state.travel;
      cars.forEach((car,i)=>{
        const p=state.cars[i];if(!p)return;
        car.holder.setAttribute('transform',`translate(${p.x} ${p.y-scroll}) rotate(${p.angle})`);
        car.body.setAttribute('transform',`scale(${mix(44/3,36,m)*scale/100} ${mix(2,22,m)*scale/36})`);
        car.shell.setAttribute('fill',`rgb(${[91,21,60].map((v,j)=>Math.round(mix(v,[201,224,138][j],smooth((m-.05)/.85)))).join(',')})`);
        car.shell.setAttribute('rx',String(mix(18,10,m)));
        car.details.setAttribute('opacity',String(smooth((m-.18)/.70)));
        car.wheels.setAttribute('opacity',String(state.owner==='scroll'?smooth((r-.94)/.06):1));
        car.doors.forEach((door,j)=>door.setAttribute('transform',`translate(${(j?1:-1)*state.doors*5.7} 0)`));
      });
    },
    destroy(){group.remove();}
  };
}
