const syllabus = 'https://www.careerairforce.gov.in/afcat-syllabus';
const modelPapers = 'https://www.careerairforce.gov.in/afcat-model-questions';
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const wrap = (value, size) => ((value % size) + size) % size;
const letter = n => alphabet[wrap(n, 26)];
const position = ch => alphabet.indexOf(ch);
const shift = (word, delta) => [...word].map(ch => letter(position(ch) + delta)).join('');
const reverse = text => [...text].reverse().join('');
const rotate = (items, n) => [...items.slice(n), ...items.slice(0, n)];
const nums = (n, fn) => Array.from({length:n}, (_, i) => fn(i));
const list = items => items.join(', ');
const wordList = 'ARCH BEND CASK DART ECHO FERN GLOW HARP IRON JADE KITE LAMB MINT NEST OPAL PINE QUIZ RAFT SILK TIDE URGE VINE WALT YARN ZEST ACRE BOLT COVE DUNE ELMS FLAX GIRD HUSK INCH JOLT KELP LIME MARSH NORTH PRISM'.split(' ');
const objects = ['red labels','route cards','blue folders','forms','ribbons','tokens','maps','marker pens','badges','beads','checklists','clay tiles'];
const names = ['Asha','Bela','Charu','Daya','Esha','Farah','Gita','Hema','Ira','Jaya','Kiran','Leela','Maya','Neha','Ojas','Pia','Reva','Sara','Tara','Uma','Varsha','Yana','Zara','Amal','Bimal','Chetan','Dev','Eshan','Farid','Gopal','Harish','Ishan','Jatin','Kabir','Laksh','Milan'];
const labelPairs = [
  ['portrait','painter','novel','novelist','publisher','reader','bookseller'],
  ['chisel','sculptor','loom','weaver','dyer','tailor','potter'],
  ['rain gauge','rainfall','speedometer','speed','time','distance','direction'],
  ['page','book','chapter','novel','author','publisher','index'],
  ['seed','seedling','egg','chick','nest','feather','shell'],
  ['actor','play','dancer','ballet','costume','stage','troupe'],
  ['brush','paint','pen','ink','paper','grip','nib'],
  ['drought','water shortage','blackout','loss of electric power','low rainfall','traffic congestion','crop growth'],
  ['atlas','maps','anthology','selected literary works','road routes','weather forecasts','grammar rules'],
  ['jury','juror','choir','singer','conductor','audience member','composer'],
  ['wheat','grain','ruby','gemstone','wood','fabric','metal'],
  ['teapot','tea','sugar bowl','sugar','salt shaker','cupboard','serving spoon'],
  ['needle','sew','broom','sweep','wash','wipe','scrub'],
  ['scales','mass','clock','time','distance','force','area'],
  ['bicycle','cyclist','sailboat','sailor','passenger','angler','swimmer'],
  ['alphabet','letter','sentence','word','book','paragraph','page'],
  ['vineyard','grapes','orchard','fruit trees','fish','cereal crops','cattle'],
  ['harmonica','reeds','violin','strings','keys','valves','pedals'],
  ['cold','hot','scarce','plentiful','limited','sparse','rare'],
  ['daisy','flower','copper','metal','mineral salt','gas','ceramic'],
  ['murmur','quiet speech','glance','brief look','quiet knock','short journey','slow step'],
  ['spoke','wheel','rung','ladder','carriage','window','wall'],
  ['cartographer','map','lexicographer','dictionary','magazine','atlas','timetable'],
  ['tadpole','frog','caterpillar','butterfly','beetle','housefly','dragonfly'],
  ['coffee','cup','soup','bowl','ladle','napkin','plate'],
  ['silent','noisy','lethargic','energetic','drowsy','sluggish','inactive'],
  ['brick','wall','note','melody','violin','rhythm','score'],
  ['hiker','trail','train','track','garage','tunnel','terminal'],
  ['metre','length','litre','volume','mass','area','time'],
  ['reef','coral','grove','trees','fish','stones','shells'],
  ['stamp','letter','label','parcel','paperclip','postbox','post office'],
  ['thumbnail','image','abstract','research paper','chapter heading','index entry','book title'],
  ['infant','adult','sapling','mature tree','timber','seed','bark'],
  ['anemometer','wind speed','hygrometer','humidity','pressure','temperature','altitude'],
  ['manuscript','editor','blueprint','architect','poet','journalist','librarian'],
  ['lighthouse','ships','railway signal','trains','sailboats','aircraft','bicycles'],
];
const triples = [
  ['harp','cello','violin','clarinet','stringed instruments'],
  ['triangle','rectangle','pentagon','sphere','plane polygons'],
  ['red','green','blue','octave','colours'],
  ['oak','teak','maple','wheat','types of tree'],
  ['January','May','August','September','months with 31 days'],
  ['turquoise','maroon','beige','velvet','colours'],
  ['garnet','ruby','emerald','slate','gemstones'],
  ['trumpet','trombone','tuba','cello','brass instruments'],
  ['owl','eagle','falcon','bat','birds'],
  ['khaki','linen','corduroy','granite','fabrics'],
  ['minute','second','hour','metre','time units'],
  ['kilometre','metre','centimetre','kilogram','length units'],
  ['soprano','alto','tenor','crescendo','voice ranges'],
  ['magnet','compass needle','lodestone','eraser','objects that can be permanently magnetic'],
  ['ellipse','circle','triangle','cylinder','two-dimensional shapes'],
  ['sum','product','difference','digit','outputs of arithmetic operations'],
  ['eclipse','solstice','equinox','thunder','astronomical events'],
  ['marble','granite','slate','steel','types of rock'],
  ['sapphire','diamond','amethyst','ambergris','gemstones'],
  ['marsupial','primate','rodent','reptile','mammal groups'],
  ['crow','raven','magpie','pelican','members of the crow family'],
  ['globe','atlas','map','calendar','geographic reference aids'],
  ['walnut','almond','pistachio','lentil','culinary nuts'],
  ['queue','stack','row','triangle','terms for linear arrangement or order'],
  ['Saturn','Jupiter','Neptune','Mercury','giant planets'],
  ['Mercury','Venus','Mars','Uranus','terrestrial planets'],
  ['pen','pencil','quill','stencil','implements that directly make a written mark'],
  ['pound','rupee','yen','gram','currencies'],
  ['tulip','lotus','poppy','spruce','plants named for familiar ornamental flowers'],
  ['larch','pine','spruce','birch','conifers'],
  ['ferry','canoe','yacht','tram','watercraft'],
  ['ladle','spatula','whisk','colander','handheld mixing, lifting or turning utensils'],
  ['poem','essay','short story','sculpture','literary works'],
  ['cherry','peach','plum','pea','fleshy stone fruits'],
  ['violinist','cellist','violist','organist','players of bowed strings'],
  ['prelude','sonata','etude','pigment','forms or types of musical composition'],
];

