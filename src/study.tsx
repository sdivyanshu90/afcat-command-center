import { useEffect, useState } from 'react';
import { CalendarDays, Clock3, Sparkles } from 'lucide-react';
import { api, ids, fmtDate, subjectShort, subjectDetails, safeUrl, displayTitle, type Dash, type Practice, type Subject, type Session, type Profile } from './types';
import { Empty, Section, subjectIcons } from './ui';
export const defaultPractice:Practice={mode:'learn',subject:'',topic:'',subtopic:'',difficulty:'',filter:'all',count:10};
export function PracticePage({data,initial,start,back,kind='practice'}:{data:Dash;initial:Partial<Practice>;start:(options:Practice)=>Promise<void>;back:()=>void;kind?:string}) {
  const [settings,setSettings]=useState<Practice>({...defaultPractice,...initial}),[count,setCount]=useState<{count:number;patterns:number}|null>(null),[patterns,setPatterns]=useState<{family:string;count:number}[]>([]),[error,setError]=useState(''),[countError,setCountError]=useState(''),[busy,setBusy]=useState(false);
  const topicRows=ids.filter(id=>!settings.subject||id===settings.subject).flatMap(id=>data.taxonomy[id]);
  const subtopics=Array.from(new Set(data.inventory.filter(row=>(!settings.subject||row.subject===settings.subject)&&(!settings.topic||row.topic===settings.topic)).map(row=>row.subtopic))).sort();
  useEffect(()=>{let active=true;setCount(null);setCountError('');api<{count:number;patterns:number}>('count',settings).then(r=>{if(active)setCount(r);}).catch(e=>{if(active)setCountError(e.message);});return()=>{active=false;};},[settings]);
  const {mode,subject,topic,subtopic,difficulty,filter}=settings;
  const suits=kind==='practice'||kind==='examstyle';
  useEffect(()=>{
    let active=true;setPatterns([]);
    if(suits&&topic)api<{family:string;count:number}[]>('patterns',{mode,subject,topic,subtopic,difficulty,filter}).then(r=>{if(active)setPatterns(r);}).catch(e=>{if(active)setCountError(e.message);});
    return()=>{active=false;};
  },[suits,mode,subject,topic,subtopic,difficulty,filter]);
  function change<K extends keyof Practice>(key:K,value:Practice[K]) {setSettings(previous=>({...previous,[key]:value,...(key==='subject'?{topic:'',subtopic:'',family:''}:key==='topic'?{subtopic:'',family:''}:['subtopic','difficulty','filter'].includes(key)?{family:''}:{})}));setError('');}
  const title:Record<string,string>={practice:'Practice MCQs',defence:'Defence GK',examstyle:'AFCAT 2027 Exam-Style Questions',mistakes:'Mistake Notebook',bookmarks:'Bookmarks',revision:'Revision Center'};
  const help:Record<string,string>={defence:'Study public-domain service history, institutions and defence awareness.',examstyle:'Original practice based on the 01/2027 syllabus and formats observed in official model papers.',mistakes:'Reattempt questions you got wrong on your most recent completed try.',bookmarks:'Build a practice set from questions you bookmarked.',revision:'Review questions when their recall interval comes due.'};
  return <>
    <Section title={title[kind]} desc={help[kind]??'Mix question patterns for broader practice, or drill one pattern with fresh variants.'}/>
    {suits&&<div className="subject-grid select-subjects">{ids.map((id,i)=>{const Icon=subjectIcons[id];return <button key={id} className={'card subject-card '+(settings.subject===id?'chosen':'')} aria-pressed={settings.subject===id} onClick={()=>change('subject',settings.subject===id?'':id)}><div className={'icon-box '+['sky','violet','orange','mint'][i]}><Icon size={21}/></div><strong>{subjectShort[id]}</strong><span>{subjectDetails[id]}</span><small>{data.inventory.filter(r=>r.subject===id).reduce((n,r)=>n+r.count,0)} published</small></button>;})}</div>}
    <div className="card panel narrow-panel"><h2>Configure session</h2><form className="form-grid" onSubmit={async e=>{e.preventDefault();setBusy(true);try{await start(settings);}catch(e){setError((e as Error).message);}finally{setBusy(false);}}}>
      <label>Subject<select aria-label="Subject" value={settings.subject} disabled={kind==='defence'} onChange={e=>change('subject',e.target.value)}><option value="">Mixed subjects</option>{ids.map(id=><option value={id} key={id}>{data.subjects[id]}</option>)}</select></label>
      <label>Topic<select aria-label="Topic" value={settings.topic} disabled={kind==='defence'} onChange={e=>change('topic',e.target.value)}><option value="">All topics</option>{[...new Set(topicRows.map(t=>t[0]))].sort().map(t=><option key={t}>{t}</option>)}</select></label>
      <label>Subtopic<select aria-label="Subtopic" value={settings.subtopic} onChange={e=>change('subtopic',e.target.value)}><option value="">All subtopics</option>{subtopics.map(t=><option key={t}>{t}</option>)}</select></label>
      <label>Difficulty<select aria-label="Difficulty" value={settings.difficulty} onChange={e=>change('difficulty',e.target.value)}>{['','Easy','Medium','Hard'].map(x=><option value={x} key={x}>{x||'All levels'}</option>)}</select></label>
      {suits&&kind!=='examstyle'&&<label>Session timing<select value={settings.mode} onChange={e=>change('mode',e.target.value)}><option value="learn">Untimed learning</option><option value="timed">Timed practice</option></select></label>}
      {suits&&<label>Question history<select value={settings.filter} onChange={e=>change('filter',e.target.value)}>{[['all','Any question'],['new','Unattempted'],['attempted','Previously attempted'],['incorrect','Most recently incorrect'],['bookmarked','Bookmarked']].map(([key,label])=><option value={key} key={key}>{label}</option>)}</select></label>}
      {suits&&settings.topic&&(patterns.length>0||settings.family)&&<label>Practice pattern<select aria-label="Practice pattern" value={settings.family??''} onChange={e=>change('family',e.target.value)}><option value="">Mix patterns</option>{settings.family&&!patterns.some(p=>p.family===settings.family)&&<option value={settings.family}>{settings.family}</option>}{patterns.map(p=><option key={p.family} value={p.family}>{p.family} · {p.count}</option>)}</select></label>}
      <label>Question count<input type="number" min="1" max="100" list="practice-counts" value={settings.count||''} required onChange={e=>change('count',Number(e.target.value))}/><datalist id="practice-counts">{[5,10,20,25,50,100].map(n=><option key={n} value={n}/>)}</datalist></label>
      <div className="full"><p className="notice" role="status">{countError|| (count===null?'Checking inventory…':count.count+' eligible questions across '+count.patterns+' patterns or standalone items'+(settings.count>count.count?' · Reduce the count or broaden the filters.':'.'))}</p>{error&&<p role="alert" className="error">{error}</p>}<div className="actions"><button className="primary" disabled={busy||count===null||settings.count>count.count||settings.count<1}>{busy?'Starting…':'Start session'}</button>{kind==='revision'&&<button type="button" className="secondary" onClick={back}>Open mistake notebook</button>}</div></div>
    </form></div>
    {kind==='revision'&&<RecallCards data={data}/>}
    {kind==='examstyle'&&<ExamPaperAnalysis data={data}/>}
  </>;
}
function RecallCards({data}:{data:Dash}) {
  const [index,setIndex]=useState(0),[revealed,setRevealed]=useState(false);
  const cards=[
    {prompt:'Which constitutional remedy can be invoked directly in the Supreme Court to enforce fundamental rights?',answer:'Article 32 guarantees the right to move the Supreme Court for enforcement of fundamental rights.',url:'https://www.legislative.gov.in/static/uploads/2025/08/b9a933fb88c0a5afba254256bc55a3f0.pdf'},
    {prompt:'What is the raw marks change between leaving a question blank and answering it correctly?',answer:'Three marks. A blank earns zero and a correct answer earns three.',url:data.research.notification},
    ...data.research.affairs.map(fact=>({prompt:'Recall a key fact about '+fact.title+'.',answer:fact.summary,url:fact.url}))
  ];
  const card=cards[index];
  return <div className="card panel narrow-panel"><h2>Quick recall cards</h2><p>{card.prompt}</p>{revealed&&<div className="explanation"><p>{card.answer}</p><a href={card.url}>Reference</a></div>}<div className="actions"><button className="secondary" onClick={()=>setRevealed(!revealed)}>{revealed?'Hide answer':'Reveal answer'}</button><button className="text-button" onClick={()=>{setIndex((index+1)%cards.length);setRevealed(false);}}>Next card</button></div></div>;
}
export function Curriculum({data:d,practice,go,task}:{data:Dash;practice:(s:Partial<Practice>)=>void;go:(p:string)=>void;task:(id:string,done:boolean)=>Promise<void>}) {
  const [subject,setSubject]=useState<Subject>(d.profile.priority), [error,setError]=useState('');
  return <><Section title="My Curriculum" desc={d.profile.level+' pathway · '+d.stage}><div className="actions"><button className="secondary" onClick={()=>practice({count:20,filter:'new'})}>Configure diagnostic</button><button className="secondary" onClick={()=>go('profile')}>Edit study profile</button></div></Section>
    <div className="card panel"><h2>Preparation stages</h2><div className="stages">{d.stages.map(s=><span key={s} className={'pill '+(s===d.stage?'':'neutral')}>{s}</span>)}</div></div>
    <div className="card panel"><h2>Today’s schedule</h2><p>{d.profile.minutes} minutes · {d.profile.scope==='all'?'All subjects':subjectShort[d.profile.priority]+' only'}</p>{error&&<p className="error" role="alert">{error}</p>}
      <div className="lesson-list">{d.tasks.map(t=><div className="lesson-row" key={t.id}><label className="check"><input type="checkbox" checked={t.done} onChange={async e=>{try{setError('');await task(t.id,e.target.checked);}catch(err){setError((err as Error).message);}}}/><span className="sr-only">Complete {t.title}</span></label><div><strong>{t.title}</strong><p>{t.objective||'Recall key facts, then check them against your source or explanation.'}</p><small>{t.minutes} min{t.questions?' · '+t.questions+' questions':''}</small></div><button className="secondary" onClick={()=>t.route==='practice'?practice({subject:t.subject,topic:t.topic,count:t.questions||5,difficulty:''}):go(t.route)}>{t.route==='practice'?'Practise':'Open'}</button></div>)}</div></div>
    <div className="card panel"><div className="panel-title"><div><h2>Syllabus map</h2><p>Priorities reflect syllabus relevance and prerequisite value.</p></div><a href={d.research.notification}>IAF notification</a></div><div className="tabs">{ids.map(id=><button key={id} className={subject===id?'active':''} onClick={()=>setSubject(id)}>{subjectShort[id]}</button>)}</div>
      {d.taxonomy[subject].map(([name,objective,sub,priority],i)=>{
        const available=d.inventory.filter(row=>row.subject===subject&&row.topic===name).reduce((n,row)=>n+row.count,0);
        const opportunity=d.topics.find(row=>row.topic===name&&row.subject===subject);
        return <details className="lesson" key={name}><summary>{name} <span className={'pill '+(priority==='high'?'':'neutral')}>{priority==='high'?'High priority':priority==='supporting'?'Supporting':'Medium priority'}</span></summary><p>{objective}</p><p><strong>Subtopics</strong> · {sub.replaceAll('|',' · ')}</p><p><strong>Study guidance</strong> · {priority==='high'?45:30} min · Start Easy or Medium · Revisit after 1, 3 and 7 days.</p><p><strong>Suggested prerequisite</strong> · {i===0?'Start with the essential vocabulary and definitions.':d.taxonomy[subject][i-1][0]+' or equivalent fundamentals.'}</p><p><strong>Practice target</strong> · {available} questions available. Start with {Math.min(10,available)}{opportunity?' · '+opportunity.accuracy+'% recorded accuracy':''}.</p>{priority==='supporting'&&<p>Listed in the older IAF syllabus. The 01/2027 notice omits this topic.</p>}{available>0&&<button className="secondary" onClick={()=>practice({subject,topic:name,count:Math.min(10,available)})}>Practise topic</button>}</details>;
      })}
    </div></>;
}
function ExamPaperAnalysis({data}:{data:Dash}) {
  const research=data.research, analysis=research.analysis;
  return <section className="card panel">
    <h2>Exam paper analysis</h2>
    <p>{analysis.inceptionNote} <a href={analysis.inceptionSource}>2011 notice mirror</a> · <a href={analysis.inceptionCorroboration}>Contemporary report</a></p>
    <p>{analysis.onlineEra.summary} <a href={analysis.onlineEra.source}>Ministry report</a> · <a href={research.notification}>01/2027 notice</a></p>
    <details open>
      <summary>{analysis.officialItems} questions across two official model papers</summary>
      <div className="table-wrap"><table>
        <thead><tr><th>Subject</th>{analysis.models.map(model=><th key={model.title}><a href={model.url}>{model.title}</a></th>)}<th>Total items</th></tr></thead>
        <tbody>{ids.map(subject=><tr key={subject}><th scope="row">{subjectShort[subject]}</th>
          {analysis.models.map(model=><td key={model.title}>{model.ranges[subject]}</td>)}<td>{analysis.modelTotals[subject]}</td>
        </tr>)}</tbody>
      </table></div>
      <p>{analysis.method}</p>
      {analysis.findings.map(item=><article className="source-row" key={item.subject}><div>
        <h3>{subjectShort[item.subject]}</h3><p>{item.summary}</p><small>{item.anchors}</small>
      </div></article>)}
    </details>
    <details>
      <summary>Samples from third-party sources</summary>
      {analysis.historicalSamples.map(sample=><article className="source-row" key={sample.label}><div>
        <h3><a href={sample.url}>{sample.label}</a></h3><p>{sample.type} · {sample.items} entries · {sample.range}</p><p>{sample.details}</p>
      </div></article>)}
      <p>{analysis.historicalLimit}</p>
    </details>
  </section>;
}

