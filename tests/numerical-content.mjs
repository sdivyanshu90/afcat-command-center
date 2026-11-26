import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildNumerical} from '../data/expanded-numeric.mjs';

const cases=buildNumerical();
const curriculum=JSON.parse(readFileSync(new URL('../data/curriculum.json',import.meta.url),'utf8'));
const seed=JSON.parse(readFileSync(new URL('../data/numeric.json',import.meta.url),'utf8'));
const norm=s=>s.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
assert.equal(new Set([...cases,...seed].map(q=>norm(q.prompt))).size,cases.length+seed.length);
assert.deepEqual([...new Set(cases.map(q=>q.topic))].sort(),curriculum.num.filter(row=>row[3]!=='supporting').map(row=>row[0]).sort());
const list=(start,end)=>Array.from({length:end-start+1},(_,i)=>start+i);
const round=(x,digits=2)=>Math.round((x+Number.EPSILON)*10**digits)/10**digits;
const lin=(a,b)=>a/b;
const med=values=>{const sorted=values.toSorted((a,b)=>a-b),half=Math.floor(sorted.length/2);return sorted.length%2?sorted[half]:(sorted[half-1]+sorted[half])/2;};
const interpret=(s,q)=>{
  if(!s.includes(' ')&&s.includes('/')){const [numerator,denominator]=s.split('/').map(Number);return numerator/denominator;}
  if(s.includes(':')){const [a,b]=s.split(':').map(Number);return a/b;}
  if(s.includes('^'))return Number(s.match(/\^\(?(-?\d+)/)[1]);
  return Number(s.replace(/^₹/,'').match(/^-?\d+(?:\.\d+)?/)[0]);
};
const answers={
  'Decimal multiplication':([x,y])=>x*y,
  'Decimal quotients':([x,y])=>x/y,
  'Place Value':([x,d],p)=>{const digits=p.match(/\d+\.(\d+)/)[1];return d*10**(-1-digits.indexOf(String(d)));},
  'Conversions':([x])=>x,
  'Recurring decimal conversion':([x,repeat])=>repeat/99,
  'Weighted Average':([a,x,b,y])=>x+(y-x)*b/(a+b),
  'Missing or removed observations':([a,x,y])=>{assert.ok(x-(a-1)*(y-x)>0);return x-(a-1)*(y-x);},
  'Percentage Change':([p,x])=>x/(1+p/100),
  'Successive percentage changes':([a,b])=>a-b-a*b/100,
  'Comparative percentages':([a])=>round(100-10000/(100+a)),
  'Part-to-whole ratio':([a,x,y,z])=>a*z/(x+y+z),
  'Direct Proportion':([a,b,c])=>b*c/a,
  'Inverse Proportion':([a,t,b])=>a*t/(a+b),
  'Linked ratios':([a,b,c,d])=>a/b*c/d,
  'Ratio after equal additions':([a,b,delta])=>(a+delta)/(b+delta),
  'Combined Work':([a,b])=>a*b/(a+b),
  'Efficiency':([a,b,t])=>t*a/b,
  'Opposing work rates':([a,b])=>a*b/(b-a),
  'Changing teams':([a,total,used,departing])=>(total-used)*a/(a-departing),
  'Fraction completed':([a,b])=>1-b/a,
  'Profit Percentage':([selling,rate])=>selling/(1+rate/100),
  'Discount':([_,a,b])=>a-b-a*b/100,
  'Equal selling prices':([sale,p1,p2])=>{assert.equal(p1,p2);const costs=sale/(1+p1/100)+sale/(1-p2/100);return 100*(costs-2*sale)/costs;},
  'Successive discounts':([a,b])=>a+b-a*b/100,
  'Revenue across multiple items':([n,cost,k,sale,profit])=>n*cost*(1+profit/100)-k*sale,
  'Simple interest duration':([p,i,r])=>100*i/p/r,
  'Simple interest rate':([p,a,t])=>100*(a-p)/p/t,
  'Compound Interest':([p,r])=>p*((1+r/100)**2-1),
  'Compounding intervals':([p,r])=>p*(1+r/200)**2,
  'Compound versus simple interest':([p,r])=>p*((1+r/100)**2-1-2*r/100),
  'Speed units':([x])=>x/3.6,
  'Average speed':([a,b])=>round(2/(1/a+1/b)),
  'Relative Speed':([distance,a,b])=>distance/(a+b),
  'Pursuit with a head start':([a,head,b])=>b*head/(b-a)-head,
  'Races':([distance,a,b])=>distance*(1-b/a),
  'Passing Objects':([speed,time])=>speed*time,
  'Crossing Platforms':([length,time,speed])=>speed*time-length,
  'Crossing in opposite directions':([lengthA,lengthB,speedA,speedB])=>(lengthA+lengthB)/(speedA+speedB),
  'Overtaking trains':([speedA,speedB,lengthA,lengthB])=>(lengthA+lengthB)/(speedA-speedB),
  'Upstream':([still,current,distance])=>distance/(still-current),
  'Downstream':([still,current,time])=>still*time+current*time,
  'Still-water and current speeds':([down,up])=>down-(down+up)/2,
  'Round trip on a stream':([distance,still,current])=>2*distance*still/(still**2-current**2),
  'Quadrilaterals':([length,perimeter])=>length*(perimeter-2*length)/2,
  'Triangles':([area,base])=>2*area/base,
  'Circles':([diameter])=>diameter,
  'Composite area':([a,b,w])=>2*a*w+2*b*w+4*w*w,
  'Linear and area scaling':([a,b,newA])=>a*b*(newA/a)**2,
  'Sample Space':([red,blue])=>red/(red+blue),
  'Two draws without replacement':([red,blue])=>{const tokens=list(1,red+blue);const events=tokens.flatMap(i=>tokens.filter(j=>i!==j).map(j=>i<=red&&j<=red));return events.filter(Boolean).length/events.length;},
  'Complement':([win,lose])=>{const tokens=list(1,win+lose);const events=tokens.flatMap(i=>tokens.map(j=>i<=win||j<=win));return events.filter(Boolean).length/events.length;},
  'Overlapping events':([start,end,a,b])=>list(start,end).filter(x=>x%a===0||x%b===0).length/(end-start+1),
  'Counting ordered outcomes':([faces,min,max,target])=>list(min,max).flatMap(x=>list(min,max).map(y=>x+y)).filter(n=>n===target).length/(faces*faces),
  'Divisibility':([divisor,min,max])=>list(min,max).filter(x=>x%divisor===0).length,
  'Remainders':([x,y])=>x%y,
  'Sequences':([a,b,c,v])=>list(0,150).findIndex(i=>a+(c-b)*i===v)+1,
  'Arithmetic series':([count,a,b,c])=>list(1,count).reduce((sum,i)=>sum+c+(i-3)*(b-a),0),
  'Missing digit and divisibility':([a,b,d])=>list(0,9).find(i=>(100*a+10*i+b)%d===0),
  'Weighted Mean':([a,low,b,high])=>low+b*(high-low)/(a+b),
  'Alligation ratio':([a,b,target])=>(b-target)/(target-a),
  'Dilution with water':([volume,rate,water])=>round(rate/(1+water/volume)),
  'Replacement':([volume,rate,drained])=>volume*rate/100-drained*rate/100,
  'Repeated replacement':([volume,drained])=>1-2*drained/volume+(drained/volume)**2,
  'Squares and Roots':([x])=>Math.sqrt(x),
  'Cubes and Roots':([x])=>Math.cbrt(x),
  'Perfect-square factorisation':([x])=>list(1,100).find(i=>Math.sqrt(i*x)%1===0),
  'Perfect-cube factorisation':([x])=>list(1,11000).find(i=>Math.cbrt(i*x)%1===0),
  'Neighbouring perfect squares':([x])=>Math.ceil(Math.sqrt(x))**2-x,
  'Factorisation':([a,b])=>list(1,Math.min(a,b)).findLast(x=>a%x===0&&b%x===0),
  'LCM Applications':([a,b])=>list(1,a*b).find(x=>x%a===0&&x%b===0),
  'Least common multiple of three values':([a,b,c])=>list(1,2000).find(x=>x%a===0&&x%b===0&&x%c===0),
  'HCF and LCM identity':([hcf,lcm,one])=>list(1,lcm).find(x=>{
    if(x===one||x%hcf!==0||lcm%x!==0)return false;
    if(list(hcf+1,Math.min(x,one)).some(d=>x%d===0&&one%d===0))return false;
    return !list(1,lcm-1).some(k=>k%x===0&&k%one===0);
  }),
  'HCF of differences':([remainder,a,b,c])=>list(remainder+1,Math.min(a,b,c)).findLast(x=>a%x===remainder&&b%x===remainder&&c%x===remainder),
  'Volume':([x,y,z])=>x*y*z,
  'Surfaces':([x,y,z])=>2*(x*y+x*z+y*z),
  'Cylinder volume':([r,h])=>r*r*h,
  'Cone volume':([r,h])=>r*r*h/3,
  'Open cylinder surface':([r,h])=>r*(2*h+r),
  'Elevation':([d,a])=>d*Math.tan(a*Math.PI/180),
  'Standard tangent values':([a,m,squareRoot])=>m*Math.sqrt(squareRoot)*Math.tan(a*Math.PI/180),
  'Observer’s eye height':([h,d,a])=>h+d*Math.tan(a*Math.PI/180),
  'Depression':([h,a])=>h/Math.tan(a*Math.PI/180),
  'Similar triangles and shadows':([h,s,newS])=>h/s*newS,
  'Mean':([mean,...known])=>5*mean-known.reduce((a,b)=>a+b,0),
  'Median':values=>med(values),
  'Median of an even-sized set':values=>med(values),
  'Mode':([a,b,c,d,fa,fb,fc,fd])=>[[a,fa],[b,fb],[c,fc],[d,fd]].sort((x,y)=>y[1]-x[1])[0][0],
  'Transformation of statistics':([median,multiplier,drop])=>med([median-1,median,median+1].map(x=>x*multiplier-drop)),
  'Exponent Laws':([base,x,repeat,y])=>Math.log(base**x*repeat**y)/Math.log(base),
  'Exponent subtraction':([base,x,repeat,y])=>Math.log(base**x/repeat**y)/Math.log(base),
  'Integer Powers':([base,exponent])=>base**exponent,
  'Power of a power':([base,x,y])=>Math.log((base**x)**y)/Math.log(base),
  'Rewrite to a common base':([a,x,b,y,targetBase])=>Math.log(a**x/b**y)/Math.log(targetBase)
};

const failed=[];
for(const q of cases){
  const nums=[...q.prompt.matchAll(/-?\d+(?:\.\d+)?/g)].map(x=>Number(x[0]));
  const result=answers[q.family](nums,q.prompt);
  const outcomes=q.options.map(x=>interpret(x,q));
  const matching=outcomes.map((val,i)=>Math.abs(val-result)<=1e-7?i:null).filter(i=>i!==null);
  if(matching.length!==1||matching[0]!==q.answer)failed.push({family:q.family,prompt:q.prompt,result,key:q.options[q.answer],matching});
  assert.equal(new Set(q.options.map(norm)).size,4);
}
console.log('Independent checks',cases.length,'families',Object.keys(answers).length,'failures',failed.length);
if(failed.length) console.error(failed.slice(0,8));
assert.equal(failed.length,0);
