import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import worker from '../dist/server/index.js';
import { createWorkerStore } from '../sites-runtime/store.mjs';

function d1Fixture(){
  const sql=new DatabaseSync(':memory:');
  sql.exec('PRAGMA foreign_keys=ON');
  for(const migration of ['0000_core','0001_catalog_guard']) sql.exec(readFileSync(new URL('../drizzle/'+migration+'.sql',import.meta.url),'utf8'));
  const d1={
    withSession(){return this;},
    prepare(query){
      const statement=sql.prepare(query);
      function bind(...params){
        return {bind,first:async()=>statement.get(...params)??null,all:async()=>({results:statement.all(...params)}),commit:()=>statement.run(...params)};
      }
      return bind();
    },
    async batch(statements){
      sql.exec('BEGIN');
      try{const result=statements.map(statement=>statement.commit());sql.exec('COMMIT');return result;}
      catch(error){sql.exec('ROLLBACK');throw error;}
    }
  };
  return {sql,d1};
}
const origin='https://afcat.test';
function request(action,payload={},token='',requestOrigin=origin){
  return new Request(origin+'/api/'+action,{method:'POST',headers:{Origin:requestOrigin,'Content-Type':'application/json',Cookie:'afcat_sid='+token},body:JSON.stringify(payload)});
}

test('Worker boots a fresh database, loads all practice packs and preserves assessment invariants',async t=>{
  const {sql,d1}=d1Fixture();
  t.after(()=>sql.close());
  const env={DB:d1,APP_ORIGIN:origin};
  assert.equal((await worker.fetch(new Request(origin),env)).status,200);
  assert.equal((await worker.fetch(request('dashboard',{},'','https://other.test'),env)).status,403);
  let response;
  for(let i=0;i<20;i++){
    response=await worker.fetch(request('dashboard'),env);
    if(response.status!==503) break;
  }
  assert.equal(response.status,200);
  const data=await response.json();
  assert.equal(data.count,17083);
  assert.equal(data.research.analysis.officialItems,200);
  assert.equal(new Set(data.research.papers.filter(paper=>paper.year).map(paper=>paper.year+':'+paper.cycle)).size,32);
  for(const subject of ['ga','en','num','rea']){
    assert.ok(data.inventory.filter(row=>row.subject===subject).reduce((sum,row)=>sum+row.count,0)>4000);
  }
  assert.equal(sql.prepare('SELECT COUNT(*) n FROM question_versions').get().n,17083);
  assert.equal((await worker.fetch(new Request(origin+'/data/awareness.json'),env)).status,404);
  let time=Date.now();
  const store=()=>createWorkerStore(d1,{clock:()=>time});
  const guest=await worker.fetch(request('guest'),env);
  assert.equal(guest.status,200);
  let token=guest.headers.get('Set-Cookie').match(/afcat_sid=([^;]+)/)[1];
  const call=(action,payload)=>store().api(action,payload,token);
  const practice=await call('start',{subject:'ga',topic:'Indian Polity',count:5});
  const signup=await call('signup',{name:'Asha',email:'asha@example.test',password:'example test password'});
  assert.equal(signup.value.ok,true);
  token=signup.cookie;
  assert.equal((await call('session',{id:practice.id})).id,practice.id);
  const mock=await call('start',{mode:'mock'});
  assert.equal(mock.questions.length,100);
  assert.ok(mock.questions.every(q=>q.answer===undefined));
  await Promise.all([call('answer',{id:mock.id,index:0,kind:'select',value:0}),call('answer',{id:mock.id,index:1,kind:'select',value:1})]);
  assert.equal((await call('session',{id:mock.id})).questions[1].selected,1);
  time=mock.deadline+10;
  const attempts=await Promise.all([call('answer',{id:mock.id,kind:'submit'}),call('answer',{id:mock.id,kind:'submit'}),call('answer',{id:mock.id,index:2,kind:'select',value:2})]);
  const finished=attempts[0];
  assert.equal(finished.finished,mock.deadline);
  assert.equal(finished.questions[2].selected,null);
  assert.equal(finished.result.blank,98);
  assert.equal(finished.result.score,(finished.questions[0].answer===0?3:-1)+(finished.questions[1].answer===1?3:-1));
  assert.ok(attempts.every(attempt=>attempt.result.score===finished.result.score));
  assert.equal((await call('dashboard')).latest.id,mock.id);
  const mentor=await call('mentor',{id:mock.id,index:0,intent:'explain',enhance:false});
  assert.ok(mentor.text.includes(finished.questions[0].options[finished.questions[0].answer]));
  await assert.rejects(call('inventory'),/Editorial access/);
  const adminStore=()=>createWorkerStore(d1,{clock:()=>time,adminPassword:'administration test secret'});
  const admin=(await adminStore().api('login',{email:'admin@afcat.local',password:'administration test secret'})).cookie;
  const imported=await adminStore().api('import',{entries:Array.from({length:500},(_,i)=>({
    subject:'num',topic:'Averages and Percentages',subtopic:'Fixture',prompt:'Editorial test fixture row '+i,
    options:['One','Two','Three','Four'],answer:0,explanation:'Fixture explanation for deployment testing.',difficulty:'Easy',source:'https://example.test/fixture'
  }))},admin);
  assert.equal(imported.imported,500);
  assert.equal((await adminStore().api('inventory',{state:'draft'},admin)).count,500);
});

test('Sites catalogue upgrade keeps the deployed chunks and in-progress attempts', {
  skip: !process.env.AFCAT_BASELINE_SITE_WORKER
}, async t=>{
  const {sql,d1}=d1Fixture();
  t.after(()=>sql.close());
  const {default:baseline}=await import(process.env.AFCAT_BASELINE_SITE_WORKER);
  const env={DB:d1,APP_ORIGIN:origin};
  async function ready(runtime, token='') {
    for(let attempt=0;attempt<20;attempt++){
      const response=await runtime.fetch(request('dashboard',{},token),env);
      const info=await response.json();
      if(response.ok) return info;
      assert.equal(info.code,'initializing');
    }
    assert.fail('Catalogue did not finish installing');
  }
  assert.equal((await ready(baseline)).count,9570);
  const guest=await baseline.fetch(request('guest'),env);
  const token=guest.headers.get('Set-Cookie').match(/afcat_sid=([^;]+)/)[1];
  const started=await (await baseline.fetch(request('start',{mode:'mock'},token),env)).json();
  assert.equal(started.questions.length,100);
  const saved=await baseline.fetch(request('answer',{id:started.id,index:0,kind:'select',value:1},token),env);
  assert.equal(saved.status,200);
  const oldChunks=sql.prepare('SELECT id FROM catalog_chunks ORDER BY id').all().map(row=>row.id);
  assert.equal(oldChunks.length,22);

  assert.equal((await ready(worker,token)).count,17083);
  const upgradedChunks=new Set(sql.prepare('SELECT id FROM catalog_chunks').all().map(row=>row.id));
  assert.equal(upgradedChunks.size,39);
  assert.ok(oldChunks.every(id=>upgradedChunks.has(id)));
  const restored=await (await worker.fetch(request('session',{id:started.id},token),env)).json();
  assert.equal(restored.deadline,started.deadline);
  assert.deepEqual(restored.questions.map(q=>[q.id,q.version,q.options]),started.questions.map(q=>[q.id,q.version,q.options]));
  assert.equal(restored.questions[0].selected,1);
  assert.equal(restored.questions[0].answer,undefined);
});
