import assert from 'node:assert/strict';

export const caseFocusScript = `(() => {
 const dialog=document.querySelector('#case-dialog');
 dialog.addEventListener('keydown',event=>{
  if(event.key!=='Tab'||!dialog.open)return;
  const controls=[...dialog.querySelectorAll('a[href],button,input,select,textarea,[tabindex]')]
   .filter(el=>el.tabIndex>=0&&!el.disabled&&el.getClientRects().length&&getComputedStyle(el).visibility!=='hidden');
  event.preventDefault();
  if(!controls.length){dialog.focus();return;}
  // WebKit may skip buttons during native Tab navigation. Advance every step,
  // not only the boundaries, so every visible control stays keyboard reachable.
  const active=controls.indexOf(document.activeElement);
  const next=active<0?(event.shiftKey?controls.length-1:0)
   :(active+(event.shiftKey?-1:1)+controls.length)%controls.length;
  controls[next].focus();
 });
})();`;
export function patchCaseFocus(html){
 assert.equal(html.split('</body></html>').length,2,'Expected one homepage body end');
 return html.replace('</body></html>',`<script id="case-keyboard-focus">${caseFocusScript}</script></body></html>`);
}
