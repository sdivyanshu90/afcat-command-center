export type Subject = 'ga' | 'en' | 'num' | 'rea';
export type Count = {correct:number;incorrect:number;blank:number;score:number;total:number;seconds:number};
export type Result = Count & {groups:{subject:Record<string,Count>;topic:Record<string,Count>;difficulty:Record<string,Count>}};
export type History = {id:string;title:string;mode:string;started:number;deadline:number|null;finished:number|null;result:Result|null};
export type Question = {id:string; version:number; subject:Subject;topic:string;subtopic:string;prompt:string;options:string[];answer?:number;explanation?:string;source?:string;family?:string;concept?:string;references?:string[];classification:string;objective:string;difficulty:string;style:string;diagram?:string;hint?:string;selected:number|null;marked:boolean;visited:boolean;locked:boolean;bookmarked:boolean};
export type Session = {id:string;mode:string;title:string;deadline:number|null;finished:number|null;serverNow:number;position:number;result:Result|null;questions:Question[]};
export type Profile = {name:string;level:'Beginner'|'Intermediate'|'Advanced';minutes:number;priority:Subject;scope:'priority'|'all';target:number|null;confidence:Partial<Record<Subject,number>>};
export type Task = {id:string;title:string;topic:string;subject:Subject;minutes:number;route:string;objective:string;questions:number;done:boolean};
export type Topic = [string,string,string,'high'|'medium'|'supporting'];
export type TopicStats = {subject:Subject;topic:string;attempts:number;accuracy:number;seconds:number;correct:number;incorrect:number};
export type Blueprint = {label:string;date:string;duration:number;count:number;correct:number;wrong:number;blank:number;split:Record<Subject,number>;version:number};
export type Affair = {title:string;category:string;event:string;published:string;verified:string;summary:string;url:string};
export type Paper = {title:string;type:string;publisher:string;year:number|null;cycle:string|null;complete:string;key:string|null;url:string;rights:string;verified?:string};
export type ExamAnalysis = {
  firstYear:number; lastYear:number; firstSitting:string; inceptionNote:string; inceptionSource:string; inceptionCorroboration:string;
  onlineEra:{summary:string;source:string}; officialItems:number;
  models:{title:string;url:string;ranges:Record<Subject,string>}[]; modelTotals:Record<Subject,number>; method:string;
  findings:{subject:Subject;summary:string;anchors:string}[];
  historicalSamples:{label:string;type:string;range:string;items:number;details:string;url:string}[]; historicalLimit:string;
};
export type Dash = {profile:Profile;account:{guest:boolean;role:string;email:string}|null;subjects:Record<Subject,string>;taxonomy:Record<Subject,Topic[]>;blueprint:Blueprint;days:number;count:number;inventory:{subject:Subject;topic:string;subtopic:string;difficulty:string;count:number}[];due:number;streak:number;weakPatterns:{subject:Subject;topic:string;family:string;attempts:number;accuracy:number;incorrect:number}[];totals:{correct:number;incorrect:number;seconds:number};topics:TopicStats[];weakest:TopicStats[];coverage:number;tasks:Task[];stages:string[];stage:string;latest:{id:string;score:number}|null;history:History[];historical:Historical[];research:{analysis:ExamAnalysis;notification:string;syllabus:string;models:string;portal:string;checked:string;papers:Paper[];affairs:Affair[];formats:{label:string;source:string}[];sample:{modelDocuments:number;historicalQuestionsCoded:number;quality:string}}};
export type Historical = {source:string;year:number;cycle:string;classification:string;count:number};
export type Practice = {mode:string;subject:string;topic:string;subtopic:string;difficulty:string;filter:string;count:number;challenge?:string;family?:string;paper?:Omit<Historical,'count'>};
export const ids:Subject[] = ['ga','en','num','rea'];
export const subjectShort:Record<Subject,string> = {ga:'General Awareness',en:'English',num:'Numerical Ability',rea:'Reasoning & Aptitude'};
export const subjectDetails:Record<Subject,string> = {ga:'Polity, defence, science and current affairs',en:'Vocabulary, grammar and comprehension',num:'Arithmetic, mensuration and data',rea:'Verbal, logical and non-verbal reasoning'};
export const displayTitle=(text:string)=>text.startsWith('challenge:')?text.split(':')[1]:text;
export const fmtDate=(date:string|number)=>new Intl.DateTimeFormat('en-IN',{day:'numeric',month:'short',year:'numeric',timeZone:'Asia/Kolkata'}).format(typeof date==='number'?date:new Date(date+'T00:00:00+05:30'));
export const safeUrl=(url:string|undefined)=>url&&/^https?:\/\//i.test(url)?url:undefined;
export async function api<T>(action:string,body:unknown={}):Promise<T> {
  for(let attempt=0;attempt<20;attempt++){
    const response=await fetch('/api/'+action,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    const result=await response.json();
    if(response.status===503 && result.code==='initializing') {
      await new Promise(resolve=>window.setTimeout(resolve,Math.min(1000,200*(attempt+1))));
      continue;
    }
    if(!response.ok) throw Error(result.error??'Request failed.');
    return result as T;
  }
  throw Error('The question bank is still being prepared. Try again in a moment.');
}
