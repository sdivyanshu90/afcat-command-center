import { useEffect, useRef, useState } from 'react';
import { Bookmark, ChevronLeft, ChevronRight, Clock3, Flag, Lightbulb } from 'lucide-react';
import { api, displayTitle, safeUrl, subjectShort, type Session, type Count, type Practice } from './types';
import { Section, Stats } from './ui';

export function Breakdown({groups}:{groups:Record<string,Count>}) {
  if(!Object.keys(groups).length) return null;
  return <div className="table-wrap"><table><thead><tr><th scope="col">Area</th><th scope="col">Raw score</th><th scope="col">Accuracy</th><th scope="col">Time</th></tr></thead><tbody>{Object.entries(groups).map(([key,v])=><tr key={key}><td>{key.includes('|')?key.split('|')[1]:subjectShort[key as keyof typeof subjectShort]??key}</td><td>{v.score} / {v.total*3}</td><td>{v.correct+v.incorrect?Math.round(v.correct/(v.correct+v.incorrect)*100)+'%':'—'}</td><td>{v.seconds} s</td></tr>)}</tbody></table></div>;
}
export function Player({session,onSession,exit,onMentor,practice}:{session:Session;onSession:(s:Session)=>void;exit:()=>void;onMentor:(id:string,index:number)=>void;practice:(settings:Partial<Practice>)=>void}) {
  const [busy,setBusy]=useState(false), [error,setError]=useState(''), [hint,setHint]=useState(false), [confirm,setConfirm]=useState(false), [report,setReport]=useState(false), [reportMessage,setReportMessage]=useState(''), [sent,setSent]=useState(false);
  const [review,setReview]=useState(0);
  const dialog=useRef<HTMLDialogElement>(null);
  useEffect(()=>{if(confirm&&!dialog.current?.open)dialog.current?.showModal();},[confirm]);
  const [time,setTime]=useState(Date.now());
  const offset=useRef({id:session.id,value:session.serverNow-Date.now()});
  if(offset.current.id!==session.id) offset.current={id:session.id,value:session.serverNow-Date.now()};
  const gate=useRef(false);
  const position=session.finished!==null?review:session.position, q=session.questions[position];
  const remaining=session.deadline===null?null:Math.max(0,Math.ceil((session.deadline-time-offset.current.value)/1000));
  async function act(kind:string,value?:boolean|number|null,index=position) {
    if(gate.current)return;
    gate.current=true;setBusy(true);setError('');
    try {onSession(await api<Session>('answer',{id:session.id,index,kind,value}));if(kind==='submit')setConfirm(false);}
    catch(e){setError(String((e as Error).message));}
    finally{gate.current=false;setBusy(false);}
  }
  useEffect(()=>{
    if(session.deadline===null||session.finished!==null)return;
    const timer=window.setInterval(()=>setTime(Date.now()),350);
    return ()=>clearInterval(timer);
  },[session.deadline,session.finished]);
  useEffect(()=>{if(remaining===0&&session.finished===null&&!busy&&!error)void act('submit');});
  function go(next:number) {
    if(next<0||next>=session.questions.length||next===position||busy)return;
    if(session.finished!==null)setReview(next);else void act('visit',undefined,next);
  }
  useEffect(()=>{setHint(false);setReport(false);setReportMessage('');setSent(false);},[position]);
  useEffect(()=>{
    function key(e:KeyboardEvent){
      if(confirm || e.altKey || e.ctrlKey || e.metaKey || (e.target as HTMLElement)?.closest('input,textarea,select,[contenteditable]'))return;
      if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();go(position+(e.key==='ArrowRight'?1:-1));}
      if(/^[1-4]$/.test(e.key)&&session.finished===null&&!q.locked){e.preventDefault();void act('select',Number(e.key)-1);}
    }
    window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);
  });
  const done=session.finished!==null, answered=session.questions.filter(x=>x.selected!==null).length;
  return <>
    <Section title={done?'Session results':displayTitle(session.title)} desc={done?displayTitle(session.title)+' · Raw AFCAT scoring':session.mode==='mock'?'Full-length AFCAT practice exam':'Syllabus-aligned practice'}>
      <button className="secondary" disabled={busy} onClick={async()=>{if(done){exit();return;}try{await api('answer',{id:session.id,index:position,kind:'pause'});exit();}catch(err){setError((err as Error).message);}}}>{done?'Dashboard':'Save and exit'}</button>
    </Section>
    {session.result&&<><Stats stats={session.result}/><div className="card panel result-breakdown"><details open><summary>Subject breakdown</summary><Breakdown groups={session.result.groups.subject}/></details><details><summary>Topic breakdown</summary><Breakdown groups={session.result.groups.topic}/></details><details><summary>Difficulty breakdown</summary><Breakdown groups={session.result.groups.difficulty}/></details></div></>}
    {error&&<p role="alert" className="error">{error}</p>}
    {remaining!==null&&!done&&<div className={'timer '+(remaining<=60?'urgent':'')}><Clock3 size={18}/><strong>{Math.floor(remaining/60)}:{String(remaining%60).padStart(2,'0')}</strong><span>remaining</span>{remaining===0&&error&&<button onClick={()=>act('submit')}>Retry submission</button>}</div>}
    <div className="player-grid">
      <article className="card question-card">
        <div className="question-top"><div><span className="pill">{subjectShort[q.subject]}</span> <span className="pill neutral">{q.difficulty}</span></div><button className={'icon-button '+(q.bookmarked?'starred':'')} aria-label={q.bookmarked?'Remove bookmark':'Bookmark question'} aria-pressed={q.bookmarked} disabled={busy} onClick={()=>act('bookmark',!q.bookmarked)}><Bookmark size={19}/></button></div>
        <p className="eyebrow">QUESTION {position+1} OF {session.questions.length} · {q.topic}</p>
        <h2 className="prompt">{q.prompt}</h2>
        {q.diagram&&<pre className="diagram" aria-hidden="true">{q.diagram}</pre>}
        <div className="options">{q.options.map((option,i)=><button type="button" className={'option '+(q.answer===i?'correct':q.selected===i&&q.answer!==undefined?'wrong':q.selected===i?'selected':'')} key={i} aria-pressed={q.selected===i} disabled={busy||done||q.locked} onClick={()=>act('select',i)}><span>{'ABCD'[i]}</span>{option}{q.answer===i&&<small>Correct</small>}</button>)}</div>
        {!done&&<div className="actions split">
          <button className="secondary" disabled={busy||q.locked||q.selected===null} onClick={()=>act('select',null)}>Clear response</button>
          <button className={'secondary '+(q.marked?'starred':'')} disabled={busy} aria-pressed={q.marked} onClick={()=>act('mark',!q.marked)}><Flag size={15}/>{q.marked?'Marked for review':'Mark for review'}</button>
          {q.hint&&<button className="secondary" onClick={()=>setHint(!hint)}><Lightbulb size={16}/> Hint</button>}
          {session.mode==='learn'&&!q.locked&&<button className="primary" disabled={busy||q.selected===null} onClick={()=>act('check')}>Submit answer</button>}
        </div>}
        {hint&&q.hint&&<p className="notice">{q.hint}</p>}
        {q.explanation&&<div className="explanation"><h3>Explanation</h3><p>{q.explanation}</p>{q.concept&&<p><strong>Concept</strong> · {q.concept}</p>}{q.family&&<p><strong>Pattern</strong> · {q.family}</p>}<small>{q.classification.replaceAll('_',' ')} · v{q.version}</small><div className="actions">{safeUrl(q.source)?<a href={q.source} target="_blank" rel="noreferrer">Question reference</a>:<span>{q.source}</span>}{q.references?.filter(url=>url!==q.source&&safeUrl(url)).map((url,i)=><a key={url} href={url} target="_blank" rel="noreferrer">Supporting reference {i+1}</a>)}{q.family&&<button className="text-button" onClick={async()=>{try{const lookup={subject:q.subject,topic:q.topic,family:q.family,filter:'new'};const r=await api<{count:number}>('count',lookup);if(!r.count){setError('You have already attempted all available variants in this pattern.');return;}if(!done)await api('answer',{id:session.id,index:position,kind:'pause'});practice({...lookup,count:Math.min(r.count,5)});}catch(err){setError((err as Error).message);}}}>Practise this pattern</button>}<button className="text-button" onClick={()=>onMentor(session.id,position)}>Ask mentor</button><button className="text-button" onClick={()=>setReport(!report)}>Report issue</button></div>
          {report&&<form className="actions" onSubmit={async e=>{e.preventDefault();try{await api('report',{id:session.id,index:position,message:reportMessage});setSent(true);setReport(false);}catch(err){setError((err as Error).message);}}}><input aria-label="Question issue" value={reportMessage} minLength={8} maxLength={1000} required onChange={e=>setReportMessage(e.target.value)}/><button className="secondary">Send report</button></form>}
          {sent&&<p role="status">Issue sent for review.</p>}
        </div>}
        <div className="actions player-navigation"><button className="secondary" disabled={busy||!position} onClick={()=>go(position-1)}><ChevronLeft size={16}/> Previous</button><button className="primary" disabled={busy||position===session.questions.length-1} onClick={()=>go(position+1)}>{done?'Next':'Save and next'} <ChevronRight size={16}/></button></div>
      </article>
      <aside className="card panel palette"><h2>{done?'Answer review':'Question navigator'}</h2><p>{answered} of {session.questions.length} answered</p><div className="question-grid">{session.questions.map((item,i)=>{
        const status=done?item.selected===null?'Unattempted':item.selected===item.answer?'Correct':'Incorrect':item.marked?'Marked':item.selected!==null?'Answered':item.visited?'Unanswered':'Unvisited';
        return <button key={item.id} className={status.toLowerCase()+(i===position?' active':'')} aria-current={i===position?'step':undefined} aria-label={'Question '+(i+1)+', '+status} disabled={busy} onClick={()=>go(i)}>{i+1}</button>;
      })}</div><div className="legend">{(done?['Correct','Incorrect','Unattempted']:['Answered','Unanswered','Unvisited','Marked']).map(label=><span key={label}><i className={label.toLowerCase()}/>{label}</span>)}</div>
      {!done&&<button className="primary wide" disabled={busy} onClick={()=>setConfirm(true)}>Submit session</button>}<p className="keyboard">Keyboard: 1–4 to answer, arrow keys to navigate.</p></aside>
    </div>
    {confirm&&<dialog ref={dialog} className="card modal" aria-labelledby="submit-title" onCancel={()=>setConfirm(false)}><h2 id="submit-title">Submit session?</h2><p>{answered} answered · {session.questions.length-answered} unattempted</p><div className="actions"><button autoFocus className="secondary" onClick={()=>setConfirm(false)}>Keep working</button><button disabled={busy} className="primary" onClick={()=>act('submit')}>Confirm submission</button></div></dialog>}
  </>;
}