const numericChoices = (key, decoys) => {
  const result = [...new Set(decoys)].filter(n => n !== key);
  for (let delta = 1; result.length < 3; delta++) if (!result.includes(key + delta)) result.push(key + delta);
  return [key, ...result.slice(0, 3)].map(String);
};
const letterChoices = (key, decoys) => {
  const result = [...new Set(decoys)].filter(n => n !== key);
  for (let delta = 1; result.length < 3; delta++) {
    const option = shift(key, delta);
    if (!result.includes(option)) result.push(option);
  }
  return [key, ...result.slice(0, 3)];
};
const families = [];
function family(topic, subtopic, name, difficulty, build, {count=36, visual=false}={}) {
  families.push({topic,subtopic,name,difficulty,build,count,visual});
}
function item(prompt, options, explanation, diagram) {
  return {prompt,options,explanation,...(diagram?{diagram}:{})};
}
function series(terms, answer, distractors, rule, prompt='Choose the next term.') {
  return item(`${prompt} ${list(terms)}, ?`, numericChoices(answer,distractors), rule);
}

const analogy='Analogies';
family(analogy,'Verbal Analogy','Lexical relationships','Easy',i=>{
  const [a,b,c,d,e,f,g]=labelPairs[i];
  const relationships=[
    'a work followed by its creator','a tool followed by the craftsperson who uses it','an instrument followed by the quantity it measures',
    'a section followed by the whole written work','an early form followed by the organism that emerges from it',
    'a performer followed by a type of performance','a writing or painting tool followed by the substance it delivers',
    'an event followed by a direct consequence','a collection followed by the kind of content it holds',
    'a collective followed by one of its typical members','an example followed by its broader category','a vessel followed by what it can hold',
    'a tool followed by its characteristic use','an instrument followed by what it measures','a vehicle followed by its operator',
    'a whole followed by one of its constituent units','a cultivated area followed by what grows there',
    'a musical instrument followed by a key physical component','a word followed by its opposite','an example followed by its category',
    'an action followed by its defining character','a component followed by the structure it belongs to',
    'a specialist followed by the kind of reference work they prepare','a larval form followed by its adult form',
    'a food or drink followed by a typical serving vessel','a condition followed by a contrasting condition',
    'a building block followed by what it helps form','something that moves followed by the path it follows',
    'a unit followed by the quantity it measures','a habitat followed by what characteristically forms it',
    'an identifying attachment followed by what it is attached to','a compact representation followed by the full object',
    'an immature form followed by a mature form','an instrument followed by the quantity it measures',
    'a document followed by a profession that works directly on it','a navigational signal followed by its main users',
  ];
  return item(`${a} is to ${b} as ${c} is to which option? Choose the closest parallel.`,
    [d,e,f,g],`The relationship is ${relationships[i]}. This pairs ${a} with ${b}, and ${c} with ${d}.`);
});
family(analogy,'Symbol Analogy','Reverse letter code analogy','Medium',i=>{
  const a=wordList[i], b=wordList[(i+9)%wordList.length], n=i%4+1;
  const target=shift(reverse(b),n);
  return item(`${a} becomes ${shift(reverse(a),n)} when its order is reversed and every letter undergoes the same alphabet shift. How does ${b} change by the same rule?`,
    letterChoices(target,[shift(b,n),shift(reverse(b),-n),reverse(b)]),
    `Reverse ${a} to get ${reverse(a)}. Its first letter advances by ${n}. Reversing ${b} gives ${reverse(b)}. Advancing every letter by ${n} gives ${target}.`);
});
family(analogy,'Number Analogy','Squared sum analogy','Medium',i=>{
  const a=i+3,b=i%7+8,c=i%5+2;const target=b*b+c;
  return item(`${a} is to ${a*a+c} as ${b} is to what? In each pair, square the first number and apply the same fixed addition.`,
    numericChoices(target,[b*b-c,b+c,2*b+c]),
    `Squaring ${a} gives ${a*a}, which is ${c} below ${a*a+c}. Apply that addition to the second square, ${b*b}, to get ${target}.`);
});
family(analogy,'Number Analogy','Digits product analogy','Hard',i=>{
  const x=2+i%6,y=3+Math.floor(i/6),a=10*x+y,b=10*(x+1)+(y-1);
  const p=(n,k)=>n*k+n+k;
  const target=p(x+1,y-1);
  return item(`${a} is to ${p(x,y)} as ${b} is to what? The rule uses the product and sum of the two digits by adding, with no other operation.`,
    numericChoices(target,[(x+1)*(y-1),(x+1)*(y-1)-x-y,b+x+y]),
    `The product and sum of ${a}'s digits are ${x*y} and ${x+y}. Adding them gives ${p(x,y)}. For ${b}, the product ${(x+1)*(y-1)} plus the sum ${x+y} gives ${target}.`);
});
family(analogy,'Verbal Analogy','Comparison of relative intensity','Medium',i=>{
  const words=[
    ['cool','cold','warm','hot','mild','short','dim'],['like','love','dislike','hate','prefer','respect','notice'],['worry','panic','interest','fascination','curiosity','apathy','hesitation'],
    ['snip','sever','scratch','gouge','polish','wash','smudge'],['stroll','sprint','speak','shout','breathe','mumble','hear'],['annoyed','furious','pleased','thrilled','nervous','sad','regretful'],
    ['breeze','gale','drizzle','downpour','hailstone','fog','frost'],['dim','dark','bright','dazzling','colourful','unlit','opaque'],['tired','exhausted','hungry','ravenous','thirsty','full','sleepy'],
    ['trickle','torrent','warmth','scorching heat','breeze','cool air','fog'],['tall','towering','small','minute','wide','narrow','old'],['stingy','miserly','generous','lavish','tidy','cautious','sparing'],
  ];
  const [a,b,c,d,e,f,g]=words[i];
  return item(`The second word intensifies the first: ${a} → ${b}. Which option similarly intensifies “${c}”?`,
    [d,e,f,g],`Keep the underlying idea and increase its degree. “${d}” expresses ${c} more strongly, as “${b}” intensifies “${a}.”`);
},{count:12});

