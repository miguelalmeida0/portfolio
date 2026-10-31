// Each film is a deterministic composition of time. GSAP owns the clock;
// visibility, dialog and user preferences decide which clocks may run.
const MOBILE_FILM_DURATION = {needle:12.4, f24:8.4, 'second-voice':8.8, leu:10};
// The build embeds the six actual Met images observed in Needle's live results.
const NEEDLE_FILM_ART = [];
const filmClamp = n => Math.max(0, Math.min(1, n));
const filmPhase = (a, b, t) => filmClamp((t - a) / (b - a));
const filmEase = (a, b, t) => { const n = filmPhase(a, b, t); return n * n * (3 - 2 * n); };

function mobileFilmPlayback({mobile, hidden, dialog, ratios}) {
  if (!mobile || hidden || dialog) return [];
  // Two small previews can be fully visible together. Neither should freeze
  // simply because an earlier project has the same viewport coverage.
  return ratios.flatMap((ratio, i) => ratio > .18 ? [i] : []);
}

function mobileFilmFrame(id, seconds, gentle = false) {
  const duration = MOBILE_FILM_DURATION[id];
  const p = ((seconds % duration) + duration) % duration / duration;
  if (id === 'needle') {
    const dock=filmEase(.22,.31,p)*(1-filmEase(.88,.96,p));
    const gallery=filmEase(.285,.36,p)*(1-filmEase(.88,.945,p));
    const inspect=filmEase(.47,.56,p)*(1-filmEase(.77,.85,p));
    const inspector=filmEase(.47,.50,p)*(1-filmEase(.82,.85,p));
    const details=filmEase(.55,.59,p)*(1-filmEase(.775,.815,p));
    return {p,dock,gallery,inspect,inspector,details,
      typed:Math.round(20*filmPhase(.025,.17,p)*(1-filmEase(.965,.997,p))),
      enterScale:gentle?1:1-.07*Math.sin(Math.PI*filmPhase(.19,.215,p)),
      select:filmEase(.43,.45,p)*(1-filmEase(.47,.5,p)),
      cards:Array.from({length:6},(_,j)=>filmEase(.285+j*.009,.335+j*.009,p)*(1-filmEase(.88,.945,p)))};
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

function mountNeedleFilm(host) {
  const root=document.createElement('span');root.className='needle-demo';root.setAttribute('aria-hidden','true');
  const searchIcon='<svg viewBox="0 0 24 24" fill="none"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg>';
  const enterIcon='<svg viewBox="0 0 24 24" fill="none"><path d="M19 6v8H5m0 0 5-5m-5 5 5 5"/></svg>';
  const field=`<span class="nd-search-icon">${searchIcon}</span><span class="nd-query"></span><span class="nd-enter">${enterIcon}</span>`;
  root.innerHTML=`<span class="nd-brand"><svg viewBox="0 0 32 32" fill="currentColor"><path d="M14 4a2 2 0 0 0-2-2C7.582 2 4 6.477 4 12v16a2 2 0 0 0 2 2c4.418 0 8-4.477 8-10Z"/><path d="M18 4a2 2 0 0 1 2-2c4.418 0 8 4.477 8 10v16a2 2 0 0 1-2 2c-4.418 0-8-4.477-8-10Z"/></svg>Needle</span>
    <span class="nd-intro" data-nd-animate><span class="nd-question">What would you<br>like to see?</span><span class="nd-description">Describe a picture in your own words.</span><span class="nd-examples">Or try one<span>A room with a window</span></span></span>
    <span class="nd-field" data-nd-animate>${field}</span><span class="nd-docked" data-nd-animate>${field}</span>
    <span class="nd-gallery" data-nd-animate><span class="nd-eyebrow">From The Met collection</span><span class="nd-results-title">A room with a window</span><span class="nd-filter">${searchIcon}Filters</span><span class="nd-grid"></span></span>
    <span class="nd-inspector" data-nd-animate><span class="nd-inspector-heading">Artwork details</span><span class="nd-close">×</span></span>
    <span class="nd-focus" data-nd-animate></span><span class="nd-details" data-nd-animate><span class="nd-art-title">Moonlight, Strandgade 30</span><span>Vilhelm Hammershøi · 1900–1906</span><span>European Paintings</span></span>`;
  const grid=root.querySelector('.nd-grid');
  NEEDLE_FILM_ART.forEach(art=>{
    const cell=document.createElement('span');cell.className='nd-cell';cell.setAttribute('data-nd-animate','');
    const img=document.createElement('img');img.src=art.data;img.alt='';img.width=art.width;img.height=art.height;
    cell.append(img);grid.append(cell);
  });
  const selected=grid.children[2].firstChild.cloneNode(false);root.querySelector('.nd-focus').append(selected);
  host.querySelector('.scene-world').append(root);
  const $=s=>root.querySelector(s);
  return {root,queries:root.querySelectorAll('.nd-query'),cells:root.querySelectorAll('.nd-cell'),
    field:$('.nd-field'),docked:$('.nd-docked'),intro:$('.nd-intro'),gallery:$('.nd-gallery'),
    inspector:$('.nd-inspector'),details:$('.nd-details'),focus:$('.nd-focus')};
}

function createMobileProjectFilms(panels) {
  const mobile = matchMedia('(max-width:767px)'), reduced = matchMedia('(prefers-reduced-motion:reduce)');
  const dialog = document.querySelector('#case-dialog');
  if (!window.gsap || !window.IntersectionObserver) return {sync(){}, stop(){}};
  const playRequested = new URLSearchParams(location.search).get('motion') === 'play';
  let enabled = false, motionAllowed = playRequested;
  try {
    sessionStorage.removeItem('portfolio-previews-paused');
    motionAllowed ||= sessionStorage.getItem('portfolio-previews-motion-allowed') === 'true';
    if (playRequested) {
      sessionStorage.setItem('portfolio-previews-motion-allowed','true');
    }
  } catch {}
  const scenes = panels.filter(panel=>panel.querySelector('.project-scene')).map((panel,i) => {
    const host=panel.querySelector('.project-scene'), $=s=>host.querySelector(s);
    // These are visual layers inside the existing semantic preview button.
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
    const owned=[...host.querySelectorAll('.art-orbit,.needle-search,.rule-field,.rule-typed,.demo-caret,.rule-error,.rule-success,.rule-save,.rule-status,.save-copy,.save-spinner,.save-check,.rule-preview,.dry-copy,.preview-check,.preview-dot,.rule-recipient,.rule-connector,.sv-dark,.sv-draft-side,.sv-rewrite-side,.sv-result>span,.sv-author,.sv-strength-dot,.sv-transfer,.sv-seam,.leu-room,.leu-arch,.leu-scene-copy,.leu-rain i')];
    let baseline=[],needle=null;
    const save=()=>{
      // Mount/decode the bounded artwork set only when mobile is first used.
      if(panel.id==='needle'&&!needle){needle=mountNeedleFilm(host);owned.push(...needle.root.querySelectorAll('[data-nd-animate]'));}
      baseline=owned.map(el=>[el,el.getAttribute('style')]);
    };
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
        const query='A room with a window'.slice(0,f.typed);
        needle.queries.forEach(el=>{if(el.textContent!==query)el.textContent=query;});
        const dock=gentle?0:f.dock;
        const {field,focus}=needle;field.style.transform=`translate3d(${70+130*dock}px,${350-318*dock}px,0)`;
        field.style.width=`${500-92*dock}px`;field.style.height=`${62-14*dock}px`;field.style.fontSize=`${26-5*dock}px`;
        field.style.opacity=gentle?1-f.dock:1;needle.docked.style.opacity=gentle?f.dock:0;
        needle.intro.style.opacity=1-f.dock;needle.gallery.style.opacity=f.gallery*(1-f.inspector);
        needle.inspector.style.opacity=f.inspector;needle.details.style.opacity=f.details;
        const r=gentle?1:f.inspect;
        focus.style.transform=`translate3d(${426-350*r}px,${198-82*r}px,0)`;
        focus.style.width=`${182+306*r}px`;focus.style.height=`${181+209*r}px`;
        focus.style.opacity=gentle?f.inspect:f.gallery;
        needle.cells.forEach((el,j)=>{el.style.opacity=f.cards[j];el.style.transform=gentle?'none':`translateY(${12*(1-f.cards[j])}px)`;});
        needle.root.style.setProperty('--nd-selected',f.select);needle.root.style.setProperty('--nd-enter-scale',f.enterScale);
        needle.root.classList.toggle('nd-gentle',gentle);
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
    const timeline=gsap.to(clock,{t:MOBILE_FILM_DURATION[panel.id],duration:MOBILE_FILM_DURATION[panel.id],repeat:-1,ease:'none',paused:true,onUpdate:()=>render(clock.t)});
    return {host,clock,timeline,render,save,restore,ratio:0};
  });
  const update=()=>{
    const active=enabled?mobileFilmPlayback({mobile:mobile.matches,hidden:document.hidden,dialog:dialog.open,ratios:scenes.map(s=>s.ratio)}):[];
    scenes.forEach((scene,i)=>{
      const playing=active.includes(i);
      scene.host.dataset.filmPlaying=String(playing);
      scene.timeline.paused(!playing);
    });
  };
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{const scene=scenes.find(s=>s.host===entry.target);if(scene)scene.ratio=entry.isIntersecting?entry.intersectionRatio:0;});
    update();
  },{threshold:[0,.18,.3,.45,.6,.75,.9,1],rootMargin:'-72px 0px 0px 0px'});
  scenes.forEach(s=>observer.observe(s.host));
  document.addEventListener('visibilitychange',update);
  new MutationObserver(update).observe(dialog,{attributes:true,attributeFilter:['open']});
  const stop=()=>{
    enabled=false;
    scenes.forEach(s=>{s.timeline.pause();s.host.classList.remove('mobile-film','film-opt-in');delete s.host.dataset.filmPlaying;s.restore();});
  };
  const sync=()=>{
    if(!mobile.matches){stop();update();return;}
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
