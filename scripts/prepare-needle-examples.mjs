import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import sharp from 'sharp';

// Reproduce the prepared searches using the released product's own encoder,
// graph and hybrid ranking. No runtime timings are published from this script.
const root=resolve(process.argv[2]||'');
if(!process.argv[2])throw new Error('Usage: node scripts/prepare-needle-examples.mjs /path/to/release');
const modulePath=name=>pathToFileURL(`${root}/dist/modules/packages/${name}`).href;
const {HybridSearchEngine}=await import(modulePath('search-runtime/src/hybrid-search-engine.js'));
const {toSearchDocument}=await import(modulePath('search-runtime/src/local-search-engine.js'));
const {ArtEmbeddingSpace}=await import(modulePath('query-encoder/src/art-embedding-space.js'));
const bytes=readFileSync(`${root}/data-packs/met-10k-lean-v2/corpus.json`);
const raw=JSON.parse(bytes), graph=JSON.parse(readFileSync(`${root}/dist/data/search-graph.json`));
const checksum=createHash('sha256').update(bytes).digest('hex');
if(checksum!==graph.corpusSha256||graph.encoderVersion!==1)throw new Error('Incompatible corpus or encoder');
const space=new ArtEmbeddingSpace();
const entries=raw.items.map(item=>({id:item.id,vector:space.encodeArtwork(item,item.visualVector?.length===raw.embedding.visualDimensions?item.visualVector:undefined)}));
const engine=new HybridSearchEngine(entries,raw.items.map(toSearchDocument),()=>{},graph.snapshot);
const queries=['Queen Louise','a blue scarab','a landscape with trees'];
const examples=[];
mkdirSync('static/projects/needle/examples',{recursive:true});
for(const query of queries){
 const result=engine.search({requestId:1,queryKind:'text',queryText:query,vector:[...space.encodeText(query)],k:4,efSearch:64,exact:false});
 const artworks=[];
 for(const hit of result.hits){
  const item=raw.items.find(item=>item.id===hit.id);
  const local=`${root}/data-packs/met-10k-lean-v2/images/${item.objectId}.jpg`;
  let image=null;
  let sourceBytes;
  if(existsSync(local))sourceBytes=readFileSync(local);
  else if(item.imageSourceUrl&&new URL(item.imageSourceUrl).hostname==='images.metmuseum.org'){
   const response=await fetch(item.imageSourceUrl,{signal:AbortSignal.timeout(20000)});
   if(!response.ok)throw new Error(`Artwork ${item.id}: HTTP ${response.status}`);
   sourceBytes=Buffer.from(await response.arrayBuffer());
   if(sourceBytes.length>15_000_000)throw new Error('Image exceeds sample budget');
  }
  if(sourceBytes){
   image=`/projects/needle/examples/${item.objectId}.webp`;
   await sharp(sourceBytes).resize({width:420,height:520,fit:'inside',withoutEnlargement:true}).webp({quality:82}).toFile(`static${image}`);
  }
  artworks.push({id:item.id,title:item.title,artist:item.creator,date:item.objectDate,medium:item.medium,department:item.department,objectUrl:item.objectUrl,image,imageSource:item.imageSourceUrl,tags:item.tags.slice(0,6)});
 }
 console.log(query,artworks.map(x=>({title:x.title,local:!!x.image})));
 examples.push({query,artworks});
}
mkdirSync('src/lib/case-studies/needle',{recursive:true});
writeFileSync('src/lib/case-studies/needle/examples.json',JSON.stringify({corpusSha256:checksum,recordCount:raw.items.length,encoderVersion:1,examples},null,2)+'\n');