const classification='Classification';
family(classification,'Verbal Classification','Shared lexical category','Easy',i=>{
  const [a,b,c,d,category]=triples[i];
  return item(`Which item is outside the group of ${category}: ${rotate([a,b,c,d],(i*3+1)%4).join(', ')}?`,
    [d,a,b,c],`Identify the named category first. ${a}, ${b}, and ${c} all belong to the group of ${category}. ${d} does not fit that category.`);
});
family(classification,'Number Classification','Even versus odd in linear rules','Easy',i=>{
  const base=8+i*3, vals=[base*2+1,base*2+5,base*2+10,base*2+15];
  return item(`Which of ${list(rotate(vals,(i*3+1)%4))} cannot be written as twice an integer plus one?`,[vals[2],vals[0],vals[1],vals[3]].map(String),
    `Twice an integer is even. Adding one makes it odd. Only ${vals[2]} is even, so it cannot satisfy the rule.`);
});
family(classification,'Number Classification','Remainder family outlier','Medium',i=>{
  const d=3+i%7,m=6+i,r=1+i%(d-1),vals=[d*m+r,d*(m+3)+r,d*(m+5)+r-1,d*(m+8)+r];
  return item(`When divided by ${d}, which of ${list(rotate(vals,i%4))} gives a different remainder from the other three?`,[vals[2],vals[0],vals[1],vals[3]].map(String),
    `${vals[0]}, ${vals[1]}, and ${vals[3]} each leave remainder ${r}. ${vals[2]} leaves remainder ${r-1}, so it is the outlier.`);
});
family(classification,'Letter Classification','Alphabet-gap outlier','Medium',i=>{
  const start=i%8,s=2+Math.floor(i/8);
  const block=(x,g)=>[letter(x),letter(x+g),letter(x+2*g)].join('');
  const a=block(start,s),b=block(start+1,s),c=block(start+3,s+1),d=block(start+5,s);
  return item(`Among ${rotate([a,b,c,d],(i*3)%4).join(', ')}, three groups have the same step between successive alphabet positions. Which group differs?`,
    [c,a,b,d],`The letters in ${a}, ${b}, and ${d} advance by ${s} positions each time. In ${c}, they advance by ${s+1}.`);
});
family(classification,'Number Classification','Perfect-square outlier','Medium',i=>{
  const a=4+i;const vals=[a*a,(a+1)**2,(a+2)**2+1,(a+3)**2];
  return item(`Which entry in ${list(rotate(vals,(i*3+1)%4))} cannot be made by multiplying an integer by itself?`,[vals[2],vals[0],vals[1],vals[3]].map(String),
    `${vals[0]}, ${vals[1]}, and ${vals[3]} are squares of ${a}, ${a+1}, and ${a+3}. ${vals[2]} lies strictly between consecutive squares ${(a+2)**2} and ${(a+3)**2}.`);
});

const sequences='Number and Letter Series';
family(sequences,'Number Series','Growing arithmetic differences','Medium',i=>{
  const a=4+i,d=2+i%7,g=1+i%4;
  const values=nums(6,j=>a+j*d+j*(j-1)*g/2);
  return series(values.slice(0,5),values[5],[values[4]+d,values[5]-g,values[5]+g],
    `The first gap is ${d}. Each later gap grows by ${g}, so the next gap is ${d+4*g}. Add it to ${values[4]} to get ${values[5]}.`);
});
family(sequences,'Number Series','Two interleaved progressions','Hard',i=>{
  const a=3+i*2,b=130+i*3,d=2+i%6,e=3+i%5;
  const values=[a,b,a+d,b-e,a+2*d,b-2*e,a+3*d];
  return series(values,b-3*e,[a+4*d,b+3*e,b-4*e],
    `Read the odd and even positions separately. The odd subsequence increases by ${d}; the even one falls by ${e}. Position eight is even, so subtract ${e} from ${b-2*e}.`);
});
family(sequences,'Number Series','Repeated multiply then add','Medium',i=>{
  const a=2+i,c=1+i%5,f=2+i%2;
  const seq=[a];
  for(let j=1;j<6;j++)seq.push(seq[j-1]*f+c);
  const target=seq[5];
  return series(seq.slice(0,5),target,[target-c,target+c,seq[4]+f+c],
    `The repeated operation is multiply by ${f}, then add ${c}. Applying it to ${seq[4]} gives ${seq[4]*f} + ${c} = ${target}.`);
});
family(sequences,'Letter Series','Increasing letter jumps','Medium',i=>{
  const a=i%12,d=1+Math.floor(i/12),values=nums(6,j=>letter(a+j*d+j*(j-1)/2));
  return item(`Letter positions advance by a growing step, wrapping after Z. Complete ${list(values.slice(0,5))}, ?`,
    letterChoices(values[5],[letter(position(values[4])+d),letter(position(values[5])-1),letter(position(values[5])+1)]),
    `The jumps are ${d}, ${d+1}, ${d+2}, and ${d+3}. The next jump is ${d+4} positions from ${values[4]}, landing on ${values[5]}.`);
});
family(sequences,'Letter Series','Opposite movement in letter pairs','Hard',i=>{
  const a=i%12,b=25-Math.floor(i/12),s=i%3+1;
  const values=nums(6,j=>letter(a+j*s)+letter(b-j*2));
  return item(`Each position within a pair moves by its own constant step. Continue ${list(values.slice(0,5))}, ?`,
    letterChoices(values[5],[letter(a+5*s)+letter(b-8),letter(a+4*s)+letter(b-10),reverse(values[5])]),
    `Read columns separately. The first letter advances ${s} and the second retreats 2 (with wrap at each alphabet end if necessary). That gives ${values[5]}.`);
});

const coding='Coding-Decoding';
family(coding,'Substitution','Decode a constant shift','Easy',i=>{
  const word=wordList[i],ref=wordList[(i+11)%wordList.length],n=i%5+2,coded=shift(word,n);
  return item(`A constant forward alphabet shift encodes ${ref} as ${shift(ref,n)}. Which word was encoded as ${coded}?`,
    letterChoices(word,[shift(coded,n),shift(coded,-n-1),reverse(word)]),
    `The example advances each letter by ${n}. Decoding requires moving each letter of ${coded} back by ${n}, yielding ${word}.`);
});
family(coding,'Substitution','Alternating letter shifts','Medium',i=>{
  const a=i%4+1,b=Math.floor(i/4)%5+1,word=wordList[i];
  const encode=(x,y)=>[...word].map((ch,j)=>shift(ch,j%2?y:x)).join('');
  return item(`From the left, move letters at odd positions forward ${a} and letters at even positions backward ${b}. Wrap between A and Z. Which code represents ${word}?`,
    letterChoices(encode(a,-b),[encode(-b,a),encode(a,b),encode(-a,-b)]),
    `Number positions starting with one. Apply +${a} at odd positions and −${b} at even ones. Processing ${word} from left to right gives ${encode(a,-b)}.`);
});
family(coding,'Position','Reverse alphabet position','Easy',i=>{
  const word=wordList[i],values=[...word].map(ch=>26-position(ch));
  const encoded=list(values);
  return item(`Use Z=1, Y=2, and continue backwards to A=26. What is the code for ${word}?`,
    [encoded,list(values.map(n=>27-n)),list([...values].reverse()),list(values.map(n=>n+1))],
    `A letter in ordinary alphabet position p has new value 27 − p. Apply that formula to the letters of ${word} in order to get ${encoded}.`);
});
family(coding,'Position','Weighted alphabet total','Medium',i=>{
  const word=wordList[i],w=2+i%4,values=[...word].map(ch=>position(ch)+1);
  const target=values.reduce((sum,n,j)=>sum+n*(j%2?w:1),0);
  const unweighted=values.reduce((sum,n)=>sum+n,0);
  return item(`With A=1 through Z=26, a code totals the letter values for ${word}. Positions 2 and 4 contribute ${w} times their value. What total is produced?`,
    numericChoices(target,[unweighted,w*unweighted,(w+1)*unweighted-target]),
    `Its letter values are ${list(values)}. Multiply the second and fourth values by ${w}, then add the unmultiplied first and third values to obtain ${target}.`);
});
family(coding,'Position','Recover overlapping codes','Hard',i=>{
  const [x,y,z,w]=nums(4,j=>letter(i+j*4));
  const codes=nums(4,j=>String(2+wrap(i+3*j,8)));
  return item(`A device replaces each letter with a distinct digit. It keeps order. It displays ${x+y} → ${codes[0]+codes[1]}, ${z+y} → ${codes[2]+codes[1]}, and ${w+x} → ${codes[3]+codes[0]}. What code does it display for ${y+w+z}?`,
    [codes[1]+codes[3]+codes[2],codes[1]+codes[2]+codes[3],codes[3]+codes[1]+codes[2],codes[0]+codes[3]+codes[2]],
    `The shared letter ${y} is ${codes[1]}. Reading the remaining mappings yields ${w} → ${codes[3]} and ${z} → ${codes[2]}. Keep the requested order to get ${codes[1]+codes[3]+codes[2]}.`);
});

