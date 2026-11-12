/** History owns the route; the existing case dialog remains its visual surface. */
export function createCaseNavigation({studies, dialog, open, close, win = window}) {
  const doc = win.document;
  const key = 'portfolioCaseNavigation';
  const homeTitle = 'Miguel Almeida · Compact index';
  let applying = false, pendingReturn = null, epoch = 0, lastOrigin = null;
  let previousRestoration = null, finishHome = null;
  const marker = () => win.history.state?.[key]?.version === 1 ? win.history.state[key] : null;
  const route = id => '/case/' + id + '/';
  const indexAtLocation = () => {
    const path = win.location.pathname.match(/^\/case\/([^/]+)\/?$/);
    const slug = path?.[1] || (win.location.hash.startsWith('#case/') ? win.location.hash.slice(6) : null);
    return studies.findIndex(study => study.id === slug);
  };
  const state = value => ({...win.history.state, [key]:{version:1, restoration:previousRestoration || marker()?.restoration || win.history.scrollRestoration, ...value}});
  const fallback = index => ({url:'/' + (studies[index].id === 'f24' ? '#experience' : '#work'),
    target:studies[index].id === 'f24' ? '#experience' : '#panel-' + studies[index].id,
    y:null, focus:-1});
  function origin(index, trigger) {
    const result = fallback(index);
    if (trigger?.closest('#work, #experience')) {
      result.url = win.location.pathname + win.location.search + win.location.hash;
      result.y = win.scrollY;
      result.focus = [...doc.querySelectorAll('.cs-open')].indexOf(trigger);
    }
    return result;
  }
  function title(index) {
    doc.title = index < 0 ? homeTitle : studies[index].shortName + ' · Miguel Almeida';
    const canonical = doc.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = win.location.origin + (index < 0 ? '/' : route(studies[index].id));
  }
  function holdScroll() {
    if (previousRestoration === null) previousRestoration = marker()?.restoration || win.history.scrollRestoration;
    win.history.scrollRestoration = 'manual';
  }
  function restorePosition(saved, destination) {
    const target = doc.querySelector(destination || saved.target);
    if (!destination && Number.isFinite(saved.y)) win.scrollTo({top:saved.y,behavior:'instant'});
    else if (target) {
      const offset = doc.querySelector('#top-nav')?.getBoundingClientRect().height || 72;
      win.scrollTo({top:win.scrollY + target.getBoundingClientRect().top - offset - 20,behavior:'instant'});
    }
    if (!destination) {
      const link = doc.querySelectorAll('.cs-open')[saved.focus] || target?.querySelector('.cap-cs, .cs-open');
      link?.focus({preventScroll:true});
    }
  }
  function showHome(saved, intent) {
    const revision = ++epoch;
    title(-1);
    const finish = () => {
      if (revision !== epoch) return;
      restorePosition(saved, intent?.destination);
      intent?.after?.();
      if (intent?.destination) {
        const url = saved.url.split('#')[0] + intent.destination;
        win.history.replaceState(state({kind:'home',origin:{...saved,url,y:win.scrollY}}),'',url);
      }
      win.requestAnimationFrame(() => {
        if (revision !== epoch) return;
        win.history.scrollRestoration = previousRestoration || 'auto';
        previousRestoration = null;
      });
    };
    finishHome = finish;
    applying = true;
    try { if (dialog.open) close(() => finishHome?.(), intent?.destination); else finish(); }
    finally { applying = false; }
  }
  function applyLocation() {
    const index = indexAtLocation();
    const current = marker();
    if (index >= 0 && pendingReturn && current?.kind === 'case' && current.depth === 0) {
      win.history.replaceState(state({kind:'home',origin:current.origin}),'',current.origin.url);
      applyLocation();
      return;
    }
    if (index >= 0) {
      ++epoch; pendingReturn = null;
      holdScroll();
      const saved = current?.kind === 'case' && current.id === studies[index].id ? current :
        {kind:'case',id:studies[index].id,depth:0,origin:fallback(index)};
      lastOrigin = saved.origin;
      win.history.replaceState(state(saved),'',route(studies[index].id));
      title(index);
      applying = true;
      try { open(index); } finally { applying = false; }
    } else if (dialog.open || pendingReturn) {
      const intent = pendingReturn;
      pendingReturn = null;
      showHome(current?.origin || lastOrigin || fallback(1), intent);
    }
  }
  return {
    enter(index, trigger) {
      if (applying) return true;
      if (pendingReturn) return false;
      const current = marker();
      if (current?.kind === 'case' && indexAtLocation() === index) return true;
      holdScroll(); ++epoch;
      const fromCase = current?.kind === 'case' && indexAtLocation() >= 0;
      const saved = fromCase ? current.origin : origin(index, trigger);
      const depth = fromCase ? current.depth + 1 : 1;
      if (!fromCase) win.history.replaceState(state({kind:'home',origin:saved}),'',saved.url);
      win.history.pushState(state({kind:'case',id:studies[index].id,depth,origin:saved}),'',route(studies[index].id));
      lastOrigin = saved; title(index);
      return true;
    },
    leave(after, destination) {
      if (applying) return false;
      if (pendingReturn) return true;
      const current = marker();
      if (current?.kind !== 'case') return false;
      pendingReturn = {after,destination};
      if (current.depth > 0) win.history.go(-current.depth);
      else {
        win.history.replaceState(state({kind:'home',origin:current.origin}),'',current.origin.url);
        applyLocation();
      }
      return true;
    },
    start() {
      win.addEventListener('popstate',applyLocation);
      // Old shared #case/... links continue to resolve to canonical case URLs.
      win.addEventListener('hashchange',() => {if (win.location.hash.startsWith('#case/')) applyLocation();});
      if (indexAtLocation() >= 0) applyLocation();
    }
  };
}
