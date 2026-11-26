import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createStore } from '../server/store.mjs';

const day=86_400_000;
const timestamp=Date.parse('2026-11-22T10:00:00Z');
const password='editor test secret phrase';
function fixture(t, filename=':memory:'){
  let now=timestamp;
  const store=createStore(filename,{clock:()=>now,adminPassword:password,installPacks:false});
  t.after(()=>store.close());
  let token=store.api('guest').cookie;
  return {store,advance:ms=>{now+=ms;},use:(name,body={})=>store.api(name,body,token),token:()=>token,
    signup:()=>{token=store.api('signup',{email:'student@example.test',password:'student test secret',name:'Asha'},token).cookie;},
    editor:()=>{const editor=store.api('login',{email:'admin@afcat.local',password}).cookie;return (name,body={})=>store.api(name,body,editor);}};
}

test('verified format, both historical cycles and real inventory',t=>{
  const {use}=fixture(t);
  const d=use('dashboard');
  assert.equal(d.blueprint.duration,120);
  assert.equal(d.blueprint.count,100);
  assert.equal(d.count,117);
  assert.equal(d.research.papers.filter(x=>x.type==='OFFICIAL_MODEL').length,2);
  assert.equal(new Set(d.research.papers.filter(x=>x.year).map(x=>x.year+':'+x.cycle)).size,32);
  assert.equal(d.historical.length,0);
  assert.equal(use('count',{subject:'ga',topic:'Indian Polity'}).count,22);
  assert.throws(()=>use('start',{subject:'ga',topic:'Indian Polity',count:23}),/22 eligible/);
});
test('signup preserves guest progress, onboarding drives GK plan, Polity practice checks and scores',async t=>{
  const {use,signup,advance,store}=fixture(t);
  const begun=use('start',{subject:'ga',topic:'Indian Polity',count:20});
  assert.equal(new Set(begun.questions.map(q=>q.id)).size,20);
  assert.equal(begun.questions[0].answer,undefined);
  signup();
  const profile=use('dashboard').profile;
  use('profile',{...profile,priority:'ga',scope:'priority',minutes:180});
  const plan=use('dashboard').tasks;
  assert.deepEqual(plan.map(x=>x.minutes),[60,45,30,30,15]);
  assert.equal(plan[0].topic,'Indian Polity');
  use('task',{id:'core',done:true});
  assert.equal(use('dashboard').tasks[0].done,true);
  assert.throws(()=>store.api('session',{id:begun.id},store.api('guest').cookie),/Session not found/);
  const submit=(index,kind,value)=>use('answer',{id:begun.id,index,kind,value});
  advance(5000);
  submit(0,'select',0);
  const first=submit(0,'check').questions[0];
  assert.match(first.explanation,/./);
  assert.equal(submit(0,'select',1).questions[0].selected,0);
  assert.equal(submit(0,'bookmark',true).questions[0].bookmarked,true);
  submit(1,'visit');
  advance(10000);
  submit(1,'select',0);
  const second=submit(1,'check').questions[1];
  const finished=submit(1,'submit');
  const correct=[first,second].filter(q=>q.answer===0).length;
  assert.equal(finished.result.score,4*correct-2);
  assert.equal(finished.result.blank,18);
  assert.equal(finished.result.seconds,15);
  assert.deepEqual(submit(1,'submit').result,finished.result);
  assert.equal(use('dashboard').totals.correct,correct);
  assert.equal(use('count',{filter:'bookmarked'}).count,1);
  const mentor=await use('mentor',{id:begun.id,index:0,intent:'explain'});
  assert.equal(mentor.ai,false);
  assert.ok(mentor.text.includes(first.options[first.answer]));
});
test('a first-time user can create an account without a guest cookie',t=>{
  const {store}=fixture(t);
  const session=store.api('signup',{email:'new@example.test',password:'new student secret',name:'First-time student'});
  assert.equal(store.api('dashboard',{},session.cookie).profile.name,'First-time student');
});
test('mock persists through reopen, hides keys, and expiry is server-authoritative', async t=>{
  const filename=join(mkdtempSync(join(tmpdir(),'afcat-test-')),'database.sqlite');
  const {use,token}=fixture(t,filename);
  const mock=use('start',{mode:'mock'});
  assert.equal(mock.questions.length,100);
  assert.equal(new Set(mock.questions.map(q=>q.id)).size,100);
  assert.equal(mock.deadline-timestamp,120*60_000);
  assert.ok(mock.questions.every(q=>!('answer' in q)&&!('explanation' in q)));
  await assert.rejects(use('mentor',{id:mock.id,index:0,intent:'explain'}),/Complete this question/);
  use('answer',{id:mock.id,kind:'select',index:0,value:1});
  use('answer',{id:mock.id,kind:'mark',index:0,value:true});
  use('answer',{id:mock.id,kind:'visit',index:17});
  let now=timestamp+4000;
  const reopened=createStore(filename,{clock:()=>now,installPacks:false});
  t.after(()=>reopened.close());
  const resumed=reopened.api('session',{id:mock.id},token());
  assert.deepEqual(resumed.questions[0].options,mock.questions[0].options);
  assert.equal(resumed.position,17);
  assert.equal(resumed.questions[0].selected,1);
  assert.equal(resumed.questions[0].marked,true);
  assert.equal(resumed.deadline,mock.deadline);
  now=mock.deadline+1000;reopened.expire();
  const result=reopened.api('answer',{id:mock.id,kind:'select',index:17,value:0},token());
  assert.equal(result.finished,mock.deadline);
  assert.equal(result.questions[17].selected,null);
  assert.equal(result.result.blank,99);
  assert.equal(result.result.score,result.questions[0].answer===1?3:-1);
  assert.deepEqual(reopened.api('dashboard',{},token()).latest,{id:mock.id,score:result.result.score});
});

