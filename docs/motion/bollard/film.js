// Shared deterministic composition: the motion study and mobile preview use this renderer.
function createBollardFilm(canvas){
const ctx=canvas.getContext('2d');
if(!ctx)return null;
const C={paper:'#efefe8',ink:'#20231f',muted:'#666c65',blue:'#3937f5',line:'#dce0d6',white:'#ffffff'};
const clamp=v=>Math.max(0,Math.min(1,v)),ease=v=>{v=clamp(v);return v*v*v*(v*(v*6-15)+10)},p=(t,a,b)=>ease((t-a)/(b-a)),mix=(a,b,k)=>a+(b-a)*k;
function text(s,x,y,z=32,color=C.ink,w=450,align='left'){ctx.fillStyle=color;ctx.font=`${w} ${z}px Figtree`;ctx.textAlign=align;ctx.fillText(s,x,y)}
function box(x,y,w,h,r,fill,stroke){ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke()}}
function line(x,y,a,b,color=C.line,w=2){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(a,b);ctx.strokeStyle=color;ctx.lineWidth=w;ctx.stroke()}
function dot(x,y,r,color,stroke){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);if(color){ctx.fillStyle=color;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke()}}
function group(alpha,x,y,fn){ctx.save();ctx.globalAlpha*=clamp(alpha);ctx.translate(x,y);fn();ctx.restore()}
function cursor(x,y,press,opacity=1){group(opacity,x,y,()=>{ctx.scale(1-.16*press,1-.16*press);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,43);ctx.lineTo(12,31);ctx.lineTo(22,51);ctx.lineTo(32,46);ctx.lineTo(23,27);ctx.lineTo(42,26);ctx.closePath();ctx.fillStyle=C.ink;ctx.strokeStyle=C.white;ctx.lineWidth=4;ctx.fill();ctx.stroke()})}
function draw(t,gentle=false){
ctx.setTransform(canvas.width/1200,0,0,canvas.height/1200,0,0);
ctx.clearRect(0,0,1200,1200);ctx.fillStyle=C.paper;ctx.fillRect(0,0,1200,1200);
const evidence=p(t,.22,.46)*(1-p(t,1.72,1.94));
const approval=p(t,2.4,2.78)*(1-p(t,5.8,6.28));
// The decision panel stays spatially anchored through evidence and approval.
text('Bollard',72,105,44,C.ink,650);text('Decisions',1128,103,30,C.muted,500,'right');
line(72,145,1128,145);text('NORDSTAHL / 2027',72,208,25,C.muted,550);
box(72,252,1056,720,36,C.blue,C.blue);
text('YOUR CALL',120,316,24,'#dfdeff',600);
dot(1064,307,7,C.white);
text('Counter Nordstahl',120,420,76,C.white,550);text('at +€23/t.',120,510,92,C.white,550);
text('Keep the quarterly index.',120,588,43,'#dfdeff');
line(120,650,1080,650,'#7775fa');
text('Your decision.',120,714,32,C.white,550);text('Before anything moves.',120,758,32,'#dfdeff');
const hover=p(t,2.06,2.28)*(1-p(t,2.4,2.55));
box(120,818,230,82,22,C.white);text('Approve',235,872,34,C.blue,550,'center');
box(372,818,230,82,22,C.blue,'#aaa8ff');text('Send back',487,872,32,C.white,500,'center');
box(918,818,162,82,22,C.blue,'#aaa8ff');text('Why',999,872,32,C.white,500,'center');
if(hover){ctx.save();ctx.globalAlpha=hover*.14;box(113,811,244,96,27,C.white);ctx.restore()}
// Evidence sheet grows out of the Why control. No scene cut or floating slide.
ctx.save();box(72,252,1056,720,36);ctx.clip();
if(evidence>0){const sheetY=gentle?350:mix(972,350,evidence);ctx.globalAlpha*=gentle?evidence:1;box(72,sheetY,1056,622,32,'#eeeeff');
 group(evidence,0,sheetY-350,()=>{
 text('What the costs support',120,422,49,C.ink,550);text('12 months · ore, coal, gas, power, carbon',120,474,29,C.muted);
 text('Supplier asks',120,561,28,C.muted);text('+€62/t',120,634,62,C.ink,550);
 text('Costs support',660,561,28,C.muted);text('+€23/t',660,634,62,C.blue,550);
 line(120,686,1080,686,'#d1d0ec',12);
 line(120,686,120+960*(23/62),686,C.blue,12);dot(120+960*(23/62),686,15,C.blue);
 text('Counter at +€23/t.',120,777,43,C.ink,550);text('Retain the quarterly index.',120,829,33,C.muted);
 text('Evidence reviewed',120,914,27,C.blue,550);text('Back to decision  ↑',1080,914,27,C.ink,500,'right');
 });ctx.globalAlpha=1;}
// The Approve button expands into the result surface; same container and same action.
if(approval>0){ctx.save();ctx.beginPath();if(gentle){ctx.rect(72,252,1056,720);ctx.globalAlpha*=approval;}else ctx.arc(235,860,1500*approval,0,Math.PI*2);ctx.clip();ctx.fillStyle=C.blue;ctx.fillRect(72,252,1056,720);
text('COUNTERPROPOSAL',120,316,24,'#d7d6ff',550);
const a=p(t,2.58,2.98)*(1-p(t,5.7,6.02));
group(a,0,gentle?0:22*(1-a),()=>{text('Approved.',120,432,94,C.white,550);text('+€23/t. Quarterly index retained.',120,495,35,'#e5e4ff');
// A tight particle field becomes the savings circle used by Bollard.
const form=gentle?1:p(t,2.95,3.95);for(let i=0;i<48;i++){const ang=(i/48)*Math.PI*2-Math.PI/2;let radius=i%2?146:116;const xx=mix(800+(i%12)*12,865+Math.cos(ang)*radius,form),yy=mix(840+Math.floor(i/12)*12,715+Math.sin(ang)*radius,form);dot(xx,yy,6.5,i<24?C.white:'#7775fa')}
text('€1.19M',120,730,105,C.white,550);text('Modelled opportunity',120,790,33,'#dfdeff');text('A decision backed by evidence.',120,911,30,C.white,500);
});ctx.restore();}
ctx.restore();
// The cursor acts on actual controls, then leaves the result to be read.
let x,y,op=1,press=0;
if(t<.22){let v=p(t,0,.18);x=mix(1112,1005,v);y=mix(1008,864,v);press=p(t,.17,.20)*(1-p(t,.20,.25))}
else if(t<1.72){let v=p(t,.46,1.05);x=mix(1005,515,v);y=mix(864,691,v);op=1-.5*p(t,.8,1.1)}
else if(t<2.4){let v=p(t,1.72,2.28);x=mix(515,258,v);y=mix(691,864,v);press=p(t,2.3,2.4);}
else{x=258;y=864;op=(1-p(t,2.4,2.65))+p(t,6.28,6.5);if(t>6.28){x=mix(1130,1112,p(t,6.28,6.5));y=mix(1025,1008,p(t,6.28,6.5))}}
if(!gentle)cursor(x,y,press,op);
text('Evidence → decision → opportunity',72,1060,34,C.ink,500);
text('Interactive motion study · fictional scenario',72,1130,24,C.muted);
}
return draw;
}
// Motion study bootstrap.
const draw=createBollardFilm(document.querySelector('canvas'));
document.fonts.load('550 76px Figtree').then(()=>{const proxy={t:0};const tl=gsap.timeline({paused:true});tl.to(proxy,{t:6.5,duration:6.5,ease:'none',onUpdate:()=>draw(proxy.t)},0);window.__timelines=window.__timelines||{};window.__timelines.main=tl;draw(0)});