export function Papers({data:d,practice,start}:{data:Dash;practice:()=>void;start:(options:Partial<Practice>)=>Promise<void>}) {
  const [year,setYear]=useState(''), [cycle,setCycle]=useState(''), [type,setType]=useState(''), [message,setMessage]=useState(''), [busy,setBusy]=useState(false);
  const [subject,setSubject]=useState(''), [topic,setTopic]=useState(''), [difficulty,setDifficulty]=useState(''), [filter,setFilter]=useState('all');
  const available=d.historical.filter(p=>(!year||String(p.year)===year)&&(!cycle||p.cycle===cycle)&&(!type||p.classification===type));
  const verified=d.historical.filter(p=>p.classification==='OFFICIAL_PREVIOUS_YEAR').reduce((sum,p)=>sum+p.count,0);
  const papers=d.research.papers.filter(p=>(!year||String(p.year)===year)&&(!cycle||p.cycle===cycle)&&(!type||p.type===type));
  return <><Section title="Previous-Year Papers" desc={d.research.analysis.firstYear+"–"+d.research.analysis.lastYear+" · AFCAT 01 and 02, official models, and source references."}/><ExamPaperAnalysis data={d}/>
    <div className="card panel"><div className="form-grid archive-filters"><label>Year<select aria-label="Year" value={year} onChange={e=>setYear(e.target.value)}><option value="">All years</option>{[...new Set(d.research.papers.flatMap(p=>p.year===null?[]:[p.year]))].sort((a,b)=>b-a).map(y=><option key={y}>{y}</option>)}</select></label><label>Cycle<select aria-label="Cycle" value={cycle} onChange={e=>setCycle(e.target.value)}><option value="">Both cycles</option><option>01</option><option>02</option></select></label><label>Source type<select aria-label="Source type" value={type} onChange={e=>setType(e.target.value)}><option value="">All source types</option>{[...new Set(d.research.papers.map(p=>p.type))].map(s=><option key={s} value={s}>{s.replaceAll('_',' ')}</option>)}</select></label></div>
    <p className="notice">{verified} authenticated historical questions available for in-app practice. Model papers and third-party reconstructions have their own source labels.</p>
    {papers.length===0?<Empty title="No source in this selection" text="Try both cycles or select another year."/>:papers.map(p=><article className="source-row" key={p.title}><div><span className="pill">{p.type==='OFFICIAL_PREVIOUS_YEAR'&&!p.key?'OFFICIAL ACCESS NOTICE':p.type.replaceAll('_',' ')}</span><h3>{p.title}</h3><p>{p.publisher}{p.year?' · '+p.cycle+'/'+p.year:''} · {p.complete}</p><small>{p.rights} Source checked {fmtDate(p.verified??d.research.checked)}.</small></div><div className="actions">{p.url&&<a className="secondary" href={p.url} target="_blank" rel="noreferrer">Open source</a>}{p.key&&<a className="secondary" href={p.key} target="_blank" rel="noreferrer">Answer key</a>}</div></article>)}</div>
    {available.length>0&&<div className="card panel"><h2>Published historical practice</h2><div className="form-grid"><label>Subject<select aria-label="Subject" value={subject} onChange={e=>{setSubject(e.target.value);setTopic('');}}><option value="">All subjects</option>{ids.map(id=><option key={id} value={id}>{subjectShort[id]}</option>)}</select></label>
    <label>Topic<select aria-label="Topic" value={topic} onChange={e=>setTopic(e.target.value)}><option value="">All topics</option>{[...new Set(ids.filter(id=>!subject||subject===id).flatMap(id=>d.taxonomy[id].map(t=>t[0])))].sort().map(t=><option key={t}>{t}</option>)}</select></label>
    <label>Difficulty<select aria-label="Difficulty" value={difficulty} onChange={e=>setDifficulty(e.target.value)}><option value="">All levels</option>{['Easy','Medium','Hard'].map(t=><option key={t}>{t}</option>)}</select></label><label>History<select value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">Any question</option><option value="new">Unattempted</option><option value="attempted">Attempted</option></select></label></div>
    {message&&<p className="notice" role="status">{message}</p>}{available.map(({count,...paper})=><article className="source-row" key={JSON.stringify(paper)}><div><h3>AFCAT {paper.cycle}/{paper.year}</h3><p>{paper.classification.replaceAll('_',' ')} · {count} published questions · Completeness depends on source documentation</p>{safeUrl(paper.source)?<a href={paper.source}>Source</a>:<small>{paper.source}</small>}</div>
    <button className="primary" disabled={busy} onClick={async()=>{setBusy(true);setMessage('');try{const options={paper,subject,topic,difficulty,filter};const result=await api<{count:number}>('count',options);if(!result.count){setMessage('No questions match these filters.');return;}await start({...options,count:Math.min(100,result.count)});}catch(e){setMessage((e as Error).message);}finally{setBusy(false);}}}>Practise available questions</button></article>)}</div>}
    <button className="primary" onClick={practice}>Practise original exam-style questions</button></>;
}
export function CurrentAffairs({data:d}:{data:Dash}) {
  const [category,setCategory]=useState(''),[month,setMonth]=useState(''),[day,setDay]=useState('');
  const categories=['Defence','Science and Technology','International Affairs','National Events','Appointments','Awards and Sports'];
  const rows=d.research.affairs.filter(x=>(!category||x.category===category)&&(!month||x.event.startsWith(month))&&(!day||x.event===day)).sort((a,b)=>b.event.localeCompare(a.event));
  return <><Section title="Current Affairs" desc="Dated revision notes with primary-source references."/><div className="card panel"><div className="form-grid archive-filters"><label>Category<select value={category} onChange={e=>setCategory(e.target.value)}><option value="">All categories</option>{categories.map(c=><option key={c}>{c}</option>)}</select></label><label>Event month<input type="month" value={month} onChange={e=>setMonth(e.target.value)}/></label><label>Event day<input type="date" value={day} onChange={e=>setDay(e.target.value)}/></label></div>{rows.length?rows.map(r=><article className="source-row" key={r.title}><div><span className="pill">{r.category}</span><h3>{r.title}</h3><p>{r.summary}</p><small>Event {fmtDate(r.event)} · Published {fmtDate(r.published)} · Checked {fmtDate(r.verified)}</small></div><a className="secondary" href={r.url}>Read source</a></article>):<Empty title="No articles in this view" text="Clear a date or category to view the available notes."/>}</div></>;
}
export function Mocks({data:d,start,open}:{data:Dash;start:(p:Practice)=>Promise<void>;open:(id:string)=>void}) {
  const [error,setError]=useState(''),[busy,setBusy]=useState(false),[counts,setCounts]=useState<Record<string,number>|null>(null);
  useEffect(()=>{api<{bySubject:Record<string,number>}>('count',{mode:'mock'}).then(r=>setCounts(r.bySubject)).catch(e=>setError(e.message));},[]);
  const shortage=counts?ids.filter(id=>counts[id]<d.blueprint.split[id]):[];
  const histories=d.history.filter(s=>s.mode==='mock');
  return <><Section title="Full Mock Tests" desc="Practise with the AFCAT time limit, navigation and raw marking rules."/>
    <div className="card panel mock-panel"><div className="icon-box sky"><Clock3 size={24}/></div><h2>AFCAT 01/2027 full-length mock</h2><p>100 unique questions · 120 minutes · 300 maximum raw marks</p><p>+3 correct · −1 incorrect · 0 unattempted</p><div className="stages">{ids.map(id=><span className="pill" key={id}>{subjectShort[id]} · {d.blueprint.split[id]}</span>)}</div><p>Practice subject split · Blueprint v{d.blueprint.version}</p>{shortage.length>0&&<p role="alert" className="error">Insufficient published questions in {shortage.map(id=>subjectShort[id]).join(', ')}.</p>}{error&&<p className="error" role="alert">{error}</p>}
    <button className="primary" disabled={busy||!counts||shortage.length>0} onClick={async()=>{setBusy(true);try{await start({...defaultPractice,mode:'mock'});}catch(e){setError((e as Error).message);}finally{setBusy(false);}}}>{busy?'Preparing mock…':'Start full mock'}</button></div>
    <div className="card panel"><h2>Mock history</h2>{histories.length?histories.map(s=><div className="source-row" key={s.id}><div><strong>{displayTitle(s.title)}</strong><p>{fmtDate(s.started)} · {s.result?s.result.score+' / 300 raw marks':'In progress'}</p></div><button className="secondary" onClick={()=>open(s.id)}>{s.result?'Review':'Resume'}</button></div>):<Empty title="Your first mock is ahead" text="Completed and in-progress mock exams appear here."/>}</div></>;
}
export function Analytics({data:d,open,practice}:{data:Dash;open:(id:string)=>void;practice:(settings:Partial<Practice>)=>void}) {
  const rows=d.history.filter(s=>s.result);
  return <><Section title="Performance Analytics" desc="Accuracy, mistakes and scores from your completed sessions."/>
    {!rows.length?<Empty title="No completed sessions yet" text="Submit a practice session or mock to see your performance."/>:<><div className="card panel"><h2>Score history</h2><div className="chart" aria-label="Raw score trend">{rows.slice(0,10).reverse().map(s=>{const result=s.result!;const ratio=result.score/(result.total*3);return <button className="chart-col" key={s.id} aria-label={displayTitle(s.title)+' '+fmtDate(s.started)+', '+result.score+' of '+result.total*3} onClick={()=>open(s.id)}><strong>{result.score}</strong><div className="chart-area"><i className={ratio<0?'below':''} style={{height:Math.max(2,ratio<0?Math.abs(ratio)*300:ratio*100)+'%'}}/></div><small>{fmtDate(s.started).split(' ').slice(0,2).join(' ')}</small></button>;})}</div><p>Each column shows the raw score relative to the maximum for that session. Select a session for subject, topic and difficulty breakdowns.</p></div>
    <div className="dash-grid"><div className="card panel"><h2>Weakest topics</h2>{d.weakest.length?d.weakest.map(x=><div className="source-row compact" key={x.subject+x.topic}><strong>{x.topic}</strong><span>{x.accuracy}% · {x.attempts} answered</span></div>):<p>No missed topics in your completed sessions.</p>}</div><div className="card panel"><h2>Slowest topics</h2>{[...d.topics].sort((a,b)=>b.seconds/b.attempts-a.seconds/a.attempts).slice(0,6).map(x=><div className="source-row compact" key={x.subject+x.topic}><strong>{x.topic}</strong><span>{Math.round(x.seconds/x.attempts)} s per answer</span></div>)}</div></div>
    {d.weakPatterns.length>0&&<div className="card panel"><h2>Patterns to revisit</h2>{d.weakPatterns.map(p=><div className="source-row" key={p.subject+p.topic+p.family}><div><strong>{p.family}</strong><p>{p.topic} · {p.accuracy}% accuracy across {p.attempts} answered</p></div><button className="secondary" onClick={async()=>{
      const settings={subject:p.subject,topic:p.topic,family:p.family,filter:'new'};
      try{
        const fresh=await api<{count:number}>('count',settings);
        const filter=fresh.count?'new':'all';
        const available=fresh.count|| (await api<{count:number}>('count',{...settings,filter})).count;
        practice({...settings,filter,count:Math.max(1,Math.min(available,5))});
      }
      catch{practice({...settings,count:1});}
    }}>Drill pattern</button></div>)}</div>}
    <div className="card panel"><h2>Completed sessions</h2>{rows.map(s=><div className="source-row" key={s.id}><div><strong>{displayTitle(s.title)}</strong><p>{fmtDate(s.started)} · {s.result!.score} / {s.result!.total*3} raw marks</p></div><button className="secondary" onClick={()=>open(s.id)}>Review answers</button></div>)}</div></>}
  </>;
}
export function Challenges({start}:{start:(s:Practice)=>Promise<void>}) {
  const [message,setMessage]=useState(''),[busy,setBusy]=useState(false);
  const challenges=[['Daily 10 GK','ga','',10],['Daily defence quiz','ga','Defence',5],['Daily English vocabulary','en','Synonyms and Antonyms',4],['Weekly mixed challenge','','',20],['Weekend revision','','',10]] as const;
  return <><Section title="Daily Challenge" desc="Short retrieval sessions based on the available question bank."/>{message&&<p className="error" role="alert">{message}</p>}<div className="subject-grid">{challenges.map(([name,subject,topic,count])=><button disabled={busy} key={name} className="card subject-card" onClick={async()=>{setBusy(true);setMessage('');try{await start({...defaultPractice,mode:name==='Weekend revision'?'revision':'daily',subject,topic,count,challenge:name});}catch(e){setMessage((e as Error).message);}finally{setBusy(false);}}}><div className="icon-box sky"><CalendarDays size={20}/></div><strong>{name}</strong><small>{count} questions</small></button>)}</div></>;
}
export function Account({data:d,go,refresh}:{data:Dash;go:(s:string)=>void;refresh:()=>Promise<void>}) {
  const [profile,setProfile]=useState<Profile>(d.profile),[mode,setMode]=useState<'signup'|'login'>('signup'),[status,setStatus]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false);
  const change=<K extends keyof Profile>(key:K,value:Profile[K])=>setProfile(previous=>({...previous,[key]:value}));
  return <><Section title="Profile" desc="Manage your study preferences and account."/>
    {error&&<p className="error" role="alert">{error}</p>}{status&&<p className="notice" role="status">{status}</p>}
    {(!d.account||d.account.guest)?<div className="card panel narrow-panel"><div className="tabs"><button className={mode==='signup'?'active':''} onClick={()=>setMode('signup')}>Create account</button><button className={mode==='login'?'active':''} onClick={()=>setMode('login')}>Sign in</button></div><form className="form-grid" onSubmit={async e=>{e.preventDefault();setBusy(true);setError('');const values=Object.fromEntries(new FormData(e.currentTarget));try{await api(mode,values);await refresh();setStatus('Account ready.');}catch(e){setError((e as Error).message);}finally{setBusy(false);}}}>
      {mode==='signup'&&<label>Name<input name="name" autoComplete="name" required defaultValue={profile.name} maxLength={60}/></label>}<label>Email address<input name="email" type="email" autoComplete="email" required/></label><label>Password<input name="password" type="password" required autoComplete={mode==='login'?'current-password':'new-password'} minLength={mode==='signup'?10:1} maxLength={128}/></label><div className="full"><button className="primary" disabled={busy}>{mode==='signup'?'Create account':'Sign in'}</button></div>
    </form></div>:<div className="card panel"><strong>{d.account.email}</strong><div className="actions"><button className="secondary" onClick={async()=>{try{await api('logout');await refresh();go('dashboard');}catch(e){setError((e as Error).message);}}}>Sign out</button></div></div>}
    <div className="card panel narrow-panel"><h2>Study preferences</h2><form className="form-grid" onSubmit={async e=>{e.preventDefault();setError('');try{if(!d.account)await api('guest');await api('profile',profile);await refresh();setStatus('Study preferences saved.');}catch(e){setError((e as Error).message);}}}>
      <label>Preferred name<input value={profile.name} onChange={e=>change('name',e.target.value)} required maxLength={60}/></label><label>Target examination<select value="01/2027" onChange={()=>{}}><option value="01/2027">AFCAT 01/2027</option></select></label>
      <label>Preparation level<select value={profile.level} onChange={e=>change('level',e.target.value as Profile['level'])}>{['Beginner','Intermediate','Advanced'].map(x=><option key={x}>{x}</option>)}</select></label><label>Daily minutes<input value={profile.minutes||''} type="number" min="15" max="480" required onChange={e=>change('minutes',Number(e.target.value))}/></label>
      <label>Priority subject<select value={profile.priority} onChange={e=>change('priority',e.target.value as Subject)}>{ids.map(id=><option key={id} value={id}>{subjectShort[id]}</option>)}</select></label><label>Time allocation<select value={profile.scope} onChange={e=>change('scope',e.target.value as Profile['scope'])}><option value="priority">Priority subject only</option><option value="all">All AFCAT subjects</option></select></label>
      <label>Target raw score (optional)<input type="number" min="0" max="300" value={profile.target??''} onChange={e=>change('target',e.target.value===''?null:Number(e.target.value))}/></label>
      <div className="form-grid full">{ids.map(id=><label key={id}>{subjectShort[id]} confidence<select value={profile.confidence[id]??3} onChange={e=>change('confidence',{...profile.confidence,[id]:Number(e.target.value)})}>{[1,2,3,4,5].map(n=><option key={n} value={n}>{n===1?'1 · Low':n===5?'5 · High':n}</option>)}</select></label>)}</div>
      <div className="full"><button className="primary">Save preferences</button></div>
    </form></div></>;
}
export function Mentor({data:d,selected}:{data:Dash;selected?:{id:string;index:number}}) {
  const [id,setId]=useState(selected?.id??d.history.find(s=>s.result)?.id??''),[index,setIndex]=useState(selected?.index??0),[session,setSession]=useState<Session|null>(null),[intent,setIntent]=useState('explain'),[enhance,setEnhance]=useState(true),[reply,setReply]=useState<{text:string;source:string;ai:boolean}|null>(null),[error,setError]=useState(''),[busy,setBusy]=useState(false);
  useEffect(()=>{let active=true;setSession(null);setReply(null);if(id)api<Session>('session',{id}).then(s=>{if(active)setSession(s);}).catch(e=>{if(active)setError(e.message);});return()=>{active=false;};},[id]);
  const sessions=d.history.filter(s=>s.result||s.id===selected?.id);
  return <><Section title="AFCAT AI Mentor" desc="Work through completed questions using the keyed answer and published explanation."/>
  {!sessions.length?<Empty title="Complete a question first" text="Open the mentor from an answer explanation or return after submitting a session."/>:<div className="card panel narrow-panel"><div className="icon-box violet"><Sparkles size={21}/></div><form className="form-grid" onSubmit={async e=>{e.preventDefault();setBusy(true);setError('');try{setReply(await api('mentor',{id,index,intent,enhance}));}catch(e){setError((e as Error).message);}finally{setBusy(false);}}}>
    <label>Session<select value={id} onChange={e=>{setId(e.target.value);setIndex(0);setError('');}}><option value="">Select a session</option>{sessions.map(s=><option key={s.id} value={s.id}>{displayTitle(s.title)} · {fmtDate(s.started)}</option>)}</select></label>
    <label>Question<select value={index} onChange={e=>{setIndex(Number(e.target.value));setReply(null);}}>{session?.questions.map((q,i)=>q.answer===undefined?null:<option key={q.id} value={i}>{i+1}. {q.topic}</option>)}</select></label>
    <label>Tutor request<select value={intent} onChange={e=>setIntent(e.target.value)}><option value="explain">Explain the answer</option><option value="concept">Teach the concept</option><option value="memory">Give me a recall cue</option><option value="next">Suggest next practice</option></select></label><label className="check"><input type="checkbox" checked={enhance} onChange={e=>setEnhance(e.target.checked)}/> Use the optional AI provider when configured</label>
    <div className="full"><button className="primary" disabled={busy||session?.questions[index]?.answer===undefined}>{busy?'Preparing explanation…':'Ask mentor'}</button></div></form>
    {error&&<p className="error" role="alert">{error}</p>}{reply&&<div className="explanation"><h3>{reply.ai?'AI-assisted explanation':'Published study guidance'}</h3><p>{reply.text}</p>{safeUrl(reply.source)?<a href={reply.source}>Question reference</a>:<small>{reply.source}</small>}</div>}</div>}</>;
}
