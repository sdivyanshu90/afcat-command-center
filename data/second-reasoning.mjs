const syllabus = 'https://www.careerairforce.gov.in/afcat-syllabus';
const modelPapers = 'https://www.careerairforce.gov.in/afcat-model-questions';
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const letters = value => [...value];
const range = end => Array.from({length:end},(_,i)=>i);
const mod = (n,d) => ((n%d)+d)%d;
const at = n => alphabet[mod(n,26)];
const shift = (s,n) => letters(s).map(letter=>at(alphabet.indexOf(letter)+n)).join('');
const rotate = (x,n) => [...x.slice(n),...x.slice(0,n)];
const plain = (prompt,options,explanation,diagram) => ({prompt,options,explanation,...(diagram?{diagram}:{})});
const nums = items => items.map(String);
const pairs = values => values.map(([a,b])=>`(${a}, ${b})`).join(', ');
const words = 'BAKED BLEND BRICK COACH CRAFT DANCE EARTH FABLE FLEET FRUIT GRAIN GRAPE GROVE HONEY HOUSE JELLY KNIFE LEMON LOGIC LUNCH MAPLE MELON METAL MOULD NERVE NOVEL OLIVE ONION OPERA PARCH PEARL PLANT PLUME QUILT REACT ROUND SHINE STAMP TABLE THORN TRAIL VAULT WHEAT WRIST YIELD'.split(' ');
const names = 'Asha Bela Charu Daya Esha Farah Gita Hana Ila Jaya Kiran Leela Maya Neha Ojas Pia Reva Sara Tara Uma Veena Yana Zara Amal Bimal Chetan Dev Eran Farid Gopal Harish Ishan Jatin Kabir Laksh Milan Nalin Omkar Pranav Rohan'.split(' ');
const folders = ['amber','blue','bronze','coral','cream','gold','green','grey','indigo','ivory','jade','lilac','navy','ochre','olive','orange','pink','plum','red','silver','teal','violet','white','yellow'];
const families=[];
function family(topic,name,subtopic,difficulty,build,{visual=false}={}) {
  families.push({topic,name,subtopic,difficulty,build,visual});
}

const analogy='Analogies';
family(analogy,'Digit-reversal offset','Number analogy','Medium',i=>{
  const tens=2+i%5,unit=1+Math.floor(i/5),a=10*tens+unit;
  const t=1+i%4,u=5+Math.floor(i/8),b=10*t+u,delta=2+i%7;
  const result=10*u+t+delta;
  return plain(`A machine reverses two digits and then applies a fixed addition. If ${a} maps to ${10*unit+tens+delta}, what does ${b} map to?`,
    nums([result,10*u+t-delta,b+delta,b-delta]),
    `Reverse the digits of ${a} to obtain ${10*unit+tens}. The machine adds ${delta}. Reversing ${b} gives ${10*u+t}, then adding ${delta} gives ${result}.`);
});
family(analogy,'Affine pair with a hidden multiplier','Number analogy','Medium',i=>{
  const a=4+i,b=6+i,t=9+i%9,m=2+i%5,k=3+Math.floor(i/5),y=x=>m*x+k;
  return plain(`The same rule maps the first number in each pair to the second: multiply by a fixed integer, then add a fixed integer. The pairs are ${pairs([[a,y(a)],[b,y(b)]])}. What does ${t} map to?`,
    nums([y(t),m*t,m*t-k,m*(t+1)+k]),
    `The inputs increase by ${b-a} and outputs by ${y(b)-y(a)}, giving a multiplier of ${m}. The first pair then gives an addition of ${k}. The target is ${m} × ${t} + ${k} = ${y(t)}.`);
});
family(analogy,'Word-stem shift analogy','Letter analogy','Medium',i=>{
  const a=words[i],b=words[(i+7)%words.length],n=1+i%5;
  const f=(word,amount)=>word[0]+shift(word.slice(1,-1),amount)+word.at(-1);
  return plain(`${a} is transformed to ${f(a,n)} by keeping its end letters and shifting the inner letters by a common number of alphabet positions. What is the corresponding transformation of ${b}?`,
    [f(b,n),f(b,-n),shift(b,n),b],
    `The unchanged outer letters enclose a forward shift of ${n}. Applying that shift to the inside of ${b}, with wrap after Z, produces ${f(b,n)}.`);
});
family(analogy,'Paired differences on two sides','Number analogy','Hard',i=>{
  const a=16+i,b=9+i%5,c=14+Math.floor(i/4),d=3+i%7,k=2+i%4;
  const f=(x,y)=>k*(x-y);
  return plain(`The relationship ${a}, ${b} → ${f(a,b)} uses the difference of the first two values and a constant multiplier. Apply the same relationship to ${c}, ${d}.`,
    nums([f(c,d),c+d,k*(c+d),c-d].map((n,j)=>j===1&&n===f(c,d)?n+1:n)),
    `${a} − ${b} = ${a-b}, and ${f(a,b)} is ${k} times that difference. The new difference is ${c-d}, so the corresponding result is ${f(c,d)}.`);
});

