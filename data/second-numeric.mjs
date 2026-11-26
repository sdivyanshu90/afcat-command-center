// Original, matriculation-level drills. The cycle notice provides the syllabus
// and standard. The generated scenarios and worked solutions are original.
const notice='https://careerairforce.gov.in/sites/default/files/2026-11/Notification-for-AFCAT-2027.pdf';
const variants=25;
const norm=text=>text.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
const number=value=>{
  if(!Number.isFinite(value))throw Error('A numerical option is not finite');
  return String(Number(value.toFixed(8)));
};
const units=unit=>value=>number(value)+' '+unit;
const money=value=>'₹'+number(value);
const pct=value=>number(value)+'%';
const gcd=(a,b)=>b===0?Math.abs(a):gcd(b,a%b);
const lcm=(a,b)=>a*b/gcd(a,b);
function fraction(a,b){
  const k=gcd(a,b);
  return b===k?String(a/k):a/k+'/'+b/k;
}
const frac=([a,b])=>fraction(a,b);
const ratio=([a,b])=>a/gcd(a,b)+':'+b/gcd(a,b);
const round=(x,places=2)=>Number(x.toFixed(places));
const round2=x=>round(x,2);
const solved=(prompt,key,wrong,explanation,format=number)=>({prompt,key,wrong,explanation,format});
const topics=[
  ['Decimal Fractions',[
    ['Adding decimals of different lengths','Easy',(i,j)=>{
      const a=178+i*21,b=34+j*7;
      const x=a/100,y=b/1000,z=(10*a+b)/1000;
      return solved('Calculate '+number(x)+' + '+number(y)+'.',z,[x+b/100,x+b/10000,x-y,(a+b)/100],
        'Write both quantities as thousandths: '+a*10+' thousandths plus '+b+' thousandths equals '+(a*10+b)+' thousandths, or '+number(z)+'.');
    }],
    ['Decimal subtraction with borrowing','Easy',(i,j)=>{
      const a=5+i,b=123+11*j+i;
      const x=a+b%3/10,y=(a-1)+b/1000,z=x-y;
      return solved('Find '+number(x)+' − '+number(y)+'.',z,[x-y/10,y-x,x+y,(Math.round(x*100)-Math.round(y*100))/100,z+0.1,z-0.1],
        'Convert to thousandths and subtract '+Math.round(y*1000)+' from '+Math.round(x*1000)+'. The difference is '+Math.round(z*1000)+' thousandths, or '+number(z)+'.');
    }],
    ['Rounding decimals to hundredths','Easy',(i,j)=>{
      const thou=2371+41*i+7*j,x=thou/1000,z=Math.floor((thou+5)/10)/100;
      return solved('Round '+number(x)+' to the nearest hundredth.',z,[Math.floor(x*100)/100,Math.ceil(x*100)/100,round(x,1),x,z+0.02,z-0.02],
        'Keep two decimal places and inspect the thousandths digit, '+Math.round(x*1000)%10+'. Round to the nearer hundredth to get '+number(z)+'.');
    }],
    ['Comparing decimal magnitudes','Medium',(i,j)=>{
      const a=11+i,b=41+j;
      const candidates=[a/10+b/10000,a/10+b/1000,a/10+b/100000,a/10+(b-3)/1000];
      return solved('Among '+candidates.toSorted((x,y)=>x-y).map(number).join(', ')+', which is the second largest?',candidates[3],candidates.slice(0,3),
        'All four numbers share '+number(a/10)+' as their first two digits. The greatest adds '+b+' thousandths, and the next adds '+(b-3)+' thousandths, giving '+number(candidates[3])+'.');
    }]
  ]],
  ['Averages and Percentages',[
    ['Average repair by correcting a score','Medium',(i,j)=>{
      const size=12+i,original=61+j,incorrect=29+i+j,correct=incorrect+size;
      return solved('An average score of '+original+' was calculated for '+size+' candidates using '+incorrect+' for one candidate. Their true score was '+correct+'. What is the corrected average?',original+1,[original-1,original,original+size,original+2],
        'The true total increases by '+correct+' − '+incorrect+' = '+size+'. Dividing the increase by the '+size+' candidates adds exactly 1 mark to the average.');
    }],
    ['Percentage-point versus relative change','Medium',(i,j)=>{
      const old=20+5*i,add=2+j,next=old+add,relative=add/old*100;
      return solved('A qualification rate increases from '+old+'% to '+next+'%. Relative to the original rate, what is the percentage increase rounded to one decimal place if needed?',round(relative,1),[add,next,round(add/next*100,1),round(relative*2,1),round(relative/2,1)],
        'The increase is '+add+' percentage points. The relative change uses the original percentage as its base: '+add+' ÷ '+old+' × 100 ≈ '+number(round(relative,1))+'%.',pct);
    }],
    ['Repeated percentage growth','Medium',(i,j)=>{
      const rate=4+i,initial=10000*(j+2),after=initial*(1+rate/100)**2;
      return solved('A library begins with '+initial+' records. It increases the total by '+rate+'% each year for two consecutive years. How many records are there after the second increase?',after,[initial*(1+2*rate/100),initial*(1+rate/100),initial*(1-rate/100)**2,after+rate],
        'The first increase gives '+number(initial*(1+rate/100))+' records. The second percentage applies to that larger total, so multiply '+initial+' by '+number(1+rate/100)+' twice to get '+number(after)+'.');
    }],
    ['Subgroup percentage in a combined population','Hard',(i,j)=>{
      const groupA=20+5*i,groupB=60+5*j,rateA=20,rateB=40;
      const passedA=groupA*rateA/100,passedB=groupB*rateB/100;
      return solved('Group A has '+groupA+' candidates and '+rateA+'% pass. Group B has '+groupB+' candidates and '+rateB+'% pass. What percentage of the combined group passes? Round to two decimal places.',round2((passedA+passedB)/(groupA+groupB)*100),[30,20,40,round2(passedB/(groupA+groupB)*100),round2(passedA/(groupA+groupB)*100)],
        'There are '+passedA+' passes from A and '+passedB+' from B, or '+(passedA+passedB)+' passes among '+(groupA+groupB)+' people. Divide the total passes by the combined headcount and multiply by 100.',pct);
    }]
  ]],
  ['Ratio and Proportion',[
    ['Find a total from a ratio difference','Medium',(i,j)=>{
      const a=3+i,b=a+2+j,unit=5+j, gap=(b-a)*unit;
      return solved('A delivery contains small and large cartons in the ratio '+a+':'+b+'. There are '+gap+' more large cartons than small cartons. How many cartons are there in total?',(a+b)*unit,[a*unit,b*unit,gap,(a+b)*gap],
        'The gap occupies '+(b-a)+' ratio parts. Each part therefore equals '+gap+' ÷ '+(b-a)+' = '+unit+' cartons. The total contains '+(a+b)+' parts, or '+(a+b)*unit+' cartons.');
    }],
    ['Unit-price proportional comparison','Medium',(i,j)=>{
      const packs=3+i,unit=21+7*j;
      return solved('A bundle of '+packs+' identical notebooks costs '+money(packs*unit)+'. At the same rate, how much would '+(packs+4)+' notebooks cost?',(packs+4)*unit,[4*unit,packs*unit,packs*unit+4,(packs+5)*unit],
        'Each notebook costs '+money(packs*unit)+' ÷ '+packs+' = '+money(unit)+'. For '+(packs+4)+' notebooks, multiply that rate by '+(packs+4)+' to get '+money((packs+4)*unit)+'.',money);
    }],
    ['Map scales with units','Medium',(i,j)=>{
      const scale=10000*(i+2),length=3+j,distance=length*scale/100000;
      return solved('A map has scale 1:'+scale+'. Two points are '+length+' cm apart on the map. What real distance separates them, in kilometres?',distance,[distance*10,distance/10,distance*100,length+distance],
        'Each map centimetre represents '+scale+' real centimetres. The measured distance represents '+length*scale+' cm, or '+number(distance)+' km because 1 km = 100,000 cm.',units('km'));
    }],
    ['Joint proportion with two independent factors','Hard',(i,j)=>{
      const machines=3+i,hours=2+j,perHour=11+i+j;
      const current=machines*hours*perHour,target=(machines+2)*(hours+2)*perHour;
      return solved(machines+' identical machines cut '+current+' labels in '+hours+' hours. At the same individual rate, how many labels can '+(machines+2)+' machines cut in '+(hours+2)+' hours?',target,[current, current*(machines+2)/machines,current*(hours+2)/hours,target*2],
        'Divide '+current+' by '+machines+' × '+hours+' to get '+perHour+' labels per machine-hour. The new plan uses '+(machines+2)*(hours+2)+' machine-hours, producing '+target+' labels.');
    }]
  ]],
  ['Time and Work',[
    ['Find an unknown partner’s rate','Medium',(i,j)=>{
      const together=(j+1)*(5+i),alone=(j+2)*together,partner=alone/(j+1);
      return solved('Two workers together finish an order in '+together+' hours. The first worker alone needs '+alone+' hours. How long would the second worker take alone?',partner,[together,alone,alone+together,alone*2,partner+1],
        'Subtract the first worker’s rate from the combined rate: 1/'+together+' − 1/'+alone+' = 1/'+partner+' of the order per hour. The second worker therefore needs '+partner+' hours.',units('hours'));
    }],
    ['Alternating turns with an exact finish','Hard',(i,j)=>{
      const a=3+i,b=7+j,limit=2+j,total=limit*(a+b)+a;
      return solved('A machine processes '+a+' files per hour and a second machine processes '+b+' files per hour. They work in alternating 1-hour turns, with the first machine starting. How many hours does it take to process exactly '+total+' files?',2*limit+1,[2*limit,2*limit+2,limit+1,limit+2,2*limit+3],
        'One pair of turns processes '+(a+b)+' files. After '+limit+' full pairs, '+(total-limit*(a+b))+' files remain, exactly one first-machine turn. Thus '+2*limit+' + 1 = '+(2*limit+1)+' hours.',units('hours'));
    }],
    ['Net progress from partly overlapping shifts','Medium',(i,j)=>{
      const anna=4+i,raj=7+j,overlap=2+i,joint=(anna+raj)*overlap;
      const solo=1+j,total=joint+raj*solo;
      return solved('One worker completes '+anna+' inspections per hour and another completes '+raj+'. They work together for '+overlap+' hours. Then the first leaves and the second continues alone for '+solo+' hours. How many inspections are done in all?',total,[joint+anna*solo,joint,(anna+raj)*(overlap+solo),raj*(overlap+solo),total+anna],
        'Together they finish '+(anna+raj)+' per hour, or '+joint+' during the overlap. The second worker contributes another '+raj*solo+' inspections alone, for a total of '+total+'.');
    }],
    ['Staffing for a shorter workday','Hard',(i,j)=>{
      const count=3+2*i,hours=6+j,duration=3*(4+i+5*j);
      const targetHours=hours/2,targetDays=duration/3,required=6*count;
      return solved(count+' workers finish a job in '+duration+' days at '+hours+' hours per day. At the same rate per worker-hour, how many workers are required to finish it in '+number(targetDays)+' days at '+number(targetHours)+' hours per day?',required,[count,count*3,count+2,count*2,required+1],
        'The job takes '+count*duration*hours+' worker-hours. One worker under the new timetable provides '+number(targetDays*targetHours)+' hours. Dividing the requirements by that number gives '+required+' workers.');
    }]
  ]],
  ['Profit and Loss',[
    ['Find a cost from a known loss','Easy',(i,j)=>{
      const p=100*(18+i+5*j),loss=4+i,sp=p*(1-loss/100);
      return solved('An item sells for '+money(sp)+' at a loss of '+loss+'%. What was its cost price?',p,[sp,sp*(1+loss/100),p-sp,p*(1+loss/100)],
        'The selling price represents '+(100-loss)+'% of cost. Divide '+money(sp)+' by '+number(1-loss/100)+' to find '+money(p)+'.',money);
    }],
    ['Discount rate for a target selling price','Medium',(i,j)=>{
      const p=100*(7+i+5*j),mark=25+i,marked=p*(1+mark/100),profit=7+j,sp=p*(1+profit/100),discount=round2(100*(1-sp/marked));
      return solved('A bag costing '+money(p)+' is marked at '+money(marked)+'. To earn a '+profit+'% profit, what discount should the seller grant on the marked price? Round to two decimal places.',discount,[mark-profit,profit,mark,round2(100*(marked-sp)/sp),round2(discount/2)],
        'A '+profit+'% profit requires a selling price of '+money(sp)+'. The discount is '+money(marked-sp)+'. Divide that amount by the marked price '+money(marked)+' and multiply by 100.',pct);
    }],
    ['Trade-in costs included in cost price','Medium',(i,j)=>{
      const buy=2400+100*i+300*j,repair=120+30*i,delivery=80+20*j, cost=buy+repair+delivery;
      const margin=(5+j)/100,sale=cost*(1+margin);
      return solved('A used bicycle is bought for '+money(buy)+', repaired for '+money(repair)+' and delivered for '+money(delivery)+'. All costs are borne by the seller. What sale price yields a '+number(margin*100)+'% profit on the full cost?',sale,[buy*(1+margin),cost,(buy+repair)*(1+margin),cost+buy*margin,cost*(1-margin)],
        'Add purchase, repair and delivery to obtain '+money(cost)+'. Applying the profit percentage to this full cost gives '+money(sale)+'.',money);
    }],
    ['Equal costs with unequal gain and loss','Medium',(i,j)=>{
      const cost=1000+100*i+500*j,a=16+i,b=5+j,net=(a-b)/2;
      return solved('Two items each cost '+money(cost)+'. One sells at a '+a+'% gain and the other at a '+b+'% loss. What is the overall profit percentage?',net,[a-b,(a+b)/2,a,b,net/2],
        'The first item adds '+money(cost*a/100)+' and the second loses '+money(cost*b/100)+'. As the two cost prices are equal, the net change divided by the combined cost is ('+a+' − '+b+') ÷ 2 = '+pct(net)+'.',pct);
    }]
  ]],
  ['Simple and Compound Interest',[
    ['Simple-interest principal from two balances','Hard',(i,j)=>{
      const interest=60+15*j,principal=1200+200*i,t1=2+i,t2=t1+3+j;
      const first=principal+t1*interest,second=principal+t2*interest;
      return solved('A deposit under simple interest becomes '+money(first)+' after '+t1+' years and '+money(second)+' after '+t2+' years. What was the original deposit?',principal,[ first,second-first,first-interest,principal+interest,principal-interest],
        'The balance rises by '+money(second-first)+' over '+(t2-t1)+' years, so it earns '+money(interest)+' per year. Subtract '+t1+' years of interest from '+money(first)+' to get '+money(principal)+'.',money);
    }],
    ['Simple interest over fractional years','Easy',(i,j)=>{
      const principal=2000+400*i+200*j,rate=5+i,months=3+3*j,interest=principal*rate*months/1200;
      return solved('Calculate the simple interest on '+money(principal)+' for '+months+' months at '+rate+'% per annum.',interest,[principal*rate/100,interest*12,interest/12,interest+principal,interest*2],
        'The yearly interest is '+money(principal*rate/100)+'. The investment lasts '+fraction(months,12)+' of a year, so the interest over this period is '+money(interest)+'.',money);
    }],
    ['Annual compounding with changing rates','Medium',(i,j)=>{
      const p=10000*(2+j),a=4+i,b=9+j,final=p*(1+a/100)*(1+b/100);
      return solved('A fund begins with '+money(p)+' and earns '+a+'% interest in its first year and '+b+'% interest in its second year. The first year’s interest remains invested. What is the final balance?',final,[p*(1+(a+b)/100),p*(1+a/100)**2,p*(1+b/100)**2,final-p,p*(1+(a-b)/100)],
        'The first year produces '+money(p*(1+a/100))+'. Apply the second year’s rate to that entire balance, giving '+money(p*(1+a/100))+' × '+number(1+b/100)+' = '+money(final)+'.',money);
    }],
    ['Compound annual interest rate from two balances','Hard',(i,j)=>{
      const p=10000*(i+1),rate=5+j+i*2,final=p*(1+rate/100)**2;
      return solved('An investment grows from '+money(p)+' to '+money(final)+' over two years at the same annual rate, compounded annually. What is the annual interest rate?',rate,[round2((final/p-1)*100),round2((final/p-1)*50),2*rate,rate/2,rate+2],
        'The two-year growth factor is '+number(final/p)+'. Take its positive square root to obtain the one-year factor '+number(1+rate/100)+'. Subtract 1 and multiply by 100 to get '+pct(rate)+'.',pct);
    }]
  ]],
  ['Time, Speed, Distance, and Races',[
    ['Average speed including a stop','Medium',(i,j)=>{
      const speed=24+4*i,first=2+j,second=3+i,rest=1+j/2;
      const distance=speed*(first+second),total=first+second+rest,value=round2(distance/total);
      return solved('A delivery van travels at '+speed+' km/h for '+first+' hours, stops for '+number(rest)+' hours, then travels at the same speed for '+second+' hours. What is its average speed over the entire elapsed time? Round to two decimal places.',value,[speed,round2(distance/(total+rest)),round2(distance/(first+rest)),round2(distance/(second+rest)),value+1],
        'The van covers '+distance+' km in '+(first+second)+' moving hours. Including the stop, '+number(total)+' hours elapse. Divide '+distance+' by '+number(total)+' to obtain '+number(value)+' km/h.',units('km/h'));
    }],
    ['Delayed departures in opposite directions','Hard',(i,j)=>{
      const first=30+4*i,second=38+3*j,delay=1+i/2;
      const answer=2+j,dist=first*delay+(first+second)*answer;
      return solved('One bus leaves a city travelling east at '+first+' km/h. A second leaves the same city westbound '+number(delay)+' hours later at '+second+' km/h. How long after the second departure are they '+number(dist)+' km apart?',answer,[answer+delay,round2(dist/(first+second)),round2(dist/second),answer*2,answer+1],
        'The first bus travels '+number(first*delay)+' km before the second starts. After that, they separate at '+(first+second)+' km/h. The remaining distance '+number(dist-first*delay)+' km takes '+answer+' hours.',units('hours'));
    }],
    ['Race distances at consistent finish margins','Medium',(i,j)=>{
      const timer=12+i,dist=200+10*j,firstMargin=20+i,jointMargin=firstMargin*2;
      const value=dist-jointMargin;
      return solved('Model car A completes a '+dist+' m race in '+timer+' seconds. At that instant, car B still has '+firstMargin+' m left and car C has twice as far left as B. How far has car C travelled?',value,[jointMargin,dist-firstMargin,dist+jointMargin,firstMargin,dist-3*firstMargin],
        'The distance remaining for C is '+firstMargin+' × 2 = '+jointMargin+' m. Its completed distance is '+dist+' − '+jointMargin+' = '+value+' m.',units('m'));
    }],
    ['Distance split from a journey timetable','Hard',(i,j)=>{
      const speedA=24+4*i,speedB=speedA+12,slow=2+j,fast=2+i,dist=speedA*slow+speedB*fast;
      return solved('A car travels '+dist+' km in '+(slow+fast)+' hours. It moves at '+speedA+' km/h for the first part and '+speedB+' km/h for the rest, without stops. How many hours does it spend at '+speedA+' km/h?',slow,[fast,slow+1,fast+slow-1,slow+2,slow/2],
        'At the faster speed throughout, it would cover '+speedB*(slow+fast)+' km. The actual journey is '+(speedB*(slow+fast)-dist)+' km shorter because each slow hour covers '+(speedB-speedA)+' km less. Divide these amounts to get '+slow+' hours.',units('hours'));
    }]
  ]],
  ['Trains',[
    ['Train speed from passing a signal','Easy',(i,j)=>{
      const seconds=10+i,speed=12+j*2,length=seconds*speed;
      return solved('A train '+length+' m long passes a stationary signal in '+seconds+' seconds. What is its speed in kilometres per hour?',speed*3.6,[speed,speed/3.6,speed*60,speed*3.6+3.6],
        'Passing a signal requires moving the train’s own length. The speed in m/s is '+length+' ÷ '+seconds+' = '+speed+'. Multiply by 3.6 to get '+number(speed*3.6)+' km/h.',units('km/h'));
    }],
    ['Train length from two crossing times','Hard',(i,j)=>{
      const a=10+i,b=a+8+j,speed=18+j*2,platform=speed*(b-a),length=speed*a;
      return solved('A train passes a telegraph pole in '+a+' seconds and takes '+b+' seconds to clear a '+platform+' m platform at the same speed. How long is the train?',length,[platform,speed*b,platform+length/2,Math.abs(platform-length),length+speed],
        'The extra '+(b-a)+' seconds cover the platform alone, so the speed is '+platform+' ÷ '+(b-a)+' = '+speed+' m/s. Multiply by the '+a+' seconds needed to pass the pole to get '+length+' m.',units('m'));
    }],
    ['Train passing a moving walker','Medium',(i,j)=>{
      const speed=14+i*2, walker=1+j/4,time=12+j*4,length=(speed-walker)*time;
      return solved('A train travels at '+speed+' m/s and a trackside walker moves in the same direction at '+number(walker)+' m/s. The train passes the walker completely in '+time+' seconds. How long is it?',length,[(speed+walker)*time,speed*time,walker*time,length+speed],
        'The train gains '+number(speed-walker)+' m each second on the walker. To pass, it must gain its own length, so multiply by '+time+' seconds: '+length+' m.',units('m'));
    }],
    ['Train clearing a bridge after entering','Medium',(i,j)=>{
      const train=125+25*i,bridge=375+25*j,speed=10+j;
      const time=round2((train+bridge)/speed);
      return solved('A train '+train+' m long moves at '+speed+' m/s over a '+bridge+' m bridge. From the front reaching the near end to the rear leaving the far end, how many seconds pass? Round to two decimal places.',time,[round2(bridge/speed),round2(train/speed),round2((bridge-train)/speed),time+2],
        'The front travels the length of the bridge and then the train’s length again to let the rear clear it. The elapsed time is ('+bridge+' + '+train+') ÷ '+speed+' ≈ '+number(time)+' seconds.',units('seconds'));
    }]
  ]],
  ['Boats and Streams',[
    ['Stream speed from equal travel distances','Medium',(i,j)=>{
      const a=2+i,b=a+2+j,d=lcm(a,b)*(6+i+j);
      const current=round2(d*(1/a-1/b)/2);
      return solved('A boat covers '+d+' km downstream in '+a+' hours and the same distance upstream in '+b+' hours. Find the current speed.',current,[d/a-d/b,(d/a+d/b)/2,d/b,d/a,current+1],
        'The downstream speed is '+d/a+' km/h and upstream speed is '+d/b+' km/h. Their difference equals twice the current, giving '+number(current)+' km/h.',units('km/h'));
    }],
    ['Still-water speed from a timed upstream leg','Medium',(i,j)=>{
      const current=2+i,still=13+2*j,time=2+i+j,d=(still-current)*time;
      return solved('Paddling against a '+current+' km/h current, a boater covers '+d+' km in '+time+' hours. What is the boat’s speed in still water?',still,[still-current,still-2*current,still+current,current,still+2*current],
        'Its upstream speed is '+d+' ÷ '+time+' = '+(still-current)+' km/h. Add back the effect of the current, '+current+' km/h, to obtain '+still+' km/h.',units('km/h'));
    }],
    ['Comparing equal-duration upstream and downstream legs','Medium',(i,j)=>{
      const current=2+i,still=10+2*j,time=2+j;
      const result=2*current*time;
      return solved('A boat has still-water speed '+still+' km/h. The current flows at '+current+' km/h. How much farther does it travel during '+time+' hours downstream than during '+time+' hours upstream?',result,[current*time,(still+current)*time,(still-current)*time,2*current,result+still,2*result,result+1],
        'Downstream and upstream speeds differ by '+2*current+' km/h because the current adds in one direction and subtracts in the other. Multiply this difference by '+time+' hours to get '+result+' km.',units('km'));
    }],
    ['Distance in a fixed-time out-and-back boat trip','Hard',(i,j)=>{
      const still=12+2*i,current=2+j,down=still+current,up=still-current,d=lcm(down,up)*(j+1);
      const hours=d/down+d/up;
      return solved('A boat goes downstream from a jetty and returns to it. The trip takes '+hours+' hours in total without stops. Its still-water speed is '+still+' km/h and the current is '+current+' km/h. How far from the jetty does it turn back?',d,[2*d,still*hours/2,down*hours/2,up*hours/2,down*hours],
        'Let the one-way distance be d. The time per kilometre is 1/'+down+' h downstream and 1/'+up+' h upstream. Divide the total '+hours+' h by their sum to obtain '+d+' km.',units('km'));
    }]
  ]],
  ['Area and Perimeter',[
    ['Area of a trapezium','Easy',(i,j)=>{
      const a=8+i,b=15+j,h=5+i+j;
      return solved('A trapezium has parallel sides '+a+' cm and '+b+' cm and a perpendicular height of '+h+' cm. What is its area?',(a+b)*h/2,[(a+b)*h,a*h,b*h,(b-a)*h/2],
        'Average the parallel sides to get '+number((a+b)/2)+' cm. Multiply by perpendicular height '+h+' cm to obtain '+number((a+b)*h/2)+' cm².',units('cm²'));
    }],
    ['Inside border of uniform width','Hard',(i,j)=>{
      const a=21+2*i,b=15+2*j,w=2+j%3;
      const core=(a-2*w)*(b-2*w),inside=a*b-core;
      return solved('A rectangle '+a+' m by '+b+' m has a border of width '+w+' m lying entirely inside it. What is the area of the border?',inside,[core,2*(a+b)*w,(a-w)*(b-w),a*b,inside+w*w],
        'The inner rectangle has sides '+(a-2*w)+' and '+(b-2*w)+' m because the border occupies both ends of each dimension. Subtract its area '+core+' m² from '+a*b+' m² to get '+inside+' m².',units('m²'));
    }],
    ['Semicircle boundary with its diameter','Medium',(i,j)=>{
      const r=7*(1+i+5*j),boundary=r*22/7+2*r;
      return solved('A semicircular sign has radius '+r+' cm. What is the length of its complete boundary, including the straight edge? Use π = 22/7.',boundary,[r*22/7,2*r*22/7,2*r*22/7+2*r,boundary+r,r*22/7+r],
        'The curved part is half a circumference, πr = '+r*22/7+' cm. The straight edge is one diameter, '+2*r+' cm. Add them to get '+boundary+' cm.',units('cm'));
    }],
    ['Area of a sector by angle share','Medium',(i,j)=>{
      const angles=[30,45,60,90,120],angle=angles[j],r=6+6*i;
      const pi=v=>frac(v)+'π cm²';
      return solved('A sector has central angle '+angle+'° and radius '+r+' cm. What is its area in terms of π?',[r*r*angle,360],[[r*r,1],[r*r*(360-angle),360],[r*r*angle,180],[r*angle,360],[r*r*angle,720]],
        'The sector covers '+fraction(angle,360)+' of the full circle. Multiplying this fraction by '+r*r+'π cm² gives '+pi([r*r*angle,360])+'.',pi);
    }]
  ]],
  ['Probability',[
    ['Exactly one success in two independent draws','Medium',(i,j)=>{
      const red=3+i, blue=9+2*j,total=red+blue;
      return solved('A bag has '+red+' red tokens and '+blue+' blue tokens. Draw two tokens uniformly, replacing the first before drawing again. What is the probability of drawing exactly one red token?',[2*red*blue,total**2],[[red*blue,total**2],[red,total],[2*red,total],[(total*total-blue*blue),total**2],[red*red,total**2]],
        'Exactly one red can occur as red then blue or blue then red. Each ordering has probability '+fraction(red*blue,total**2)+'. Add the two disjoint outcomes to get '+fraction(2*red*blue,total**2)+'.',frac);
    }],
    ['Probability of two different colours without replacement','Hard',(i,j)=>{
      const a=3+i,b=8+j,total=a+b;
      return solved('An urn holds '+a+' yellow balls and '+b+' black balls. Two balls are drawn at random without replacement. What is the probability that they have different colours?',[2*a*b,total*(total-1)],[[a*b,total*(total-1)],[2*a*b,total*total],[a,total],[b,total],[(a*(a-1)+b*(b-1)),total*(total-1)]],
        'There are '+total*(total-1)+' ordered draws. There are '+a*b+' yellow-then-black draws and the same number of black-then-yellow draws, giving probability '+fraction(2*a*b,total*(total-1))+'.',frac);
    }],
    ['Same face twice with independent dice','Easy',(i,j)=>{
      const faces=5+i+5*j;
      return solved('Two fair '+faces+'-sided dice, each numbered from 1 to '+faces+', are rolled. What is the probability that the two numbers match?',[1,faces],[[1,faces*faces],[2,faces],[faces-1,faces],[1,faces+1]],
        'For any value on the first die, precisely one of the '+faces+' equally likely second-die outcomes matches. The probability is 1/'+faces+'.',frac);
    }],
    ['Number range outcomes by complement','Easy',(i,j)=>{
      const n=21+4*i+j, excluded=4+j;
      return solved('One integer is chosen uniformly from 1 to '+n+' inclusive. What is the probability that it exceeds '+excluded+'?',[n-excluded,n],[[excluded,n],[n-excluded+1,n],[n-excluded-1,n],[n-excluded,n-1],[n-excluded,n+1]],
        'Exactly '+excluded+' integers fail the test: 1 through '+excluded+'. Therefore '+(n-excluded)+' of the '+n+' possible values meet it, giving '+fraction(n-excluded,n)+'.',frac);
    }]
  ]],
  ['Number System and Number Series',[
    ['Least adjustment to a multiple','Easy',(i,j)=>{
      const d=11+i,m=20+i+j,r=2+j,n=d*m+r;
      return solved('What is the smallest non-negative integer to add to '+n+' to make it divisible by '+d+'?',d-r,[r,d+r,d,d-r+1],
        'There are '+r+' more units than the preceding multiple '+d*m+'. The next multiple is '+d*(m+1)+', so add '+(d-r)+'.');
    }],
    ['Next term of a geometric progression','Easy',(i,j)=>{
      const a=3+i,r=2+j;
      return solved('A geometric progression begins '+a+', '+a*r+', '+a*r*r+', … What is the fourth term?',a*r**3,[a*r*r+r,a*r*r+(a*r*r-a*r),a*r**4,a*(r+1)**3,a*r*r*a],
        'Each term is '+r+' times the previous term. Multiplying '+a*r*r+' by '+r+' gives '+a*r**3+'.');
    }],
    ['Consecutive integers with a given total','Medium',(i,j)=>{
      const count=5+2*j,center=14+5*i+j,min=center-j-2;
      return solved('A block of '+count+' consecutive positive integers has a total of '+center*count+'. What is the smallest integer?',min,[center,center+count,min-1,min+1,center+j+2],
        'The arithmetic mean is '+count*center+' ÷ '+count+' = '+center+'. This is the middle integer, so subtract '+(count-1)/2+' steps to reach the smallest, '+min+'.');
    }],
    ['Chinese remainder by listing one progression','Hard',(i,j)=>{
      const a=5+i,b=(2+i+j)*a+1,rem=1+i%3;
      const answer=b+rem;
      const secondRem=answer%a;
      return solved('What is the least positive integer that leaves remainder '+rem+' on division by '+b+' and remainder '+secondRem+' on division by '+a+'?',answer,[rem,answer+b,answer+a,b,a+b],
        'The first two candidates from division by '+b+' are '+rem+' and '+(b+rem)+'. The first has remainder '+rem%a+' modulo '+a+' and fails the second condition. The second leaves remainder '+secondRem+', so it is the least solution.');
    }]
  ]],
  ['Mixtures and Alligation',[
    ['Concentration after adding pure ingredient','Medium',(i,j)=>{
      const start=20+5*i,ml=1000*(j+1),add=ml/4,target=(start*ml+100*add)/(ml+add);
      return solved('A jug holds '+ml+' mL of a drink that is '+start+'% fruit juice by volume. Add '+add+' mL of pure fruit juice. Assuming volumes add, what percentage is fruit juice now?',target,[start,start+25,start*1.25,100-target,target+2],
        'The original jug contains '+ml*start/100+' mL of fruit juice. Add '+add+' mL to this, and divide by '+(ml+add)+' mL total to obtain '+pct(target)+'.',pct);
    }],
    ['Dilution volume needed for a target concentration','Hard',(i,j)=>{
      const p=32+4*i,q=16+2*i,volume=5+5*j;
      return solved('A vessel holds '+volume+' L of a concentrate at '+p+'%. How many litres of water should be added to reduce it to '+q+'%, assuming volumes add?',volume,[volume/2,2*volume,volume*(1-q/100),volume*q/100,3*volume],
        'The amount of concentrate stays constant while the percentage is halved. The total volume must therefore double from '+volume+' L to '+volume*2+' L. Add '+volume+' L of water.',units('L'));
    }],
    ['Find a missing strength in a two-part blend','Hard',(i,j)=>{
      const a=5+i,b=8+j,bar=40+i;
      const gap=2+j,first=bar-b*gap/2,second=bar+a*gap/2;
      return solved(a+' L of a '+number(first)+'% cordial is blended with '+b+' L of an unknown-strength cordial. The result is '+bar+'% cordial by volume. Assuming volumes add, what is the unknown strength?',second,[bar,first,bar+gap,100-second,second+gap],
        'The '+(a+b)+' L blend contains '+number((a+b)*bar/100)+' L of cordial. The known portion supplies '+number(a*first/100)+' L. The difference must come from the '+b+' L unknown portion, so its strength is '+pct(second)+'.',pct);
    }],
    ['Blend components from a target unit price','Medium',(i,j)=>{
      const low=70+5*i,high=low+30+j*5,total=15+5*j,highKg=total*2/5,target=low+2*(high-low)/5;
      return solved('Mix tea costing '+money(low)+' per kg with tea costing '+money(high)+' per kg to make '+total+' kg of a blend valued at '+money(target)+' per kg. How many kilograms of the more expensive tea are needed?',highKg,[total-highKg,total/2,total,highKg*2,highKg+5],
        'All '+total+' kg at the cheaper rate would cost '+money(total*low)+'. The actual blend is worth '+money(total*target)+', a difference of '+money((target-low)*total)+'. Each kg of dearer tea adds '+money(high-low)+', so use '+highKg+' kg.',units('kg'));
    }]
  ]],
  ['Squares and Cubes',[
    ['Evaluation by difference of squares','Easy',(i,j)=>{
      const x=16+2*i+j,y=2+j;
      return solved('Evaluate '+(x+y)+'² − '+(x-y)+'².',4*x*y,[4*y*y,2*x*y,4*x,2*x+2*y,2*x-2*y],
        'Use a² − b² = (a − b)(a + b). The difference of the bases is '+2*y+' and their sum is '+2*x+', giving '+4*x*y+'.');
    }],
    ['Nearest square by subtraction','Medium',(i,j)=>{
      const root=20+5*i+j,m=root*root+j+2;
      return solved('What is the smallest positive integer to subtract from '+m+' to obtain a perfect square?',j+2,[j+1,j+3,2*root+1,2*root,root],
        'The largest square below '+m+' is '+root+'² = '+root*root+'. The next square is '+(root+1)**2+', which exceeds the given number. Subtract '+root*root+' from '+m+' to get '+(j+2)+'.');
    }],
    ['Minimum factor division to a perfect square','Medium',(i,j)=>{
      const root=5+5*i+j,prime=[2,3,5,7,11][j],product=root*root*prime;
      return solved('What is the least positive integer by which '+product+' must be divided so that the quotient is a perfect square?',prime,[root,gcd(root,prime),prime**2,prime+1,root+prime],
        'The number is '+root+'² × '+prime+'. In any square all prime exponents are even. Dividing by the single extra prime '+prime+' makes every exponent even.');
    }],
    ['Cubes inside a radical quotient','Medium',(i,j)=>{
      const y=3+i,x=3+j;
      return solved('Find the cube root of '+(x*y)**3+' ÷ '+y**3+'. Take the division before the root.',x,[x*y,x**3,y,x+1,x-1],
        'The numerator is ('+x+' × '+y+')³ and the denominator is '+y+'³. The quotient is '+x+'³, so its cube root is '+x+'.');
    }]
  ]],
  ['HCF and LCM',[
    ['Pairing supplies into largest identical kits','Easy',(i,j)=>{
      const kits=10+5*i+j,a=kits*4,b=kits*7,c=kits*9;
      return solved('A centre has '+a+' pencils, '+b+' erasers and '+c+' blank cards. It packs the largest possible number of identical kits with nothing left over. How many kits can it make?',kits,[kits*4,kits*7,kits*9,kits/2,kits+1],
        'The number of kits must divide all three quantities. Each has a factor '+kits+', and the remaining factors 4, 7 and 9 have HCF 1. The maximum number of kits is '+kits+'.');
    }],
    ['Two schedules after a common offset','Medium',(i,j)=>{
      const a=6+2*i,b=9+3*j,offset=4+i+j,solution=offset+lcm(a,b);
      return solved('Two alarms first ring together '+offset+' minutes after noon. Thereafter they ring at intervals of '+a+' and '+b+' minutes. How many minutes after noon do they ring together for the second time?',solution,[lcm(a,b),offset+a+b,offset+gcd(a,b),2*solution,2*offset+lcm(a,b)],
        'The next shared interval is the LCM of '+a+' and '+b+', which is '+lcm(a,b)+' minutes. Add the initial offset '+offset+' minutes to obtain '+solution+' minutes after noon.',units('minutes'));
    }],
    ['HCF from prime factorisation','Easy',(i,j)=>{
      const a=2+i,b=2+j,x=2**a*3**b*5,y=2**(a+1)*3**(b-1)*7,hcf=2**a*3**(b-1);
      return solved('Find the highest common factor of '+x+' and '+y+' using their prime factors.',hcf,[2*hcf,3*hcf,6*hcf,hcf*5,hcf/2],
        'The common prime factors are 2 and 3. The smaller exponents in their factorizations are '+a+' and '+(b-1)+' respectively. Their product 2^'+a+' × 3^'+(b-1)+' is '+hcf+'.');
    }],
    ['Least multiple with a fixed leftover','Medium',(i,j)=>{
      const a=4+i,b=11+j,rem=2+i%2,n=lcm(a,b)+rem;
      return solved('Find the smallest integer greater than '+b+' that leaves remainder '+rem+' when divided by either '+a+' or '+b+'.',n,[lcm(a,b),a+b+rem,rem,gcd(a,b)+rem,n+rem],
        'Subtract the common remainder '+rem+' to get a positive multiple of both divisors. Their LCM is '+lcm(a,b)+'. Restore the remainder to get '+n+'.');
    }]
  ]],
  ['Elementary Mensuration',[
    ['Capacity in litres from cuboid dimensions','Medium',(i,j)=>{
      const w=20+5*i,l=30+10*j,depth=40+5*j,volume=w*l*depth,litres=volume/1000;
      return solved('A rectangular tank has internal dimensions '+l+' cm by '+w+' cm by '+depth+' cm. What is its capacity in litres?',litres,[volume,volume/100,volume/10000,w*depth/1000,l*w/1000],
        'The cuboid volume is '+l+' × '+w+' × '+depth+' = '+volume+' cm³. Divide by 1,000 because 1 litre equals 1,000 cm³.',units('L'));
    }],
    ['Surface area of a cube from volume','Medium',(i,j)=>{
      const s=5+5*i+j,v=s**3;
      return solved('A solid cube has volume '+v+' cm³. What is its total surface area?',6*s*s,[s*s,4*s*s,6*s,6*v,5*s*s],
        'The cube root of '+v+' is '+s+', so each face has area '+s*s+' cm². Multiply by six faces to give '+6*s*s+' cm².',units('cm²'));
    }],
    ['Water depth change from a known added volume','Easy',(i,j)=>{
      const a=20+2*i,b=40+2*j,h=3+i+j,v=a*b*h;
      return solved(v+' cm³ of water is added to a vertical-sided tank with rectangular base '+a+' cm by '+b+' cm. By how many centimetres does the water level rise?',h,[h*2,h/2,v/a,v/b,v/(a+b)],
        'A rise of one centimetre adds '+a*b+' cm³ because the base area is '+a*b+' cm². Divide the added volume by the base area to get '+h+' cm.',units('cm'));
    }],
    ['Curved surface of a right circular cone','Hard',(i,j)=>{
      const radius=3*(2+i),height=4*(2+i)+j,slant=Math.hypot(radius,height),value=round2(radius*slant);
      return solved('A right circular cone has radius '+radius+' cm and vertical height '+height+' cm. Find the coefficient of π in its curved surface area in cm². Round to two decimal places.',value,[radius*height,round2(radius*(radius+height)),radius**2,value+radius**2,2*value],
        'The radius and vertical height are perpendicular. Pythagoras gives slant height √('+radius+'² + '+height+'²). Multiply the slant height by the radius and π to obtain approximately '+number(value)+'π cm².');
    }]
  ]],
  ['Heights and Distances',[
    ['Distance from a 60 degree elevation','Medium',(i,j)=>{
      const result=8+5*i+j,height=result;
      return solved('From a point on level ground, the top of a '+height+' m vertical pole is at an angle of elevation of 60°. What is the horizontal distance to the base? Express it as a multiple of √3 metres.',[result,3],[[result,1],[result*3,1],[result,2],[result,6],[result*2,3]],
        'The tangent of 60° is √3. Use distance = height ÷ √3 = '+result+'/√3 = '+fraction(result,3)+'√3 m.',v=>frac(v)+'√3 m');
    }],
    ['Tower height from two elevation points','Hard',(i,j)=>{
      const base=4+5*i+j;
      return solved('A vertical tower stands on level ground. Two points due east of its base are '+base+' m apart. The elevation to the top is 45° at the nearer point and its tangent is 1/2 at the farther point. Both sight lines start at ground level. Find the tower’s height.',base,[2*base,base/2,3*base,base/4,base+1],
        'With tan 45° = 1, the nearer distance equals the height h. At the farther point the horizontal distance is 2h because the tangent is 1/2. Their difference is h, giving height '+base+' m.',units('m'));
    }],
    ['Height from the length of a slanted sight line','Medium',(i,j)=>{
      const slant=24+2*i+10*j;
      return solved('A straight sight line from ground level to the top of a vertical tree is '+slant+' m long at an elevation of 30°. How high is the tree?',slant/2,[slant,slant/3,slant/4,slant*2,slant/2+2],
        'The sight line is the hypotenuse. Height is the opposite side, so multiply '+slant+' m by sin 30° = 1/2 to get '+slant/2+' m.',units('m'));
    }],
    ['Height difference from a depression angle','Medium',(i,j)=>{
      const distance=14+5*i+j,lower=6+i+2*j,upper=distance+lower;
      return solved('Two vertical posts stand on level ground '+distance+' m apart. The shorter post is '+lower+' m high. From the top of the taller post, the angle of depression to the top of the shorter one is 45°. How high is the taller post?',upper,[distance,lower,distance-lower,upper+lower,upper+distance],
        'The tops differ in height by '+distance+' m because the horizontal run is '+distance+' m and tan 45° = 1. Add the shorter post’s '+lower+' m to get '+upper+' m.',units('m'));
    }]
  ]],
  ['Statistics',[
    ['Mean from a discrete frequency table','Medium',(i,j)=>{
      const value=7+i,f1=2+j,f2=3+i,f3=5+j, data=[value,value+2,value+6], freqs=[f1,f2,f3];
      const sum=data.reduce((total,x,k)=>total+x*freqs[k],0),count=f1+f2+f3;
      return solved('The values '+data.join(', ')+' occur '+freqs.join(', ')+' times respectively. What is the arithmetic mean? Round to two decimal places.',round2(sum/count),[round2((data[0]+data[1]+data[2])/3),round2(sum/3),data[2],data[1],round2(sum/(count+1))],
        'The total is '+data[0]+' × '+f1+' + '+data[1]+' × '+f2+' + '+data[2]+' × '+f3+' = '+sum+'. There are '+count+' observations, so the mean is '+number(round2(sum/count))+'.');
    }],
    ['Median from a discrete frequency table','Medium',(i,j)=>{
      const x=5+i,y=x+3+j,z=y+2,m=z+4,f1=3+i,f2=2+j,f3=f1+f2+1,f4=2;
      return solved('The ordered values '+[x,y,z,m].join(', ')+' occur '+[f1,f2,f3,f4].join(', ')+' times respectively. What is the median?',z,[x,y,m,(z+y)/2,(z+m)/2],
        'The first two values cover '+(f1+f2)+' places. The middle positions of the full '+(f1+f2+f3+f4)+' observations are both inside the next '+f3+' places, all occupied by '+z+'.');
    }],
    ['The additional observation needed for a target mean','Medium',(i,j)=>{
      const count=5+i,old=40+2*j,newMean=old+1+j;
      const value=(count+1)*newMean-count*old;
      return solved('A set of '+count+' observations has mean '+old+'. One observation is added and the mean becomes '+newMean+'. What was the added observation?',value,[newMean,count*(newMean-old),value-(newMean-old),count*newMean-old,value+newMean-old],
        'The original sum is '+count*old+'. The new sum is '+(count+1)+' × '+newMean+' = '+(count+1)*newMean+'. Subtract the sums to isolate the new observation, '+value+'.');
    }],
    ['Mode after a frequency update','Easy',(i,j)=>{
      const x=4+i,values=[x,x+2+j,x+7+j,x+11+j],counts=[3+i,6+i,4+i,2+i],add=5+j;
      return solved('The values '+values.join(', ')+' occur '+counts.join(', ')+' times respectively. Then '+add+' observations of value '+values[2]+' are added. Which value is the mode of the new data?',values[2],[values[0],values[1],values[3]],
        'The added observations make the frequency of '+values[2]+' equal to '+(counts[2]+add)+'. This exceeds every other frequency, so '+values[2]+' is the new mode.');
    }]
  ]],
  ['Exponents and Powers',[
    ['Scientific notation after scaling a decimal','Easy',(i,j)=>{
      const raw=10+i+j/10,e=2+i+j;
      const fmt=([c,k])=>number(c)+' × 10^'+k;
      return solved('Express '+number(raw)+' × 10^'+e+' in standard scientific notation, with a coefficient at least 1 and less than 10.',[raw/10,e+1],[[raw,e],[raw/10,e-1],[raw/100,e+2],[raw/10,e],[raw/100,e+1]],
        'Moving the decimal point one place left divides the coefficient by 10. Increase the exponent by 1 to compensate. The standard form is '+fmt([raw/10,e+1])+'.',fmt);
    }],
    ['Recover an exponent from numerical powers','Medium',(i,j)=>{
      const base=2+i,x=3+j,y=2+i,rhs=base**(x+y);
      return solved('Find x if '+base+'^x × '+base+'^'+y+' = '+rhs+'.',x,[x+y,y,x+1,x-1,x*y],
        'Express '+rhs+' as '+base+'^'+(x+y)+'. The multiplication on the left gives '+base+'^(x + '+y+'). Match the exponents and subtract '+y+' to get x = '+x+'.');
    }],
    ['Missing factor in a product of powers','Medium',(i,j)=>{
      const a=2+i,known=2+j,x=2+i+j,total=known+x,quantity=a**total;
      return solved('Complete the equation '+a+'^'+known+' × ___ = '+quantity+' by choosing the missing numerical factor.',a**x,[a**total,a**(x+1),a**(x-1),a*(x+1),x],
        'Divide the right side by '+a+'^'+known+' = '+a**known+'. Factoring the right side as '+a+'^'+total+' leaves exponent '+x+', so the missing factor is '+a**x+'.');
    }],
    ['Common-base conversion with a reciprocal','Hard',(i,j)=>{
      const a=2+i,b=a**2,x=2+j,y=3+i,exponent=2*x-y;
      return solved('Express '+b+'^'+x+' × (1/'+a+')^'+y+' as a power of base '+a+'.',exponent,[2*x+y, x-y, y-2*x, x*2-y*2,exponent+1,exponent-1],
        'Rewrite '+b+' as '+a+'² and 1/'+a+' as '+a+'⁻¹. The product uses one base, so add the exponents '+2*x+' and −'+y+' to obtain '+exponent+'.',value=>a+'^('+value+')');
    }]
  ]]
];

export function buildNumericalSecond(){
  const fingerprints=new Set();
  return topics.flatMap(([topic,families])=>families.flatMap(([family,difficulty,build])=>
    Array.from({length:variants},(_,index)=>{
      const {prompt,key,wrong,explanation,format}=build(index%5,Math.floor(index/5));
      const fingerprint=norm(prompt);
      if(fingerprints.has(fingerprint))throw Error('Duplicate numerical prompt: '+prompt);
      fingerprints.add(fingerprint);
      const correct=format(key),used=new Set([norm(correct)]);
      const options=wrong.map(format).filter(option=>{
        const tag=norm(option);
        if(used.has(tag))return false;
        used.add(tag);
        return true;
      }).slice(0,3);
      if(options.length!==3)throw Error('Three distinct distractors are required for '+family+' case '+index);
      const answer=(index*3+family.length)%4;
      options.splice(answer,0,correct);
      return {subject:'num',topic,subtopic:family,prompt,options,answer,explanation,difficulty,
        source:notice,classification:'ORIGINAL_AFCAT_STYLE',family,concept:family,style:'Short numerical application'};
    })));
}
