import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Activity, BookOpen, Bookmark, CalendarDays, CircleHelp, ClipboardCheck, Eclipse, Globe2, GraduationCap, LayoutDashboard, LibraryBig, Menu, Plane, RotateCcw, Settings2, Shield, Sparkles, Target, UserRound, X, Zap } from 'lucide-react';
import { api, type Dash, type Session, type Practice } from './types';
import { Dashboard } from './ui';
import { Account, Analytics, Challenges, Curriculum, CurrentAffairs, defaultPractice, Mentor, Mocks, Papers, PracticePage } from './study';
import { Player } from './player';
import { Admin } from './admin';
import './style.css';

const groups=[
  {label:'STUDENT WORKSPACE',items:[['dashboard','Dashboard',LayoutDashboard],['curriculum','My Curriculum',GraduationCap],['practice','Practice MCQs',BookOpen],['papers','Previous-Year Papers',LibraryBig],['examstyle','2027 Exam-Style Questions',Target],['mocks','Full Mock Tests',ClipboardCheck]]},
  {label:'STUDY RESOURCES',items:[['defence','Defence GK',Shield],['affairs','Current Affairs',Globe2],['mentor','AI Mentor',Sparkles],['challenge','Daily Challenge',Zap]]},
  {label:'PROGRESS',items:[['mistakes','Mistake Notebook',CircleHelp],['revision','Revision Center',RotateCcw],['analytics','Analytics',Activity],['bookmarks','Bookmarks',Bookmark]]},
  {label:'ACCOUNT',items:[['profile','Profile',UserRound],['admin','Admin Panel',Settings2]]}
] as const;
const names:Record<string,string>=Object.fromEntries(groups.flatMap(group=>group.items.map(([key,label])=>[key,label])));
const route=()=>location.hash.slice(1)||'dashboard';
function App() {
  const [path,setPath]=useState(route),[data,setData]=useState<Dash|null>(null),[session,setSession]=useState<Session|null>(null),[selection,setSelection]=useState<Partial<Practice>>({}),[variant,setVariant]=useState(0),[mentor,setMentor]=useState<{id:string;index:number}|undefined>(),[error,setError]=useState(''),[sessionError,setSessionError]=useState(''),[menu,setMenu]=useState(false),[dark,setDark]=useState(()=>localStorage.getItem('afcat-theme')==='dark');
  const sessionId=path.startsWith('session/')?path.slice(8):'';
  async function refresh(){setData(await api<Dash>('dashboard'));}
  useEffect(()=>{refresh().catch(e=>setError(e.message));},[]);
  useEffect(()=>{const change=()=>{setPath(route());setMenu(false);window.scrollTo(0,0);};window.addEventListener('hashchange',change);return()=>window.removeEventListener('hashchange',change);},[]);
  useEffect(()=>{document.documentElement.dataset.theme=dark?'dark':'light';localStorage.setItem('afcat-theme',dark?'dark':'light');},[dark]);
  useEffect(()=>{
    let active=true;setSessionError('');
    if(sessionId)api<Session>('session',{id:sessionId}).then(s=>{if(active)setSession(s);}).catch(e=>{if(active)setSessionError(e.message);});
    return()=>{active=false;};
  },[sessionId]);
  function go(next:string){setMenu(false);if(route()===next){window.scrollTo(0,0);return;}location.hash=next;}
  function practice(settings:Partial<Practice>) {setSelection(settings);setVariant(v=>v+1);go('practice');}
  async function start(settings:Practice){
    if(!data?.account)await api('guest');
    const s=await api<Session>('start',settings);
    setSession(s);go('session/'+s.id);void refresh().catch(e=>setError(e.message));
  }
  const open=(id:string)=>go('session/'+id);
  const navigate=(next:string)=>{if(next==='practice'){practice({});return;}if(next==='mentor')setMentor(undefined);go(next);};
  function page() {
    if(!data) return error?<div className="card panel"><p className="error" role="alert">{error}</p><button className="primary" onClick={()=>{setError('');void refresh().catch(e=>setError(e.message));}}>Retry</button></div>:<p role="status">Loading your study workspace…</p>;
    if(sessionId) return sessionError?<p className="error" role="alert">{sessionError}</p>:session?.id===sessionId?<Player key={sessionId} session={session} practice={practice} onSession={s=>{setSession(s);if(s.finished!==null)void refresh().catch(e=>setError(e.message));}} exit={()=>{go('dashboard');void refresh().catch(e=>setError(e.message));}} onMentor={(id,index)=>{setMentor({id,index});go('mentor');}}/>:<p role="status">Restoring your session…</p>;
    switch(path){
      case 'curriculum':return <Curriculum data={data} practice={practice} go={go} task={async(id,done)=>{if(!data.account)await api('guest');await api('task',{id,done});await refresh();}}/>;
      case 'practice':return <PracticePage key={'practice'+variant} data={data} initial={selection} start={start} back={()=>go('mistakes')}/>;
      case 'examstyle':return <PracticePage key={path} kind={path} data={data} initial={{mode:'examstyle'}} start={start} back={()=>go('mistakes')}/>;
      case 'defence':return <PracticePage key={path} kind={path} data={data} initial={{subject:'ga',topic:'Defence',count:5}} start={start} back={()=>go('mistakes')}/>;
      case 'mistakes':return <PracticePage key={path} kind={path} data={data} initial={{filter:'incorrect',count:1}} start={start} back={()=>go('mistakes')}/>;
      case 'bookmarks':return <PracticePage key={path} kind={path} data={data} initial={{filter:'bookmarked',count:1}} start={start} back={()=>go('mistakes')}/>;
      case 'revision':return <PracticePage key={path} kind={path} data={data} initial={{mode:'revision',count:Math.max(1,Math.min(10,data.due))}} start={start} back={()=>go('mistakes')}/>;
      case 'papers':return <Papers data={data} practice={()=>go('examstyle')} start={options=>start({...defaultPractice,...options})}/>;
      case 'affairs':return <CurrentAffairs data={data}/>;
      case 'mocks':return <Mocks data={data} start={start} open={open}/>;
      case 'analytics':return <Analytics data={data} open={open} practice={practice}/>;
      case 'challenge':return <Challenges start={start}/>;
      case 'profile':return <Account key={data.account?.email??'new'} data={data} go={go} refresh={refresh}/>;
      case 'mentor':return <Mentor data={data} selected={mentor}/>;
      case 'admin':return <Admin data={data} refresh={refresh} signin={()=>go('profile')}/>;
      default:return <Dashboard data={data} go={go} practice={practice} open={open}/>;
    }
  }
  return <div className="app">
  <a className="skip" href="#main-content" onClick={e=>{e.preventDefault();document.getElementById('main-content')?.focus();}}>Skip to content</a>
  {menu&&<button className="mobile-shade" aria-label="Close navigation" onClick={()=>setMenu(false)}/>}
  <aside className={'sidebar '+(menu?'shown':'')} aria-label="Main navigation">
    <button className="brand" onClick={()=>go('dashboard')}><span className="brand-icon"><Plane size={22}/></span><span><strong>AFCAT</strong><small>COMMAND CENTER</small></span></button>
    <button className="icon-button close-menu" aria-label="Close menu" onClick={()=>setMenu(false)}><X size={20}/></button>
    <nav>{groups.map(g=><div className="nav-group" key={g.label}><p>{g.label}</p>{g.items.map(([key,label,Icon])=><a key={key} className={path===key?'active':''} href={'#'+key} aria-current={path===key?'page':undefined} onClick={e=>{e.preventDefault();navigate(key);}}><Icon size={16} strokeWidth={1.85}/><span>{label}</span></a>)}</div>)}</nav>
    <div className="sidebar-foot"><span className="brand-mini"><Shield size={14}/></span><div>Independent AFCAT preparation</div></div>
  </aside>
  <div className="workspace">
    <header className="topbar"><div className="breadcrumb"><button className="icon-button open-menu" aria-label="Open navigation" aria-expanded={menu} onClick={()=>setMenu(!menu)}><Menu size={21}/></button><span>Workspace</span><i>/</i><strong>{sessionId?'Question session':names[path]??'Dashboard'}</strong></div>
    <div className="top-actions"><button className="icon-button" aria-label={dark?'Use light theme':'Use dark theme'} onClick={()=>setDark(!dark)}><Eclipse size={19}/></button><span className="top-divider"/><button className="avatar" aria-label="Open profile" onClick={()=>go('profile')}>{data?.profile.name.slice(0,1).toUpperCase()??'C'}</button></div></header>
    <main className="content" id="main-content" tabIndex={-1}>{data&&error&&<p className="error" role="alert">{error}</p>}{page()}</main>
    <footer className="footer"><span>AFCAT Command Center</span>{data&&<a href={data.research.notification}>Official examination notice</a>}</footer>
  </div></div>;
}
createRoot(document.getElementById('root')!).render(<App/>);
