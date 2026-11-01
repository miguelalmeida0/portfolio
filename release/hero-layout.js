 function measureHero(){
  if(mobileLayout.matches){
   layout={w:hero.clientWidth,h:hero.clientHeight,handWidth:0,handHeight:0};
   return;
  }
  const w=hero.clientWidth,h=hero.clientHeight,content=$('.hero-content');
  const large=matchMedia('(min-width:1100px)').matches;
  const name=$('.hero-name');
  const copyBottom=content.offsetTop+(large?name.offsetTop+name.offsetHeight:content.offsetHeight);
  const safe=large?64:48,defaultGrip=w<=900?.27:.23;
  const overscan=Math.max(24,w*.025);
  // CSS owns the text column from first paint. Fit the hands around that
  // column; font readiness and ScrollTrigger refreshes cannot move the name.
  const available=Math.max(0,Math.min(content.offsetLeft,w-content.offsetLeft-content.offsetWidth)-48);
  const handLimit=large?Math.max(available+overscan,(available-w*defaultGrip)/.09):Infinity;
  const maxWidth=Math.min(w*(large?.42:.84),760,handLimit);
  let handWidth=maxWidth,grip=defaultGrip;
  // Large hands frame the name; the metadata sits in the clear center between them.
  // Wrist cropping and contact with the curved sheet remain part of one model.
  for(let i=0;i<5;i++){
   grip=Math.max(0,Math.min(defaultGrip,(handWidth*.91-overscan)/w));
   const gripY=h*(.84+2*grip*(1-grip)*.08);
   handWidth=Math.max(0,Math.min(maxWidth,(gripY-copyBottom-safe)*1.6/.79));
  }
  grip=Math.max(0,Math.min(defaultGrip,(handWidth*.91-overscan)/w));
  layout={w,h,handWidth,handHeight:handWidth/1.6,grip,takeover:w<1100,sheet:layout.sheet,gesture:layout.gesture||0};stage.style.setProperty('--gallery-width',stage.clientWidth+'px');
  hands.forEach(el=>{el.style.width=handWidth+'px';el.style.height=layout.handHeight+'px';el.style.transformOrigin='91% 79%';});
  sheet.setAttribute('viewBox',`0 0 ${w} ${h}`);renderSheet(heroProgress);
 }
