import type { JourneyController, StopIndex } from './journey-controller';
export const LINE_M = Symbol('Line M');
export const initialTrain = () => ({ at:-1, requested:-1, held:false, reduced:false });
export type Train = ReturnType<typeof initialTrain>;
/** Layout-scoped bindings, never a module-global controller. Links work without a host. */
export function createLineService() {
  let controller: JourneyController | undefined;
  let wake = () => {};
  let root: HTMLElement | undefined;
  let state = initialTrain();
  let earlyIntent: {index: StopIndex; source: 'pointer'|'focus'|'activate'} | undefined;
  const listeners = new Set<(value: Train) => void>();
  const roots = new Set<(value: HTMLElement | undefined) => void>();
  function publish() {
    const s=controller?.snapshot();if(!s)return;
    const value={at:s.at,requested:s.desiredStop,held:s.owner==='manual'||s.paused,reduced:s.reduced};
    if(JSON.stringify(value)===JSON.stringify(state))return;
    state=value;listeners.forEach(fn=>fn(state));
  }
  return {
    attach(value: JourneyController, schedule: () => void) {
      controller=value;wake=schedule;
      if(earlyIntent){controller.requestStop(earlyIntent.index,earlyIntent.source);earlyIntent=undefined;}
      publish();wake();
      return()=>{if(controller===value){controller=undefined;wake=()=>{};}};
    },
    register(value: HTMLElement) {root=value;roots.forEach(fn=>fn(root));return()=>{root=undefined;roots.forEach(fn=>fn(root));};},
    observeRoot(fn: (value: HTMLElement | undefined)=>void) {roots.add(fn);fn(root);return()=>{roots.delete(fn);};},
    subscribe(fn: (value: Train)=>void) {listeners.add(fn);fn(state);return()=>{listeners.delete(fn);};},
    aim(i: number, source: 'pointer'|'focus'|'activate'='pointer') {
      if(!Number.isInteger(i)||i<0||i>3)return;
      if(controller){controller.requestStop(i as StopIndex,source);publish();}
      else {
        // Bindings can mount before the decorative layer. Publish immediately;
        // the first host consumes only the latest explicit selection.
        earlyIntent={index:i as StopIndex,source};
        state={...state,requested:i,at:-1,held:true};listeners.forEach(fn=>fn(state));
      }
      wake();
    },
    toggle() {if(state.held)controller?.resumeAuto();else controller?.pauseAuto();publish();wake();},
    publish
  };
}
export type LineService = ReturnType<typeof createLineService>;