const classification='Classification';
family(classification,'Divisibility under a shared product','Numeric classification','Medium',i=>{
  const a=3+i%5,b=2+Math.floor(i/5),k=a*b,m=3+i;
  const values=[k*m,k*(m+1),k*(m+2)+a,k*(m+3)];
  return plain(`Three members of this list are divisible by the product ${a} × ${b}: ${rotate(values,i%4).join(', ')}. Which value differs?`,
    nums([values[2],values[0],values[1],values[3]]),
    `The common divisor is ${k}. The outlier ${values[2]} leaves remainder ${a}, whereas all three other values are exact multiples of ${k}.`);
});
family(classification,'Constant digit-sum outlier','Numeric classification','Easy',i=>{
  const k=7+i%5;
  const start=2+Math.floor(i/10),adjust=i%2?1:-1;
  const sum=k;
  const keys=range(3).map(j=>10*(start+j)+(sum-start-j));
  // A three-digit outlier would reveal itself by length, so keep it within the same digit range.
  const out=10*(start+1)+(sum-start-1)+adjust;
  const options=[out,...keys];
  return plain(`Which value has a different digit sum from the other three: ${rotate(options,(i+1)%4).join(', ')}?`,
    nums(options),`Three values have digits that add to ${sum}. The digits of ${out} add to ${sum+adjust}, making it the exception.`);
});
family(classification,'Reversed alphabet gaps','Verbal classification','Medium',i=>{
  const d=1+i%7,start=Math.floor(i/7),a=12+start;
  const group=(n,delta)=>at(n)+at(n-delta)+at(n-2*delta);
  const options=[group(a+5,d-1),group(a,d),group(a+2,d),group(a+3,d)];
  return plain(`With the alphabet treated cyclically, three options step backward by the same amount: ${rotate(options,i%4).join(', ')}. Which group differs?`,
    options,`In ${options[1]}, ${options[2]} and ${options[3]}, each step goes back ${d} positions. In ${options[0]} the step size is ${d-1}.`);
});
family(classification,'Odd common-factor pair','Numeric classification','Medium',i=>{
  const d=2+i%8,a=3+Math.floor(i/8),p=[
    [d*(a+1),d*(a+2)+1],[d*a,d*(a+1)],[d*(a+2),d*(a+4)],[d*(a+3),d*(a+7)]
  ];
  return plain(`Find the exception. In three pairs, both members are multiples of ${d}. The pairs are ${pairs(rotate(p,(i+2)%4))}.`,
    p.map(item=>pairs([item])),`${p[0][1]} is one more than a multiple of ${d}. All the other pairs consist of two exact multiples.`);
});

const series='Number and Letter Series';
family(series,'Missing square-based series term','Number series','Medium',i=>{
  const seed=3+Math.floor(i/8),step=1+i%4,offset=2+i;
  const vals=range(6).map(j=>(seed+j*step)**2+offset),answer=vals[3];
  return plain(`The terms come from squaring equally spaced integers and adding a fixed amount. Fill the gap in ${[...vals.slice(0,3),'?',...vals.slice(4)].join(', ')}.`,
    nums([answer,answer-offset,(seed+2*step)**2+offset+step,(seed+3*step+1)**2+offset]),
    `The base integers are ${range(6).map(j=>seed+j*step).join(', ')}. The missing term is the square of ${seed+3*step} plus ${offset}, giving ${answer}.`);
});
family(series,'Alternating subtraction and doubling','Number series','Hard',i=>{
  const start=9+i,d=1+i%6;
  const values=[start];
  for(let j=0;j<6;j++)values.push(j%2?2*values.at(-1):values.at(-1)-d);
  const answer=values[6];
  return plain(`Two operations repeat in alternate steps. Which number completes ${values.slice(0,6).join(', ')}, ?`,
    nums([answer,values[5]-d,answer+d,values[5]+2*d]),
    `Starting from ${start}, subtract ${d} on the first step and double on the second. Repeat that pair of operations. The displayed final term, ${values[5]}, must be doubled to ${answer}.`);
});
family(series,'Letter groups with a fixed internal gap','Letter series','Medium',i=>{
  const a=i%10,spread=2+Math.floor(i/10),step=2+(i%3);
  const vals=range(5).map(j=>at(a+step*j)+at(a+step*j+spread));
  const n=a+4*step;
  return plain(`Letters wrap from Z to A. In ${vals.slice(0,4).join(', ')}, each pair keeps its internal alphabet gap. What is the fifth pair if the first letters advance by the same step each time?`,
    [vals[4],at(n)+at(n+spread+1),at(n-1)+at(n-1+spread),at(n+1)+at(n+1+spread)],
    `First positions advance by ${step}. From ${vals[3][0]} advance ${step} to ${vals[4][0]}. The second letter is ${spread} positions after it, so the pair is ${vals[4]}.`);
});
family(series,'Find a missing first term','Number series','Hard',i=>{
  const a=5+i,m=2+i%3,d=1+Math.floor(i/5);
  const vals=[a];
  for(let j=0;j<4;j++)vals.push(m*vals.at(-1)-d);
  const options=[a,a+d,a-m,vals[1]-m];
  options[3]=options.slice(0,3).includes(options[3])?a+m+d:options[3];
  return plain(`Each term after the first equals an integer multiple of the previous term minus a fixed amount. Find the missing first term in ?, ${vals.slice(1).join(', ')}.`,
    nums(options),`The differences between displayed terms increase by a factor of ${m}, so the multiplier is ${m}. From ${vals[1]} → ${vals[2]} the subtraction is ${d}. Invert the rule: (${vals[1]} + ${d}) ÷ ${m} = ${a}.`);
});

