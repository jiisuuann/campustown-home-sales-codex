/* Q5–Q9: independent views of the original transactions, never map-filtered. */
'use strict';
function initMarketAnalysis(source,{validPrice,townKey}) {
  const el=id=>document.getElementById(id);
  const money=new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0});
  const count=new Intl.NumberFormat('en-US');
  const numeric=v=>v!==''&&Number.isFinite(Number(v));
  const sample=n=>n===0?'No sales':n<10?'Small sample':'—';
  const median=rs=>rs.length?d3.median(rs,r=>+r.sale_price):null;
  const price=v=>v===null?'No eligible sales':money.format(v);
  const cities=[...new Set(source.map(townKey))].sort();
  const dateOf=r=>{
    if(!/^\d{4}-\d{2}-\d{2}$/.test(r.sale_date))return null;
    const date=new Date(`${r.sale_date}T00:00:00Z`);
    return Number.isFinite(+date)&&date.toISOString().slice(0,10)===r.sale_date?date:null;
  };
  const dates=new Map(source.map(r=>[r.listing_id,dateOf(r)]));
  const yearOf=r=>dates.get(r.listing_id)?.getUTCFullYear();
  const years=[...new Set(source.filter(r=>dates.get(r.listing_id)).map(yearOf))].sort((a,b)=>a-b);
  const monthNames=Array.from({length:12},(_,m)=>new Intl.DateTimeFormat('en-US',{month:'long',timeZone:'UTC'}).format(new Date(Date.UTC(2000,m,1))));
  const cityRows=id=>source.filter(r=>!el(id).value||townKey(r)===el(id).value);
  const moneyDifference=v=>`${v>0?'+':v<0?'−':''}${money.format(Math.abs(v))}`;
  function table(q,data) {
    el(`q${q}-rows`).replaceChildren(...data.map(({cells,winner=false})=>{
      const tr=document.createElement('tr');if(winner)tr.className='winner';
      cells.forEach((v,i)=>{const cell=document.createElement(i===0?'th':'td');if(i===0)cell.scope='row';cell.textContent=v;tr.append(cell);});return tr;
    }));
  }
  function chart(q,data,format) {
    const width=900,left=145,right=165,height=Math.max(180,data.length*42+65);
    const svg=d3.select(`#q${q}-chart`).selectAll('svg').data([null]).join('svg').attr('viewBox',`0 0 ${width} ${height}`).attr('role','img').attr('aria-label',`${el(`q${q}-title`).textContent} Exact values and counts follow in the table.`);
    svg.selectAll('*').remove();
    const x=d3.scaleLinear().domain([0,d3.max(data,d=>d.value)||1]).nice().range([left,width-right]);
    x.ticks(4).filter(t=>q!==9||Number.isInteger(t)).forEach(t=>{
      svg.append('line').attr('class','chart-grid').attr('x1',x(t)).attr('x2',x(t)).attr('y1',12).attr('y2',height-40);
      svg.append('text').attr('class','chart-label').attr('x',x(t)).attr('y',height-15).attr('text-anchor','middle').text(format(t));
    });
    data.forEach((d,i)=>{
      const y=20+42*i;
      svg.append('text').attr('class','chart-label').attr('x',left-12).attr('y',y+18).attr('text-anchor','end').text(d.label);
      if(d.value!==null)svg.append('rect').attr('class','price-bar').attr('x',left).attr('y',y).attr('width',x(d.value)-left).attr('height',27).attr('rx',3).append('title').text(`${d.label}: ${format(d.value)}; ${count.format(d.n)} sales`);
      svg.append('text').attr('class','chart-value').attr('x',(d.value===null?left:x(d.value))+8).attr('y',y+18).text(d.value===null?'No eligible sales':format(d.value));
    });
  }
  function range(q) {
    const lower=el(`q${q}-min`),upper=el(`q${q}-max`);
    const low=+lower.value,high=upper.value===''?Infinity:+upper.value;
    if(lower.value!==''&&lower.checkValidity()&&upper.checkValidity()&&Number.isFinite(low)&&(upper.value===''||Number.isFinite(high))&&low<=high)return [low,high];
    el(`q${q}-answer`).textContent='Enter nonnegative whole-number bounds with minimum ≤ maximum. Leave maximum blank for no limit.';
    el(`q${q}-note`).textContent='';el(`q${q}-rows`).replaceChildren();el(`q${q}-chart`)?.replaceChildren();return null;
  }
  function coverage(rs) {
    const ordered=rs.filter(r=>dates.get(r.listing_id)).map(r=>r.sale_date).sort();
    return ordered.length?`Recorded closing dates: ${ordered[0]} to ${ordered.at(-1)}. Coverage can be partial; absent sales do not establish complete market coverage.`:'No valid closing dates in this selection.';
  }
  function render5() {
    const all=cityRows('q5-city'),dated=all.filter(r=>dates.get(r.listing_id)),eligible=dated.filter(validPrice);
    const quarterly=el('q5-period').value==='quarter';
    const key=r=>yearOf(r)*(quarterly?4:1)+(quarterly?Math.floor(dates.get(r.listing_id).getUTCMonth()/3):0);
    const keys=dated.map(key),groups=d3.group(eligible,key);
    const data=keys.length?d3.range(d3.min(keys),d3.max(keys)+1).map(k=>{
      const rs=groups.get(k)||[];return {label:quarterly?`${Math.floor(k/4)} Q${k%4+1}`:String(k),value:median(rs),n:rs.length};
    }):[];
    const observed=data.filter(d=>d.value!==null),first=observed[0],last=observed.at(-1);
    el('q5-answer').textContent=observed.length>1?`${el('q5-city').value}: ${price(first.value)} in ${first.label} → ${price(last.value)} in ${last.label}; change ${moneyDifference(last.value-first.value)} (${((last.value/first.value-1)*100).toFixed(1)}%).`:observed.length?`${first.label}: median ${price(first.value)} across ${count.format(first.n)} sales; no second period to compare.`:'No eligible dated sales for this city.';
    el('q5-note').textContent=`${coverage(all)} ${count.format(all.length-dated.length)} missing/invalid dates excluded; another ${count.format(dated.length-eligible.length)} dated sales excluded by the $1,000 price floor. Different homes sold in each period; this is not a repeat-sales appreciation index. Small samples and partial periods can distort changes.`;
    table(5,data.map((d,i)=>({cells:[d.label,price(d.value),count.format(d.n),i&&d.value!==null&&data[i-1].value!==null?moneyDifference(d.value-data[i-1].value):'—',sample(d.n)]})));
    chart(5,data,v=>money.format(v));
  }
  function render6() {
    const bounds=range(6);if(!bounds)return;
    const all=cityRows('q6-city'),eligible=all.filter(validPrice),rs=eligible.filter(r=>+r.sale_price>=bounds[0]&&+r.sale_price<=bounds[1]);
    const med=median(rs),mean=rs.length?d3.mean(rs,r=>+r.sale_price):null,difference=mean===null?null:Math.abs(mean-med);
    el('q6-answer').textContent=rs.length?`Mean ${price(mean)} · median ${price(med)} · absolute difference ${price(difference)} across ${count.format(rs.length)} sales${rs.length<10?' (small sample)':''}.`:'No eligible sales meet this city and price range.';
    table(6,[{cells:[price(mean),price(med),price(difference),count.format(rs.length),sample(rs.length)]}]);
    el('q6-note').textContent=`${count.format(all.length-eligible.length)} excluded by the $1,000 price floor; ${count.format(eligible.length-rs.length)} further excluded by your inclusive price range. Blank maximum retains all high-price outliers, which can strongly affect the mean. No upper cutoff is applied unless you set one. Differences use unrounded statistics.`;
  }
  function render7() {
    const all=cityRows('q7-city'),rs=all.filter(validPrice),feature=el('q7-feature').value;
    const data=['1','0','unknown'].map((value,i)=>{
      const group=rs.filter(r=>value==='unknown'?!['0','1'].includes(r[feature]):r[feature]===value);
      return {label:['With','Without','Not reported'][i],value:median(group),n:group.length};
    });
    const [yes,no,unknown]=data;
    el('q7-answer').textContent=yes.value!==null&&no.value!==null?`${el('q7-feature').selectedOptions[0].text}: with ${price(yes.value)} vs without ${price(no.value)}; median difference (with − without) ${moneyDifference(yes.value-no.value)}.`:'A with/without difference is unavailable: one or both groups have no eligible sales.';
    el('q7-note').textContent=`${count.format(all.length-rs.length)} excluded by the price floor. ${count.format(unknown.n)} eligible sales have no valid reported feature flag and remain separate from “Without”. This is an unadjusted comparison across different homes, not the value added by installing a feature. Groups below 10 sales are flagged in the table.`;
    table(7,data.map(d=>({cells:[d.label,price(d.value),count.format(d.n),sample(d.n)]})));chart(7,data,v=>money.format(v));
  }
  function render8() {
    const bounds=range(8);if(!bounds)return;
    const eligible=source.filter(validPrice),area=eligible.filter(r=>numeric(r.living_area_sqft)&&+r.living_area_sqft>0),within=area.filter(r=>+r.living_area_sqft>=bounds[0]&&+r.living_area_sqft<=bounds[1]);
    const rs=within.filter(r=>numeric(r.year_built)&&Number.isInteger(+r.year_built)&&+r.year_built>0);
    const edges=[0,1940,1960,1980,2000,2020,Infinity],labels=['Before 1940','1940–1959','1960–1979','1980–1999','2000–2019','2020+'];
    const data=labels.map((label,i)=>{const group=rs.filter(r=>+r.year_built>=edges[i]&&+r.year_built<edges[i+1]);return {label,value:median(group),n:group.length};});
    const observed=data.filter(d=>d.value!==null),low=d3.min(observed,d=>d.value),high=d3.max(observed,d=>d.value);
    el('q8-answer').textContent=observed.length?`Across ${count.format(rs.length)} eligible sales, group medians range from ${price(low)} (${observed.filter(d=>d.value===low).map(d=>d.label).join(', ')}) to ${price(high)} (${observed.filter(d=>d.value===high).map(d=>d.label).join(', ')}).`:'No eligible sales meet this living-area range with a reported construction year.';
    el('q8-note').textContent=`All towns. Exclusions: ${count.format(source.length-eligible.length)} by price; ${count.format(eligible.length-area.length)} missing/nonpositive area; ${count.format(area.length-within.length)} outside your area range; ${count.format(within.length-rs.length)} missing/invalid construction year. Geography and other home characteristics differ across groups; price differences do not isolate building age.`;
    table(8,data.map(d=>({cells:[d.label,price(d.value),count.format(d.n),sample(d.n)]})));chart(8,data,v=>money.format(v));
  }
  function render9() {
    const all=cityRows('q9-city'),dated=all.filter(r=>dates.get(r.listing_id)),year=+el('q9-year').value,rs=dated.filter(r=>yearOf(r)===year);
    const data=monthNames.map((label,m)=>{const n=rs.filter(r=>dates.get(r.listing_id).getUTCMonth()===m).length;return {label,value:n,n};});
    const highest=d3.max(data,d=>d.n),leaders=data.filter(d=>d.n===highest);
    el('q9-answer').textContent=highest?`${leaders.length>1?'Tied busiest months':'Busiest month'}: ${leaders.map(d=>d.label).join(', ')} ${year} — ${count.format(highest)} recorded sales${highest<10?' (small sample)':''}. ${count.format(rs.length)} sales recorded in the selected year.`:`No sales recorded for ${el('q9-city').value} in ${year}; no busiest month.`;
    el('q9-note').textContent=`${coverage(all)} ${count.format(all.length-dated.length)} city sales with missing/invalid closing dates cannot be assigned to any year or month. Counts include all prices. ${year} may be a partial year; zero months are not evidence of seasonality or complete reporting.`;
    table(9,data.map(d=>({winner:highest>0&&d.n===highest,cells:[d.label,count.format(d.n),sample(d.n)]})));chart(9,data,v=>count.format(v));
  }
  [5,6,7,9].forEach(q=>el(`q${q}-city`).replaceChildren(...((q===6||q===7)?[new Option('All towns','')]:[]),...cities.map(c=>new Option(c,c))));
  el('q9-year').replaceChildren(...years.map(y=>new Option(y,y)));
  const defaults={5:{'q5-city':cities[0],'q5-period':'year'},6:{'q6-city':'','q6-min':'1000','q6-max':''},7:{'q7-city':'','q7-feature':'has_garage'},8:{'q8-min':'1500','q8-max':'2500'},9:{'q9-city':cities[0],'q9-year':years.at(-1)}};
  const renders={5:render5,6:render6,7:render7,8:render8,9:render9};
  Object.keys(defaults).forEach(q=>{
    const reset=()=>{Object.entries(defaults[q]).forEach(([id,value])=>el(id).value=value);renders[q]();};
    Object.keys(defaults[q]).forEach(id=>el(id).addEventListener(el(id).tagName==='SELECT'?'change':'input',renders[q]));
    el(`q${q}-reset`).onclick=reset;reset();el(`q${q}`).querySelector('fieldset').disabled=false;
  });
}
