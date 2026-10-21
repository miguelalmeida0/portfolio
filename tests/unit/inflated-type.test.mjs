import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadLocalTs } from '../../scripts/lib/load-local-ts.mjs';
import { Euler, Matrix4, Vector3 } from 'three';
const { decodeInflatedGlyphs, inflatedWord, inflatedWordScale, typePose } = await loadLocalTs('src/lib/hero-lab/typographic/type-geometry.ts');
const meta = JSON.parse(readFileSync('static/models/inflated-type.json'));
const bytes = readFileSync('static/models/inflated-type.bin');
const glyphs = decodeInflatedGlyphs(meta, bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));

test('inflated glyphs are closed, outward-facing surfaces with curved fronts', () => {
  for (const [char, { geometry }] of Object.entries(glyphs)) {
    const p = geometry.attributes.position, n = geometry.attributes.normal, indices = geometry.index.array;
    assert.ok([...p.array, ...n.array].every(Number.isFinite));
    const edges = new Map();
    let flat = 0, curvedFront = 0;
    for (let i = 0; i < n.count; i++) {
      const length = Math.hypot(n.getX(i), n.getY(i), n.getZ(i));
      assert.ok(Math.abs(length - 1) < .002);
      if (n.getZ(i) > .999) flat++;
      if (n.getZ(i) > .35 && n.getZ(i) < .95) curvedFront++;
    }
    assert.ok(flat / n.count < .12, `${char}: face must not be a flat extrusion`);
    assert.ok(curvedFront / n.count > .15, `${char}: needs rounded visible volume`);
    for (let i = 0; i < indices.length; i += 3) {
      const [ia,ib,ic]=[indices[i],indices[i+1],indices[i+2]];
      const ab=new Vector3().fromBufferAttribute(p,ib).sub(new Vector3().fromBufferAttribute(p,ia));
      const ac=new Vector3().fromBufferAttribute(p,ic).sub(new Vector3().fromBufferAttribute(p,ia));
      const outward=new Vector3().fromBufferAttribute(n,ia).add(new Vector3().fromBufferAttribute(n,ib)).add(new Vector3().fromBufferAttribute(n,ic));
      assert.ok(ab.cross(ac).dot(outward)>-1e-10,`${char}: inward triangle`);
      for (const [a,b] of [[indices[i],indices[i+1]],[indices[i+1],indices[i+2]],[indices[i+2],indices[i]]]) {
        const key = a < b ? `${a}:${b}` : `${b}:${a}`;
        edges.set(key, (edges.get(key) ?? 0) + 1);
      }
    }
    assert.ok([...edges.values()].every(count => count === 2), `${char}: open or nonmanifold edge`);
  }
});

function crossesCounter(g, x, y) {
  const p = g.attributes.position, ids = g.index.array;
  for (let i=0; i<ids.length; i+=3) {
    const [a,b,c]=[ids[i],ids[i+1],ids[i+2]];
    const d=(p.getY(b)-p.getY(c))*(p.getX(a)-p.getX(c))+(p.getX(c)-p.getX(b))*(p.getY(a)-p.getY(c));
    if (Math.abs(d)<1e-10) continue;
    const u=((p.getY(b)-p.getY(c))*(x-p.getX(c))+(p.getX(c)-p.getX(b))*(y-p.getY(c)))/d;
    const v=((p.getY(c)-p.getY(a))*(x-p.getX(c))+(p.getX(a)-p.getX(c))*(y-p.getY(c)))/d;
    if(u>=0 && v>=0 && u+v<=1) return true;
  }
  return false;
}

test('inflation preserves readable O, R, D and G counters', () => {
  for (const [letter,x,y] of [['O',.335,.5],['R',.34,.69],['D',.32,.5],['G',.34,.57]]) {
    assert.equal(crossesCounter(glyphs[letter].geometry,x*.78,y),false,`${letter} counter closed`);
  }
});

test('both headlines are bounded indexed meshes with no separate extruded layers', () => {
  for (const word of ['FRONTEND','ENGINEER']) {
    const g = inflatedWord(glyphs,word);
    assert.ok(g.attributes.position.count < 85000);
    assert.equal(g.groups.length,0);
    assert.ok(g.index.count / 3 < 170000);
    g.computeBoundingBox();
    assert.ok(g.boundingBox.max.z > .1 && g.boundingBox.min.z < -.1);
    g.dispose();
  }
});

test('the glazed material is non-metallic and has smooth clearcoat', async () => {
  const { inflatedTypeMaterial } = await loadLocalTs('src/lib/hero-lab/typographic/inflated-type-material.ts');
  const material = inflatedTypeMaterial('#1c362d');
  assert.equal(material.color.getHexString(),'1c362d');
  assert.ok(material.metalness < .1);
  assert.ok(material.clearcoat > .8 && material.roughness < .3);
  assert.equal(material.vertexColors,true);
  material.dispose();
});

test('gentle whole-word motion remains smooth and bounded', () => {
  let prev=typePose(0,0,0);
  for(let t=.016;t<30;t+=.016){
    const p=typePose(t,0,0);
    assert.ok(Math.abs(p.x-prev.x)<.001 && Math.abs(p.y-prev.y)<.001);
    assert.ok(Math.abs(p.x)<.1 && Math.abs(p.y)<.15);
    prev=p;
  }
  const p=typePose(3,100,-100);
  assert.ok(Math.abs(p.x)<.12 && Math.abs(p.y)<.2);
});

test('rounded lettering stays within existing desktop and mobile headline cells throughout motion', () => {
  const v=new Vector3();
  for(const word of ['FRONTEND','ENGINEER']) {
    const g=inflatedWord(glyphs,word),size=g.boundingBox.getSize(new Vector3());
    for(const [width,em] of [[530,150],[340,95]]) {
      const scale=inflatedWordScale(size,width,em);
      for(let t=0;t<30;t+=3) for(const pointer of [-1,1]) {
        const pose=typePose(t,pointer,pointer);
        const matrix=new Matrix4().makeRotationFromEuler(new Euler(pose.x,pose.y,0,'YXZ'));
        matrix.multiply(new Matrix4().makeScale(scale.x,scale.y,scale.z));
        for(let i=0;i<g.attributes.position.count;i++) {
          v.fromBufferAttribute(g.attributes.position,i).applyMatrix4(matrix);
          assert.ok(Math.abs(v.x)<width/2,`${word}: horizontal clipping`);
          assert.ok(Math.abs(v.y)<em*.47,`${word}: vertical clipping`);
        }
      }
    }
    g.dispose();
  }
});