const logical='Logical Relationships';
family(logical,'Family Relations','Family chain through siblings','Medium',i=>{
  const [p,k,s,d]=rotate(names,i);
  return item(`${p} is the only parent mentioned for siblings ${k} and ${s}. ${k} is the mother of ${d}. What is ${p}'s relation to ${d}?`,
    ['Grandparent','Sibling','Aunt or uncle','Child'],`${p} is the parent of ${k}, and ${k} is the mother of ${d}. Two parent links make ${p} a grandparent of ${d}.`);
});
family(logical,'Deduction','Necessary versus sufficient','Medium',i=>{
  const settings=['a pottery course','a reading group','a route-planning workshop','a garden club','a music rehearsal','a library visit','a chess league','a science fair','a cycling event','an art exhibition','a language course','a training seminar'];
  const person=names[i],setting=settings[i%settings.length];
  return item(`Only people with a registration code may enter ${setting}. ${person} has no registration code. What must be true?`,
    [`${person} may not enter.`,`${person} has entered.`,`${person} will obtain a code.`,`${person} is running the event.`],
    `Having a code is necessary for entry. ${person} fails that requirement, so the entry rule rules out admission.`);
});
family(logical,'Deduction','Conditional chain and its converse','Hard',i=>{
  const [first,second,third]=rotate(objects,i%12);
  const host=names[i];
  return item(`Every box that holds ${first} also holds ${second}. Every box that holds ${second} also holds ${third}. ${host}'s box holds ${first}. What must follow?`,
    [`It holds ${third}.`,`Any box with ${third} holds ${first}.`,`No box with ${second} holds ${first}.`,`Every box holds ${first}.`],
    `Start from the stated contents and follow the two one-way rules. This box has ${second}, hence ${third}. Nothing says the rules work in reverse.`);
});
family(logical,'Deduction','Exclusive-or inference','Medium',i=>{
  const [a,b]=rotate(objects,i%12);const person=names[i];
  return item(`${person} selects exactly one set: ${a} or ${b}. A receipt proves that ${person} selected ${b}. Which statement is forced?`,
    [`${person} did not select ${a}.`,`${person} selected ${a} too.`,`${person} selected neither set.`,`Everyone else selected ${a}.`],
    `Exactly one combines a requirement to choose with a prohibition on both choices. The receipt establishes ${b}, which excludes ${a} for this person.`);
});
family(logical,'Deduction','Contrapositive across two steps','Hard',i=>{
  const [a,b,c]=rotate(objects,i%12);const person=names[i];
  return item(`Every assigned kit contains ${a}. Every kit with ${a} contains ${b}. ${person} inspects a kit that contains ${c}, with no ${b}. What follows?`,
    ['The inspected kit is unassigned.',`The inspected kit contains ${a}.`,'The kit was assigned twice.',`Every kit with ${c} is assigned.`],
    `Assignment would require ${a}, which would require ${b}. The kit's lack of ${b} therefore rules out assignment. The fact about ${c} is irrelevant.`);
});

const direction='Directional Reasoning';
const points=['North','East','South','West'];
const heading=(start,turns)=>points[wrap(start+turns.reduce((sum,turn)=>sum+turn,0),4)];
const compassOptions=(answer,values=points)=>[answer,...values.filter(value=>value!==answer)];
const location=(x,y)=>[Math.abs(x)+' m '+(x<0?'west':'east'),Math.abs(y)+' m '+(y<0?'south':'north')].join(' and ');

family(direction,'Turns','Alternating named turns','Easy',i=>{
  const start=i%4;
  const first=i&4?1:-1,second=i&8?1:-1,last=i&16?1:-1;
  const extra=i>=32;
  const turns=[first,second,last,...(extra?[2]:[])],target=heading(start,turns);
  const turn = n=>n===1?'right':'left';
  return item(`A walker faces ${points[start]}. At the first, second and third junctions they turn ${turn(first)}, ${turn(second)} and ${turn(last)}, respectively.${extra?' They then make a U-turn.':''} Which way do they face?`,
    compassOptions(target),`Count one clockwise quarter turn for right, minus one for left and two for a U-turn. The net is ${turns.reduce((sum,n)=>sum+n,0)} quarter turns from ${points[start]}, giving ${target}.`);
});
family(direction,'Turns','Reverse direction mid-route','Medium',i=>{
  const start=i%4,first=i&4?1:-1,last=i&8?1:-1,turns=1+Math.floor(i/16);
  const target=heading(start,[first,2*turns,last]);
  const turn = n=>n===1?'right':'left';
  return item(`A walker starts facing ${points[start]}, turns ${turn(first)} by a quarter turn, makes ${turns} U-turn${turns===1?'':'s'} at successive junctions, then turns ${turn(last)} by a quarter turn. What is the final heading?`,
    compassOptions(target),`Each U-turn adds two quarter turns. The turns therefore sum to ${first} + ${2*turns} + (${last}) = ${first+2*turns+last} clockwise quarter turns. Starting from ${points[start]}, that gives ${target}.`);
});
family(direction,'Displacement','Signed cardinal displacement','Medium',i=>{
  const x=7+i%8,y=6+i,x0=23+i%5,y0=22+i%7;
  const e=i%2,xs=e?-x:x,ys=i%3?-y:y;
  const target=location(xs,ys);
  return item(`A walker goes ${x0+xs} m east, ${y0+40+ys} m north, ${x0} m west and ${y0+40} m south. Where is the walker relative to the start?`,
    [target,location(-xs,ys),location(xs,-ys),location(-xs,-ys)],
    `Compute horizontal and vertical offsets independently: east minus west is ${xs} m and north minus south is ${ys} m. These signs give ${target}.`);
});
family(direction,'Displacement','Shortest straight-line distance','Medium',i=>{
  const [x,y,h]=[[3,4,5],[5,12,13],[7,24,25],[8,15,17],[9,40,41],[12,35,37]][i%6],k=1+Math.floor(i/6);
  const east=k*x,north=k*y,west=i%5+2,target=k*h;
  return item(`A runner moves ${east+west} m east, ${north} m north, then ${west} m west. How far is the runner from the start in a straight line?`,
    numericChoices(target,[east+north,east+west+north+west,Math.abs(east-north)]).map(value=>value+' m'),
    `The westward segment cancels ${west} m of the eastward segment, leaving ${east} m east and ${north} m north. Apply the Pythagorean theorem: √(${east}² + ${north}²) = ${target} m.`);
});
family(direction,'Displacement','Path using headings and net offset','Hard',i=>{
  const start=i%4,a=8+i,b=5+i%10,c=2+i%5;
  const unit=[[0,1],[1,0],[0,-1],[-1,0]];
  const [x1,y1]=unit[start],[x2,y2]=unit[(start+1)%4];
  const x=(a-c)*x1+b*x2,y=(a-c)*y1+b*y2;
  return item(`${names[i]} starts facing ${points[start]}, walks ${a} m, turns right and walks ${b} m, then turns right and walks ${c} m. Where is the end point relative to the start?`,
    [location(x,y),location(-x,y),location(x,-y),location(-x,-y)],
    `The first and third segments are in opposite directions, giving ${a-c} m along the starting heading. The middle segment gives ${b} m to its right. Resolving those directions gives ${location(x,y)}.`);
});

