import assert from 'node:assert/strict';

// Artwork is a sibling of the action, so moving text in the demonstration
// cannot become part of the control's visible label or accessible name.
export function patchPreviewControls(html){
 let count=0;
 html=html.replace(/<button([^>]*class="project-shot has-scene"[^>]*)>([\s\S]*?)<\/button>/g,(_,attrs,body)=>{
  const name=attrs.match(/aria-label="([^"]+)"/)[1];
  const id=attrs.match(/data-case="([^"]+)"/)[1];
  const action=body.match(/<span class="shot-action"[^>]*>[\s\S]*?<\/span>/)?.[0];
  assert.ok(action,'Expected the existing preview action label');
  count++;
  const wrapper=attrs.replace(/\s(?:type|aria-label|data-case|data-cursor)="[^"]*"/g,'');
  return `<div${wrapper}>${body.replace(action,'')}<button class="project-preview-action" type="button" data-cursor="open" data-case="${id}" aria-label="${name}">${action}</button></div>`;
 });
 assert.equal(count,3,'Expected the three animated DOM previews');
 return html.replace('</head>',`<style>.project-shot.has-scene{position:relative}.project-preview-action{position:absolute;inset:0;z-index:6;border:0;background:transparent;color:inherit;border-radius:inherit;cursor:inherit}.project-preview-action:focus-visible{outline-offset:-4px}</style></head>`);
}
