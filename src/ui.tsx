import { ArrowUpRight, BookOpen, Brain, Calculator, Globe2, Shield, Target, Layers, Activity, Clock3, CircleCheck, Flame } from 'lucide-react';
import type { ReactNode } from 'react';
import { ids, subjectShort, subjectDetails, type Dash, type Subject, type Count, type Practice } from './types';

export const subjectIcons = {ga:Globe2,en:BookOpen,num:Calculator,rea:Brain};
export function Section({title,desc,children}:{title:string;desc?:string;children?:ReactNode}) {
  return <section><header className="section-head"><div><h1>{title}</h1>{desc&&<p>{desc}</p>}</div>{children}</header></section>;
}
export function Empty({title,text,children}:{title:string;text:string;children?:ReactNode}) {
  return <div className="empty"><Layers size={24}/><h3>{title}</h3><p>{text}</p>{children}</div>;
}
export function Stats({stats}:{stats:Count}) {
  const attempted=stats.correct+stats.incorrect;
  return <div className="stats-grid">{[
    ['Raw score',stats.score+' / '+stats.total*3],['Correct',stats.correct],['Incorrect',stats.incorrect],['Unattempted',stats.blank],
    ['Accuracy',attempted?Math.round(stats.correct/attempted*100)+'%':'—'],['Attempt rate',Math.round(attempted/stats.total*100)+'%'],['Avg. response time',attempted?Math.round(stats.seconds/attempted)+' sec':'—']
  ].map(([label,value])=><div className="card stat" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>;
}
export function Dashboard({data:d,go,practice,open}:{data:Dash;go:(route:string)=>void;practice:(settings:Partial<Practice>)=>void;open:(id:string)=>void}) {
  const attempts=d.totals.correct+d.totals.incorrect;
  const resume=d.history.find(s=>s.finished===null);
  const subjectsCount=d.inventory.reduce((counts,row)=>({...counts,[row.subject]:(counts[row.subject]??0)+row.count}),{} as Partial<Record<Subject,number>>);
  const syllabus=ids.reduce((n,id)=>n+d.taxonomy[id].filter(t=>t[3]!=='supporting').length,0);
  const percent=attempts?Math.round(d.totals.correct/attempts*100):null;
  return <>
    <div className="welcome"><div><p className="eyebrow">YOUR PREPARATION OVERVIEW</p><h1>Welcome back, {d.profile.name}.</h1><p>Build the knowledge and confidence to take on AFCAT.</p></div><div className="cycle"><span/> {d.blueprint.label}</div></div>
    <div className="hero">
      <div className="hero-content"><div className="hero-tag"><Target size={15}/> TARGET EXAM</div><h2>Prepare with Precision.<br/>Aim Higher.</h2><p>AFCAT 01/2027 <i/> 31 January 2027</p><button className="primary hero-button" onClick={()=>resume?open(resume.id):go('practice')}>{resume?'Resume session':'Start practice'}</button></div>
      <div className="countdown"><Clock3 size={17}/><div><strong>{d.days}</strong><span>DAYS TO EXAM</span></div></div>
    </div>
    <div className="metric-grid">
      {[
        {label:'Questions attempted',value:attempts,note:'Across completed sessions',Icon:CircleCheck,color:'sky'},
        {label:'Practice accuracy',value:percent===null?'—':percent+'%',note:attempts?d.totals.correct+' correct answers':'Complete a session to begin',Icon:Target,color:'violet'},
        {label:'Study streak',value:d.streak+' '+(d.streak===1?'day':'days'),note:Math.round(d.totals.seconds/60)+' min studied in sessions',Icon:Flame,color:'orange'},
        {label:'Latest mock score',value:d.latest?d.latest.score+' / 300':'—',note:d.latest?'View answer review':'Take your first full mock',Icon:Activity,color:'mint'}
      ].map(({label,value,note,Icon,color})=><div className="card metric" key={label}><div className={'icon-box '+color}><Icon size={19}/></div><span>{label}</span><strong>{value}</strong>{label==='Latest mock score'?<button className="plain muted" onClick={()=>d.latest?open(d.latest.id):go('mocks')}>{note}</button>:<small>{note}</small>}</div>)}
    </div>
    <div className="dash-grid">
      <div className="card panel"><div className="panel-title"><div><h2>Today’s study plan</h2><p>{d.profile.minutes} minutes · {d.profile.scope==='all'?'All subjects':subjectShort[d.profile.priority]+' focus'}</p></div><button className="text-button" onClick={()=>go('curriculum')}>View plan <ArrowUpRight size={14}/></button></div>
      <div className="task-list">{d.tasks.map((t,i)=>{const Icon=[BookOpen,Shield,Globe2,Target,Brain][i];return <button key={t.id} className="task-row" onClick={()=>t.route==='practice'?practice({subject:t.subject,topic:t.topic,count:t.questions||5}):go(t.route)}><span className={'icon-box '+['sky','violet','mint','orange','sky'][i]}><Icon size={17}/></span><span><strong>{t.title}</strong><small>{t.done?'Completed':i===0?'Core study':i===1?'Secondary study':i===2?'Read and recall':i===3?'Apply what you learned':'Review previously missed questions'}</small></span><span className="duration">{t.minutes} min</span></button>;})}</div></div>
      <div className="card panel"><div className="panel-title"><div><h2>Subject mastery</h2><p>{d.coverage} of {syllabus} topics at 75%+ with 3+ answers</p></div><button className="text-button" onClick={()=>go('analytics')}>Analytics <ArrowUpRight size={14}/></button></div>
      <div className="mastery">{ids.map((id,i)=>{const Icon=subjectIcons[id];const rows=d.topics.filter(t=>t.subject===id);const all=rows.reduce((sum,t)=>sum+t.attempts,0);const value=all?Math.round(rows.reduce((sum,t)=>sum+t.correct,0)/all*100):null;return <button className="mastery-row" key={id} onClick={()=>practice({subject:id})}><div><Icon size={16}/><strong>{subjectShort[id]}</strong><span>{value===null?'—':value+'%'}</span></div><div className="track"><i className={'bar tone'+i} style={{width:(value??0)+'%'}}/></div></button>;})}</div>
      <div className="recommend"><Target size={18}/><div><strong>{d.due?d.due+' questions due for recall':d.weakest[0]?'Revisit '+d.weakest[0].topic:'Recommended next activity'}</strong><p>{d.due?'Strengthen recall with a short review.':d.weakest[0]?'Practise the topic where your accuracy is lowest.':'Start with '+d.tasks[0].topic+' to establish a baseline.'}</p><button className="text-button" onClick={()=>d.due?go('revision'):practice({subject:d.weakest[0]?.subject??d.tasks[0].subject,topic:d.weakest[0]?.topic??d.tasks[0].topic,count:5})}>{d.due?'Open revision':'Practise topic'}</button></div></div></div>
    </div>
    <div className="strip-head"><h2>Explore subjects</h2><button className="text-button" onClick={()=>go('practice')}>All practice</button></div>
    <div className="subject-grid">{ids.map((id,i)=>{const Icon=subjectIcons[id];return <button key={id} className="card subject-card" onClick={()=>practice({subject:id})}><div className={'icon-box '+['sky','violet','orange','mint'][i]}><Icon size={21}/></div><strong>{subjectShort[id]}</strong><span>{subjectDetails[id]}</span><small>{subjectsCount[id]??0} questions</small></button>;})}</div>
  </>;
}
