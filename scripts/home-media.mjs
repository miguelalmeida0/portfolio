import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';

export function externalizePointingHand(html) {
  const match=html.match(/const POINT_HAND_IMAGE="data:image\/png;base64,([A-Za-z0-9+/=]+)";/);
  assert.ok(match,'Expected the original pointing-hand photograph');
  const bytes=Buffer.from(match[1],'base64');
  const hash=createHash('sha256').update(bytes).digest('hex');
  const path=`/images/hero-pointing-hand-${hash.slice(0,16)}.png`;
  html=html.replace(match[0],`const POINT_HAND_IMAGE="${path}";`);
  const eager=' grip.src=source;point.src=POINT_HAND_IMAGE;';
  assert.equal(html.split(eager).length,2,'Expected one hand image loader');
  html=html.replace(eager,` const handViewport=matchMedia('(min-width:768px)');
 function loadPhotos(){grip.src=source;point.src=POINT_HAND_IMAGE;}
 if(handViewport.matches)loadPhotos();
 else handViewport.addEventListener('change',()=>loadPhotos(),{once:true});`);
  return {html,path,bytes,hash};
}