const coding='Coding-Decoding';
family(coding,'Decode odd-even position exchange','Position code','Medium',i=>{
  const word=words[i];
  const code=word[1]+word[0]+word[3]+word[2]+word[4];
  const lettersChanged=word[3]+word[1]+word[2]+word[0]+word[4];
  const decoys=[code,lettersChanged,word[0]+word[2]+word[1]+word[3]+word[4],shift(word,1)];
  const options=[word,...new Set(decoys)].filter((val,j,array)=>array.indexOf(val)===j).slice(0,4);
  return plain(`Pairs of positions are exchanged to encode a five-letter word: positions 1 and 2 swap, positions 3 and 4 swap, and position 5 stays. If the code is ${code}, what was the word?`,
    options,`The swaps undo themselves. Pair the code as ${code.slice(0,2)}, ${code.slice(2,4)}, ${code.at(-1)}. Swapping the letters in the first two groups returns ${word}.`);
});
family(coding,'Read a verbal substitution code through intersections','Substitution','Hard',i=>{
  const d=1+i%6,offset=Math.floor(i/6),labels=rotate(folders,3*offset%folders.length).slice(0,4);
  const codes=range(4).map(j=>at(d*j+offset)+at(12+offset+j*2));
  const [a,b,c,e]=labels,[w,x,y,z]=codes;
  return plain(`Each colour has one two-letter code. Order may change. “${a} ${b}” gives “${x} ${w}”; “${b} ${c}” gives “${y} ${x}”; “${e} ${a}” gives “${z} ${w}”. What code belongs to ${c}?`,
    [y,w,x,z],`The first two phrases share ${b}, and their codes share ${x}, so ${b} is ${x}. The other code in the second phrase, ${y}, belongs to ${c}.`);
});
family(coding,'Recover a token with position-weighted letter values','Position code','Medium',i=>{
  const first=3+i%8,last=10+Math.floor(i/8),middle=5+i%7,f=2+i%4;
  const total=first+f*middle+last;
  return plain(`A three-letter code uses A = 1 to Z = 26. Its value is the first and third letter values plus ${f} times the middle letter value. The code ${at(first-1)}?${at(last-1)} totals ${total}. What is the missing letter?`,
    [at(middle-1),at(middle),at(middle-2),at(middle+1)],
    `Subtract the outer values (${first} and ${last}) to obtain ${f*middle}. Divide by ${f} to get alphabet position ${middle}, which is ${at(middle-1)}.`);
});
family(coding,'Even occurrence substitution','Substitution','Medium',i=>{
  const stem=words[i],pattern=stem[0]+stem[1]+stem[0]+stem[4]+stem[1]+stem[0]+stem[4];
  const run=s=>{
    const visits=new Map();
    return letters(pattern).map(ch=>{
      const n=(visits.get(ch)??0)+1;
      visits.set(ch,n);
      return n%2?ch:shift(ch,s);
    }).join('');
  };
  const n=1+i%5;
  return plain(`In the code for ${pattern}, count each letter's appearances separately from left to right. Shift the letter by ${n} alphabet place${n===1?'':'s'} on its second, fourth and later even appearances. Leave its other appearances as written. Which code results?`,
    [run(n),run(-n),shift(pattern,n),pattern],`Only each letter's even appearances change. Tracking the three separate counters while scanning from left to right gives ${run(n)}.`);
});

const logic='Logical Relationships';
family(logic,'Family branch through a niece','Family relations','Medium',i=>{
  const [a,b,c,d]=rotate(names,i);
  const genders=i%2?'daughter':'son';
  const line=i%4<2?'mother':'father';
  return plain(`${a} is ${b}'s sister. ${c} is ${a}'s ${genders}. ${b} is ${d}'s ${line}. How are ${c} and ${d} related?`,
    ['First cousins','Siblings','Grandparent and grandchild','Aunt and niece'],`${a} and ${b} are siblings. Their respective children, ${c} and ${d}, belong to the next generation on separate branches of the same family, so they are first cousins.`);
});
family(logic,'Direct implication does not reverse','Deduction','Medium',i=>{
  const jobs=['may open the tool cabinet','receives a signed record','gets a ticket','can place an order','attends the final rehearsal','may borrow a reference book','can submit a form','has a reserved seat'];
  const event=jobs[i%8];
  const [a,b]=rotate(names,(i*7)%names.length);
  return plain(`An organisation issues a confirmation slip to everyone who ${event}. ${a} has a slip and ${b} has no slip. What is guaranteed by this rule alone?`,
    [`${b} does not meet the condition “${event}”.`,`${a} meets the condition “${event}”.`,'Only eligible people have slips.','Everyone with a slip was checked twice.'],
    `The rule gives “meets condition → gets slip.” Its contrapositive is “no slip → does not meet condition,” so it applies to ${b}. A slip alone does not identify how ${a} received it.`);
});
family(logic,'Conditional chain with inclusive alternatives','Deduction','Hard',i=>{
  const a=folders[i%20],b=folders[(i%20+4)%24],c=folders[(5+i*3)%24],d=folders[(7+i*7+Math.floor(i/20))%24];
  const labels=[a,b,c,d].map((name,j)=>`${name} label ${j+1}`);
  const [p,q,r,s]=labels;
  return plain(`Every package has at least one of ${p} or ${q}. A package with ${q} also has ${r}. A package has ${s} and lacks ${p}. Which option lists another required label?`,
    [r,p,'black label','No additional label is implied'],`Lacking ${p} forces ${q}. That label in turn requires ${r}. The observed ${s} does not change these implications.`);
});
family(logic,'Two badge statements under exactly one truth','Deduction','Hard',i=>{
  const [a,b,c]=rotate(names,i);
  const [x,y,z]=rotate(folders,(i*5)%folders.length);
  const secondOwner=i%2?b:a;
  const otherColours=secondOwner===a?[y,z]:[x,y,z];
  const secondColour=otherColours[Math.floor(i/2)%otherColours.length];
  const statements = [{owner:a,colour:x},{owner:secondOwner,colour:secondColour}];
  const assignments = [{[a]:x,[b]:y},{[a]:y,[b]:x}];
  const truths=assignments.map(assignment=>statements.filter(({owner,colour})=>assignment[owner]===colour).length);
  const result=truths.filter(count=>count===1).length;
  return plain(`${a}, ${b} and ${c} each receive one badge. The colours ${x}, ${y} and ${z} are used once each, and ${c} receives ${z}. Exactly one of “${a}'s badge is ${x}” and “${secondOwner}'s badge is ${secondColour}” must be true. How many assignments satisfy the clues?`,
    nums([result,...[0,1,2,3].filter(value=>value!==result)]),
    `Once ${c} has ${z}, two assignments remain. Giving ${a} the ${x} badge makes ${truths[0]} of the statements true. Giving ${a} the ${y} badge makes ${truths[1]} true. Exactly ${result} of the two assignments has one true statement.`);
});

