import { useEffect, useState } from 'react';
import { api, fmtDate, ids, subjectShort, type Dash } from './types';
import { Empty, Section } from './ui';
type RecordRow={id:string;version:number;state:string;prompt:string;subject:string;topic:string;classification:string};
type Inventory={count:number;records:RecordRow[];totals:{state:string;subject:string;classification:string;topic:string;count:number}[];jobs:{id:string;kind:string;created:number;summary:unknown}[];reports:{id:number;question_id:string;version:number;body:string;created:number}[]};
const transitions:Record<string,string[]>={draft:['validated','rejected'],validated:['review','rejected'],review:['verified','rejected'],verified:['published','rejected'],published:['unpublished'],unpublished:['review'],rejected:['draft']};
const example={subject:'ga',topic:'Indian Polity',subtopic:'Constitution',prompt:'',options:['','','',''],answer:0,explanation:'',difficulty:'Medium',source:'',classification:'ORIGINAL_AFCAT_STYLE'};
function csv(text:string):unknown[] {
  const rows:string[][]=[];
  let row:string[]=[],cell='',inQuote=false,closed=false;
  const field=()=>{row.push(cell);cell='';closed=false;};
  const line=()=>{field();if(row.some(Boolean))rows.push(row);row=[];};
  for(let i=0;i<text.length;i++){
    const c=text[i];
    if(inQuote){
      if(c==='"'&&text[i+1]==='"'){cell+='"';i++;}
      else if(c==='"'){inQuote=false;closed=true;}
      else cell+=c;
    }else if(c===',')field();
    else if(c==='\n'||c==='\r'){if(c==='\r'&&text[i+1]==='\n')i++;line();}
    else if(c==='"'&&!cell&&!closed)inQuote=true;
    else if(c==='"'||closed)throw Error('Malformed CSV near row '+(rows.length+1)+'.');
    else cell+=c;
  }
  if(inQuote)throw Error('The CSV has an unclosed quote.');
  if(cell||row.length||closed)line();
  const headers=rows.shift()?.map(h=>h.trim())??[];
  if(!headers.includes('prompt')||headers.length!==new Set(headers).size)throw Error('CSV requires unique headings including prompt.');
  return rows.map((cells,i)=>{
    if(cells.length!==headers.length)throw Error('CSV column count differs on row '+(i+2)+'.');
    const q=Object.fromEntries(headers.map((key,j)=>[key,cells[j]]).filter(([,value])=>value!==''));
    for(const n of ['answer','year','number'])if(q[n]!==undefined)(q as Record<string,unknown>)[n]=Number(q[n]);
    const entry:Record<string,unknown>=q;
    entry.options=q.optionA!==undefined?[q.optionA,q.optionB,q.optionC,q.optionD]:q.options?JSON.parse(q.options):[];
    return entry;
  });
}
export function Admin({data:d,refresh,signin}:{data:Dash;refresh:()=>Promise<void>;signin:()=>void}) {
  const [tab,setTab]=useState('Inventory'),[inventory,setInventory]=useState<Inventory|null>(null),[page,setPage]=useState(0),[query,setQuery]=useState(''),[state,setState]=useState(''),[revision,setRevision]=useState(0),[selected,setSelected]=useState<RecordRow[]>([]),[editing,setEditing]=useState<RecordRow|null>(null),[body,setBody]=useState(JSON.stringify(example,null,2)),[raw,setRaw]=useState(''),[format,setFormat]=useState('JSON'),[notes,setNotes]=useState(''),[output,setOutput]=useState<unknown>(),[error,setError]=useState(''),[busy,setBusy]=useState(false);
  const [split,setSplit]=useState(d.blueprint.split);
  const isAdmin=d.account?.role==='admin';
  useEffect(()=>{let active=true;if(isAdmin)api<Inventory>('inventory',{page,query,state}).then(r=>{if(active)setInventory(r);}).catch(e=>{if(active)setError(e.message);});return()=>{active=false;};},[page,query,state,revision,isAdmin]);
  async function action(name:string,payload:unknown,after?:()=>void) {
    setError('');setOutput(undefined);setBusy(true);
    try{const value=await api(name,payload);setOutput(value);setRevision(r=>r+1);await refresh();after?.();}
    catch(e){setError((e as Error).message);}finally{setBusy(false);}
  }
  function begin(record?:RecordRow) {
    setEditing(record??null);
    setBody(JSON.stringify(record?Object.fromEntries(Object.entries(record).filter(([key])=>!['id','version','state','changed'].includes(key))):example,null,2));
    setTab('Question editor');
  }
  function select(record:RecordRow) {setSelected(old=>old.some(q=>q.id===record.id)?old.filter(q=>q.id!==record.id):[...old,record]);}
  const steps=selected[0]?(transitions[selected[0].state]??[]).filter(move=>selected.every(q=>transitions[q.state]?.includes(move))):[];
  const totals=inventory?.totals??[];
  return <><Section title="Editorial Administration" desc="Review question versions, verify answer keys and publish approved content."/>
    {!isAdmin?<Empty title="Editorial access required" text="Sign in using an administrator account to open this workspace."><button className="primary" onClick={signin}>Open profile</button></Empty>:<>
    <div className="stats-grid">{['published','draft','verified','review'].map(stage=><div className="card stat" key={stage}><span>{stage==='review'?'Awaiting review':stage}</span><strong>{totals.filter(x=>x.state===stage).reduce((sum,x)=>sum+x.count,0)}</strong></div>)}</div>
    <div className="card panel"><div className="tabs">{['Inventory','Question editor','Import & generate','Blueprint','Current affairs','Reports'].map(t=><button key={t} className={tab===t?'active':''} onClick={()=>{setTab(t);setOutput(undefined);setError('');}}>{t}</button>)}</div>
    {error&&<p className="error" role="alert">{error}</p>}
    {tab==='Inventory'&&<>
      <div className="form-grid archive-filters"><label>Search questions<input value={query} onChange={e=>{setQuery(e.target.value);setPage(0);}} placeholder="Prompt, topic or ID"/></label><label>Workflow state<select value={state} onChange={e=>{setState(e.target.value);setPage(0);}}><option value="">All states</option>{Object.keys(transitions).map(s=><option key={s}>{s}</option>)}</select></label></div>
      <div className="actions"><button className="primary" onClick={()=>begin()}>Add question</button><button className="secondary" onClick={()=>setSelected(old=>{const map=new Map([...old,...inventory?.records??[]].map(r=>[r.id,r]));return [...map.values()];})}>Select page</button><button className="secondary" onClick={()=>setSelected([])}>Clear selection</button></div>
      {selected.length>0&&<div className="notice"><p>{selected.length} selected</p><label>Review rationale<input value={notes} onChange={e=>setNotes(e.target.value)}/></label><div className="actions">{steps.map(s=><button className="secondary" key={s} disabled={busy} onClick={()=>action('transition',{ids:selected.map(q=>q.id),state:s,notes},()=>setSelected([]))}>Move to {s}</button>)}</div></div>}
      {!inventory?<p role="status">Loading inventory…</p>:<><div className="table-wrap"><table><thead><tr><th>Select</th><th>Prompt</th><th>State</th><th>Actions</th></tr></thead><tbody>{inventory.records.map(q=><tr key={q.id}><td><input type="checkbox" aria-label={'Select '+q.prompt} checked={selected.some(x=>x.id===q.id)} onChange={()=>select(q)}/></td><td><strong>{q.topic}</strong><br/>{q.prompt.slice(0,140)}{q.prompt.length>140?'…':''}</td><td>{q.state} · v{q.version}</td><td><div className="actions"><button className="secondary" onClick={()=>begin(q)}>Edit</button><button className="text-button" onClick={()=>action('near',{id:q.id})}>Similar</button><button className="text-button" onClick={()=>action('audit',{id:q.id})}>Audit</button></div></td></tr>)}</tbody></table></div>
      <div className="actions"><button className="secondary" disabled={page===0} onClick={()=>setPage(p=>p-1)}>Previous page</button><span>Page {page+1} · {inventory.count} matches</span><button className="secondary" disabled={(page+1)*30>=inventory.count} onClick={()=>setPage(p=>p+1)}>Next page</button></div>
      <details><summary>Subject, topic and source inventory</summary><div className="table-wrap"><table><thead><tr><th>Subject</th><th>Topic</th><th>Source</th><th>State</th><th>Count</th></tr></thead><tbody>{totals.map(x=><tr key={JSON.stringify(x)}><td>{x.subject}</td><td>{x.topic}</td><td>{x.classification}</td><td>{x.state}</td><td>{x.count}</td></tr>)}</tbody></table></div></details></>}
    </>}
    {tab==='Question editor'&&<form className="stack" onSubmit={e=>{e.preventDefault();try{const entry=JSON.parse(body);void action('edit',{id:editing?.id,version:editing?.version,entry},()=>setTab('Inventory'));}catch(e){setError((e as Error).message);}}}><h2>{editing?'Edit question v'+editing.version:'New question'}</h2><p>Saving creates a draft version. The review workflow controls publication.</p><label>Question JSON<textarea rows={18} value={body} onChange={e=>setBody(e.target.value)} required spellCheck={false}/></label><button className="primary" disabled={busy}>Save draft</button></form>}
    {tab==='Import & generate'&&<><form className="stack" onSubmit={e=>{e.preventDefault();try{void action('import',{entries:format==='JSON'?JSON.parse(raw):csv(raw.replace(/^\uFEFF/,''))});}catch(e){setError((e as Error).message);}}}><h2>Import questions</h2><p>Up to 500 records per file. CSV requires the same fields as question JSON, with optionA–optionD columns and a zero-based answer index.</p><label>Format<select value={format} onChange={e=>setFormat(e.target.value)}><option>JSON</option><option>CSV</option></select></label><label>Load file<input type="file" accept=".json,.csv" onChange={async e=>{const file=e.target.files?.[0];if(!file)return;if(file.size>4_500_000){setError('Choose a file under 4.5 MB.');return;}try{setRaw(await file.text());setFormat(file.name.toLowerCase().endsWith('.csv')?'CSV':'JSON');}catch(e){setError((e as Error).message);}}}/></label><label>Question data<textarea rows={7} value={raw} onChange={e=>setRaw(e.target.value)} required/></label><button className="primary" disabled={busy}>Import drafts</button></form>
    <form className="form-grid divider" onSubmit={e=>{e.preventDefault();const form=new FormData(e.currentTarget);void action('generate',{topic:form.get('topic'),count:Number(form.get('count'))});}}><h2 className="full">Generate arithmetic drafts</h2><label>Objective<select name="topic">{['Averages and Percentages','Time and Work','Ratio and Proportion'].map(t=><option key={t}>{t}</option>)}</select></label><label>Draft count<input name="count" type="number" min="1" max="30" defaultValue="5" required/></label><div><button className="secondary" disabled={busy}>Generate drafts</button></div></form>
    <details className="divider"><summary>Recent jobs and duplicate reports</summary>{inventory?.jobs.map(j=><div className="notice" key={j.id}><strong>{j.kind} · {fmtDate(j.created)}</strong><pre>{JSON.stringify(j.summary,null,2)}</pre></div>)}</details></>}
    {tab==='Blueprint'&&<form className="form-grid" onSubmit={e=>{e.preventDefault();void action('blueprint',{split,version:d.blueprint.version});}}><h2 className="full">Approve a new practice distribution</h2><p className="full">Version {d.blueprint.version} · The total must equal 100 questions.</p>{ids.map(id=><label key={id}>{subjectShort[id]}<input type="number" min="1" max="97" required value={split[id]} onChange={e=>setSplit({...split,[id]:Number(e.target.value)})}/></label>)}<div className="full"><button className="primary" disabled={busy}>Approve distribution</button></div></form>}
    {tab==='Current affairs'&&<form className="form-grid" onSubmit={e=>{e.preventDefault();const form=e.currentTarget;void action('affair',Object.fromEntries(new FormData(form)),()=>form.reset());}}><h2 className="full">Add a verified current-affairs note</h2><label className="full">Title<input name="title" required/></label><label>Category<select name="category">{['Defence','Science and Technology','International Affairs','National Events','Appointments','Awards and Sports'].map(s=><option key={s}>{s}</option>)}</select></label><label>Event date<input name="event" type="date" required/></label><label>Publication date<input name="published" type="date" required/></label><label>Verification date<input name="verified" type="date" required/></label><label className="full">Primary source URL<input name="url" type="url" required/></label><label className="full">Summary<textarea name="summary" required/></label><div className="full"><button className="primary" disabled={busy}>Publish note</button></div></form>}
    {tab==='Reports'&&(inventory?.reports.length?inventory.reports.map(r=><div className="source-row" key={r.id}><div><strong>{r.question_id} · v{r.version}</strong><p>{r.body}</p></div><button className="secondary" disabled={busy} onClick={()=>action('resolve',{id:r.id})}>Resolve</button></div>):<Empty title="No open reports" text="Student reports will appear here."/>)}
    {output!==undefined&&<div className="notice"><h3>Operation result</h3><pre>{JSON.stringify(output,null,2)}</pre></div>}
    </div></>}
  </>;
}
