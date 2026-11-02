import assert from 'node:assert/strict';

export const caseFocusScript = `(() => {
 const dialog=document.querySelector('#case-dialog');
 dialog.addEventListener('keydown',event=>{
  if(event.key!=='Tab'||!dialog.open)return;
  const controls=[...dialog.querySelectorAll('a[href],button,input,select,textarea,[tabindex]')]
   .filter(el=>el.tabIndex>=0&&!el.disabled&&el.getClientRects().length&&getComputedStyle(el).visibility!=='hidden');
  const first=controls[0],last=controls.at(-1),active=document.activeElement;
  if(!first){event.preventDefault();dialog.focus();return;}
  if(event.shiftKey&&(active===first||active===dialog)){event.preventDefault();last.focus();}
  else if(!event.shiftKey&&(active===last||active===dialog)){event.preventDefault();first.focus();}
 });
})();`;
export function patchCaseFocus(html){
 assert.equal(html.split('</body></html>').length,2,'Expected one homepage body end');
 return html.replace('</body></html>',`<script id="case-keyboard-focus">${caseFocusScript}</script></body></html>`);
}