const directions='Directional Reasoning';
const compass=['North','East','South','West'];
const unit=[[0,1],[1,0],[0,-1],[-1,0]];
const bearing=(x,y)=>[y?y>0?'north':'south':'',x?x>0?'east':'west':''].filter(Boolean).join('-');
const meters=(x,y)=>`${Math.abs(x)} m ${x>0?'east':'west'} and ${Math.abs(y)} m ${y>0?'north':'south'}`;
family(directions,'Return bearing from an offset point','Displacement','Easy',i=>{
  const a=4+i,b=7+i%9,sx=i&1?1:-1,sy=i&2?1:-1;
  const target=bearing(-sx,-sy);
  return plain(`From a starting marker, a walker goes ${a} metres ${sx>0?'east':'west'} and then ${b} metres ${sy>0?'north':'south'}. In which compass quadrant does the starting marker lie from the final point?`,
    [target,bearing(sx,sy),bearing(-sx,sy),bearing(sx,-sy)],`The outward movement is ${bearing(sx,sy)}. Reverse both components to return toward the starting marker, putting it to the ${target}.`);
});
family(directions,'Use a relative heading to get home','Turns','Medium',i=>{
  const a=i%4,b=1+Math.floor(i/4)%3,c=1+i%2,turn=1+Math.floor(i/12);
  const head=mod(a+b-turn,4),answer=compass[mod(head+c+2,4)];
  return plain(`A walker initially faces ${compass[a]}. They turn ${90*b}° right, then ${90*turn}° left. At the next point they turn ${90*c}° right and walk straight towards a gate. Which direction should they face at the gate to retrace that final segment?`,
    [answer,...compass.filter(x=>x!==answer)],
    `The gate is reached while facing ${compass[mod(head+c,4)]}. Choose the opposite heading to retrace that straight segment, giving ${answer}.`);
});
family(directions,'Compare two walkers from one origin','Displacement','Hard',i=>{
  const a=6+i%10,b=5+Math.floor(i/10),c=3+i%6,d=2+i%7,pattern=i%4;
  const [ux,uy]=unit[pattern],[vx,vy]=unit[(pattern+1)%4];
  const [x,y]=[(a+c)*ux+(b+d)*vx,(a+c)*uy+(b+d)*vy];
  return plain(`From one starting point, walker P goes ${a} m ${compass[pattern]} and ${b} m ${compass[(pattern+1)%4]}. Walker Q goes ${c} m ${compass[(pattern+2)%4]} and ${d} m ${compass[(pattern+3)%4]}. Where is P's final point relative to Q's final point?`,
    [meters(x,y),meters(-x,-y),meters(x,-y),meters(-x,y)],
    `The walkers went in opposite directions on both axes. From Q to P requires ${a+c} m ${compass[pattern]} and ${b+d} m ${compass[(pattern+1)%4]}, which is ${meters(x,y)}.`);
});
family(directions,'Same-coordinate shortcut after multiple turns','Displacement','Hard',i=>{
  const a=5+i%10,b=5+Math.floor(i/10),d=1+i%4,s=i%4,total=a+2*b+d;
  const target=(s+1)%4;
  return plain(`Starting at a flag, a student goes ${b} m ${compass[s]}, turns right and walks ${a} m, then turns right again and walks ${b} m. Their final turn is left, and they walk ${d} m. How long is the straight route from the flag to their final point?`,
    nums([a+d,total,a+d+b,total+a]),
    `The two ${b} m segments face opposite directions and cancel. The remaining two legs both go ${compass[target]}, so there is a straight displacement of ${a} + ${d} = ${a+d} m.`);
});