const analytical='Analytical Reasoning';
family(analytical,'Ranking','Rank conversion from two ends','Easy',i=>{
  const n=27+i*2,front=6+i%13,back=n-front+1;
  return item(`In an untied ranking of ${n} students, ${names[i]} is position ${front} from the top. What is their position from the bottom?`,
    numericChoices(back,[n-front,n-front+2,front]),`There are ${n-front} students below ${names[i]}. Include ${names[i]} when counting upward from the bottom, giving rank ${back}.`);
});
family(analytical,'Ranking','Count between ranks reported from opposite ends','Medium',i=>{
  const n=35+i*2,f=4+i%11,b=7+i%8,last=n-b+1,count=last-f-1;
  return item(`There are ${n} people in a queue. One person is in position ${f} from the front and another is in position ${b} from the back. How many people are strictly between them?`,
    numericChoices(count,[last-f,last-f+1,n-b-f-1]),`Convert the back-reported rank to ${n} − ${b} + 1 = ${last} from the front. The difference between ranks is ${last-f}. Exclude both endpoints to get ${count}.`);
});
family(analytical,'Ordering','Four-slot precedence with fixed ends','Medium',i=>{
  const [a,b,c,d]=rotate(names,i);
  return item(`Four students present once each, in slots 1 to 4. ${c} presents before ${a}. ${b} presents immediately after ${a}. ${d} presents in slot 4. Who presents in slot 2?`,
    [a,b,c,d],`Slots 1–3 hold ${c}, ${a}, and ${b}. The consecutive pair ${a}–${b} must follow ${c}, so it takes slots 2–3. Thus ${a} is second.`);
});
family(analytical,'Ordering','Five-slot compatible arrangements','Hard',i=>{
  const [a,b,c,d,e]=rotate(names,i);
  const seq=(...x)=>x.join(' → ');
  return item(`Five people make appointments in five consecutive slots. ${d} is fifth, ${a} is exactly three places before ${d}, and ${b} is immediately before ${e}. Which order satisfies every condition?`,
    [seq(c,a,b,e,d),seq(c,a,e,b,d),seq(a,b,e,c,d),seq(b,a,c,e,d)],
    `Placing ${d} fifth fixes ${a} in slot 2. The consecutive pair ${b} and ${e} cannot fit before slot 2 or touch the already occupied slot 5, so they fill slots 3 and 4. ${c} fills slot 1.`);
});
family(analytical,'Ranking','Rank after overtake','Medium',i=>{
  const n=23+i,old=9+i%10,passes=2+i%4,fall=1+i%3;
  const next=old-passes+fall;
  return item(`Among ${n} racers, ${names[i]} starts at rank ${old}. They overtake ${passes} racers and are passed by ${fall} racers, with no other change to their position. What is the new rank?`,
    numericChoices(next,[old+passes+fall,old-passes-fall,old+passes-fall]),`Each overtake reduces the rank number by one; each racer passing them increases it by one. The new rank is ${old} − ${passes} + ${fall} = ${next}.`);
});

const venn='Venn Diagrams';
family(venn,'Sets','Two-set overlap from the union','Easy',i=>{
  const left=8+i,right=13+i%10,both=3+i%8,total=left+right+both+4+i%5,union=left+right+both;
  return item(`Out of ${total} participants, ${left+both} entered drawing, ${right+both} entered photography, and ${union} entered at least one. How many entered both?`,
    numericChoices(both,[left,right,total-union]),`Adding the drawing and photography totals counts the overlap twice. Subtract the count of people with at least one entry to recover the overlap: ${left+both} + ${right+both} − ${union} = ${both}.`);
});
family(venn,'Sets','Exclusive membership in a two-set survey','Medium',i=>{
  const a=12+i,b=15+i%11,overlap=4+i%7,others=9+i%6,total=a+b+overlap+others;
  return item(`Among ${total} people, ${a+overlap} joined the reading club, ${b+overlap} joined the cycling club, and ${overlap} joined both. How many joined exactly one club?`,
    numericChoices(a+b,[total-others,a+b-overlap,a+b+2*overlap]),`Subtract the overlap from each club: ${a+overlap} − ${overlap} = ${a} and ${b+overlap} − ${overlap} = ${b}. Their sum, ${a+b}, is the number in exactly one club.`);
});
family(venn,'Sets','Three-set union by inclusion-exclusion','Hard',i=>{
  const onlyA=11+i,onlyB=8+i%5,onlyC=12+i%3,ab=3+i%4,ac=2+i%5,bc=4+i%6,abc=1+i%3;
  const a=onlyA+ab+ac+abc,b=onlyB+ab+bc+abc,c=onlyC+ac+bc+abc;
  const x=ab+abc,y=ac+abc,z=bc+abc,union=onlyA+onlyB+onlyC+ab+ac+bc+abc;
  return item(`A survey counts ${a} readers of A, ${b} of B and ${c} of C. Pairwise counts are AB = ${x}, AC = ${y} and BC = ${z}, each including the ${abc} who read all three. How many read at least one?`,
    numericChoices(union,[a+b+c,a+b+c-x-y-z,union-2*abc]),`Add the three totals, subtract the pairwise overlaps, then restore the triple overlap that was removed one time too many: ${a} + ${b} + ${c} − ${x} − ${y} − ${z} + ${abc} = ${union}.`);
});
family(venn,'Syllogisms','Disjoint from a containing set','Medium',i=>{
  const [a,b,c]=rotate(objects,i%12),name=names[i];
  return item(`${name} sorts items using these rules. Every item listed as ${a} is also listed as ${b}. No item listed as ${b} is listed as ${c}. What must follow?`,
    [`No item listed as ${a} is listed as ${c}.`,`Every item listed as ${c} is listed as ${a}.`,`Every item listed as ${b} is listed as ${a}.`,`An item listed as ${a} must exist.`],
    `The ${a} set is entirely inside the ${b} set. Since ${b} and ${c} are disjoint, ${a} cannot overlap ${c}. None of the rules guarantees that a set has an item.`);
});
family(venn,'Syllogisms','Overlap inside a larger containing set','Hard',i=>{
  const [a,b,c]=rotate(objects,i%12),name=names[i];
  return item(`${name} describes a sorting system. Some items listed as ${a} are also listed as ${b}. Every item listed as ${b} is listed as ${c}. Which conclusion is necessary?`,
    [`Some items listed as ${a} are listed as ${c}.`,`Every item listed as ${a} is listed as ${c}.`,`All items listed as ${c} are listed as ${b}.`,`No item listed as ${a} is listed as ${c}.`],
    `Take any item in the stated overlap of ${a} and ${b}. Because it lies in ${b}, it also lies in ${c}. That proves an overlap of ${a} and ${c} without proving total inclusion.`);
});

