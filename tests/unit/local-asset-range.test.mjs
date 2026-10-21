import test from 'node:test';
import assert from 'node:assert/strict';
import { localAssetRange } from '../../scripts/lib/local-asset-range.mjs';

for (const [range,body,contentRange] of [
  ['bytes=0-1','01','bytes 0-1/10'],
  ['bytes=7-','789','bytes 7-9/10'],
  ['bytes=-3','789','bytes 7-9/10'],
  ['bytes=8-100','89','bytes 8-9/10']
]) test(`local asset binding returns exact bytes for ${range}`, async () => {
  const response = await localAssetRange(new Request('http://localhost/film.mp4',{headers:{range,'cache-control':'no-cache'}}),
    new Response('0123456789',{headers:{'content-type':'video/mp4',etag:'"film"'}}));
  assert.equal(response.status,206);
  assert.equal(response.headers.get('content-range'),contentRange);
  assert.equal(response.headers.get('content-length'),String(body.length));
  assert.equal(response.headers.get('content-type'),'video/mp4');
  assert.equal(await response.text(),body);
});

test('unsatisfiable range returns its actual asset size', async () => {
  const response=await localAssetRange(new Request('http://localhost/film.mp4',{headers:{range:'bytes=10-'}}),new Response('0123456789'));
  assert.equal(response.status,416);
  assert.equal(response.headers.get('content-range'),'bytes */10');
  assert.equal(await response.text(),'');
});

test('complete responses advertise seeking while preserving the actual body', async () => {
  const response = await localAssetRange(new Request('http://localhost/film.mp4'),new Response('body'));
  assert.equal(response.status,200);
  assert.equal(response.headers.get('accept-ranges'),'bytes');
  assert.equal(await response.text(),'body');
});

test('existing partial responses and stale If-Range stay untouched', async () => {
  for(const [headers,status] of [[{range:'bytes=0-1'},206],[{range:'bytes=0-1','if-range':'"old"'},200]]) {
    const original=new Response('body',{status,headers:{etag:'"current"'}});
    assert.equal(await localAssetRange(new Request('http://localhost/film.mp4',{headers}),original),original);
  }
});