const analytical='Analytical Reasoning';
family(analytical,'Distance between internal ranks after promotion','Ranking','Medium',i=>{
  const n=22+i,a=8+i%4,b=17+i%5,rise=2+i%3,drop=1+i%4;
  const x=a-rise,y=b+drop,between=y-x-1;
  return plain(`In a group of ${n} trainees, trainee P is ranked ${a} and trainee Q ${b} from the top. Their next ranks change as follows: P moves up by ${rise}, and Q moves down by ${drop}. How many ranking positions are strictly between their new ranks?`,
    nums([between,between+1,between-1,b-a-1]),
    `The new positions are ${x} and ${y}. Count the positions strictly inside that interval: ${y} − ${x} − 1 = ${between}.`);
});
family(analytical,'Six-slot constraints with two linked blocks','Ordering','Hard',i=>{
  const [a,b,c,d,e,f]=rotate(names,i);
  const left=2+i%2,right=left+2,target=right-1;
  const placements=left===2?[b,a,e,f,c,d]:[b,d,a,e,f,c];
  const answer=placements[target-1];
  const options=[answer,...placements.filter(x=>x!==answer).slice(0,3)];
  return plain(`Six presenters occupy slots 1–6. ${a} is in slot ${left}, and ${f} is two slots after ${a}. ${e} is immediately before ${f}. ${b} is first. ${c} is immediately after ${f}. Who is in slot ${target}?`,
    options,`${f} is in slot ${right}. Its immediate predecessor is ${e}, so ${e} occupies slot ${target}. The other clues place the remaining presenters without a conflict.`);
});
family(analytical,'Placement match under multiple negative clues','Ordering','Hard',i=>{
  const [a,b,c,d]=rotate(names,i);
  const [p,q,r,s]=rotate(folders,i%24);
  const row=(x,y,z,w)=>`${a}: ${x}; ${b}: ${y}; ${c}: ${z}; ${d}: ${w}`;
  return plain(`Four students each receive a folder, with ${p}, ${q}, ${r}, and ${s} used once each. ${a} receives neither ${r} nor ${s}. ${b} receives ${s}. ${c} does not receive ${p}. ${d} receives ${q}. Which assignment works?`,
    [row(p,s,r,q),row(q,s,r,p),row(r,s,p,q),row(p,r,s,q)],
    `${b} takes ${s}, and ${d} takes ${q}. Since ${a} cannot take either of the other restricted colours, ${a} must take ${p}, leaving ${r} to ${c}.`);
});
family(analytical,'Fifth comparison via cumulative movement','Ranking','Medium',i=>{
  const start=13+i%6,a=1+i%3,b=3+i%5,c=1+i%4,d=1+i%7,base=29+Math.floor(i/6);
  const target=start+a-b+c-d;
  return plain(`In the same group of ${base} people, a participant begins at position ${start} from the top and then goes down ${a} places, up ${b}, down ${c}, and up ${d}. What is the final position counted from the bottom?`,
    nums([base-target+1,base-target,base-start+1,base-target+2].map((n,j)=>j===2&&[base-target+1,base-target,base-target+2].includes(n)?base-target+4:n)),
    `Down increases the top rank and up decreases it. The final top rank is ${start} + ${a} − ${b} + ${c} − ${d} = ${target}. From the bottom it is ${base} − ${target} + 1 = ${base-target+1}.`);
});

const venn='Venn Diagrams';
family(venn,'Exactly two groups in a three-set survey','Sets','Hard',i=>{
  const ab=7+i,ac=6+i%5,bc=8+Math.floor(i/5),overlap=2+i%4;
  const a=ab+overlap,b=ac+overlap,c=bc+overlap,result=ab+ac+bc;
  return plain(`In a club survey, ${a} attend both A and B, ${b} attend both A and C, and ${c} attend both B and C. Each pairwise count includes the ${overlap} people who attend all three. How many people attend exactly two clubs?`,
    nums([result,a+b+c,result+overlap,result-overlap]),
    `Subtract the triple intersection from each pairwise count to get ${ab}, ${ac}, and ${bc}. Those are disjoint groups, with total ${result}.`);
});
family(venn,'Neither group from overlap and totals','Sets','Medium',i=>{
  const a=14+i,b=10+i%7,both=6+Math.floor(i/7),outside=3+i%5,all=a+b+both+outside;
  return plain(`Among ${all} students, ${a+both} study drawing, ${b+both} study music, and ${both} study both. How many study neither?`,
    nums([outside,all-(a+b+both)+1,outside+both,outside+2*both]),
    `The union has ${a+both} + ${b+both} − ${both} = ${a+b+both}. Remove this union from ${all} to leave ${outside} students.`);
});
family(venn,'Syllogism uses a guaranteed witness','Syllogisms','Hard',i=>{
  const tags=rotate(folders,(i*7)%folders.length).slice(0,3).map((f,j)=>`${f} label ${j+1+Math.floor(i/24)}`);
  const [a,b,c]=tags;
  return plain(`Consider only these premises. Some items have ${a} and ${b}. No item with ${b} has ${c}. Which statement is forced?`,
    [`Some items with ${a} lack ${c}.`,`Every item with ${a} lacks ${c}.`,`Some items with ${b} have ${c}.`,`No item with ${a} has ${b}.`],
    `Pick an item in the stated overlap of ${a} and ${b}. The ${b} restriction excludes ${c} for that particular item. Other ${a} items could lie outside the overlap.`);
});
family(venn,'Mutually exclusive categories with one witness','Syllogisms','Medium',i=>{
  const [a,b,c]=rotate(folders,(i*5)%folders.length).slice(0,3).map((f,j)=>`${f} tag ${j+2+Math.floor(i/24)}`);
  return plain(`All samples with ${a} have ${b}. Samples with ${b} are barred from having ${c}. At least one sample has ${a}. Which conclusion follows?`,
    [`At least one sample with ${b} lacks ${c}.`,`Every sample with ${b} has ${a}.`,`At least one sample with ${a} has ${c}.`,`A sample with ${c} must exist.`],
    `Use the known sample with ${a}. It gains ${b} by the first premise and lacks ${c} by the second. This guarantees one witness for the conclusion.`);
});

