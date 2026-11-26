// D1 batches are atomic. A shared revision makes reads used to plan mutations
// optimistic: if a mutation commits in the meantime, retry with fresh rows.
export function repository(database) {
  const db=database.withSession('first-primary');
  const prepare=(sql,...args)=>db.prepare(sql).bind(...args);
  let staged=null;
  const get=async(sql,...args)=>(await prepare(sql,...args).first())??undefined;
  const all=async(sql,...args)=>(await prepare(sql,...args).all()).results;
  function run(sql,...args) {
    if(!staged) throw Error('Expected a batched mutation');
    staged.push(prepare(sql,...args));
  }
  async function tx(work) {
    for(let attempt=0;attempt<5;attempt++) {
      const base=await get('SELECT revision FROM worker_revision WHERE id=1');
      staged=[];
      let value, statements;
      try { value=await work(); statements=staged; }
      finally { staged=null; }
      if(!statements.length) return value;
      try {
        await db.batch([
          prepare('INSERT INTO worker_revision(id,revision) SELECT 0,0 WHERE (SELECT revision FROM worker_revision WHERE id=1)<>?',base.revision),
          ...statements,
          prepare('UPDATE worker_revision SET revision=revision+1 WHERE id=1')
        ]);
        return value;
      } catch(error) {
        const current=await get('SELECT revision FROM worker_revision WHERE id=1');
        if(current.revision===base.revision || !/CHECK constraint failed/i.test(String(error))) throw error;
      }
    }
    throw Object.assign(Error('The session changed in another request. Please retry.'),{status:409});
  }
  return {get,all,run,tx};
}
