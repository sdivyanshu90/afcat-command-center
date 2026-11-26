import { seedChunks, seedSummary } from './generated.mjs';

async function expand(chunk) {
  const bytes=Uint8Array.from(atob(chunk),char=>char.charCodeAt(0));
  return new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).text();
}

export async function prepareCatalog(db) {
  const primary=db.withSession('first-primary');
  const rows=(await primary.prepare('SELECT id FROM catalog_chunks').all()).results;
  const installed=new Set(rows.map(row=>row.id));
  const missing=seedChunks.filter(([id])=>!installed.has(id));
  const wanted=missing.slice(0,4);
  for(const [id,chunk] of wanted) {
    const body=await expand(chunk);
    const statement=(sql,...args)=>primary.prepare(sql).bind(...args);
    const pending='NOT EXISTS(SELECT 1 FROM catalog_chunks WHERE id=?)';
    await primary.batch([
      statement('INSERT OR IGNORE INTO blueprints VALUES(1,?,?,?)',seedSummary.blueprint.label,JSON.stringify(seedSummary.blueprint),seedSummary.created),
      statement(`INSERT OR IGNORE INTO affairs SELECT value->>0,value->>1 FROM json_each(?) WHERE ${pending} AND NOT EXISTS(SELECT 1 FROM affairs WHERE body=json_each.value->>1)`,JSON.stringify(seedSummary.affairs),id),
      statement(`INSERT OR IGNORE INTO questions SELECT value->>0,value->>1,1,'published',value->>2,value->>3,value->>4,value->>5,value->>6,value->>7,? FROM json_each(?) WHERE ${pending}`,seedSummary.created,body,id),
      statement(`INSERT OR IGNORE INTO question_versions SELECT value->>0,1,value->>7,? FROM json_each(?) WHERE ${pending}`,seedSummary.created,body,id),
      statement(`INSERT INTO editorial_log(actor,entity,action,notes,created) SELECT value->>8,value->>0,'create','published',? FROM json_each(?) WHERE ${pending} AND NOT EXISTS(SELECT 1 FROM editorial_log WHERE entity=json_each.value->>0 AND action='create')`,seedSummary.created,body,id),
      statement('INSERT OR IGNORE INTO catalog_chunks VALUES(?)',id)
    ]);
  }
  return wanted.length===missing.length;
}
