// Original numerical drills mapped to §8.2.1.3 of the AFCAT 01/2027 notice.
// Each family is a separate solution method. Cases vary the givens, answer,
// and misconception-based distractors while keeping the skill identifiable.
const syllabus='https://careerairforce.gov.in/sites/default/files/2026-11/Notification-for-AFCAT-2027.pdf';
const variants=24;
const familyLabels={'interest-si-time':'Simple interest duration','interest-si-rate':'Simple interest rate'};
const sum=values=>values.reduce((total,value)=>total+value,0);
const normalize=value=>value.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
const gcd=(a,b)=>b?gcd(b,a%b):a;
const lcm=(a,b)=>a/gcd(a,b)*b;
const fraction=(n,d)=>{
  const factor=gcd(Math.abs(n),d);
  return d===factor?String(n/factor):n/factor+'/'+d/factor;
};
const n=value=>{
  if(!Number.isFinite(value))throw Error('Numerical drill has a non-finite option');
  return String(Number(value.toFixed(8)));
};
const money=value=>'₹'+n(value);
const percent=value=>n(value)+'%';
const metric=unit=>value=>n(value)+' '+unit;
const ratio=([a,b])=>a/gcd(a,b)+':'+b/gcd(a,b);

const values=(correct,distractors,format=n)=>[correct,distractors,format];
const fractions=(correct,distractors)=>values(correct,distractors,([num,den])=>fraction(num,den));

function entry(topic,[family,subtopic,difficulty,build],index) {
  const {prompt,choice,explanation}=build(index%6,Math.floor(index/6));
  const [correct,distractors,format]=choice;
  const key=format(correct);
  const seen=new Set([normalize(key)]);
  const wrong=distractors.map(format).filter(option=>{
    const normalized=normalize(option);
    if(seen.has(normalized))return false;
    seen.add(normalized);
    return true;
  }).slice(0,3);
  if(wrong.length!==3) throw Error('Numerical drill requires three distinct distractors: '+family+' ['+index+']');
  const answer=(index*3+family.length)%4;
  const options=[...wrong];
  options.splice(answer,0,key);
  return {
    subject:'num',topic,subtopic,prompt,options,answer,explanation,difficulty,
    source:syllabus,classification:'ORIGINAL_AFCAT_STYLE',family:familyLabels[family] ?? subtopic,concept:subtopic,
    style:'Short numerical application'
  };
}

