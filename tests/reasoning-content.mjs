import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { buildReasoning } from '../data/expanded-reasoning.mjs';
import { buildReasoningSecond } from '../data/second-reasoning.mjs';

const seed=JSON.parse(readFileSync(new URL('../data/reasoning.json',import.meta.url)));
const curriculum=JSON.parse(readFileSync(new URL('../data/curriculum.json',import.meta.url)));
const questions=buildReasoningSecond();
const fingerprint=text=>text.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
const answer=q=>q.options[q.answer];
const families=new Map();
for(const q of questions) {
  const family=q.family.replace(/^Reasoning — /,'');
  if(!families.has(family)) families.set(family,[]);
  families.get(family).push(q);
}
const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const heading=['North','East','South','West'];
const arrowNames=['up','right','down','left'];
const clockwiseEdge='A1 A2 A3 A4 B4 C4 D4 D3 D2 D1 C1 B1'.split(' ');
const ring=(n,k)=>((n%k)+k)%k;
const pointNames=text=>[...text.matchAll(/\b([A-D])([1-4])\b/g)].map(m=>m[0]);
const encodePoints=points=>points.sort().join(' ');
const transform=(point,fn)=>{
  const [r,c]=fn(alphabet.indexOf(point[0]),Number(point[1])-1);
  return alphabet[r]+(c+1);
};
const permutations=values=>values.length<=1?[values]:values.flatMap((value,i)=>permutations(values.filter((_,j)=>i!==j)).map(tail=>[value,...tail]));
const verify=(family,solver)=>{
  const rows=families.get(family);
  assert.equal(rows.length,40);
  for(const q of rows) assert.equal(answer(q),String(solver(q)),q.prompt);
};
const values=(regex,text)=>text.match(regex).slice(1).map(Number);