const sample={subject:'num',topic:'Averages and Percentages',subtopic:'Percentage Change',prompt:'Compute the final percentage on fixture example.',options:['20%','30%','40%','50%'],answer:1,explanation:'The result is 30 percent in this test fixture.',difficulty:'Easy',source:'https://example.com/facts'};
test('bulk import handles 500 rows, rejects duplicates and enforces review transitions',t=>{
  const {use,editor}=fixture(t),admin=editor();
  assert.throws(()=>use('import',{entries:[sample]}),/Editorial access/);
  const entries=Array.from({length:500},(_,i)=>({...sample,prompt:sample.prompt+' '+i}));
  const report=admin('import',{entries});
  assert.equal(report.imported,500);
  assert.equal(admin('import',{entries}).duplicates,500);
  assert.equal(use('dashboard').count,117);
  const ids=Array.from({length:17},(_,page)=>admin('inventory',{state:'draft',query:'fixture example',page}).records).flat().map(r=>r.id);
  assert.equal(ids.length,500);
  assert.throws(()=>admin('transition',{ids,state:'published'}),/cannot move/);
  for(const state of ['validated','review','verified','published']){
    const result=admin('transition',{ids,state,notes:'Verified fixtures for testing.'});
    assert.equal(result.updated,500);
  }
  assert.equal(use('dashboard').count,617);
  const record=admin('inventory',{query:ids[0]}).records[0];
  const old=use('start',{subject:'num',topic:'Averages and Percentages',count:100});
  const target=old.questions.find(q=>q.id.startsWith('numeric-'))??old.questions[0];
  const edit=admin('inventory',{query:target.id}).records.find(x=>x.id===target.id);
  assert.ok(record);
  assert.ok(edit);
  admin('edit',{id:edit.id,version:edit.version,entry:{...edit,explanation:'New draft explanation retained out of historical attempts.'}});
  const current=use('session',{id:old.id});
  assert.equal(current.questions.find(q=>q.id===target.id).version,edit.version);
  assert.equal(admin('inventory',{query:edit.id}).records.find(x=>x.id===edit.id).version,edit.version+1);
});
test('revision derives from wrong answers and recall updates the next date',t=>{
  const {use,advance}=fixture(t);
  const s=use('start',{subject:'ga',topic:'Indian Polity',count:1});
  const act=(kind,value,id=s.id)=>use('answer',{id,index:0,kind,value});
  act('select',0);
  const first=act('check');
  const target=first.questions[0].answer;
  if(target===0){
    assert.equal(act('submit').result.correct,1);
    // Use a fresh question rather than changing a locked response.
    const mock=use('start',{subject:'ga',topic:'Indian Polity',count:20});
    for(let i=0;i<20;i++)use('answer',{id:mock.id,index:i,kind:'select',value:0});
    assert.ok(use('answer',{id:mock.id,kind:'submit'}).result.incorrect>0);
  }else assert.equal(act('submit').result.incorrect,1);
  assert.equal(use('count',{mode:'revision'}).count,0);
  assert.ok(use('dashboard').weakest.length>0);
  advance(day);
  const before=use('count',{mode:'revision'}).count;
  assert.ok(before>0);
  const revision=use('start',{mode:'revision',count:1});
  act('select',0,revision.id);act('check',undefined,revision.id);act('submit',undefined,revision.id);
  assert.equal(use('count',{mode:'revision'}).count,before-1);
});
test('generation produces drafts and provenance gates historical practice',t=>{
  const {use,editor}=fixture(t),admin=editor();
  const draft=admin('generate',{count:3,topic:'Ratio and Proportion'});
  assert.ok(draft.imported>=1);
  assert.equal(use('dashboard').count,117);
  const historical={...sample,year:2020,cycle:'02',number:1,classification:'LICENSED_PREVIOUS_YEAR'};
  assert.equal(admin('import',{entries:[historical]}).imported,0);
  const approved=admin('edit',{entry:{...historical,permission:'Integration test publication permission.'}}).id;
  for(const state of ['validated','review','verified','published'])admin('transition',{id:approved,state,notes:'Test rights and answer verified.'});
  const [paper]=use('dashboard').historical;
  assert.equal(paper.count,1);
  assert.equal(use('start',{paper,count:1}).questions[0].classification,'LICENSED_PREVIOUS_YEAR');
  assert.equal(use('count',{mode:'mock'}).bySubject.num,22);
});

