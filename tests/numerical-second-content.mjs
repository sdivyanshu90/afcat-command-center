import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildNumerical } from '../data/expanded-numeric.mjs';
import { buildNumericalSecond } from '../data/second-numeric.mjs';

const load=(name)=>JSON.parse(readFileSync(new URL('../data/'+name+'.json',import.meta.url),'utf8'));
const questions=buildNumericalSecond();
const combined=[...load('numeric'),...buildNumerical(),...questions];
const normalize=s=>s.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
const range=(length,start=0)=>Array.from({length},(_,i)=>i+start);
const seq=(start,end)=>range(end+1-start,start);
const mean=xs=>xs.reduce((a,b)=>a+b,0)/xs.length;
const decimal=(x,places=2)=>Math.round((x+1e-10)*10**places)/10**places;
const subsets=(a,b,replacement)=>range(a+b).flatMap(x=>range(a+b).filter(y=>replacement||x!==y).map(y=>[x<a,y<a]));
const middle=xs=>mean([xs[Math.floor((xs.length-1)/2)],xs[Math.floor(xs.length/2)]]);
const getLcm=(a,b)=>seq(Math.max(a,b),a*b).find(n=>n%a===0&&n%b===0);
const num=s=>s.match(/-?\d+(?:\.\d+)?/g)?.map(Number);
const value=s=>{
  const [a,b,c]=num(s);
  if(s.includes('× 10^'))return {coefficient:a,exponent:c};
  if(s.includes('^'))return b;
  if(/^[-+]?\d+\//.test(s))return a/b;
  return a;
};

// These solvers use the quantities in each emitted stem, with no generator inputs.
const solve={
  'Adding decimals of different lengths':([a,b])=>a+b,
  'Decimal subtraction with borrowing':([a,b])=>a-b,
  'Rounding decimals to hundredths':([x])=>decimal(x),
  'Comparing decimal magnitudes':xs=>xs.toSorted((a,b)=>b-a)[1],
  'Average repair by correcting a score':([m,n,x,y])=>(m*n-x+y)/n,
  'Percentage-point versus relative change':([x,y])=>decimal((y/x-1)*100,1),
  'Repeated percentage growth':([n,p])=>n*Math.pow(1+p/100,2),
  'Subgroup percentage in a combined population':([a,p,b,q])=>decimal((a*p+b*q)/(a+b)),
  'Find a total from a ratio difference':([a,b,gap])=>gap*(a+b)/(b-a),
  'Unit-price proportional comparison':([n,cost,expanded])=>cost*expanded/n,
  'Map scales with units':([one,scale,length])=>length/one*scale*1e-5,
  'Joint proportion with two independent factors':([n,amount,h,x,y])=>amount*x/n*y/h,
  'Find an unknown partner’s rate':([same,one])=>(same*one)/(one-same),
  'Alternating turns with an exact finish':([a,b,shift,target])=>{
    let elapsed=0,work=0;
    while(work<target){
      const rate=elapsed%2===0?a:b;
      if(work+rate*shift>=target)return elapsed+(target-work)/rate;
      work+=rate*shift;
      elapsed+=shift;
    }
  },
  'Net progress from partly overlapping shifts':([a,b,first,second])=>a*first+b*(first+second),
  'Staffing for a shorter workday':([n,d,h,otherD,otherH])=>n*(d/otherD)*(h/otherH),
  'Find a cost from a known loss':([sale,loss])=>sale/(1-loss/100),
  'Discount rate for a target selling price':([cost,marked,profit])=>decimal(100-100*cost*(1+profit/100)/marked),
  'Trade-in costs included in cost price':([a,b,c,p])=>a+b+c+(a+b+c)*p/100,
  'Equal costs with unequal gain and loss':([a,p,q])=>100*(a*p/100-a*q/100)/(a+a),
  'Simple-interest principal from two balances':([a,x,b,y])=>(a*y-b*x)/(y-x),
  'Simple interest over fractional years':([p,m,r])=>p*(r/100)*(m/12),
  'Annual compounding with changing rates':([p,a,b])=>p*(1+(a+b)/100+(a*b)/1e4),
  'Compound annual interest rate from two balances':([a,b])=>(Math.sqrt(b/a)-1)*100,
  'Average speed including a stop':([speed,a,b,c])=>decimal(mean([...range(a*2).fill(speed),...range(b*2).fill(0),...range(c*2).fill(speed)])),
  'Delayed departures in opposite directions':([x,delay,y,d])=>(d-x*delay)/(x+y),
  'Race distances at consistent finish margins':([d,time,left])=>d-2*left,
  'Distance split from a journey timetable':([d,time,slow,fast])=>(fast*time-d)/(fast-slow),
  'Train speed from passing a signal':([m,s])=>m*3600/(s*1000),
  'Train length from two crossing times':([a,b,p])=>p/(b/a-1),
  'Train passing a moving walker':([train,walker,t])=>train*t-walker*t,
  'Train clearing a bridge after entering':([train,speed,bridge])=>decimal(train/speed+bridge/speed),
  'Stream speed from equal travel distances':([d,a,b])=>d*(b-a)/(a*b*2),
  'Still-water speed from a timed upstream leg':([current,d,t])=>(d+t*current)/t,
  'Comparing equal-duration upstream and downstream legs':([still,current,t])=>still*t+current*t-(still*t-current*t),
  'Distance in a fixed-time out-and-back boat trip':([time,still,current])=>time*(still**2-current**2)/(2*still),
  'Area of a trapezium':([a,b,h])=>a*h+(b-a)*h/2,
  'Inside border of uniform width':([a,b,w])=>2*w*b+2*w*(a-2*w),
  'Semicircle boundary with its diameter':([r,a,b])=>r*(a/b+2),
  'Area of a sector by angle share':([degree,r])=>r**2*(degree/360),
  'Exactly one success in two independent draws':([a,b])=>{const events=subsets(a,b,true);return events.filter(([x,y])=>x!==y).length/events.length;},
  'Probability of two different colours without replacement':([a,b])=>{const events=subsets(a,b,false);return events.filter(([x,y])=>x!==y).length/events.length;},
  'Same face twice with independent dice':([faces,first,last])=>seq(first,last).flatMap(x=>seq(first,last).filter(y=>x===y)).length/faces**2,
  'Number range outcomes by complement':([first,last,cut])=>seq(first,last).filter(x=>x>cut).length/(last-first+1),
  'Least adjustment to a multiple':([n,d])=>range(d).find(i=>(n+i)%d===0),
  'Next term of a geometric progression':([a,b,c])=>c*(c/b),
  'Consecutive integers with a given total':([n,sum])=>sum/n-(n-1)/2,
  'Chinese remainder by listing one progression':([x,b,y,a])=>seq(1,a*b).find(n=>n%b===x&&n%a===y),
  'Concentration after adding pure ingredient':([a,rate,b])=>100*(a*rate/100+b)/(a+b),
  'Dilution volume needed for a target concentration':([a,from,to])=>a*(from-to)/to,
  'Find a missing strength in a two-part blend':([a,p,b,combined])=>(combined*(a+b)-a*p)/b,
  'Blend components from a target unit price':([lo,hi,n,target])=>n*(target-lo)/(hi-lo),
  'Evaluation by difference of squares':([a,b])=>a*a-b*b,
  'Nearest square by subtraction':([x])=>x-Math.floor(Math.sqrt(x))**2,
  'Minimum factor division to a perfect square':([x])=>seq(1,x).find(d=>x%d===0&&Number.isInteger(Math.sqrt(x/d))),
  'Cubes inside a radical quotient':([a,b])=>Math.cbrt(a/b),
  'Pairing supplies into largest identical kits':([a,b,c])=>seq(1,Math.min(a,b,c)).findLast(k=>a%k===0&&b%k===0&&c%k===0),
  'Two schedules after a common offset':([offset,a,b])=>offset+getLcm(a,b),
  'HCF from prime factorisation':([a,b])=>{while(b){[a,b]=[b,a%b];}return a;},
  'Least multiple with a fixed leftover':([b,rem,a])=>seq(b+1,b*a+rem).find(k=>k%a===rem&&k%b===rem),
  'Capacity in litres from cuboid dimensions':([a,b,c])=>(a/10)*(b/10)*(c/10),
  'Surface area of a cube from volume':([v])=>6*v**(2/3),
  'Water depth change from a known added volume':([v,a,b])=>v/(a*b),
  'Curved surface of a right circular cone':([r,h])=>decimal(Math.sqrt(r*r+h*h)*r),
  'Distance from a 60 degree elevation':([height,degree,radical])=>height/(Math.tan(degree*Math.PI/180)*Math.sqrt(radical)),
  'Tower height from two elevation points':([gap,angle,numer,denom])=>gap/(denom/numer-1/Math.tan(angle*Math.PI/180)),
  'Height from the length of a slanted sight line':([l,a])=>l*Math.sin(a*Math.PI/180),
  'Height difference from a depression angle':([d,h,a])=>h+d*Math.tan(a*Math.PI/180),
  'Mean from a discrete frequency table':([a,b,c,fa,fb,fc])=>decimal(mean([...range(fa).fill(a),...range(fb).fill(b),...range(fc).fill(c)])),
  'Median from a discrete frequency table':([a,b,c,d,fa,fb,fc,fd])=>middle([...range(fa).fill(a),...range(fb).fill(b),...range(fc).fill(c),...range(fd).fill(d)]),
  'The additional observation needed for a target mean':([n,first,last])=>last+(last-first)*n,
  'Mode after a frequency update':([a,b,c,d,fa,fb,fc,fd,added,to])=>[[a,fa],[b,fb],[c,fc],[d,fd]].sort(([x,n],[y,m])=>m+(y===to?added:0)-n-(x===to?added:0))[0][0],
  'Scientific notation after scaling a decimal':([a,ten,e])=>{const raw=a*10**e,p=Math.floor(Math.log10(raw));return {coefficient:raw/10**p,exponent:p};},
  'Recover an exponent from numerical powers':([a,b,y,p])=>Math.round(Math.log(p/b**y)/Math.log(a)),
  'Missing factor in a product of powers':([a,x,right])=>right/a**x,
  'Common-base conversion with a reciprocal':([a,x,one,b,y])=>Math.round(Math.log(a**x*(one/b)**y)/Math.log(b))
};

assert.equal(combined.length,4155);
assert.equal(new Set(combined.map(q=>normalize(q.prompt))).size,combined.length);
const covered=load('curriculum').num.filter(([, , ,status])=>status!=='supporting').map(([name])=>name).sort();
assert.deepEqual([...new Set(questions.map(q=>q.topic))].sort(),covered);
assert.ok(Object.values(Object.groupBy(questions,q=>q.topic)).every(items=>items.length===100));
const families=Object.groupBy(questions,q=>q.family);
assert.equal(Object.keys(families).length,76);
assert.ok(Object.values(families).every(items=>items.length===25));
assert.ok(!buildNumerical().some(q=>Object.hasOwn(families,q.family)));

for(const q of questions){
  assert.ok(q.explanation.length>=20);
  assert.equal(new Set(q.options.map(normalize)).size,4);
  const expected=solve[q.family](num(q.prompt));
  const matched=q.options.flatMap((option,i)=>{
    const interpreted=value(option);
    if(typeof expected==='object'){
      return interpreted.exponent===expected.exponent&&Math.abs(interpreted.coefficient-expected.coefficient)<1e-7?[i]:[];
    }
    return Math.abs(interpreted-expected)<1e-7?[i]:[];
  });
  assert.deepEqual(matched,[q.answer],q.family+' | '+q.prompt+' | '+JSON.stringify(expected)+' | '+q.options.join(', '));
}
console.log(questions.length+' answer keys checked across '+Object.keys(families).length+' problem families and '+covered.length+' topics.');