const side=4;
const cells=range(side**2);
const row=n=>Math.floor(n/side);
const col=n=>n%side;
const cell=(r,c)=>r*side+c;
const coord=n=>at(row(n))+(col(n)+1);
const sig=points=>points.map(coord).sort().join(' ');
const draw=(points)=>range(side).map(r=>range(side).map(c=>points.includes(cell(r,c))?'X':'·').join(' ')).join('\n');
const drawPanels=panels=>panels.map((points,i)=>`Panel ${i+1}\n${draw(points)}`).join('\n\n');
const frame='On a 4 × 4 grid, rows A–D are top to bottom and columns 1–4 are left to right.';
const optionsFrame='Coordinates in each option list its marked cells.';
const moved=(shape,fn)=>shape.map(idx=>fn(row(idx),col(idx)));
const cap=n=>side-1-n;
const backslash=(r,c)=>cell(c,r);
const slash=(r,c)=>cell(cap(c),cap(r));
const lr=(r,c)=>cell(r,cap(c));
const tb=(r,c)=>cell(cap(r),c);
const half=(r,c)=>cell(cap(r),cap(c));
const right=(r,c)=>cell(c,cap(r));
const left=(r,c)=>cell(cap(c),r);
const fragments=[];
for(let a=0;a<12;a++)for(let b=a+1;b<13;b++)for(let c=b+1;c<15;c++){
  const shape=[a,b,c];
  if(new Set([backslash,slash,lr,tb,half,right,left,(r,c)=>cell(r,c)].map(fn=>sig(moved(shape,fn)))).size===8) fragments.push(shape);
}
const shapes=i=>fragments[7*i];
const spatial='Spatial Reasoning';
family(spatial,'Reflection across the rising diagonal','Mirror Image','Hard',i=>{
  const shape=shapes(i);
  const result=sig(moved(shape,slash));
  return {...plain(`${frame} The marks start at ${sig(shape)}. Reflect them across the diagonal from A4 to D1. Which cells now contain marks? ${optionsFrame}`,
    [result,sig(moved(shape,backslash)),sig(moved(shape,lr)),sig(moved(shape,half))],
    `A4, B3, C2, and D1 stay fixed. Every other cell exchanges its distances from the two opposite edges. For zero-based row r and column c this is (3 − c, 3 − r), yielding ${result}.`,draw(shape)),variantGroup:`spatial-grid-${sig(shape)}`};
},{visual:true});
family(spatial,'Clockwise rotation followed by reflection','Rotation','Hard',i=>{
  const shape=shapes(i),turn=right;
  const order=i%2?'vertical':'horizontal';
  const reflect=i%2?lr:tb;
  const key=sig(moved(moved(shape,turn),reflect));
  const other=sig(moved(moved(shape,turn),i%2?tb:lr));
  return {...plain(`${frame} Starting at ${sig(shape)}, rotate the whole shape 90° clockwise about the grid centre, then reflect it across the ${order} centreline. Where are the marks? ${optionsFrame}`,
    [key,other,sig(moved(shape,turn)),sig(moved(shape,reflect))],
    `The clockwise turn moves the marks to ${sig(moved(shape,turn))}. The ${order} reflection then swaps ${i%2?'left and right columns':'top and bottom rows'}, leaving ${key}.`,draw(shape)),variantGroup:`spatial-grid-${sig(shape)}`};
},{visual:true});
family(spatial,'Two punches after a fold','Folding','Medium',i=>{
  const w=8+2*(i%5),h=7+Math.floor(i/5);
  const c=1+Math.floor(i/5)%3,r=2+i%4;
  const first=w+1-c,second=w-c;
  const pair=(x,y)=>pairs([[r,c],[r+1,c+1],[r,x],[r+1,y]]);
  return plain(`A sheet has ${h} rows and ${w} columns. Fold the right half over the left. Punch through both layers at positions (${r}, ${c}) and (${r+1}, ${c+1}), expressed as (row, column) on the left half. Which four positions are punched after unfolding?`,
    [pair(first,second),pair(second,first),pair(first-2,second-2),pair(first,second-1)],
    `Unfolding leaves each original punch and its mirror in the same row. Mirrored columns sum to ${w+1}. The corresponding columns for ${c} and ${c+1} are ${first} and ${second}, respectively.`);
});
family(spatial,'Translation after a half turn','Rotation','Hard',i=>{
  const width=19+i%7,height=16+Math.floor(i/7);
  const p=[1+i%5,3+i%6],q=[p[0]+1,p[1]+2],a=1+i%4,b=1+i%3;
  const movement=([r,c])=>[height+1-r-a,width+1-c-b];
  const result=pairs([movement(p),movement(q)]);
  return plain(`On a ${height}-row by ${width}-column grid, marks are at ${pairs([p,q])} in (row, column) order. Rotate the marks by half a turn about the grid centre, then move them ${a} row${a===1?'':'s'} up and ${b} column${b===1?'':'s'} left. What are the new coordinates?`,
    [result,pairs([p,q].map(([r,c])=>[height+1-r,width+1-c])),
      pairs([p,q].map(([r,c])=>[height+1-r+a,width+1-c+b])),
      pairs([p,q].map(([r,c])=>[height+1-r-a,width+1-c+b]))],
    `The half turn changes (r,c) to (${height+1} − r, ${width+1} − c). Subtract ${a} from the new rows and ${b} from the new columns to get ${result}.`);
});

