import test from 'node:test';
import assert from 'node:assert/strict';
const origin=process.env.ROUTE_HEALTH_BASE_URL || 'http://127.0.0.1:4286';
for (const direction of ['counterform','bearing','throughline']) {
  test(`${direction} preserves the real Home Story CV journey`,async()=>{
    const base=`/hero-lab/${direction}`;
    for(const suffix of ['', '/story','/cv']){
      const response=await fetch(origin+base+suffix);
      assert.equal(response.status,200);
      const html=await response.text();
      assert.ok(html.includes(`data-craft="${direction}"`));
      for(const href of [base,base+'/story',base+'/cv'])assert.ok(html.includes(`href="${href}"`),href);
      if(!suffix){
        for(const text of ['Hi, I’m Miguel.','4+ years building production software.','Built a product used by hundreds of companies.','View CV']) assert.ok(html.includes(text),text);
        assert.ok(html.includes('wind-full-1086.avif'));
        assert.ok(html.includes('id="work"'));
      }
      if(suffix==='/story')assert.ok(html.includes('Aviation')&&html.includes('UX design')&&html.includes('Frontend'));
      if(suffix==='/cv')assert.ok(html.includes('/files/miguel-almeida-cv.pdf'));
    }
  });
}
