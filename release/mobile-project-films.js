// Each film is a deterministic composition of time. GSAP owns the clock;
// visibility, dialog and user preferences decide which clocks may run.
const MOBILE_FILM_DURATION = [8.8, 8.4, 8.8, 10];
const filmClamp = n => Math.max(0, Math.min(1, n));
const filmPhase = (a, b, t) => filmClamp((t - a) / (b - a));
const filmEase = (a, b, t) => { const n = filmPhase(a, b, t); return n * n * (3 - 2 * n); };

function mobileFilmPlayback({mobile, hidden, dialog, paused, ratios}) {
  if (!mobile || hidden || dialog || paused) return [];
  // Two small previews can be fully visible together. Neither should freeze
  // simply because an earlier project has the same viewport coverage.
  return ratios.flatMap((ratio, i) => ratio > .18 ? [i] : []);
}

function mobileFilmFrame(id, seconds, gentle = false) {
  const i = ['needle', 'f24', 'second-voice', 'leu'].indexOf(id);
  const p = ((seconds % MOBILE_FILM_DURATION[i]) + MOBILE_FILM_DURATION[i]) % MOBILE_FILM_DURATION[i] / MOBILE_FILM_DURATION[i];
  if (id === 'needle') {
    // A description becomes a search: inspect the collection, then find the
    // little golden object. Reduced motion keeps each object near its place.
    const home = [[64,252,-14,1.2,1],[276,238,7,1.45,1],[478,254,15,1.2,1]];
    const match = gentle
      ? [[66,224,-3,1.45,1],[272,226,3,1.5,.32],[478,240,8,1.22,.32]]
      : [[240,212,-3,1.85,1],[76,252,-11,1,.32],[480,250,11,1,.32]];
    const poses = [
      home,
      [[74,236,-9,1.28,1],[272,220,3,1.55,1],[474,236,10,1.28,1]],
      [[78,234,-5,1.3,1],[274,226,6,1.48,1],[470,231,6,1.35,1]],
      match, match, home
    ];
    const stops = [0,.18,.54,.72,.86,1];
    const part = Math.max(0, stops.findIndex((_,j)=>p<stops[j+1]));
    const u = filmEase(stops[part],stops[part+1],p);
    const lensX = p<.35 ? 340+176*filmEase(.18,.35,p)
      : p<.52 ? 516-381*filmEase(.35,.52,p)
      : 135+(gentle?-5:187)*filmEase(.54,.72,p);
    const found = filmEase(.7,.77,p)*(1-filmEase(.86,.98,p));
    return {p, cards:poses[part].map((a,j)=>a.map((n,k)=>n+(poses[part+1][j][k]-n)*u)),
      typed:Math.round(26*filmPhase(.02,.17,p)*(1-filmEase(.88,.98,p))),found,
      queryOpacity:1-filmEase(.7,.77,p),
      lens:[lensX,310+7*filmEase(.54,.72,p),filmEase(.16,.2,p)*(1-filmEase(.75,.82,p))],
      lensArt:[filmEase(.45,.52,p),1-filmEase(.29,.35,p),filmEase(.29,.35,p)*(1-filmEase(.45,.52,p))]};
  }
  if (id === 'f24') {
    const exit = 1-filmEase(.95,1,p), saved = filmEase(.83,.9,p)*exit;
    return {p, typed: Math.round(20*filmPhase(.025,.22,p)*exit), route:filmPhase(.23,.39,p),
      dry:filmEase(.31,.4,p)*exit, error:filmEase(.45,.5,p)*(1-filmEase(.67,.72,p)), saved,
      busy:(p>=.37&&p<.47)||(p>=.73&&p<.85), retry:p>=.5&&p<.73,
      press:Math.sin(Math.PI*filmPhase(.34,.4,p)) + Math.sin(Math.PI*filmPhase(.7,.76,p))};
  }
  if (id === 'second-voice') {
    const travel = filmEase(.08,.29,p), clear = 1-filmEase(.88,.98,p);
    return {p, travel, ghost:filmEase(.05,.09,p)*(1-filmEase(.27,.31,p)), clear,
      words:Array.from({length:13},(_,j)=>filmEase(.265+j*.014,.325+j*.014,p)*clear)};
  }
  // Original window rain, driven by the same pausable clock in both profiles.
  // Integer passes per loop and invisible wrap points make the reset seamless.
  return {p,rain:Array.from({length:24},(_,j)=>{
    const fall=(p*(3+j%3)+j*.38196601125)%1;
    return [-12*fall,340*fall,filmEase(0,.08,fall)*(1-filmEase(.9,1,fall))];
  })};
}