const groups=[
  ['Decimal Fractions',[
    ['decimal-multiply','Decimal multiplication','Easy',(i,j)=>{
      const a=12+i*3+j,b=3+j+i%2;
      return {prompt:'Evaluate '+n(a/100)+' × '+n(b/10)+'.',
        choice:values(a*b/1000,[a*b/100,a*b/10,a*b/10000,a*b/100000]),
        explanation:'Multiply the whole numbers '+a+' and '+b+' to get '+a*b+'. The factors contain three decimal places in total, so the product is '+n(a*b/1000)+'.'};
    }],
    ['decimal-divide','Decimal quotients','Easy',(i,j)=>{
      const a=4+i+j,b=2+j,q=2+i+2*j;
      const dividend=a*b*q, divisor=a*b;
      return {prompt:'Find the quotient when '+n(dividend/100)+' is divided by '+n(divisor/10)+'.',
        choice:values(q/10,[q,q/100,q*10,q/1000]),
        explanation:'Multiply both terms by 100 to obtain '+dividend+' ÷ '+divisor*10+'. Scaling both terms equally preserves the quotient, which is '+n(q/10)+'.'};
    }],
    ['decimal-place','Place Value','Easy',(i,j)=>{
      const digit=2+i,places=2+j;
      const value=digit*10**-places;
      const example=81+value;
      return {prompt:'In the number '+n(example)+', what is the place value of the digit '+digit+'?',
        choice:values(value,[value*10,value/10,digit,value/100]),
        explanation:'The digit '+digit+' is the '+['second','third','fourth','fifth'][j]+' digit to the right of the decimal point. Its value is '+digit+' ÷ '+10**places+' = '+n(value)+'.'};
    }],
    ['decimal-to-fraction','Conversions','Easy',(i,j)=>{
      const dividend=9+i*7+j*23, divisor=1000;
      return {prompt:'Express '+n(dividend/divisor)+' as a fraction in its lowest terms.',
        choice:fractions([dividend,divisor],[[dividend,100],[dividend,10000],[dividend-1,divisor],[dividend+1,divisor]]),
        explanation:'The digits after the decimal give '+dividend+' thousandths. Use '+dividend+'/'+divisor+' and reduce by '+gcd(dividend,divisor)+' to obtain '+fraction(dividend,divisor)+'.'};
    }],
    ['repeat-to-fraction','Recurring decimal conversion','Medium',(i,j)=>{
      const repeat=11+i*6+j, displayed='0.'+repeat+repeat+repeat+'…';
      return {prompt:'Write '+displayed+' as a fraction if the two-digit block '+repeat+' repeats indefinitely.',
        choice:fractions([repeat,99],[[repeat,100],[repeat,90],[repeat,999],[repeat+1,99]]),
        explanation:'Set x = '+displayed+'. Multiplying by 100 moves one repeating block past the point. The fractional tails cancel in 100x − x = '+repeat+', hence x = '+fraction(repeat,99)+'.'};
    }]
  ]],
  ['Averages and Percentages',[
    ['weighted-scores','Weighted Average','Medium',(i,j)=>{
      const a=8+i,b=2+j,mean=55+2*i+3*j,spread=2+i;
      const low=mean-b*spread,high=mean+a*spread;
      return {prompt:'A batch of '+a+' trainees averages '+low+' marks. A second batch of '+b+' trainees averages '+high+' marks. What is the combined average?',
        choice:values(mean,[(low+high)/2,low,high,mean+spread]),
        explanation:'Reconstruct the score total, '+a+' × '+low+' + '+b+' × '+high+' = '+(a*low+b*high)+'. Divide by the combined headcount '+(a+b)+' to obtain '+mean+'.'};
    }],
    ['average-removed','Missing or removed observations','Easy',(i,j)=>{
      const members=5+i,mean=47+j+i, rise=1+j;
      const removed=members*mean-(members-1)*(mean+rise);
      return {prompt:'The average mass of '+members+' parcels is '+mean+' kg. After removing one parcel, the average becomes '+(mean+rise)+' kg. What was the mass of the removed parcel?',
        choice:values(removed,[mean-rise,mean+rise,mean,(members-1)*rise],metric('kg')),
        explanation:'The original total was '+members*mean+' kg. The remaining '+(members-1)+' parcels weigh '+(members-1)*(mean+rise)+' kg in all. Subtract the totals to get '+removed+' kg.'};
    }],
    ['percent-original','Percentage Change','Medium',(i,j)=>{
      const rate=5*(i+1), original=100*(j+2+i), increase=original*rate/100,current=original+increase;
      return {prompt:'Production rose by '+rate+'% to '+current+' items a week. How many items a week were produced before the rise?',
        choice:values(original,[current*(100-rate)/100,increase,current,original-increase]),
        explanation:'The new production is '+(100+rate)+'% of the original. Divide '+current+' by '+n(1+rate/100)+' to recover '+original+' items; subtracting '+rate+'% of the new total would use the wrong base.'};
    }],
    ['percent-two-stage','Successive percentage changes','Medium',(i,j)=>{
      const up=10+5*i, down=5+5*j,net=(100+up)*(100-down)/100-100;
      return {prompt:'Stock in a store rises by '+up+'% in June and falls by '+down+'% from that new level in July. What is the net percentage change over the two months (positive means an increase)?',
        choice:values(net,[up-down,down-up,up+down,-down,up],percent),
        explanation:'Start at an index of 100. After the rise it is '+(100+up)+'; after the fall it is '+n(100+net)+'. Relative to the original 100, the change is '+n(net)+'%.'};
    }],
    ['percent-base-swap','Comparative percentages','Hard',(i,j)=>{
      const percentMore=5*(i+2)+j, result=+(100*percentMore/(100+percentMore)).toFixed(2);
      return {prompt:'Facility X uses '+percentMore+'% more water than Facility Y. By what percentage does Y use less water than X, rounded to two decimal places?',
        choice:values(result,[percentMore,+(100*percentMore/(100-percentMore)).toFixed(2),+(100-result).toFixed(2),+(result/2).toFixed(2)],percent),
        explanation:'Use Y = 100 units. Then X = '+(100+percentMore)+' units and the gap is '+percentMore+'. The question uses X as the base, giving '+percentMore+' ÷ '+(100+percentMore)+' × 100 ≈ '+n(result)+'%.'};
    }]
  ]],
  ['Ratio and Proportion',[
    ['ratio-share-three','Part-to-whole ratio','Easy',(i,j)=>{
      const a=2+i,b=3+j,c=5+i+j, size=j+i+3,total=(a+b+c)*size;
      return {prompt:'A relief fund of '+money(total*100)+' is divided across three centres in the ratio '+a+':'+b+':'+c+'. What is the third centre’s share?',
        choice:values(c*size*100,[a*size*100,b*size*100,(a+b)*size*100,total*100,(c+1)*size*100],money),
        explanation:'There are '+(a+b+c)+' total parts. One part is '+money(total*100)+' ÷ '+(a+b+c)+' = '+money(size*100)+'. The third centre receives '+c+' parts, worth '+money(c*size*100)+'.'};
    }],
    ['ratio-direct-scale','Direct Proportion','Easy',(i,j)=>{
      const a=3+i,b=a+2+j,rate=7+3*i+j;
      return {prompt:a+' identical printers produce '+a*rate+' labels per minute in total. At the same speed, how many labels per minute do '+b+' identical printers produce?',
        choice:values(b*rate,[a*rate,rate,(b-a)*rate,a*b*rate,b*rate+rate]),
        explanation:'Each printer makes '+a*rate+' ÷ '+a+' = '+rate+' labels per minute. Multiply by '+b+' to obtain '+b*rate+'.'};
    }],
    ['ratio-inverse-food','Inverse Proportion','Medium',(i,j)=>{
      const people=4+i,extra=2+j,duration=2+i+j,days=(people+extra)*duration;
      return {prompt:'Food stocks can support '+people+' hikers for '+days+' days. If '+extra+' extra hikers join immediately and every hiker consumes the same daily amount, how long will the same stock last?',
        choice:values(people*duration,[days,duration,days-extra,people*duration-extra,days+extra],metric('days')),
        explanation:'The supply represents '+people+' × '+days+' = '+people*days+' person-days. The new group contains '+(people+extra)+' people, so the supply lasts '+people*days+' ÷ '+(people+extra)+' = '+people*duration+' days.'};
    }],
    ['ratio-linked','Linked ratios','Hard',(i,j)=>{
      const ab=[2+i,3+j],bc=[5+j,6+i];
      return {prompt:'A:B = '+ab.join(':')+' and B:C = '+bc.join(':')+'. What is A:C in simplest terms?',
        choice:values([ab[0]*bc[0],ab[1]*bc[1]],[[ab[0],bc[1]],[ab[0]*bc[1],ab[1]*bc[0]],[ab[1]*bc[1],ab[0]*bc[0]],[ab[0]+bc[0],ab[1]+bc[1]],[ab[0],ab[1]],[ab[0]*bc[0]+1,ab[1]*bc[1]]],ratio),
        explanation:'Scale A:B by '+bc[0]+' and B:C by '+ab[1]+', so both values of B become '+ab[1]*bc[0]+'. Then A:C = '+ab[0]*bc[0]+':'+ab[1]*bc[1]+' = '+ratio([ab[0]*bc[0],ab[1]*bc[1]])+'.'};
    }],
    ['ratio-change','Ratio after equal additions','Medium',(i,j)=>{
      const a=2+i,b=a+3+j,add=2+i+j,unit=5+j;
      return {prompt:'A hall has '+(a*unit)+' blue seats and '+(b*unit)+' grey seats. The manager adds '+add+' seats of each colour. What is the new ratio of blue seats to grey seats?',
        choice:values([a*unit+add,b*unit+add],[[a,b],[a*unit+add,b*unit],[a*unit,b*unit+add],[a+add,b+add],[a*unit+2*add,b*unit+2*add]],ratio),
        explanation:'Add '+add+' to each count to get '+(a*unit+add)+' and '+(b*unit+add)+'. Reduce their ratio to '+ratio([a*unit+add,b*unit+add])+'.'};
    }]
  ]],
  ['Time and Work',[
    ['work-combine','Combined Work','Medium',(i,j)=>{
      const a=3+i,b=2+j,unit=1+i+j;
      const timeA=a*(a+b)*unit,timeB=b*(a+b)*unit;
      return {prompt:'R takes '+timeA+' minutes and S takes '+timeB+' minutes to check a batch of forms independently. How many minutes do they need when working together at constant rates?',
        choice:values(a*b*unit,[timeA+timeB,(timeA+timeB)/2,timeA,timeB,Math.abs(timeA-timeB),2*a*b*unit],metric('minutes')),
        explanation:'Add rates, 1/'+timeA+' + 1/'+timeB+' = 1/'+a*b*unit+' of the batch per minute. Invert the combined rate to get '+a*b*unit+' minutes.'};
    }],
    ['work-efficiency','Efficiency','Easy',(i,j)=>{
      const a=3+i,b=2+j,scale=2+i+j;
      return {prompt:'The hourly work rates of Lal and Pari are in the ratio '+a+':'+b+'. Lal finishes a task alone in '+b*scale+' hours. How long would Pari take alone at her usual rate?',
        choice:values(a*scale,[b*scale,b*b*scale/a,(a+b)*scale,a*scale+b,a*scale*(b+1)],metric('hours')),
        explanation:'Times for a fixed job are proportional to the reciprocals of the rates. Multiply Lal’s '+b*scale+' hours by '+a+'/'+b+' to get '+a*scale+' hours for Pari.'};
    }],
    ['work-fill-drain','Opposing work rates','Medium',(i,j)=>{
      const scale=3+i+j,a=2+j,b=a+1;
      const fill=a*scale,drain=b*scale,answer=a*b*scale;
      return {prompt:'An inlet fills a tank in '+fill+' minutes. A drain empties a full tank in '+drain+' minutes. With both open and rates constant, how long will the initially empty tank take to fill?',
        choice:values(answer,[fill+drain,drain-fill,fill,drain,a*b*(scale+1)],metric('minutes')),
        explanation:'Filling and draining oppose each other. The net rate is 1/'+fill+' − 1/'+drain+' = 1/'+answer+' tank per minute, so filling takes '+answer+' minutes.'};
    }],
    ['work-equivalent-shifts','Changing teams','Hard',(i,j)=>{
      const workers=5+i, departing=2+j%3,remaining=workers-departing,extra=2+i+j,done=1+j,days=done+remaining*extra;
      return {prompt:workers+' workers can pave a lane in '+days+' days. After all work for '+done+' days, '+departing+' workers leave. How many more days will the remaining workers need at the same individual rate?',
        choice:values(workers*extra,[days-done,days,remaining*extra+departing,workers*extra+done,workers*extra+departing],metric('days')),
        explanation:'The lane requires '+workers*days+' worker-days. After '+workers*done+' worker-days, '+(workers*days-workers*done)+' remain. Divide by the '+remaining+' remaining workers to get '+workers*extra+' days.'};
    }],
    ['work-fraction-done','Fraction completed','Easy',(i,j)=>{
      const total=35+8*i+j,working=i%3+j%2+1;
      return {prompt:'A worker can sort an order in '+total+' hours at a constant rate. What fraction remains after '+working+' hours?',
        choice:fractions([total-working,total],[[working,total],[total-working,total+working],[total-working-1,total],[total-working+1,total]]),
        explanation:'The worker completes '+fraction(working,total)+' in '+working+' hours. Subtract that from one full job to leave '+fraction(total-working,total)+'.'};
    }]
  ]],
  ['Profit and Loss',[
    ['profit-find-cost','Profit Percentage','Easy',(i,j)=>{
      const cost=100*(11+4*i+j), rate=4+i*2+j,sale=cost*(100+rate)/100;
      return {prompt:'A retailer sold an appliance for '+money(sale)+' at a profit of '+rate+'%. What was the cost price?',
        choice:values(cost,[sale*(100-rate)/100,sale,sale-cost,cost*(100-rate)/100],money),
        explanation:'Selling price is '+(100+rate)+'% of cost price. Dividing '+money(sale)+' by '+n((100+rate)/100)+' gives a cost of '+money(cost)+'.'};
    }],
    ['profit-marked-price','Discount','Medium',(i,j)=>{
      const costTimes=10+i*2+j,discount=10+5*j, markup=25+5*i,base=costTimes*100, marked=base*(100+markup)/100;
      const final=marked*(100-discount)/100, net=(final-base)/base*100;
      return {prompt:'A jacket costs '+money(base)+', is marked up by '+markup+'% and is then sold with a '+discount+'% discount on the marked price. What is the net percentage gain relative to cost (negative means a loss)?',
        choice:values(net,[markup-discount,markup+discount,discount-markup,-discount,(final-base)/marked*100],percent),
        explanation:'The marked price is '+money(marked)+' and the discount reduces it to '+money(final)+'. Divide the signed difference '+money(final-base)+' by the cost '+money(base)+' and multiply by 100 to get '+percent(net)+'.'};
    }],
    ['profit-two-sales','Equal selling prices','Hard',(i,j)=>{
      const rate=10+5*i+j,scale=1+i+j,common=(100-rate)*(100+rate)*scale;
      return {prompt:'A shop sold two items at '+money(common)+' each. It gained '+rate+'% on the first and lost '+rate+'% on the second. What was the loss percentage across both sales?',
        choice:values(rate**2/100,[0,rate,rate**2/200,rate/2,-(rate**2)/100],percent),
        explanation:'The costs were '+money((100-rate)*scale*100)+' and '+money((100+rate)*scale*100)+'. Their sum is '+money(20000*scale)+' compared with sales of '+money(common*2)+'. The loss divided by the total cost is '+percent(rate**2/100)+'.'};
    }],
    ['profit-successive-discounts','Successive discounts','Medium',(i,j)=>{
      const rateA=5+5*i,rateB=10+5*j, final=(100-rateA)*(100-rateB)/100;
      return {prompt:'An online retailer applies a '+rateA+'% discount first, then a '+rateB+'% discount to the reduced amount. What single discount gives the same final price?',
        choice:values(100-final,[rateA+rateB,rateA,rateB,Math.abs(rateA-rateB),final],percent),
        explanation:'For a marked price of ₹100, the remaining price is '+(100-rateA)+' × '+(100-rateB)+' ÷ 100 = '+money(final)+'. The equivalent discount is '+percent(100-final)+'.'};
    }],
    ['profit-target-selling-price','Revenue across multiple items','Hard',(i,j)=>{
      const price=100*(3+i+j),lots=2+j, rate=5*(j+1), prior=price*(100-5*(i+1))/100;
      const overall=(lots+1)*price*(100+rate)/100,target=overall-lots*prior;
      return {prompt:'A dealer bought '+(lots+1)+' identical chairs for '+money(price)+' each. After selling '+lots+' of them for '+money(prior)+' each, what must the final chair sell for to make '+rate+'% profit overall?',
        choice:values(target,[price*(100+rate)/100,overall,price, target - lots*(price-prior), target+lots*(price-prior)],money),
        explanation:'The revenue target is '+money((lots+1)*price)+' × '+n(1+rate/100)+' = '+money(overall)+'. The earlier sales brought in '+money(lots*prior)+', leaving '+money(target)+' to earn on the last chair.'};
    }]
  ]],
  ['Simple and Compound Interest',[
    ['interest-si-time','Simple Interest','Easy',(i,j)=>{
      const principal=1000*(3+i+j),rate=4+i,time=2+j;
      return {prompt:'An investment of '+money(principal)+' earns '+money(principal*rate*time/100)+' at '+rate+'% simple interest per annum. How long was it invested?',
        choice:values(time,[time+1,time-1,rate,rate+time],metric('years')),
        explanation:'The yearly simple interest is '+money(principal*rate/100)+'. Divide the total interest '+money(principal*rate*time/100)+' by that yearly interest to obtain '+time+' years.'};
    }],
    ['interest-si-rate','Simple Interest','Easy',(i,j)=>{
      const rate=5+i,years=2+j,principal=1000*(i+j+5);
      return {prompt:'Under simple interest, '+money(principal)+' becomes '+money(principal*(100+rate*years)/100)+' in '+years+' years. What is the annual rate?',
        choice:values(rate,[rate*years,rate+years,rate/years,100+rate],percent),
        explanation:'The total interest is '+money(principal*rate*years/100)+'. Divide it by '+years+' for annual interest, then divide by the principal and multiply by 100 to get '+rate+'%.'};
    }],
    ['interest-ci-two','Compound Interest','Medium',(i,j)=>{
      const rate=4+2*i,principal=10000*(2+j),initial=principal*rate/100,second=(principal+initial)*rate/100;
      return {prompt:'Find the interest earned on '+money(principal)+' in two years at '+rate+'% per annum, compounded annually.',
        choice:values(initial+second,[initial*2,second,initial,principal+initial+second],money),
        explanation:'Interest in year one is '+money(initial)+'. The second year earns '+rate+'% of '+money(principal+initial)+' = '+money(second)+'. The interest total is '+money(initial+second)+'.'};
    }],
    ['interest-ci-half-year','Compounding intervals','Hard',(i,j)=>{
      const half=2+i, rate=half*2,principal=10000*(2+j),first=principal*half/100,second=(principal+first)*half/100;
      return {prompt:'What is the total balance after one year on a '+money(principal)+' deposit paying '+rate+'% per annum, compounded half-yearly?',
        choice:values(principal+first+second,[principal+2*first,principal+first,principal*(1+rate/100)**2,first+second],money),
        explanation:'Use two periods at '+half+'% each. The first half-year adds '+money(first)+' and the second adds '+money(second)+' on the updated balance. The final total is '+money(principal+first+second)+'.'};
    }],
    ['interest-ci-si-gap','Compound versus simple interest','Medium',(i,j)=>{
      const rate=5+i,principal=10000*(1+j),yearly=principal*rate/100,gap=yearly*rate/100;
      return {prompt:'For a principal of '+money(principal)+' at '+rate+'% annually, by how much does compound interest exceed simple interest after exactly two years, when compounded annually?',
        choice:values(gap,[yearly,yearly*2,gap*2,gap/2,yearly+gap],money),
        explanation:'Year one earns '+money(yearly)+' either way. In year two, compounding adds interest on that first year’s interest: '+rate+'% of '+money(yearly)+' is '+money(gap)+'.'};
    }]
  ]],
  ['Time, Speed, Distance, and Races',[
    ['speed-convert','Speed units','Easy',(i,j)=>{
      const speed=18*(i+2)+3.6*j;
      const answer=speed/3.6;
      return {prompt:'Convert '+n(speed)+' km/h to metres per second.',
        choice:values(answer,[speed,speed*3.6,speed/60,speed/1000],metric('m/s')),
        explanation:'Converting kilometres to metres multiplies by 1,000 and converting hours to seconds divides by 3,600. The net factor is 5/18, giving '+n(answer)+' m/s.'};
    }],
    ['speed-average-round-trip','Average speed','Medium',(i,j)=>{
      const a=20+5*i,b=60+5*j, answer=2*a*b/(a+b);
      return {prompt:'A cyclist covers a route at '+a+' km/h, then returns along the same route at '+b+' km/h. What is the average speed for the whole journey, to two decimal places where needed?',
        choice:values(+answer.toFixed(2),[(a+b)/2,b-a,+(a*b/(a+b)).toFixed(2),a,b],metric('km/h')),
        explanation:'For equal distances d, total distance is 2d and total time is d/'+a+' + d/'+b+'. Average speed is 2 × '+a+' × '+b+' ÷ '+(a+b)+' ≈ '+n(+answer.toFixed(2))+' km/h.'};
    }],
    ['speed-closing','Relative Speed','Medium',(i,j)=>{
      const a=14+i*2,b=12+j*3,time=3+i+j,d=(a+b)*time;
      return {prompt:'Two cyclists leave opposite ends of a '+d+' km route at the same time, riding towards each other at '+a+' km/h and '+b+' km/h. When do they meet?',
        choice:values(time,[d/a,d/b,time*2,time+1,time-1],metric('hours')),
        explanation:'Their separation closes at '+a+' + '+b+' = '+(a+b)+' km/h. Divide the starting gap '+d+' km by the closing speed to find '+time+' hours.'};
    }],
    ['speed-catch-up','Pursuit with a head start','Hard',(i,j)=>{
      const slower=24+3*i, gapSpeed=4+j,head=(2+j)*gapSpeed;
      const catchTime=slower*head/gapSpeed;
      return {prompt:'A van leaves first at '+slower+' km/h. A car follows along the same route '+head+' minutes later at '+(slower+gapSpeed)+' km/h. How many minutes after the car starts does it catch up?',
        choice:values(catchTime,[head,catchTime+head,catchTime-head,head*(slower+gapSpeed)/gapSpeed,catchTime*2],metric('minutes')),
        explanation:'The head start is '+slower+' × '+head+'/60 = '+n(slower*head/60)+' km. The car gains '+gapSpeed+' km each hour. Dividing the head start by that rate and converting to minutes gives '+catchTime+' minutes.'};
    }],
    ['speed-race-margin','Races','Medium',(i,j)=>{
      const a=10+i,b=a-j-2,time=20+j*5,d=time*a;
      return {prompt:'In a '+d+' m race, model cars A and B start together at constant speeds of '+a+' m/s and '+b+' m/s respectively. How far short of the finish is B when A finishes?',
        choice:values(d-b*time,[b*time,d-(a-b),a-b,d,d-b*time+(a-b)],metric('m')),
        explanation:'A finishes in '+d+' ÷ '+a+' = '+time+' seconds. B covers '+b+' × '+time+' = '+b*time+' m in that time, leaving '+(d-b*time)+' m.'};
    }]
  ]],
  ['Trains',[
    ['train-post','Passing Objects','Easy',(i,j)=>{
      const speed=12+2*i,time=8+j*2,length=speed*time;
      return {prompt:'A train travelling at '+speed+' m/s passes a fixed post in '+time+' seconds. What is its length?',
        choice:values(length,[speed+time,length/2,length+speed,speed*(time-1),speed*(time+1)],metric('m')),
        explanation:'To clear a fixed post, a train travels its own length. Multiplying '+speed+' m/s by '+time+' s gives '+length+' m.'};
    }],
    ['train-platform','Crossing Platforms','Medium',(i,j)=>{
      const speed=15+i*2, train=80+j*10,time=20+j;
      const total=speed*time, platform=total-train;
      return {prompt:'A train '+train+' m long takes '+time+' seconds to clear a platform at '+speed+' m/s. How long is the platform?',
        choice:values(platform,[total,train,total+train,total-2*train,platform+speed],metric('m')),
        explanation:'The front of the train travels '+speed+' × '+time+' = '+total+' m while the train passes completely. That covers the platform and the train’s length. Subtract '+train+' m to find '+platform+' m.'};
    }],
    ['train-opposite','Crossing in opposite directions','Medium',(i,j)=>{
      const a=12+2*i,b=15+3*j,time=8+j;
      const x=100+5*i,y=time*(a+b)-x;
      return {prompt:'Trains '+x+' m and '+y+' m long run towards each other at '+a+' m/s and '+b+' m/s. How many seconds elapse from their fronts meeting to their rear ends clearing each other?',
        choice:values(time,[(x+y)/a,(x+y)/b,(x+y)/Math.max(1,Math.abs(a-b)),time+1,time-1],metric('seconds')),
        explanation:'For opposite directions, add speeds to obtain '+(a+b)+' m/s. The trains must clear both lengths, '+(x+y)+' m, so the time is '+(x+y)+' ÷ '+(a+b)+' = '+time+' s.'};
    }],
    ['train-overtake','Overtaking trains','Hard',(i,j)=>{
      const slower=10+2*i,faster=slower+6+j,time=40+2*j,x=130+10*i,y=time*(faster-slower)-x;
      return {prompt:'Two trains move in the same direction at '+faster+' m/s and '+slower+' m/s. Their lengths are '+x+' m and '+y+' m. How long does the faster train take to pass the slower train completely, measured from the moment the faster train’s front reaches the slower train’s rear?',
        choice:values(time,[(x+y)/(faster+slower),x/(faster-slower),y/(faster-slower),time*2,time+2],metric('seconds')),
        explanation:'The faster train gains '+(faster-slower)+' m each second. It must gain both lengths, '+(x+y)+' m. The pass takes '+(x+y)+' ÷ '+(faster-slower)+' = '+time+' seconds.'};
    }]
  ]],
  ['Boats and Streams',[
    ['boat-upstream-time','Upstream','Easy',(i,j)=>{
      const still=12+i*2,current=2+j,time=3+i+j,d=(still-current)*time;
      return {prompt:'A boat travels at '+still+' km/h in still water. The stream flows at '+current+' km/h. How long does the boat take to travel '+d+' km upstream?',
        choice:values(time,[d/(still+current),d/still,d/current,time+1,time-1],metric('hours')),
        explanation:'For upstream travel subtract the current: '+still+' − '+current+' = '+(still-current)+' km/h. At that speed, '+d+' km takes '+time+' hours.'};
    }],
    ['boat-downstream-distance','Downstream','Easy',(i,j)=>{
      const still=9+i*2,current=2+j,time=2+i+j;
      return {prompt:'A motorboat has a still-water speed of '+still+' km/h and the current is '+current+' km/h. What distance does it cover in '+time+' hours downstream?',
        choice:values((still+current)*time,[(still-current)*time,still*time,current*time,still+current],metric('km')),
        explanation:'The current adds to the boat’s speed downstream, giving '+(still+current)+' km/h. Multiply by '+time+' hours to get '+(still+current)*time+' km.'};
    }],
    ['boat-decompose','Still-water and current speeds','Medium',(i,j)=>{
      const still=14+2*i,current=2+j, down=still+current,up=still-current;
      return {prompt:'A boat travels at '+down+' km/h downstream and '+up+' km/h upstream. What is the speed of the current?',
        choice:values(current,[down-up,(down+up)/2,down,up,down-up+1],metric('km/h')),
        explanation:'The same current is added downstream and subtracted upstream. The difference '+down+' − '+up+' = '+(down-up)+' is twice the current, giving '+current+' km/h.'};
    }],
    ['boat-return-time','Round trip on a stream','Hard',(i,j)=>{
      const still=8+i*2,current=2+j, up=still-current,down=still+current;
      const d=lcm(up,down)*(j+1),time=d/up+d/down;
      return {prompt:'A boat goes '+d+' km downstream and returns to its starting point. Its still-water speed is '+still+' km/h and the stream flows at '+current+' km/h. How long does the round trip take?',
        choice:values(time,[d/up,d/down,2*d/still,2*d/down,2*d/up],metric('hours')),
        explanation:'The boat moves at '+down+' km/h down and '+up+' km/h up. Add the separate travel times, '+d+'/'+down+' + '+d+'/'+up+' = '+time+' hours.'};
    }]
  ]],
  ['Area and Perimeter',[
    ['area-rectangle-dimensions','Quadrilaterals','Easy',(i,j)=>{
      const length=11+i*2,width=4+j;
      return {prompt:'A rectangular courtyard is '+length+' m long and its perimeter is '+2*(length+width)+' m. What is its area?',
        choice:values(length*width,[2*(length+width),length*(2*width),width*width,length*length,length+width],metric('m²')),
        explanation:'Half the perimeter equals length plus width, so the width is '+(length+width)+' − '+length+' = '+width+' m. Area is '+length+' × '+width+' = '+length*width+' m².'};
    }],
    ['area-triangle-inverse','Triangles','Easy',(i,j)=>{
      const base=12+2*i,height=4+2*j;
      return {prompt:'A triangle has an area of '+base*height/2+' cm² and a base of '+base+' cm. Find the perpendicular height to this base.',
        choice:values(height,[height/2,height*2,base,height+base],metric('cm')),
        explanation:'Area is half the product of base and perpendicular height. Double '+base*height/2+' cm² and divide by '+base+' cm to obtain '+height+' cm.'};
    }],
    ['area-circumference','Circles','Easy',(i,j)=>{
      const radius=2+i*4+j, diameter=2*radius;
      return {prompt:'What is the circumference of a circle with diameter '+diameter+' cm?',
        choice:values(diameter,[radius,4*radius,radius*radius,3*radius],v=>n(v)+'π cm'),
        explanation:'Circumference is π times the diameter. Here π × '+diameter+' gives '+diameter+'π cm.'};
    }],
    ['area-path-outside','Composite area','Hard',(i,j)=>{
      const length=18+i*3,width=10+j*2,path=1+j;
      const outerX=length+2*path,outerY=width+2*path,answer=outerX*outerY-length*width;
      return {prompt:'A rectangular garden '+length+' m by '+width+' m is surrounded on all four sides by a uniform path '+path+' m wide, entirely outside the garden. What is the area of the path?',
        choice:values(answer,[outerX*outerY,length*width,2*(length+width)*path,(length+path)*(width+path)-length*width,answer-2*path**2],metric('m²')),
        explanation:'The outer rectangle includes the path on both sides of each dimension, so it is '+outerX+' m by '+outerY+' m. Subtract the garden area: '+outerX+' × '+outerY+' − '+length+' × '+width+' = '+answer+' m².'};
    }],
    ['area-perimeter-scaling','Linear and area scaling','Medium',(i,j)=>{
      const length=10+2*i, factor=(3+j)/2;
      const width=length-4,jScale=width*factor,newLength=length*factor;
      return {prompt:'A rectangular design measuring '+length+' cm by '+width+' cm is enlarged proportionally until its long side measures '+newLength+' cm. What is the enlarged area?',
        choice:values(newLength*jScale,[newLength*width,(length+width)*factor*2,length*width,(newLength+width)*factor,newLength*jScale*2],metric('cm²')),
        explanation:'The scale factor is '+newLength+' ÷ '+length+' = '+n(factor)+'. The other side is now '+n(jScale)+' cm. Multiplying the two new sides gives '+n(newLength*jScale)+' cm².'};
    }]
  ]],
  ['Probability',[
    ['prob-single-draw','Sample Space','Easy',(i,j)=>{
      const red=3+i*2,blue=7+j*3;
      return {prompt:'A bag contains '+red+' red balls and '+blue+' blue balls. One ball is drawn uniformly at random. What is the probability that it is red?',
        choice:fractions([red,red+blue],[[blue,red+blue],[red,red+blue+1],[red-1,red+blue],[1,red+blue],[red+1,red+blue]]),
        explanation:'There are '+(red+blue)+' equally likely balls and '+red+' are red. Divide favourable by total outcomes and reduce to '+fraction(red,red+blue)+'.'};
    }],
    ['prob-without-replacement','Two draws without replacement','Medium',(i,j)=>{
      const red=3+i, blue=5+j*2,total=red+blue;
      return {prompt:'An urn holds '+red+' red tokens and '+blue+' white tokens. Two tokens are drawn one at a time uniformly at random, without replacement. What is the probability both are red?',
        choice:fractions([red*(red-1),total*(total-1)],[[red*red,total*total],[red,total],[red*(red-1),total*total],[red*blue,total*(total-1)],[red*(red-1),total*(total+1)]]),
        explanation:'The first draw is red with probability '+red+'/'+total+'. After a red draw, '+(red-1)+' red tokens remain out of '+(total-1)+'. Multiply the two rates to obtain '+fraction(red*(red-1),total*(total-1))+'.'};
    }],
    ['prob-at-least-one','Complement','Medium',(i,j)=>{
      const successes=2+i, failures=3+j,total=successes+failures;
      return {prompt:'A box contains '+successes+' winning tickets and '+failures+' losing tickets. Draw one ticket at random, replace it, and draw again. What is the probability of at least one win?',
        choice:fractions([total*total-failures*failures,total*total],[[successes,total],[successes*successes,total*total],[failures*failures,total*total],[2*successes*failures,total*total],[total*total-failures*failures-1,total*total]]),
        explanation:'Both attempts lose with probability ('+failures+'/'+total+')². Subtract this from 1; the complementary event is at least one win, with probability '+fraction(total*total-failures*failures,total*total)+'.'};
    }],
    ['prob-inclusion-exclusion','Overlapping events','Hard',(i,j)=>{
      const top=24+2*i+j,m=2+i,n=3+j,start=1;
      const shared=lcm(m,n);
      const countM=Math.floor(top/m),countN=Math.floor(top/n),countBoth=Math.floor(top/shared),favourable=countM+countN-countBoth;
      return {prompt:'One integer is chosen uniformly from '+start+' through '+top+' inclusive. What is the probability that it is divisible by '+m+' or '+n+' (or both)?',
        choice:fractions([favourable,top],[[countM+countN,top],[countBoth,top],[countM+countN-2*countBoth,top],[top-favourable,top],[favourable-1,top],[favourable+1,top]]),
        explanation:'There are '+countM+' multiples of '+m+' and '+countN+' of '+n+'. Their overlap contains '+countBoth+' multiples of '+shared+', which the separate counts include twice. Count '+favourable+' favourable integers out of '+top+', giving '+fraction(favourable,top)+'.'};
    }],
    ['prob-two-dice-sum','Counting ordered outcomes','Medium',(i,j)=>{
      const faces=6+j, target=4+i;
      const out=Array.from({length:faces},(_,k)=>k+1).filter(a=>target-a>=1&&target-a<=faces).length;
      return {prompt:'Two fair '+faces+'-sided dice numbered 1 through '+faces+' are rolled. What is the probability that their sum is exactly '+target+'?',
        choice:fractions([out,faces*faces],[[out+1,faces*faces],[out-1,faces*faces],[Math.ceil(out/2),faces*faces],[out,faces*(faces+1)],[out,2*faces]]),
        explanation:'The dice have '+faces+' × '+faces+' = '+faces*faces+' equally likely ordered outcomes. Exactly '+out+' first values have a valid partner that gives the required sum, so the probability is '+fraction(out,faces*faces)+'.'};
    }]
  ]],
  ['Number System and Number Series',[
    ['number-multiples','Divisibility','Easy',(i,j)=>{
      const number=3+i,min=14+5*j,max=min+48+i*4;
      const count=Math.floor(max/number)-Math.floor((min-1)/number);
      return {prompt:'How many multiples of '+number+' are there from '+min+' to '+max+', inclusive?',
        choice:values(count,[Math.floor(max/number),count-1,count+1,count+2,count-2]),
        explanation:'Count the multiples at most '+max+' and exclude those below '+min+'. The difference is ⌊'+max+'/'+number+'⌋ − ⌊'+(min-1)+'/'+number+'⌋ = '+count+'.'};
    }],
    ['number-remainder','Remainders','Easy',(i,j)=>{
      const divisor=9+i*2,quotient=15+2*i+j, rest=3+j, dividend=divisor*quotient+rest;
      return {prompt:'What is the remainder when '+dividend+' is divided by '+divisor+'?',
        choice:values(rest,[rest+1,rest-1,divisor-rest,0,1]),
        explanation:'The greatest multiple not exceeding '+dividend+' is '+divisor+' × '+quotient+' = '+divisor*quotient+'. The remainder is '+dividend+' − '+divisor*quotient+' = '+rest+'.'};
    }],
    ['number-ap-position','Sequences','Medium',(i,j)=>{
      const first=3+i,step=2+j,term=10+i+j,v=first+(term-1)*step;
      return {prompt:'An arithmetic progression starts '+[first,first+step,first+2*step].join(', ')+', … Which term is '+v+'? Give its position, counting the first term as position 1.',
        choice:values(term,[term-1,term+1,term+2,v/step,v-first]),
        explanation:'The common difference is '+step+'. There are ('+v+' − '+first+') ÷ '+step+' = '+(term-1)+' steps after the first term, so the position is '+term+'.'};
    }],
    ['number-ap-sum','Arithmetic series','Hard',(i,j)=>{
      const first=4+i,step=3+j,count=8+i+j,last=first+(count-1)*step,result=count*(first+last)/2;
      return {prompt:'Calculate the sum of the first '+count+' terms of the arithmetic sequence '+[first,first+step,first+2*step].join(', ')+', …',
        choice:values(result,[count*(first+last), count*(first+last-step)/2, count*(first+last+step)/2,first+last, count*last]),
        explanation:'The last included term is '+first+' + '+(count-1)+' × '+step+' = '+last+'. Each term paired with its counterpart from the opposite end averages '+n((first+last)/2)+'. Multiply that mean by '+count+' to obtain '+result+'.'};
    }],
    ['number-digit-divisibility','Missing digit and divisibility','Medium',(i,j)=>{
      const first=3+i,last=1+j, middle=((9-(first+last)%9)%9);
      return {prompt:'What is the smallest digit that can replace ★ in '+first+'★'+last+' to make the number divisible by 9?',
        choice:values(middle,[(middle+1)%10,(middle+2)%10,(middle+3)%10,(middle+4)%10,(middle+5)%10]),
        explanation:'A number is divisible by 9 exactly when the digit sum is a multiple of 9. The known digits sum to '+(first+last)+'. The smallest digit that makes the sum a multiple of 9 is '+middle+'.'};
    }]
  ]],
  ['Mixtures and Alligation',[
    ['mixture-weighted-price','Weighted Mean','Easy',(i,j)=>{
      const a=2+i,b=4+j, price=75+i+j,step=5+j,low=price-b*step, high=price+a*step;
      return {prompt:a+' kg of grain at '+money(low)+' per kg is blended with '+b+' kg at '+money(high)+' per kg. What is the cost per kg of the blend?',
        choice:values(price,[low,high,(high+low)/2,price+step,price-step],v=>money(v)+' per kg'),
        explanation:'The total cost is '+money(a*low+b*high)+'. Divide by the total mass '+(a+b)+' kg to obtain '+money(price)+' per kg. The mean is weighted by the quantities.'};
    }],
    ['mixture-alligation-ratio','Alligation ratio','Medium',(i,j)=>{
      const lower=10+2*i,higher=lower+30+j+3*i,target=lower+10+2*j;
      return {prompt:'In what ratio by volume should a '+lower+'% syrup and a '+higher+'% syrup be mixed to obtain a '+target+'% syrup? Give the ratio weaker : stronger.',
        choice:values([higher-target,target-lower],[[target-lower,higher-target],[lower,higher],[target-lower,higher-lower],[higher-target,higher-lower],[higher-target+1,target-lower],[higher-target,target-lower+1]],ratio),
        explanation:'Balance the shortfall and excess around the target: a unit of weaker syrup falls short by '+(target-lower)+' percentage points and a unit of stronger syrup exceeds it by '+(higher-target)+'. The amounts must be inverse to those gaps, so use '+ratio([higher-target,target-lower])+'.'};
    }],
    ['mixture-dilute','Dilution with water','Medium',(i,j)=>{
      const base=12+2*i, initial=base*(2+j),water=base*(j+1),rate=20+(5*i);
      const expected=initial*rate/(initial+water);
      return {prompt:'A tank holds '+initial+' L of a sugar solution that is '+rate+'% sugar by volume. After adding '+water+' L of pure water, what percentage is sugar, assuming volumes add? Round to two decimal places.',
        choice:values(+expected.toFixed(2),[rate,rate/2,+(water*rate/(initial+water)).toFixed(2),+(initial*rate/water).toFixed(2),+(100-expected).toFixed(2)],percent),
        explanation:'Adding water leaves sugar volume unchanged at '+n(initial*rate/100)+' L. The new total is '+(initial+water)+' L, so the sugar percentage is '+n(initial*rate/100)+' ÷ '+(initial+water)+' × 100 ≈ '+n(+expected.toFixed(2))+'%.'};
    }],
    ['mixture-replace-once','Replacement','Hard',(i,j)=>{
      const total=20+4*i,remove=4+j,rate=25+5*j,sugar=(total-remove)*rate/100;
      return {prompt:'A well-stirred tank holds '+total+' L of a solution that is '+rate+'% salt by volume. A worker drains '+remove+' L, then refills the tank to its original volume with water. How much salt remains?',
        choice:values(sugar,[total*rate/100,remove*rate/100,(total-2*remove)*rate/100,(total-remove)*(100-rate)/100,sugar+1],metric('L')),
        explanation:'The liquid left immediately after draining is '+(total-remove)+' L and still has the original '+rate+'% concentration. It contains '+n(sugar)+' L of salt. The refill adds no salt.'};
    }],
    ['mixture-replace-twice','Repeated replacement','Hard',(i,j)=>{
      const total=20+4*i,remove=4+j,remaining=total-remove;
      return {prompt:'A container starts with '+total+' L of pure fruit juice. Each time, '+remove+' L of the thoroughly mixed contents is removed and replaced with water. What fraction of the original juice remains after two such cycles?',
        choice:fractions([remaining*remaining,total*total],[[remaining,total],[total-2*remove,total],[remove*remove,total*total],[total*total-remaining*remaining,total*total],[remaining*remaining+1,total*total]]),
        explanation:'Each cycle retains '+fraction(remaining,total)+' of the juice present at its start. Two cycles retain the square of that fraction, which is '+fraction(remaining*remaining,total*total)+'.'};
    }]
  ]],
  ['Squares and Cubes',[
    ['roots-square','Squares and Roots','Easy',(i,j)=>{
      const k=12+i*4+j;
      return {prompt:'Find the positive square root of '+k*k+'.',
        choice:values(k,[k-1,k+1,k+2,k-2,2*k]),
        explanation:k+' × '+k+' = '+k*k+', so the positive square root is '+k+'.'};
    }],
    ['roots-cube','Cubes and Roots','Easy',(i,j)=>{
      const k=10+i*4+j;
      return {prompt:'Find the cube root of '+k**3+'.',
        choice:values(k,[k-1,k+1,k-2,k+2,3*k]),
        explanation:k+' × '+k+' × '+k+' = '+k**3+', so its cube root is '+k+'.'};
    }],
    ['roots-min-square-multiplier','Perfect-square factorisation','Medium',(i,j)=>{
      const a=[2,3,5,7,11,13][i], b=[17,19,23,29][j],value=a*a*b;
      return {prompt:'What is the smallest positive integer that multiplies '+value+' to give a perfect square?',
        choice:values(b,[a,a*b,a*a,b*b,1]),
        explanation:'The prime factorisation is '+a+'² × '+b+'. Square factors have even exponents for every prime. The exponent of '+b+' is odd, so multiply by '+b+' to make it even.'};
    }],
    ['roots-min-cube-multiplier','Perfect-cube factorisation','Hard',(i,j)=>{
      const a=[2,3,5,7,11,13][i],b=[17,19,23,29][j],value=a*a*b;
      return {prompt:'What is the least positive integer that '+value+' must be multiplied by to make a perfect cube?',
        choice:values(a*b*b,[a*b,a*a*b,a*a*b*b,a*b**3,b*b,a]),
        explanation:'The factorisation is '+a+'² × '+b+'. A perfect cube needs exponents divisible by 3. Supply one more factor '+a+' and two factors '+b+', so the least multiplier is '+a*b*b+'.'};
    }],
    ['roots-square-between','Neighbouring perfect squares','Medium',(i,j)=>{
      const k=12+i*4+j,target=k*k+k;
      return {prompt:'What is the least positive integer to add to '+target+' to obtain a perfect square?',
        choice:values(k+1,[k,k+2,2*k+1,2*k,k-1]),
        explanation:'The number lies between '+k+'² = '+k*k+' and '+(k+1)+'² = '+(k+1)**2+'. The next square exceeds '+target+' by '+(k+1)+'.'};
    }]
  ]],
  ['HCF and LCM',[
    ['hcf-equal-pieces','Factorisation','Easy',(i,j)=>{
      const common=4+i*4+j, a=common*7,b=common*9;
      return {prompt:'Two ribbons of '+a+' cm and '+b+' cm are cut into equal pieces with nothing left over. What is the greatest possible length of each piece?',
        choice:values(common,[common*2,common*3,common*7,common*9,a+b],metric('cm')),
        explanation:'The segment length must divide both original lengths. The numbers are '+common+' × 7 and '+common+' × 9, and 7 and 9 share no factor greater than 1. The HCF is '+common+' cm.'};
    }],
    ['lcm-signals','LCM Applications','Easy',(i,j)=>{
      const a=4+i*2, b=15+j*4,answer=lcm(a,b);
      return {prompt:'Two lights flash together at noon. One flashes every '+a+' seconds and the other every '+b+' seconds. How many seconds later do they next flash together?',
        choice:values(answer,[a*b,a+b,Math.abs(a-b),gcd(a,b),2*answer,answer+b],metric('seconds')),
        explanation:'The next simultaneous flash occurs after the least positive common multiple of '+a+' and '+b+'. Their greatest common divisor is '+gcd(a,b)+', so the LCM is '+a+' × '+b+' ÷ '+gcd(a,b)+' = '+answer+' seconds.'};
    }],
    ['lcm-three','Least common multiple of three values','Medium',(i,j)=>{
      const base=3+i*4+j, x=base*4,y=base*6,z=base*15,answer=base*60;
      return {prompt:'Find the least positive integer divisible by '+x+', '+y+' and '+z+'.',
        choice:values(answer,[lcm(x,y),lcm(y,z),2*answer,x+y+z,3*answer]),
        explanation:'Factor out '+base+' and find the LCM of 4, 6 and 15. The needed prime powers are 2², 3 and 5, giving 60. Restoring the common factor gives '+answer+'.'};
    }],
    ['hcf-lcm-unknown','HCF and LCM identity','Medium',(i,j)=>{
      const scale=3+i*4+j, known=scale*5, other=scale*12,multiple=scale*60;
      return {prompt:'Two positive integers have HCF '+scale+' and LCM '+multiple+'. One integer is '+known+'. What is the other?',
        choice:values(other,[multiple/known,scale*known,5*other,other+scale,multiple-other]),
        explanation:'For positive integers, their product equals HCF × LCM. Divide '+scale+' × '+multiple+' by '+known+' to obtain the missing integer '+other+'.'};
    }],
    ['hcf-same-remainders','HCF of differences','Hard',(i,j)=>{
      const divisor=5+i*4+j, rem=2+j, a=divisor*5+rem,b=divisor*7+rem,c=divisor*11+rem;
      return {prompt:'What is the greatest positive integer that leaves remainder '+rem+' when it divides each of '+a+', '+b+' and '+c+'?',
        choice:values(divisor,[divisor*2,divisor*3,divisor+rem,divisor-rem,rem,divisor+1]),
        explanation:'Subtract the required remainder from each number so the divisor must divide all three differences. They are '+divisor*5+', '+divisor*7+' and '+divisor*11+', whose HCF is '+divisor+'.'};
    }]
  ]],
  ['Elementary Mensuration',[
    ['mens-cuboid-volume','Volume','Easy',(i,j)=>{
      const a=10+i,b=3+j,c=2+i+j;
      return {prompt:'Find the volume of a rectangular box with interior dimensions '+a+' cm × '+b+' cm × '+c+' cm.',
        choice:values(a*b*c,[a*b,a*c,(a+b+c)**2,2*(a*b+a*c+b*c),a*b*c*2],metric('cm³')),
        explanation:'The box holds '+a+' × '+b+' = '+a*b+' cm² in each 1 cm layer. With '+c+' layers, the volume is '+a*b*c+' cm³.'};
    }],
    ['mens-cuboid-surface','Surfaces','Medium',(i,j)=>{
      const a=13+i,b=4+j,c=i+j+2,result=2*(a*b+a*c+b*c);
      return {prompt:'A closed rectangular carton measures '+a+' cm by '+b+' cm by '+c+' cm. What is its total external surface area?',
        choice:values(result,[a*b+a*c+b*c,a*b*c,2*(a*b+a*c),2*(a*b+b*c),result+a*b],metric('cm²')),
        explanation:'The three distinct face areas are '+a*b+', '+a*c+' and '+b*c+' cm². Each has an opposite matching face, so double their sum to get '+result+' cm².'};
    }],
    ['mens-cylinder-fill','Cylinder volume','Medium',(i,j)=>{
      const radius=6+i,height=15+j*5,value=radius**2*height;
      return {prompt:'A vertical cylinder has internal radius '+radius+' cm. Water stands '+height+' cm deep in it. What volume of water is present, in terms of π?',
        choice:values(value,[radius*height,2*radius*height,4*value,value/4,radius**2],v=>n(v)+'π cm³'),
        explanation:'The cylinder’s cross-section has area π × '+radius+'² = '+radius**2+'π cm². Multiply by the '+height+' cm filled height to obtain '+value+'π cm³.'};
    }],
    ['mens-cone-volume','Cone volume','Medium',(i,j)=>{
      const radius=4+i,height=9+j*3,value=radius**2*height/3;
      return {prompt:'What is the volume, in terms of π, of a right circular cone with base radius '+radius+' cm and perpendicular height '+height+' cm?',
        choice:values(value,[radius**2*height,2*value, value/4,radius*height/3, radius**2],v=>n(v)+'π cm³'),
        explanation:'A cone has one third the volume of a cylinder with the same base and height. Use π × '+radius+'² × '+height+' ÷ 3 = '+value+'π cm³.'};
    }],
    ['mens-paint-open-cylinder','Open cylinder surface','Hard',(i,j)=>{
      const r=4+i,h=10+j*3,value=2*r*h+r*r;
      return {prompt:'An open-topped cylindrical container of radius '+r+' cm and height '+h+' cm is painted on the outside, including the circular base. Ignoring thickness, what area is painted, in terms of π?',
        choice:values(value,[2*r*h,2*r*h+2*r*r,r*h+r*r,r*r, value/2],v=>n(v)+'π cm²'),
        explanation:'The curved wall has area 2πrh = '+2*r*h+'π cm². The base adds πr² = '+r*r+'π cm². The open top contributes no area, so the total is '+value+'π cm².'};
    }]
  ]],
  ['Heights and Distances',[
    ['height-elevation-fortyfive','Elevation','Easy',(i,j)=>{
      const distance=11+i*4+j;
      return {prompt:'From a point on level ground '+distance+' m from the foot of a vertical flagpole, the angle of elevation to the top is 45°. The sight line starts at ground level. How high is the flagpole?',
        choice:values(distance,[distance/2,2*distance,distance*3,distance-2],metric('m')),
        explanation:'The tangent of 45° is 1, so the height opposite the 45° angle equals the horizontal distance adjacent to it. The height is '+distance+' m.'};
    }],
    ['height-angle-thirty','Standard tangent values','Medium',(i,j)=>{
      const scale=3+i*4+j;
      return {prompt:'A surveyor sights the top of a vertical tower at an elevation angle of 30°. The sight line starts at ground level '+scale+'√3 m horizontally from its foot. How high is the tower?',
        choice:values(scale,[scale*2,scale*3,scale/3,scale/2],metric('m')),
        explanation:'Since tan 30° = 1/√3, multiply the horizontal leg '+scale+'√3 m by 1/√3 to obtain '+scale+' m.'};
    }],
    ['height-eye-level','Observer’s eye height','Medium',(i,j)=>{
      const level=1.2+j/10,distance=12+i*3, answer=distance+level;
      return {prompt:'An observer’s eye is '+n(level)+' m above level ground. Standing '+distance+' m horizontally from a vertical post, the observer sees the top at an angle of elevation of 45°. How tall is the post?',
        choice:values(answer,[distance,distance-level,2*distance+level,2*distance-level],metric('m')),
        explanation:'At 45°, the vertical rise above the observer’s eye equals the horizontal run of '+distance+' m. Add eye height '+n(level)+' m for a total of '+n(answer)+' m.'};
    }],
    ['height-depression','Depression','Easy',(i,j)=>{
      const h=15+i*4+j;
      return {prompt:'From the top of a vertical lookout '+h+' m high, an observer sees a marker on the same level as the lookout’s base at an angle of depression of 45°. How far horizontally is the marker from the base?',
        choice:values(h,[h/2,h*2,h*3,h-2],metric('m')),
        explanation:'The angle of depression equals the marker’s angle of elevation because both reference lines are horizontal. With tan 45° = 1, the horizontal run equals the '+h+' m height.'};
    }],
    ['height-shadow','Similar triangles and shadows','Medium',(i,j)=>{
      const post=2+i, smallShadow=3+j, scale=4+i+j;
      const largeShadow=smallShadow*scale, height=post*scale;
      return {prompt:'A '+post+' m vertical pole casts a '+smallShadow+' m shadow on level ground. At the same instant, a nearby vertical tower casts a '+largeShadow+' m shadow. How tall is the tower?',
        choice:values(height,[largeShadow,scale,largeShadow-post,largeShadow+post,height+post,height-post],metric('m')),
        explanation:'The sunlight creates similar right triangles, so height and shadow scale together. The tower’s shadow is '+largeShadow+' ÷ '+smallShadow+' = '+scale+' times the pole’s shadow. Its height is '+post+' × '+scale+' = '+height+' m.'};
    }]
  ]],
  ['Statistics',[
    ['stats-mean-missing','Mean','Medium',(i,j)=>{
      const centre=20+i*3, spread=j+2;
      const known=[centre-3*spread,centre,centre+2*spread,centre-spread];
      const result=5*centre-sum(known);
      return {prompt:'Five readings have a mean of '+centre+'. Four readings are '+known.join(', ')+'. What is the missing reading?',
        choice:values(result,[centre,centre+spread,centre-spread,centre+3*spread,centre-2*spread]),
        explanation:'A mean of '+centre+' over five readings gives a total of '+5*centre+'. The four listed values sum to '+sum(known)+'. Subtract their sum to obtain '+result+'.'};
    }],
    ['stats-median-odd','Median','Easy',(i,j)=>{
      const c=16+2*i+j,spread=2+j;
      const data=[c+spread,c-1,c+2*spread,c-2*spread,c,c+3*spread,c-3*spread];
      return {prompt:'Find the median of these seven observations: '+data.join(', ')+'.',
        choice:values(c,[data[3],c-1,c+spread,c-3*spread,c+2*spread]),
        explanation:'After sorting, the values are '+data.toSorted((a,b)=>a-b).join(', ')+'. The fourth value has three values on either side, so the median is '+c+'.'};
    }],
    ['stats-median-even','Median of an even-sized set','Medium',(i,j)=>{
      const base=17+3*i,step=2+j,lo=base+2*step,hi=base+5*step;
      const data=[base+7*step,lo,base,base+step,base+6*step,hi];
      return {prompt:'Find the median of the six values '+data.join(', ')+'.',
        choice:values((lo+hi)/2,[lo,hi,(data[2]+data[3])/2,base+step,base+6*step]),
        explanation:'After sorting, the third and fourth values are '+lo+' and '+hi+'. Their average is '+n((lo+hi)/2)+', the median.'};
    }],
    ['stats-mode-frequencies','Mode','Easy',(i,j)=>{
      const base=2+i,spacing=1+j;
      const valuesA=[base,base+spacing,base+2*spacing,base+3*spacing],freq=[3+i,7+i+j,5+i,2+j];
      return {prompt:'The values '+valuesA.join(', ')+' occur '+freq.join(', ')+' times, respectively. What is the mode?',
        choice:values(valuesA[1],[valuesA[0],valuesA[2],valuesA[3]]),
        explanation:'The greatest frequency is '+freq[1]+'. It belongs to the observation '+valuesA[1]+', which is therefore the mode.'};
    }],
    ['stats-shift-median','Transformation of statistics','Medium',(i,j)=>{
      const before=23+i*4+j,shift=2+j,scale=i+2;
      const result=scale*before-shift;
      return {prompt:'A data set has a median of '+before+'. Every value is multiplied by '+scale+' and then reduced by '+shift+'. What is the new median?',
        choice:values(result,[scale*(before-shift),scale*before+shift,before-shift,scale*before, before+scale-shift]),
        explanation:'Multiplication by a positive number and subtraction of a constant preserve the order. They transform the middle value or middle pair in the same way, so the new median is '+scale+' × '+before+' − '+shift+' = '+result+'.'};
    }]
  ]],
  ['Exponents and Powers',[
    ['power-same-base-product','Exponent Laws','Easy',(i,j)=>{
      const base=2+i,x=2+i,y=3+j,answer=x+y;
      return {prompt:'Which expression is equal to '+base+'^'+x+' × '+base+'^'+y+'?',
        choice:values(answer,[x*y,y,x,Math.abs(x-y),answer+1,answer-1],v=>base+'^'+v),
        explanation:'For powers with the same base, multiplication combines all copies of the base. Add the exponents: '+x+' + '+y+' = '+answer+'.'};
    }],
    ['power-quotient-common-base','Exponent subtraction','Easy',(i,j)=>{
      const base=3+i,a=8+3*j,b=2+i,answer=a-b;
      return {prompt:'Simplify '+base+'^'+a+' ÷ '+base+'^'+b+' as a power of '+base+'.',
        choice:values(answer,[a+b,a,b,a*b,answer+1,answer-1],v=>base+'^'+v),
        explanation:'In the ratio of two powers with the same base, '+b+' factors cancel. Subtract '+b+' from '+a+' to get '+answer+', so the result is '+base+'^'+answer+'.'};
    }],
    ['power-negative','Integer Powers','Medium',(i,j)=>{
      const base=2+i,negative=2+j,den=base**negative;
      return {prompt:'What is the numerical value of '+base+'^(-'+negative+')?',
        choice:fractions([1,den],[[den,1],[1,base**(negative-1)],[1,base**(negative+1)],[-1,den],[1,den+1]]),
        explanation:'A negative exponent gives the reciprocal of the positive power. Here '+base+'^'+negative+' = '+den+', so the requested value is 1/'+den+'.'};
    }],
    ['power-power','Power of a power','Medium',(i,j)=>{
      const base=2+i,inner=2+i,outer=3+j,answer=inner*outer;
      return {prompt:'Write ('+base+'^'+inner+')^'+outer+' as a single power with base '+base+'.',
        choice:values(answer,[inner+outer,outer,inner,answer+1,2*answer,answer-1],v=>base+'^'+v),
        explanation:'The outer exponent repeats the inner block of '+inner+' factors '+outer+' times. Multiply the exponents: '+inner+' × '+outer+' = '+answer+'.'};
    }],
    ['power-rewrite-base','Rewrite to a common base','Hard',(i,j)=>{
      const base=2+i, C=base**2, D=base**3,a=4+j,b=2+j,answer=3*a-2*b;
      return {prompt:'Express '+D+'^'+a+' ÷ '+C+'^'+b+' as a single power of '+base+'.',
        choice:values(answer,[a-b,3*a+2*b,2*a-3*b,3*(a-b),3*a-b,answer+1],v=>base+'^('+v+')'),
        explanation:'Convert '+D+' to '+base+'^3 and '+C+' to '+base+'^2. Multiply exponents within each power, then subtract across the quotient: 3 × '+a+' − 2 × '+b+' = '+answer+'.'};
    }]
  ]]
];

export function buildNumerical() {
  const questions=groups.flatMap(([topic,families])=>families.flatMap(family=>
    Array.from({length:variants},(_,index)=>entry(topic,family,index))));
  const prompts=new Map();
  for(const question of questions){
    const fingerprint=normalize(question.prompt);
    const previous=prompts.get(fingerprint);
    if(previous)throw Error('Duplicate numerical prompt in '+previous+' and '+question.family+': '+question.prompt);
    prompts.set(fingerprint,question.family);
  }
  return questions;
}
