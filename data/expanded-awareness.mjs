import { createHash } from 'node:crypto';
import { economy } from './facts-economy.mjs';
import { polity } from './facts-polity.mjs';
import { science } from './facts-science.mjs';
import { history } from './facts-history.mjs';
import { defence } from './facts-defence.mjs';

const normalize = value => value.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
const directives = [
  'Both answers are correct',
  'Only answer I is correct',
  'Only answer II is correct',
  'Neither answer is correct'
];
const groups = [
  ['Recall', 'Direct factual or conceptual recall'],
  ['Match an answer to its clue', 'Reverse retrieval'],
  ['Match two answers', 'Ordered pair matching'],
  ['Check two proposed answers', 'Statement evaluation'],
  ['Correct a study note', 'Error identification']
];

function hash(value) {
  return createHash('sha256').update(value).digest('hex');
}

function distinct(values) {
  return new Set(values.map(normalize)).size === values.length;
}

function poolFor(row, all) {
  const different = other => other !== row && normalize(other.answer)!==normalize(row.answer);
  const topic = all.filter(other=>other.topic===row.topic && different(other));
  const subtopic = topic.filter(other=>other.subtopic===row.subtopic);
  if(subtopic.length>=4) return subtopic;
  if(topic.length>=4) return topic;
  return all.filter(different);
}

function partners(row, pool, count, label) {
  const ranks=pool.map(other=>[hash(label+'|'+row.prompt+'|'+other.prompt),other]);
  ranks.sort((a,b)=>a[0].localeCompare(b[0]));
  const labels=new Set([normalize(row.answer)]);
  const result=[];
  for(const [,other] of ranks) {
    const name=normalize(other.answer);
    if(labels.has(name)) continue;
    labels.add(name);
    result.push(other);
    if(result.length===count) break;
  }
  return result;
}

function item(row, form, prompt, options, answer, explanation, partners=[]) {
  const [name,style]=groups[form];
  const references=[...new Set(partners.map(r=>r.source).filter(source=>source!==row.source))];
  return {
    subject:'ga',topic:row.topic,subtopic:row.subtopic,prompt,options,answer,explanation,
    difficulty:form===0&&prompt.length<=115?'Easy':form===3||form===4?'Hard':'Medium',
    mockEligible:[0,2,3].includes(form),
    source:row.source,references,classification:'ORIGINAL_AFCAT_STYLE',family:row.subtopic+' · '+name,
    concept:row.subtopic,variantGroup:row.variantGroup,style
  };
}

function line(label, clue, answer) {
  return label+'. '+clue+' → '+answer;
}

export function buildAwareness() {
  return buildAwarenessFromFacts([...polity,...history,...science,...defence,...economy]);
}
export function buildAwarenessFromFacts(facts) {
  const all=facts.map(data=>{
    const [topic,subtopic,prompt,answer,...tail]=data;
    const [distractor1,distractor2,distractor3,explanation,source]=tail;
    const wrong=[distractor1,distractor2,distractor3];
    if(data.length!==9 || !data.every(value=>typeof value==='string'&&value.trim()) || !/^https?:\/\//i.test(source) || !distinct([answer,...wrong])) {
      throw Error('Invalid General Awareness source fact: '+prompt);
    }
    return {topic,subtopic,prompt,answer,wrong,explanation,source,variantGroup:'ga-'+hash(prompt).slice(0,24)};
  });
  const result=[];
  const inverseAnswers=new Set();
  for(const [i,row] of all.entries()) {
    const pool=poolFor(row,all);
    const why=row.explanation;
    result.push(item(row,0,row.prompt,[row.answer,...row.wrong],0,why));

    // Reverse recall needs an answer with enough meaning outside the original stem.
    const reverseEligible=row.answer.length>=10 && row.answer.length<=92 && !/^(it\b|a rise\b|a fall\b|yes\b|no\b|\d|both\b|only\b)/i.test(row.answer);
    const answerKey=normalize(row.answer);
    if(reverseEligible&&!inverseAnswers.has(answerKey)){
      const inversePool=pool.filter(other=>!other.wrong.some(value=>normalize(value)===normalize(row.answer))&&!other.prompt.includes(row.answer));
      const others=partners(row,inversePool,3,'inverse');
      const options=[row.prompt,...others.map(other=>other.prompt)];
      if(others.length===3 && distinct(options)){
        inverseAnswers.add(answerKey);
        result.push(item(row,1,'Which question has “'+row.answer+'” as its correct answer?',options,0,why,others));
      }
    }

    const [pair]=partners(row,pool,1,'pair');
    if(pair){
      const rowWrong=row.wrong[i%3], pairWrong=pair.wrong[(i+1)%3];
      const options=[
        'I: '+row.answer+' / II: '+pair.answer,
        'I: '+rowWrong+' / II: '+pair.answer,
        'I: '+row.answer+' / II: '+pairWrong,
        'I: '+rowWrong+' / II: '+pairWrong
      ];
      result.push(item(row,2,'Find the correct answer to each question in order.\nI. '+row.prompt+'\nII. '+pair.prompt,options,0,
        'I. '+row.answer+'. '+why+'\nII. '+pair.answer+'. '+pair.explanation,[pair]));
    }

    const [statement]=partners(row,pool.filter(other=>other!==pair),1,'check');
    if(statement){
      const decision=i%4;
      const proposedA=decision<=1?row.answer:row.wrong[i%3];
      const proposedB=decision===0||decision===2?statement.answer:statement.wrong[(i+2)%3];
      result.push(item(row,3,'Check these two proposed answers. Which assessment is correct?\n'+line('I',row.prompt,proposedA)+'\n'+line('II',statement.prompt,proposedB),
        directives,decision,'I. The correct answer is '+row.answer+'. '+why+'\nII. The correct answer is '+statement.answer+'. '+statement.explanation,[statement]));
    }

    // The incorrect entry moves around so finding it requires factual comparison.
    const additional=partners(row,pool.filter(other=>other!==pair&&other!==statement),3,'error');
    if(additional.length===3){
      const at=(i*3+1)%4, candidates=[...additional];
      candidates.splice(at,0,row);
      const letters=['I','II','III','IV'];
      const chart=candidates.map((other,j)=>line(letters[j],other.prompt,j===at?row.wrong[(i+1)%3]:other.answer));
      result.push(item(row,4,'A student records four answers during revision. Which entry needs a correction?\n'+chart.join('\n'),
        letters.map(label=>'Entry '+label),at,'Entry '+letters[at]+' should read “'+row.answer+'”. '+why,additional));
    }
  }
  return result;
}