function mobileFilmReducedFrame(id, progress) {
  const p=((progress%1)+1)%1;
  const clear=1-filmEase(.8,.98,p);
  if(id==='f24')return {fieldOpacity:filmEase(.015,.18,p)*(1-filmEase(.94,1,p)),recipientOpacity:filmEase(.15,.31,p)*(1-filmEase(.94,1,p))};
  if(id==='second-voice')return {words:Array.from({length:13},(_,j)=>filmEase(.03+j*.025,.09+j*.025,p)*clear),author:filmEase(.43,.57,p)*clear};
}

function createMobileProjectFilms(panels) {
  const button = document.querySelector('[data-film-toggle]');
  const mobile = matchMedia('(max-width:900px)'), reduced = matchMedia('(prefers-reduced-motion:reduce)');
  const dialog = document.querySelector('#case-dialog');
  if (!window.gsap || !window.IntersectionObserver || !button) return {sync(){}, stop(){}};
  const playRequested = new URLSearchParams(location.search).get('motion') === 'play';
  let enabled = false, paused = false, motionAllowed = playRequested;
  try {
    paused = !playRequested && sessionStorage.getItem('portfolio-previews-paused') === 'true';
    motionAllowed ||= sessionStorage.getItem('portfolio-previews-motion-allowed') === 'true';
    if (playRequested) {
      sessionStorage.setItem('portfolio-previews-paused','false');
      sessionStorage.setItem('portfolio-previews-motion-allowed','true');
    }
  } catch {}
  const scenes = panels.map((panel,i) => {
    const host=panel.querySelector('.project-scene'), $=s=>host.querySelector(s);
    // These are visual layers inside the existing semantic preview button.
    if (panel.id==='needle') {
      const found=document.createElement('span');found.className='needle-found';found.textContent='Found it.';
      $('.needle-input').append(found);
      const lens=document.createElement('span');lens.className='needle-lens';
      lens.innerHTML='<span class="needle-lens-window"></span><span class="needle-lens-handle"></span>';
      [0,1,4].forEach(n=>{
        const art=$(`[data-orbit="${n}"] .art-crop`).cloneNode(false);
        art.classList.add('needle-lens-art');lens.firstChild.append(art);
      });
      $('.scene-world').append(lens);
    }
    if (panel.id==='second-voice') {
      const transfer=document.createElement('span'); transfer.className='sv-transfer';transfer.textContent='Rain';
      $('.scene-world').append(transfer);
    }
    if (panel.id==='f24') {
      const tick=document.createElementNS('http://www.w3.org/2000/svg','svg');
      tick.setAttribute('viewBox','0 0 24 24');tick.setAttribute('class','film-check');
      tick.innerHTML='<path d="m5 12 5 5 9-10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
      $('.rule-success i').append(tick);
    }
    const owned=[...host.querySelectorAll('.art-orbit,.needle-search,.needle-query,.needle-found,.needle-lens,.needle-lens-art,.rule-field,.rule-typed,.demo-caret,.rule-error,.rule-success,.rule-save,.rule-status,.save-copy,.save-spinner,.save-check,.rule-preview,.dry-copy,.preview-check,.preview-dot,.rule-recipient,.rule-connector,.sv-dark,.sv-draft-side,.sv-rewrite-side,.sv-result>span,.sv-author,.sv-strength-dot,.sv-transfer,.sv-seam,.leu-room,.leu-arch,.leu-scene-copy,.leu-rain i')];
    let baseline=[];
    const save=()=>{baseline=owned.map(el=>[el,el.getAttribute('style')]);};
    const restore=()=>baseline.forEach(([el,style])=>style===null?el.removeAttribute('style'):el.setAttribute('style',style));
    const transform=(selector,value)=>$(selector).style.transform=value;
    const opacity=(selector,value)=>$(selector).style.opacity=value;
    const text=(selector,value)=>{const el=$(selector);if(el.textContent!==value)el.textContent=value;};
    const render=t=>{
      // Reduced motion changes the composition, not whether it autoplays.
      // Keep the camera and reading copy still; use local prop motion or fades.
      const gentle=reduced.matches&&!motionAllowed;
      const f=mobileFilmFrame(panel.id,t,gentle);host.dataset.filmTime=t.toFixed(3);
      const g=gentle&&(panel.id==='f24'||panel.id==='second-voice')?mobileFilmReducedFrame(panel.id,f.p):null;
      const move=(selector,value)=>transform(selector,gentle?'none':value);
      if(panel.id==='needle') {
        [0,1,4].forEach((n,j)=>{
          const el=$(`[data-orbit="${n}"]`),[x,y,angle,scale,alpha]=f.cards[j];
          el.style.setProperty('--film-transform',`translate3d(${x}px,${y}px,0) rotate(${angle}deg) rotateY(${-angle*.6}deg) scale(${scale})`);
          el.style.opacity=alpha;
        });
        text('.needle-query','Something small and golden'.slice(0,f.typed));
        opacity('.needle-query',f.queryOpacity);opacity('.needle-found',f.found);
        transform('.needle-lens',`translate3d(${f.lens[0]-66}px,${f.lens[1]-66}px,0)`);
        opacity('.needle-lens',f.lens[2]);
        [...host.querySelectorAll('.needle-lens-art')].forEach((el,j)=>el.style.opacity=f.lensArt[j]);
      } else if(panel.id==='f24') {
        text('.rule-typed','Severity is Critical'.slice(0,gentle?20:f.typed));
        opacity('.rule-field',gentle?g.fieldOpacity:1);opacity('.rule-recipient',gentle?g.recipientOpacity:1);
        opacity('.demo-caret',!gentle&&f.typed<20?1:0);opacity('.rule-error',f.error);opacity('.rule-success',f.saved);
        move('.rule-error',`translateY(${8*(1-f.error)}px)`);move('.rule-success',`translateY(${8*(1-f.saved)}px)`);
        move('.rule-save',`scale(${1-.06*f.press})`);
        $('.rule-save').style.background=f.saved>.8?'#346747':'#244f8e';
        text('.save-copy',f.saved>.8?'Saved':f.busy?'Saving…':f.retry?'Try again':'Save rule');
        text('.rule-status',f.saved>.8?'Saved':f.busy?'Saving…':'Editing');
        $('.save-spinner').style.display=f.busy?'block':'none';$('.save-check').style.display=f.saved>.8?'block':'none';
        $('.rule-success').style.setProperty('--film-check',gentle?0:1-f.saved);
        $('.rule-connector').style.setProperty('--signal-y',`${f.route*30}px`);
        $('.rule-connector').style.setProperty('--signal-alpha',!gentle&&f.route>0&&f.route<1?1:0);
        $('.rule-recipient').style.borderColor=f.dry>.8?'#6c9871':'#d4dce8';
        opacity('.rule-preview',f.dry);move('.rule-preview',`translateY(${12*(1-f.dry)}px)`);
        opacity('.preview-check',f.dry);text('.dry-copy','Condition matched · no notification sent');
        $('.preview-dot').style.background='#408452';
      } else if(panel.id==='second-voice') {
        transform('.sv-dark','none');transform('.sv-draft-side','none');transform('.sv-rewrite-side','none');
        move('.sv-transfer',`translate3d(${90+260*f.travel}px,${330-65*Math.sin(f.travel*Math.PI)}px,0) rotate(${-8*Math.sin(f.travel*Math.PI)}deg)`);
        opacity('.sv-transfer',f.ghost);$('.sv-transfer').style.color=f.travel>.885?'#eceee0':'#293d32';
        [...host.querySelectorAll('.sv-result>span')].forEach((el,j)=>{
          const r=gentle?g.words[j]:f.words[j];el.style.opacity=r;el.style.transform=gentle?'none':`translateY(${24*(1-r)}px) rotate(${2*(1-r)}deg)`;
        });
        opacity('.sv-author',gentle?g.author:filmEase(.53,.62,f.p)*f.clear);
        move('.sv-strength-dot',`translateX(${-140+240*filmEase(.1,.57,f.p)*f.clear}px)`);
        move('.sv-seam',`scaleY(${.25+.75*filmEase(.04,.3,f.p)*f.clear})`);
      } else {
        transform('.leu-room','none');transform('.leu-arch','none');
        transform('.leu-scene-copy','none');opacity('.leu-scene-copy',1);
        [...host.querySelectorAll('.leu-rain i')].forEach((el,j)=>{
          const [x,y,alpha]=f.rain[j];el.style.transform=`translate3d(${x}px,${y}px,0)`;el.style.opacity=alpha;
        });
      }
    };
    const clock={t:0};
    const timeline=gsap.to(clock,{t:MOBILE_FILM_DURATION[i],duration:MOBILE_FILM_DURATION[i],repeat:-1,ease:'none',paused:true,onUpdate:()=>render(clock.t)});
    return {host,clock,timeline,render,save,restore,ratio:0};
  });
  const update=()=>{
    const active=enabled?mobileFilmPlayback({mobile:mobile.matches,hidden:document.hidden,dialog:dialog.open,paused,ratios:scenes.map(s=>s.ratio)}):[];
    scenes.forEach((scene,i)=>{
      const playing=active.includes(i);
      scene.host.dataset.filmPlaying=String(playing);
      scene.timeline.paused(!playing);
    });
    const blocked=paused;
    button.setAttribute('aria-pressed',String(blocked));button.querySelector('span').textContent=blocked?'Play motion':'Pause motion';
    button.setAttribute('aria-label',blocked?'Play project preview animations':'Pause project preview animations');
    button.title=reduced.matches&&!motionAllowed?'Reduced motion: the camera stays still.':'';
  };
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{const scene=scenes.find(s=>s.host===entry.target);if(scene)scene.ratio=entry.isIntersecting?entry.intersectionRatio:0;});
    update();
  },{threshold:[0,.18,.3,.45,.6,.75,.9,1],rootMargin:'-72px 0px 0px 0px'});
  scenes.forEach(s=>observer.observe(s.host));
  button.addEventListener('click',()=>{
    paused=!paused;
    try{
      sessionStorage.setItem('portfolio-previews-paused',String(paused));
      sessionStorage.setItem('portfolio-previews-motion-allowed',String(motionAllowed));
    }catch{}
    sync();
  });
  document.addEventListener('visibilitychange',update);
  new MutationObserver(update).observe(dialog,{attributes:true,attributeFilter:['open']});
  const stop=()=>{
    enabled=false;button.hidden=true;
    scenes.forEach(s=>{s.timeline.pause();s.host.classList.remove('mobile-film','film-opt-in');delete s.host.dataset.filmPlaying;s.restore();});
  };
  const sync=()=>{
    if(!mobile.matches){stop();update();return;}
    button.hidden=false;
    if(!enabled){
      enabled=true;
      scenes.forEach(s=>{s.save();s.host.classList.add('mobile-film');s.render(s.clock.t);});
    }
    scenes.forEach(s=>s.host.classList.toggle('film-opt-in',motionAllowed));update();
  };
  mobile.addEventListener('change',sync);
  reduced.addEventListener('change',()=>{
    if(reduced.matches){
      motionAllowed=false;
      try{sessionStorage.removeItem('portfolio-previews-motion-allowed');}catch{}
    }
    sync();
  });
  addEventListener('pagehide',()=>scenes.forEach(s=>s.timeline.pause()));
  addEventListener('pageshow',update);
  return {sync,stop};
}