test('50,000-question capacity smoke test pages inventory and builds a filtered session',t=>{
  const directory=mkdtempSync(join(tmpdir(),'afcat-capacity-'));
  const filename=join(directory,'database.sqlite');
  const {use,editor}=fixture(t,filename);
  t.after(()=>rmSync(directory,{recursive:true,force:true}));
  const db=new DatabaseSync(filename);
  const base=JSON.stringify({...sample,classification:'ORIGINAL_AFCAT_STYLE',version:1,objective:'Capacity test objective.',style:'Fixture'});
  db.exec('BEGIN');
  db.prepare(`WITH RECURSIVE sequence(i) AS (VALUES(1) UNION ALL SELECT i+1 FROM sequence WHERE i<50000)
    INSERT INTO questions
    SELECT 'capacity-'||i, 'capacity-'||i, 1, 'published', 'num', 'Averages and Percentages',
      'Percentage Change', 'Easy', 'ORIGINAL_AFCAT_STYLE',
      json_set(?, '$.id', 'capacity-'||i, '$.prompt', 'Capacity fixture '||i), ?
    FROM sequence`).run(base,timestamp);
  db.exec(`INSERT INTO question_versions
    SELECT id,version,body,changed FROM questions WHERE id LIKE 'capacity-%'; COMMIT;`);
  db.close();
  assert.ok(use('count',{subject:'num',topic:'Averages and Percentages',difficulty:'Easy'}).count>=50000);
  const session=use('start',{mode:'learn',subject:'num',topic:'Averages and Percentages',count:100});
  assert.equal(new Set(session.questions.map(q=>q.id)).size,100);
  const inventory=editor()('inventory',{query:'Capacity fixture',page:100});
  assert.equal(inventory.count,50000);
  assert.equal(inventory.records.length,30);
});

test('expanded packs preserve existing attempts, cover all topics, and seed each subject once',t=>{
  const directory=mkdtempSync(join(tmpdir(),'afcat-expansion-'));
  const filename=join(directory,'database.sqlite');
  t.after(()=>rmSync(directory,{recursive:true,force:true}));
  const baseline=createStore(filename,{clock:()=>timestamp,installPacks:false});
  const token=baseline.api('guest').cookie;
  const previous=baseline.api('start',{subject:'ga',topic:'Indian Polity',count:3},token);
  baseline.api('answer',{id:previous.id,index:0,kind:'select',value:2},token);
  const previousResult=baseline.api('answer',{id:previous.id,index:0,kind:'submit'},token);
  baseline.close();

  const db=createStore(filename,{clock:()=>timestamp});
  const call=(action,input={})=>db.api(action,input,token);
  const d=call('dashboard');
  assert.deepEqual(call('session',{id:previous.id}),previousResult);
  for(const subject of Object.keys(d.subjects)) {
    const subjectCount=call('count',{subject}).count;
    assert.ok(subjectCount>4000,subject+' has '+subjectCount+' published questions');
    for(const [topic,,,priority] of d.taxonomy[subject]) {
      if(priority!=='supporting') assert.ok(call('count',{subject,topic}).count>=5,'Thin topic: '+topic);
    }
  }
  const mock=call('start',{mode:'mock'});
  const mockTopics=new Set(mock.questions.map(q=>q.subject+'|'+q.topic));
  assert.ok(mockTopics.size>=40,'Full mock should sample broadly');
  assert.ok(mock.questions.every(q=>q.answer===undefined&&q.source===undefined&&q.family===undefined));
  const pattern=call('patterns',{subject:'num',topic:'Time and Work'}).find(row=>row.count>=5);
  assert.ok(pattern);
  const filters={subject:'num',topic:'Time and Work',family:pattern.family,filter:'new'};
  const drill=call('start',{...filters,count:5});
  call('answer',{id:drill.id,index:0,kind:'select',value:0});
  const reviewed=call('answer',{id:drill.id,index:0,kind:'check'});
  assert.equal(reviewed.questions[0].family,pattern.family);
  assert.equal(call('count',filters).count,pattern.count-1);
  const completed=call('answer',{id:drill.id,kind:'submit'});
  assert.ok(completed.questions.every(q=>q.family===pattern.family));
  db.close();

  const reopened=createStore(filename,{clock:()=>timestamp});
  assert.equal(reopened.api('dashboard',{},token).count,d.count);
  reopened.close();
  const sqlite=new DatabaseSync(filename,{readOnly:true});
  assert.equal(sqlite.prepare('SELECT COUNT(*) n FROM content_packs').get().n,8);
  sqlite.close();
});