const cells = nums(9,i=>i);
const grid=(marks)=>nums(3,r=>nums(3,c=>marks.includes(r*3+c)?'X':'·').join(' ')).join('\n');
const coords = i=>letter(Math.floor(i/3))+(1+i%3);
const signature = marks=>[...marks].sort((a,b)=>a-b).map(coords).join(' ');
const sorted = marks=>[...marks].sort((a,b)=>a-b);
const point=(r,c)=>r*3+c;
const row = i=>Math.floor(i/3);
const col = i=>i%3;
const transform=(marks,fn)=>sorted(marks.map(idx=>fn(row(idx),col(idx))));
const rotations = [(r,c)=>point(r,c),(r,c)=>point(c,2-r),(r,c)=>point(2-r,2-c),(r,c)=>point(2-c,r)];
const clock = rotations[1];
const counterclock = rotations[3];
const face = (r,c)=>point(r,2-c);
const rowMirror=(r,c)=>point(2-r,c);
const transposed=(r,c)=>point(c,r);
const through=(marks,fn)=>signature(transform(marks,fn));
const figureHint = 'Rows A to C run from top to bottom, columns 1 to 3 run left to right. Each option lists the marked cells.';
const shapes3=[];
const shapes4=[];
for(let mask=1;mask<512;mask++) {
  const marks=cells.filter(j=>mask&(1<<j));
  if(marks.length!==3&&marks.length!==4)continue;
  if(new Set([...rotations,face,rowMirror,transposed].map(fn=>through(marks,fn))).size!==7)continue;
  (marks.length===3?shapes3:shapes4).push(marks);
}
const spatial='Spatial Reasoning';
family(spatial,'Rotation','Rotate an asymmetric shape by a quarter turn','Medium',i=>{
  const shape=shapes4[i],a=through(shape,clock);
  return item(`Rotate the 3 × 3 shape marked at ${signature(shape)} by a quarter turn clockwise around its centre. Which set is marked afterwards? ${figureHint}`,
    [a,through(shape,counterclock),through(shape,face),through(shape,rotations[2])],
    `For a clockwise quarter turn, old rows become new columns and old columns become rows in reverse order. Moving the four marks gives ${a}.`,
    grid(shape));
},{visual:true});
family(spatial,'Mirror Image','Left-right reflection in a vertical mirror','Medium',i=>{
  const shape=shapes4[i],a=through(shape,face);
  return item(`A vertical mirror reflects the drawing marked at ${signature(shape)} left to right. Which coordinates are marked in the reflection? ${figureHint}`,
    [a,through(shape,rowMirror),through(shape,clock),through(shape,transposed)],
    `A vertical mirror leaves each row fixed, swaps columns 1 and 3, and retains column 2. The reflected marks are ${a}.`,
    grid(shape));
},{visual:true});
family(spatial,'Rotation','Two rotations with different headings','Medium',i=>{
  const start=i%4,turn1=1+Math.floor(i/8),turn2=1+i%3;
  const scene=['arrow','dial pointer','direction marker','sign pointer','compass graphic','pointer on a model board','pointer on a map','pointer on a screen','arrow on a tile'][Math.floor(i/4)];
  const result=heading(start,[turn1,-turn2]);
  return item(`A ${scene} initially points ${points[start]}. It rotates clockwise through ${90*turn1}° and then anticlockwise through ${90*turn2}°. Where does it point after both rotations?`,
    compassOptions(result),`Use 90° as one quarter turn. Net clockwise movement is ${turn1} − ${turn2} = ${turn1-turn2} quarter turns. Starting from ${points[start]}, that gives ${result}.`);
});
family(spatial,'Folding','Restore a single hole after a vertical fold','Medium',i=>{
  const width=8+2*(i%6),height=5+Math.floor(i/6),c=1+Math.floor(i/6)%(width/2),r=1+i%5;
  const mirror=width+1-c,q=(x,y)=>`Row ${r}, columns ${Math.min(x,y)} and ${Math.max(x,y)}`;
  return item(`A ${height}-row by ${width}-column sheet is folded so the right half exactly covers the left. Columns are numbered across the unfolded sheet. One hole goes through both layers at row ${r}, column ${c} on the left half. Where will the two holes appear?`,
    [q(c,mirror),q(c,mirror-1),q(c,mirror-2),`Row ${r}, column ${c} only`],
    `Both holes stay in row ${r}. Columns mirrored across the fold sum to ${width+1}. The partner of column ${c} is ${mirror}.`);
});
family(spatial,'Folding','Unfold two perpendicular paper folds','Hard',i=>{
  const width=8+2*(i%6),height=8+2*Math.floor(i/6),r=2+i%3,c=2+Math.floor(i/6)%3;
  const rr=height+1-r,cc=width+1-c;
  const option=(a,b,x,y)=>`Rows ${a} and ${b}; columns ${x} and ${y} (all four combinations)`;
  return item(`A ${height} × ${width} paper grid is folded in half twice. First the right half covers the left. Then the bottom half covers the top. A hole through all layers is made at original grid position row ${r}, column ${c}, in the upper-left quarter. Which positions are punched after unfolding?`,
    [option(r,rr,c,cc),option(r,rr-1,c,cc),option(r,rr,c,cc-1),option(r,rr-1,c,cc-1)],
    `Reflect across each fold separately. The partner row is ${height+1} − ${r} = ${rr} and the partner column is ${width+1} − ${c} = ${cc}. Taking every combination yields four marks.`);
});
const figure='Figure Series';
const ring=[0,1,2,5,8,7,6,3];
const arrow=v=>['↑','→','↓','←'][v];
const upDown=i=>points[i];
family(figure,'Position','Perimeter marker with fixed clockwise step','Easy',i=>{
  const start=i%8,step=1+Math.floor(i/8),id=j=>ring[wrap(start+j*step,8)];
  const sequence=nums(5,id);const target=coords(sequence[4]);
  const endList=nums(4,j=>coords(sequence[j])).join(' → ');
  return item(`Follow the dot around the perimeter of a 3 × 3 grid. It advances clockwise by a constant number of cells. Its first four locations are ${endList}. Where is the fifth? ${figureHint}`,
    [target,...[ring[wrap(start+4*step+1,8)],ring[wrap(start+4*step-1,8)],ring[wrap(start+4*step+3,8)]].map(coords)],
    `Clockwise edge order is A1, A2, A3, B3, C3, C2, C1, B1. The observed step is ${step}, so the next location is ${target}.`,
    nums(4,j=>`Panel ${j+1}\n${grid([sequence[j]])}`).join('\n\n'));
},{count:32,visual:true});
family(figure,'Rotation','Repeated quarter-turn of an arrow','Easy',i=>{
  const start=i%4,step=1+Math.floor(i/4)%3,targetIndex=3+Math.floor(i/12);
  const sequence=nums(targetIndex+1,j=>wrap(start+j*step,4));
  const answer=points[sequence[targetIndex]];
  return item(`The first three arrows on a strip point ${list(sequence.slice(0,3).map(upDown))}. The same rotation occurs between every adjacent pair. Where does arrow ${targetIndex+1} point?`,
    compassOptions(answer),`Advance by ${step} clockwise quarter turns each time, or the equivalent anticlockwise rotation. From arrow 3, apply ${targetIndex-2} more rotation${targetIndex-2===1?'':'s'} to reach ${answer}.`,
    sequence.slice(0,3).map(arrow).join('   '));
},{visual:true});
family(figure,'Rotation','Increasing rotations around a marker','Hard',i=>{
  const start=i%4,base=Math.floor(i/4)%3+1,inc=1+Math.floor(i/12)%3,mark=names[i];
  const sequence=nums(5,j=>wrap(start+j*base+j*(j-1)*inc/2,4));
  const target=points[sequence[4]];
  return item(`In ${mark}'s clockwise arrow series, the first rotation is ${base*90}° and each later rotation exceeds the previous by ${inc*90}°. Arrows 1–4 point ${list(sequence.slice(0,4).map(upDown))}. Which way does arrow 5 point?`,
    compassOptions(target),`The fourth rotation is ${base*90}° + 3 × ${inc*90}° = ${(base+3*inc)*90}°. Applying it clockwise to ${points[sequence[3]]} gives ${target}.`,
    sequence.slice(0,4).map(arrow).join('   '));
},{visual:true});
family(figure,'Position','Alternating dot steps around the perimeter','Hard',i=>{
  const start=i%8,phase=Math.floor(i/8),a=[1,2,3,4,2][phase],b=[5,6,7,6,7][phase];
  const indexes=[start];
  for(let j=0;j<5;j++)indexes.push(wrap(indexes.at(-1)+(j%2?b:a),8));
  const sequence=indexes.map(j=>ring[j]),target=coords(sequence[5]);
  return item(`A marker on a 3 × 3 perimeter takes two alternating clockwise step sizes. Starting with the first panel, its locations are ${sequence.slice(0,5).map(coords).join(' → ')}. Where is panel six? ${figureHint}`,
    [target,coords(ring[wrap(indexes[4]+b,8)]),coords(ring[wrap(indexes[4]+a+1,8)]),coords(ring[wrap(indexes[4]+a-1,8)])],
    `From the first two transitions, the alternating jumps are ${a} and ${b} in clockwise perimeter order. The fifth transition repeats the first jump, ${a}, so it lands at ${target}.`,
    nums(5,j=>`Panel ${j+1}\n${grid([sequence[j]])}`).join('\n\n'));
},{visual:true});
family(figure,'Position','Alternating panels with independent dot motion','Hard',i=>{
  const odd=i%8,even=4+Math.floor(i/8),s=1+Math.floor(i/8)%3;
  const sequence=nums(6,j=>ring[wrap(j%2?even-Math.floor(j/2)*2:odd+Math.floor(j/2)*s,8)]),target=coords(sequence[5]);
  const decoys=[coords(ring[wrap(even-3,8)]),coords(ring[wrap(even-2,8)]),coords(ring[wrap(even-1,8)])];
  return item(`Group this perimeter-dot sequence by odd and even panel numbers. Each group moves by a constant step on its own. The five locations are ${sequence.slice(0,5).map(coords).join(' → ')}. Where is panel six? ${figureHint}`,
    [target,...decoys],
    `For the even panels, panel 2 to panel 4 moves two cells anticlockwise. Repeat that move from ${coords(sequence[3])} to get ${target}. The odd-numbered panels use a different step.`,
    nums(5,j=>`Panel ${j+1}\n${grid([sequence[j]])}`).join('\n\n'));
},{visual:true});

