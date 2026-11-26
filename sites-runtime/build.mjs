import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { gzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { build } from 'esbuild';
import { createStore } from '../server/store.mjs';

execFileSync(process.execPath,['node_modules/vite/bin/vite.js','build'],{stdio:'inherit'});
const scratchDirectory=mkdtempSync(join(tmpdir(),'afcat-catalog-'));
const scratch=join(scratchDirectory,'catalog.sqlite');
const store=createStore(scratch,{clock:()=>Date.parse('2026-11-25T00:00:00Z')});
store.close();
const db=new DatabaseSync(scratch);
const rows=db.prepare(`SELECT q.id,q.fingerprint,q.subject,q.topic,q.subtopic,q.difficulty,q.classification,q.body,
  (SELECT actor FROM editorial_log WHERE entity=q.id ORDER BY id LIMIT 1) AS actor FROM questions q WHERE state='published' ORDER BY q.subject,q.topic,q.subtopic,json_extract(q.body,'$.family'),q.id`).all();
const initialRows=rows.filter(row=>!row.actor?.endsWith('-r2'));
const secondRows=rows.filter(row=>row.actor?.endsWith('-r2'));
const seedChunks=[];
function appendChunks(group) {
  for(let i=0;i<group.length;i+=450) {
    const body=JSON.stringify(group.slice(i,i+450).map(row=>Object.values(row)));
    if(Buffer.byteLength(body)>1_800_000) throw Error('A seed chunk exceeds the D1 binding budget.');
    seedChunks.push([createHash('sha256').update(body).digest('hex'),gzipSync(body,{level:9}).toString('base64')]);
  }
}
// Preserve the first release's exact chunk boundaries so a redeploy only installs the new cohort.
appendChunks(initialRows);
appendChunks(secondRows);
const seedSummary={
  blueprint:JSON.parse(db.prepare('SELECT body FROM blueprints WHERE version=1').get().body),
  created:Date.parse('2026-11-25T00:00:00Z'),
  affairs:db.prepare('SELECT id,body FROM affairs').all().map(row=>Object.values(row))
};
db.close();
rmSync(scratchDirectory,{recursive:true,force:true});
const mimes={'.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png'};
const asset=(file,type)=>[type,readFileSync('dist/'+file).toString('base64')];
const assets={'/':asset('index.html','text/html; charset=utf-8'),'/flight.png':['image/webp',readFileSync('sites-runtime/flight.webp').toString('base64')]};
for(const file of readdirSync('dist/assets')) assets['/assets/'+file]=asset('assets/'+file,mimes[file.slice(file.lastIndexOf('.'))]);
const hosting=JSON.parse(readFileSync('.openai/hosting.json','utf8'));
const generated=JSON.stringify({seedChunks,seedSummary,assets,expectedOrigin:hosting.expected_origin??''});
await build({
  entryPoints:['sites-runtime/index.mjs'],outfile:'dist/server/index.js',bundle:true,format:'esm',platform:'browser',target:'es2022',minify:true,
  plugins:[{name:'afcat-content',setup(builder){
    builder.onResolve({filter:/^\.\/generated\.mjs$/},()=>({path:'afcat-content',namespace:'afcat-build'}));
    builder.onLoad({filter:/.*/,namespace:'afcat-build'},()=>({contents:'export const {seedChunks,seedSummary,assets,expectedOrigin}='+generated,loader:'js'}));
  }}]
});
mkdirSync('dist/.openai',{recursive:true});
writeFileSync('dist/.openai/hosting.json',JSON.stringify(hosting,null,2)+'\n');
console.log('Bundled '+rows.length+' published questions in '+seedChunks.length+' chunks.');