const figure='Figure Series';
const path=[0,1,2,3,7,11,15,14,13,12,8,4];
const glyphs=['↑','→','↓','←'];
const turnsWord=['up','right','down','left'];
family(figure,'Counterclockwise perimeter movement','Position','Easy',i=>{
  const start=i%12,step=1+Math.floor(i/12),pos=n=>path[mod(start-n*step,path.length)];
  const shown=range(4).map(pos),target=pos(4),prev=pos(3),p=path.indexOf(target);
  return plain(`${frame} A dot moves around the perimeter anticlockwise by a constant step. Its positions are ${shown.map(coord).join(' → ')}. Where does it go next, after ${coord(prev)}?`,
    [target,path[mod(p+1,12)],path[mod(p-1,12)],path[mod(p+2,12)]].map(coord),
    `Moving anticlockwise along the outer cells, each jump crosses ${step} position${step===1?'':'s'}. One further jump from ${coord(prev)} reaches ${coord(target)}.`,drawPanels(shown.map(x=>[x])));
},{visual:true});
family(figure,'Rotate a shape while adding one marker','Rotation and position','Hard',i=>{
  const first=shapes(i);
  const turn=i%2?right:left,other=i%2?left:right;
  const move=(shape,fn)=>moved(shape,fn);
  const seq=[first,move(first,turn),move(move(first,turn),turn)];
  const next=move(seq[2],turn);
  const available=cells.filter(x=>!next.includes(x));
  const add=available[i%13],alternativeMark=available[(i+1)%13];
  const result=sig([...next,add]);
  const wrong=move(seq[2],other);
  const distractor=sig(wrong.includes(add)?wrong:[...wrong,add]);
  return plain(`${frame} Three panels show successive quarter turns of the same set of marks. The sets are ${seq.map(sig).join(' / ')}. Apply one more turn in the observed direction, then mark ${coord(add)} as well. What is the fourth set? ${optionsFrame}`,
    [result,sig(next),distractor,sig([...next,alternativeMark])],
    `The first move is ${i%2?'clockwise':'anticlockwise'}, which is also the second move. Turning panel 3 in the same direction gives ${sig(next)}. Adding ${coord(add)} gives ${result}.`,drawPanels(seq));
},{visual:true});
family(figure,'Arrow directions in alternating slots','Rotation','Medium',i=>{
  const start=i%4,offset=1+Math.floor(i/4)%3,a=mod(start+offset,4),b=1+Math.floor(i/12)%3;
  const seq=[start,a,mod(start+1,4),mod(a-b,4),mod(start+2,4)];
  const target=i<36?6:8;
  const applications=(target-4)/2;
  const answer=turnsWord[mod(seq[3]-b*applications,4)];
  return plain(`The arrows at positions 1–5 point ${seq.map(n=>turnsWord[n]).join(', ')}. Odd and even positions follow their own fixed rotation. Which way does arrow ${target} point?`,
    [answer,...turnsWord.filter(x=>x!==answer)],
    `Use only the even positions. Arrow 2 points ${turnsWord[seq[1]]} and arrow 4 points ${turnsWord[seq[3]]}, a change of ${b} anticlockwise quarter turn${b===1?'':'s'}. Apply that change ${applications} more time${applications===1?'':'s'} to reach arrow ${target}, pointing ${answer}.`,seq.map(n=>glyphs[n]).join('   '));
},{visual:true});
family(figure,'Bouncing marker on a row','Position','Medium',i=>{
  const size=5+i%4,start=1+Math.floor(i/4)%4,step=1+Math.floor(i/16),startDir=i%2?1:-1;
  const period=2*(size-1),position=j=>{
    const p=mod(start+startDir*step*j,period);
    return (p<size?p:period-p)+1;
  };
  const vals=range(6).map(position),target=vals[5];
  const opts=[target,...range(size).map(n=>n+1).filter(n=>n!==target).sort((a,b)=>Math.abs(a-target)-Math.abs(b-target)).slice(0,3)];
  return plain(`A marker on cells 1 to ${size} starts on cell ${start+1} and moves ${step} space${step===1?'':'s'} at a time, initially toward the ${startDir>0?'greater':'smaller'} numbers. On reaching either end it reverses, completing any remaining spaces in that same move. Its first five positions, including the start, are ${vals.slice(0,5).join(', ')}. What is the sixth position?`,
    nums(opts),`Track every individual space, reversing as soon as the end is reached. Starting from ${start+1}, the first six positions are ${vals.join(', ')}.`,
    vals.slice(0,5).map((n,k)=>`${k+1}: ${range(size).map(j=>j+1===n?'X':'·').join(' ')}`).join('\n'));
},{visual:true});

const pattern='Pattern Completion';
family(pattern,'Find exactly the cells marked in both panels','Matrices','Medium',i=>{
  const a=shapes(i), b=[a[0],cells.find(x=>!a.includes(x)&&x>3),cells.find(x=>!a.includes(x)&&x>10)];
  const both=a.filter(x=>b.includes(x)),either=[...new Set([...a,...b])];
  return plain(`${frame} The first panel is marked at ${sig(a)} and the second at ${sig(b)}. The next panel keeps only positions marked in both panels. What should it show? ${optionsFrame}`,
    [sig(both),sig(a),sig(b),sig(either)],
    `Compare cells coordinate by coordinate. Only ${sig(both)} is marked twice. Other cells are marked in just one of the original panels and are dropped.`,drawPanels([a,b]));
},{visual:true});
family(pattern,'Exclusive overlay completes the third panel','Matrices','Hard',i=>{
  const a=shapes(i),c=cells.filter(x=>!a.includes(x));
  const b=[a[1],c[i%c.length],c[(i+4)%c.length]];
  const target=[...a.filter(x=>!b.includes(x)),...b.filter(x=>!a.includes(x))];
  return plain(`${frame} First panel: ${sig(a)}. Second panel: ${sig(b)}. Overlay them without moving either grid. Erase any mark where both panels are marked. Which cells remain in the third panel? ${optionsFrame}`,
    [sig(target),sig([...new Set([...a,...b])]),sig(a),sig(b)],
    `The common mark ${coord(a[1])} cancels. Marks appearing in one panel only survive. Together they are ${sig(target)}.`,drawPanels([a,b]));
},{visual:true});
family(pattern,'Complete a column using paired products','Matrices','Medium',i=>{
  const a=[3+i,2+i%4,3+i%5],b=[2+i%6,3+Math.floor(i/6),5+i%8];
  const sumProducts=(x,y)=>x*y+2;
  const out=[sumProducts(a[0],b[0]),sumProducts(a[1],b[1]),'?'];
  const target=sumProducts(a[2],b[2]);
  return plain(`Use the same rule in each column: multiply the top two entries, then apply a common addition. If the three rows are ${[a,b,out].map(r=>r.join(', ')).join(' / ')}, what replaces the question mark?`,
    nums([target,target-2,target+2,a[2]+b[2]+2]),
    `The first column has ${a[0]} × ${b[0]} + 2 = ${out[0]}, and the second follows the same rule. So the last result is ${a[2]} × ${b[2]} + 2 = ${target}.`,
    [a,b,out].map(r=>r.join('  │  ')).join('\n'));
},{visual:true});
family(pattern,'Recover a row from diagonal reflection','Symmetry','Hard',i=>{
  const shape=shapes(i),mirror=moved(shape,backslash),target=sig([...new Set([...shape,...mirror])]);
  const alt=[sig(shape),sig(mirror),sig([...new Set([...shape,...moved(shape,lr)])])];
  return plain(`${frame} A partly filled grid has marks at ${sig(shape)}. Complete its symmetry across diagonal A1–D4 by adding only the necessary marks. Which set is marked in the completed grid? ${optionsFrame}`,
    [target,...alt],`The A1–D4 diagonal exchanges row and column indexes. The reflected marks are ${sig(mirror)}. Keep the starting marks and add the missing partners, leaving ${target}.`,draw(shape));
},{visual:true});