test('the second reasoning pack adds unique, deterministic, valid items in all twelve topics',()=>{
  assert.deepEqual(questions,buildReasoningSecond());
  assert.equal(questions.length,1920);
  assert.equal(families.size,48);
  assert.equal(questions.filter(q=>q.diagram).length,560);
  for(const [topic] of curriculum.rea) assert.equal(questions.filter(q=>q.topic===topic).length,160);
  const prior=[...seed,...buildReasoning()];
  const fingerprints=new Set(prior.map(q=>fingerprint(q.prompt)));
  const priorFamilies=new Set(prior.map(q=>q.family));
  for(const q of questions){
    const normalized=fingerprint(q.prompt);
    assert.equal(fingerprints.has(normalized),false,q.prompt);
    assert.equal(priorFamilies.has(q.family),false,q.family);
    assert.equal(q.subject,'rea');
    assert.equal(q.classification,'ORIGINAL_AFCAT_STYLE');
    assert.ok(q.explanation.trim().length>=20);
    assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4);
    assert.equal(q.options.length,4);
    assert.equal(new Set(q.options.map(fingerprint)).size,4,q.prompt);
    fingerprints.add(normalized);
  }
});
test('recomputes numerical analogies, classifications, sequences, and code transformations',()=>{
  verify('Digit-reversal offset',q=>{
    const [source,output,target]=values(/If (\d+) maps to (\d+), what does (\d+)/,q.prompt);
    const reverse=n=>Number([...String(n)].reverse().join(''));
    return reverse(target)+output-reverse(source);
  });
  verify('Affine pair with a hidden multiplier',q=>{
    const [a,b,c,d,x]=values(/pairs are \((\d+), (\d+)\), \((\d+), (\d+)\). What does (\d+)/,q.prompt);
    return b+(d-b)*(x-a)/(c-a);
  });
  verify('Paired differences on two sides',q=>{
    const [a,b,c,x,y]=values(/relationship (\d+), (\d+) → (\d+).*to (\d+), (\d+)/,q.prompt);
    return c/(a-b)*(x-y);
  });
  verify('Divisibility under a shared product',q=>{
    const [a,b]=values(/product (\d+) × (\d+)/,q.prompt);
    const odds=q.options.filter(x=>Number(x)%(a*b)!==0);
    assert.equal(odds.length,1);
    return odds[0];
  });
  verify('Constant digit-sum outlier',q=>{
    const digitSum=opt=>[...opt].reduce((a,b)=>a+Number(b),0);
    const options=q.options.map(digitSum);
    return q.options.find(opt=>options.filter(sum=>sum===digitSum(opt)).length===1);
  });
  verify('Alternating subtraction and doubling',q=>{
    const numbers=q.prompt.slice(q.prompt.indexOf('completes ')+'completes '.length).match(/\d+/g).map(Number);
    const delta=numbers[0]-numbers[1];
    assert.ok(numbers.every((n,i)=>i===0||n===(i%2?numbers[i-1]-delta:2*numbers[i-1])));
    return numbers.at(-1)*2;
  });
  verify('Find a missing first term',q=>{
    const [a,b,c,d]=q.prompt.slice(q.prompt.indexOf('term in')).match(/\d+/g).map(Number);
    const multiplier=(c-b)/(b-a);
    assert.equal(c+(c-b)*multiplier,d);
    return a-(b-a)/multiplier;
  });
  verify('Decode odd-even position exchange',q=>{
    const code=q.prompt.match(/code is ([A-Z]+)/)[1];
    return [1,0,3,2,4].map(i=>code[i]).join('');
  });
  verify('Recover a token with position-weighted letter values',q=>{
    const [,f,a,b,total]=q.prompt.match(/plus (\d+) times.* code ([A-Z])\?([A-Z]) totals (\d+)/);
    return alphabet[(Number(total)-alphabet.indexOf(a)-alphabet.indexOf(b)-2)/Number(f)-1];
  });
});
test('recomputes constraints, relative directions, and set regions',()=>{
  verify('Two badge statements under exactly one truth',q=>{
    const [,a,b,c,x,y,z,firstOwner,firstColour,secondOwner,secondColour]=q.prompt.match(/^(\w+), (\w+) and (\w+) each.*?colours (\w+), (\w+) and (\w+) .*“(\w+)'s badge is (\w+)” and “(\w+)'s badge is (\w+)”/);
    return permutations([x,y,z]).map(colours=>Object.fromEntries([a,b,c].map((name,i)=>[name,colours[i]])))
      .filter(assignment=>assignment[c]===z)
      .filter(assignment=>(assignment[firstOwner]===firstColour)!==(assignment[secondOwner]===secondColour)).length;
  });
  verify('Return bearing from an offset point',q=>{
    const [,x,y]=q.prompt.match(/metres (west|east) and then \d+ metres (north|south)/);
    return (y==='north'?'south':'north')+'-'+(x==='west'?'east':'west');
  });
  verify('Use a relative heading to get home',q=>{
    const [,side,a,b,c]=q.prompt.match(/faces (\w+). They turn (\d+)° right, then (\d+)° left. At the next point they turn (\d+)° right/);
    return heading[ring(heading.indexOf(side)+Number(a)/90-Number(b)/90+Number(c)/90+2,4)];
  });
  verify('Six-slot constraints with two linked blocks',q=>{
    const [,a,left,f,e,,b,c,,target]=q.prompt.match(/([A-Z]\w+) is in slot (\d+), and (\w+) is two slots after \w+. (\w+) is immediately before (\w+). (\w+) is first. (\w+) is immediately after (\w+). Who is in slot (\d+)/);
    const possible=permutations([a,b,c,e,f,'other']).filter(list=>list[0]===b&&list[Number(left)-1]===a&&list.indexOf(f)-list.indexOf(a)===2&&list.indexOf(f)-list.indexOf(e)===1&&list.indexOf(c)-list.indexOf(f)===1);
    assert.equal(possible.length,1,q.prompt);
    return possible[0][Number(target)-1];
  });
  verify('Distance between internal ranks after promotion',q=>{
    const [total,a,b,rise,drop]=values(/of (\d+) trainees, trainee P is ranked (\d+) and trainee Q (\d+) from.*by (\d+), and Q moves down by (\d+)/,q.prompt);
    assert.ok(a-rise>0&&b+drop<=total);
    return b+drop-(a-rise)-1;
  });
  verify('Exactly two groups in a three-set survey',q=>{
    const [ab,ac,bc,abc]=values(/(\d+) attend both A and B, (\d+) attend both A and C, and (\d+) attend both B and C.* includes the (\d+)/,q.prompt);
    const valid=ab>=abc&&ac>=abc&&bc>=abc;
    assert.ok(valid);
    return ab+ac+bc-3*abc;
  });
  verify('Neither group from overlap and totals',q=>{
    const [total,a,b,both]=values(/Among (\d+) students, (\d+) study drawing, (\d+) study music, and (\d+) study both/,q.prompt);
    return (total-a)-(b-both);
  });
});
test('reconstructs geometric keys and diagram categories from their described marks',()=>{
  verify('Reflection across the rising diagonal',q=>{
    const marks=pointNames(q.prompt.split('Reflect')[0]);
    return encodePoints(marks.map(point=>transform(point,(r,c)=>[3-c,3-r])));
  });
  verify('Clockwise rotation followed by reflection',q=>{
    const marks=pointNames(q.prompt.split('rotate')[0]);
    const vertical=q.prompt.includes('vertical centreline');
    const move=vertical?(r,c)=>[c,r]:(r,c)=>[3-c,3-r];
    return encodePoints(marks.map(point=>transform(point,move)));
  });
  verify('Counterclockwise perimeter movement',q=>{
    const marks=pointNames(q.prompt.split('Its positions are ')[1]);
    const [a,b,c,d]=marks.slice(0,4).map(point=>clockwiseEdge.indexOf(point));
    const travel=ring(b-a,12);
    assert.equal(c,ring(b+travel,12));
    assert.equal(d,ring(c+travel,12));
    return clockwiseEdge[ring(d+travel,12)];
  });
  verify('Arrow directions in alternating slots',q=>{
    const [,a,target]=q.prompt.match(/point ([a-z, ]+). Odd.* arrow (\d+)/);
    const seq=a.split(', ').map(word=>arrowNames.indexOf(word));
    return arrowNames[ring(seq[3]+(seq[3]-seq[1])*((Number(target)-4)/2),4)];
  });
  verify('Find exactly the cells marked in both panels',q=>{
    const [,a,b]=q.prompt.match(/marked at ([A-D1-4 ]+) and the second at ([A-D1-4 ]+)\./);
    const points=pointNames(a);
    return encodePoints(pointNames(b).filter(p=>points.includes(p)));
  });
  verify('Exclusive overlay completes the third panel',q=>{
    const [,a,b]=q.prompt.match(/First panel: ([A-D1-4 ]+)\. Second panel: ([A-D1-4 ]+)\./);
    const occurrences=[...pointNames(a),...pointNames(b)];
    return encodePoints(occurrences.filter(p=>occurrences.indexOf(p)===occurrences.lastIndexOf(p)));
  });
  verify('Odd panel under 180-degree rotation',q=>{
    const odd=q.options.filter(option=>encodePoints(pointNames(option).map(p=>transform(p,(r,c)=>[3-r,3-c])))!==option);
    assert.equal(odd.length,1);
    return odd[0];
  });
  verify('Bouncing marker on a row',q=>{
    const [,size,initial,speed,direction]=q.prompt.match(/cells 1 to (\d+) starts on cell (\d+) and moves (\d+) spaces?,? at a time, initially toward the (greater|smaller)/);
    let current=Number(initial),delta=direction==='greater'?1:-1;
    for(let i=0;i<5*Number(speed);i++){
      if(current+delta<1||current+delta>Number(size))delta=-delta;
      current+=delta;
    }
    return current;
  });
  verify('One row or column contains all marks',q=>{
    const line=marks=>new Set(marks.map(p=>p[0])).size===1||new Set(marks.map(p=>p[1])).size===1;
    const odd=q.options.filter(option=>!line(pointNames(option)));
    assert.equal(odd.length,1);
    return odd[0];
  });
  verify('Detect the only side-touching pair',q=>{
    const touching=(a,b)=>Math.abs(a.charCodeAt(0)-b.charCodeAt(0))+Math.abs(Number(a[1])-Number(b[1]))===1;
    const odd=q.options.filter(option=>{
      const marks=pointNames(option);
      return marks.some(a=>marks.some(b=>touching(a,b)));
    });
    assert.equal(odd.length,1);
    return odd[0];
  });
  verify('Unequal quadrant coverage',q=>{
    const section=p=>[alphabet.indexOf(p[0])<2,Number(p[1])<=2].join(',');
    const odd=q.options.filter(option=>new Set(pointNames(option).map(section)).size!==4);
    assert.equal(odd.length,1);
    return odd[0];
  });
});