const pattern='Pattern Completion';
family(pattern,'Symmetry','Complete the horizontal mirror projection','Medium',i=>{
  const shape=shapes3[i],answer=through(shape,rowMirror);
  return item(`The upper pattern has marks at ${signature(shape)}. Copy it into a second grid as a reflection across a horizontal line, with top and bottom swapping. Which marks complete the second grid? ${figureHint}`,
    [answer,through(shape,face),through(shape,transposed),signature(shape)],
    `A horizontal mirror keeps columns fixed. Swap rows A and C and keep row B. The resulting marks are ${answer}.`,
    grid(shape));
},{visual:true});
family(pattern,'Matrices','Complete a row operation matrix','Medium',i=>{
  const rowA=[4+i,6+i%5],rowB=[2+i%7,12+Math.floor(i/2)],rowC=[8+i%3,7+i];
  const f=(x,y)=>2*x+y;
  const diagram=[...([rowA,rowB].map(([a,b])=>[a,b,f(a,b)])),[...rowC,'?']].map(r=>r.join('  │  ')).join('\n');
  const answer=f(...rowC);
  const lines=diagram.split('\n').map(s=>s.replaceAll('  │  ', ', ')).join(' / ');
  return item(`Each row in this matrix uses the same operation on its first two entries to produce its third. Complete the third row. Rows: ${lines}. The operation doubles one input and adds the other.`,
    numericChoices(answer,[rowC[0]+2*rowC[1],rowC[0]+rowC[1],2*(rowC[0]+rowC[1])]),
    `Double the first entry and add the second. The first two rows show which input is doubled and gives 2 × ${rowC[0]} + ${rowC[1]} = ${answer}.`,diagram);
},{visual:true});
family(pattern,'Matrices','Union overlay completes a row','Medium',i=>{
  const a=shapes3[i],b=shapes3[(i+11)%shapes3.length];
  const answer=signature([...new Set([...a,...b])]);
  const overlap=a.filter(x=>b.includes(x)),excl=[...a.filter(x=>!b.includes(x)),...b.filter(x=>!a.includes(x))];
  const replaced=[...a.slice(0,2),cells.find(cell=>!a.includes(cell)&&!b.includes(cell))];
  const options=[answer,signature(a),signature(b),signature(overlap.length?excl:replaced)];
  return item(`Overlay two panels without moving or rotating them. The third panel should show every marked cell from either panel. Panel 1 has ${signature(a)}. Panel 2 has ${signature(b)}. Which set completes the row? ${figureHint}`,
    options,`Combine the two sets of marks. If a cell is marked in both panels count it once. The combined panel has ${answer}.`,
    `Panel 1\n${grid(a)}\n\nPanel 2\n${grid(b)}`);
},{visual:true});
family(pattern,'Matrices','Complete a matrix of geometric fields','Hard',i=>{
  const colors=['striped','outlined','dotted','filled','chequered','hatched'];
  const figures=['triangle','square','circle','pentagon','rhombus','hexagon'];
  const triplet=values=>nums(3,j=>values[wrap(i+j,6)]);
  const [first,second,third]=triplet(colors),[a,b,c]=triplet(rotate(figures,Math.floor(i/6)));
  const lines=[`${first} ${a} | ${first} ${b} | ${first} ${c}`,`${second} ${a} | ${second} ${b} | ${second} ${c}`,`${third} ${a} | ${third} ${b} | ?`];
  return item(`Each row keeps the same surface pattern. Each column keeps the same shape. What belongs in the bottom-right cell? Top, middle and bottom rows in order: ${lines.join(' / ')}.`,
    [`${third} ${c}`,`${second} ${c}`,`${third} ${b}`,`${first} ${a}`],
    `The bottom-row surface pattern is ${third}. The right-column shape is ${c}. Combining those two independent properties yields a ${third} ${c}.`,lines.join('\n'));
},{visual:true});
family(pattern,'Symmetry','Complete a reflected shape across its centre','Hard',i=>{
  const h=8+Math.floor(i/6),w=8+i%6;
  const a=[1+i%3,1+Math.floor(i/3)%3],b=[a[0]+1,a[1]+1];
  const transform=(x,kind)=>kind==='both'?[h+1-x[0],w+1-x[1]]:kind==='rows'?[h+1-x[0],x[1]]:[x[0],w+1-x[1]];
  const describe=(p,q)=>`(${p.join(', ')}) and (${q.join(', ')})`;
  const answer=describe(transform(a,'both'),transform(b,'both'));
  return item(`A drawing on a ${h}-row by ${w}-column board has two marks at ${describe(a,b)}, written as (row, column). Add the two marks required for half-turn symmetry about the exact board centre. Which pair completes the drawing?`,
    [answer,describe(transform(a,'rows'),transform(b,'rows')),describe(transform(a,'cols'),transform(b,'cols')),describe(transform(a,'rows'),transform(b,'cols'))],
    `A 180° turn reverses both coordinates. Use new row = ${h+1} − old row and new column = ${w+1} − old column. This gives ${answer}.`);
});
const nonverbal='Non-Verbal Classification';
const isAdjacent = (a,b)=>Math.abs(row(a)-row(b))+Math.abs(col(a)-col(b))===1;
const shapesOf = (n,condition)=>{
  const results=[];
  for(let mask=0;mask<512;mask++){
    const marks=cells.filter(j=>mask&(1<<j));
    if(marks.length===n&&condition(marks))results.push(marks);
  }
  return results;
};
const sharedEdge=marks=>marks.some((a,i)=>marks.slice(i+1).some(b=>isAdjacent(a,b)));
const connected=marks=>{
  const visited=[marks[0]];
  for(let i=0;i<visited.length;i++)for(const b of marks)
    if(!visited.includes(b)&&isAdjacent(visited[i],b))visited.push(b);
  return visited.length===marks.length;
};
const symmetric=(marks,fn)=>signature(marks)===through(marks,fn);
const collection=(matching,odd,i)=>[odd[i%odd.length],...nums(3,j=>matching[wrap(i*3+j*7,matching.length)])];
function oddFigure(prompt,groups,why,order){
  const panels=rotate(groups,order);
  return item(`${prompt} The four panels are ${panels.map(signature).join(' / ')}. ${figureHint}`,groups.map(signature),why,
    panels.map((shape,i)=>`Panel ${i+1}\n${grid(shape)}`).join('\n\n'));
}
const withEdge=shapesOf(3,sharedEdge),hasNoEdge=shapesOf(3,marks=>!sharedEdge(marks));
family(nonverbal,'Visual Groups','Odd figure with no shared cell edge','Easy',i=>{
  const groups=collection(withEdge,hasNoEdge,i);
  return oddFigure('In three panels, at least one pair of marked cells shares an edge. Which panel differs?',groups,
    `${signature(groups[0])} has no pair of marks sharing an edge. In each other panel at least one pair is side by side in a row or column. Corner contact does not count.`,(i*3+1)%4);
},{visual:true});
const connectedShapes=shapesOf(4,connected), disconnectedShapes=shapesOf(4,marks=>!connected(marks));
family(nonverbal,'Visual Groups','Odd disconnected figure','Medium',i=>{
  const groups=collection(connectedShapes,disconnectedShapes,i);
  return oddFigure('In three panels every marked cell can be reached from any other without leaving the marked cells. You may move through shared edges only. Which panel differs?',groups,
    `In ${signature(groups[0])}, the edge-touching marks form more than one group. Each other panel forms one connected group. Diagonal contact does not connect cells.`,(i*3+2)%4);
},{visual:true});
const reflective = shapesOf(4,marks=>symmetric(marks,face)), unreflective = shapesOf(4,marks=>!symmetric(marks,face));
family(nonverbal,'Visual Groups','Detect a break in vertical symmetry','Medium',i=>{
  const groups=collection(reflective,unreflective,i);
  return oddFigure('Which pattern fails to match itself when reflected across its middle vertical line?',groups,
    `For vertical symmetry, every mark outside column 2 must have a partner on the opposite side in the same row. ${signature(groups[0])} fails that test.`,(i*3+3)%4);
},{visual:true});
const onePerRow = shapesOf(3,marks=>new Set(marks.map(row)).size===3), repeatRow=shapesOf(3,marks=>new Set(marks.map(row)).size!==3);
family(nonverbal,'Visual Groups','Detect repeated marks in a row','Easy',i=>{
  const groups=collection(onePerRow,repeatRow,i);
  return oddFigure('Three panels contain one mark in each row. Which one breaks that rule?',groups,
    `${signature(groups[0])} repeats at least one row letter. The other panels contain exactly one A cell, one B cell and one C cell.`,(i*3+1)%4);
},{visual:true});
const corners=marks=>marks.filter(x=>[0,2,6,8].includes(x)).length;
const twoCorner=shapesOf(4,marks=>corners(marks)===2),otherCorner=shapesOf(4,marks=>corners(marks)!==2);
family(nonverbal,'Visual Groups','Detect a different corner count','Medium',i=>{
  const groups=collection(twoCorner,otherCorner,i);
  return oddFigure('Compare the counts of marked corner cells. Three panels have equal counts. Which one differs?',groups,
    `Only A1, A3, C1 and C3 are corners. Three panels mark exactly two; ${signature(groups[0])} marks ${corners(groups[0])}.`,(i*3+2)%4);
},{visual:true});
export function buildReasoning() {
  return families.flatMap(({topic,subtopic,name,difficulty,build,count,visual})=>nums(count,i=>{
    const question=build(i);
    const shiftBy=(i+name.length)%4;
    return {
      subject:'rea',topic,subtopic, ...question,
      options:rotate(question.options,shiftBy),answer:wrap(-shiftBy,4),
      family:`Reasoning — ${name}`,concept:name,
      difficulty,source:visual?modelPapers:syllabus,
      style:visual?'Non-verbal pattern practice':'Verbal and analytical reasoning',
      classification:'ORIGINAL_AFCAT_STYLE'
    };
  }));
}