const nonverbal='Non-Verbal Classification';
function isAdjacent(a,b) { return Math.abs(row(a)-row(b))+Math.abs(col(a)-col(b))===1; }
function graph(marks){ return marks.reduce((n,x,i)=>n+marks.slice(i+1).filter(y=>isAdjacent(x,y)).length,0); }
function isStraightGrid(marks){ return marks.every(x=>row(x)===row(marks[0]))||marks.every(x=>col(x)===col(marks[0])); }
const rows=[];
for(let a=0;a<14;a++)for(let b=a+1;b<15;b++)for(let c=b+1;c<16;c++)rows.push([a,b,c]);
const halfSym=marks=>sig(marks)===sig(moved(marks,half));
const couples=[];
for(let a=0;a<13;a++)for(let b=a+1;b<14;b++)for(let c=b+1;c<15;c++)for(let d=c+1;d<16;d++)couples.push([a,b,c,d]);
function oddPanel(seed,prompt,pass,fail,proof){
  const right=fail[(seed*11)%fail.length];
  const choices=[right,...range(3).map(j=>pass[(seed*7+2*j)%pass.length])];
  const panels=rotate(choices,seed%4);
  return plain(`${frame} ${prompt} The four panels are ${panels.map(sig).join(' / ')}. ${optionsFrame}`,
    choices.map(sig),proof(right),drawPanels(panels));
}
const linePanels=rows.filter(isStraightGrid),otherLines=rows.filter(marks=>!isStraightGrid(marks));
family(nonverbal,'One row or column contains all marks','Visual Groups','Easy',i=>
  oddPanel(i,'In three panels the marks all occupy one row or all occupy one column. Which panel breaks the rule?',linePanels,otherLines,
    key=>`${sig(key)} spans multiple rows and columns. Every other panel puts all its marks on a single horizontal or vertical line.`),{visual:true});
const noGraph=rows.filter(x=>graph(x)===0),hasGraph=rows.filter(x=>graph(x)>0);
family(nonverbal,'Detect the only side-touching pair','Visual Groups','Easy',i=>
  oddPanel(i,'Three panels have no marks sharing a side. Which panel contains a pair of marks sharing a side?',noGraph,hasGraph,
    key=>`In ${sig(key)}, at least two marks occupy cells at a horizontal or vertical distance of one. In the other panels no pair shares a side.`),{visual:true});
const halfPanels=couples.filter(halfSym),otherHalf=couples.filter(x=>!halfSym(x));
family(nonverbal,'Odd panel under 180-degree rotation','Visual Groups','Medium',i=>
  oddPanel(i,'Three patterns look identical after a 180° turn about the centre. Which one changes?',halfPanels,otherHalf,
    key=>`The marks ${sig(key)} turn into ${sig(moved(key,half))}. Those two sets differ, so this is the only non-invariant panel.`),{visual:true});
const partitions=marks=>[marks.filter(x=>row(x)<2&&col(x)<2),marks.filter(x=>row(x)<2&&col(x)>=2),marks.filter(x=>row(x)>=2&&col(x)<2),marks.filter(x=>row(x)>=2&&col(x)>=2)];
const regular=couples.filter(x=>partitions(x).every(part=>part.length===1)),irregular=couples.filter(x=>partitions(x).some(part=>part.length!==1));
family(nonverbal,'Unequal quadrant coverage','Visual Groups','Medium',i=>
  oddPanel(i,'Split the grid into four 2 × 2 quarters. Three panels have exactly one mark in each quarter. Which panel differs?',regular,irregular,
    key=>`Reading the quarters top-left, top-right, bottom-left, bottom-right, ${sig(key)} gives counts ${partitions(key).map(part=>part.length).join(', ')}. The other panels all give 1, 1, 1, 1.`),{visual:true});

export function buildReasoningSecond() {
  return families.flatMap(({topic,name,subtopic,difficulty,visual,build})=>range(40).map(i=>{
    const question=build(i);
    const offset=(i+name.length)%4;
    return {...question,
      subject:'rea',topic,subtopic,difficulty,concept:name,
      family:`Reasoning — ${name}`,
      options:rotate(question.options,offset),
      answer:mod(-offset,4),
      source:syllabus,
      references:visual?[modelPapers]:[],
      style:visual?'Non-verbal pattern practice':'Verbal and analytical reasoning',
      classification:'ORIGINAL_AFCAT_STYLE'
    };
  }));
}
