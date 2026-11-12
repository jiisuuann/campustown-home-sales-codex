/* Q1–Q4 deliberately use independent controls and never mutate map selection. */
'use strict';
function initPriceAnalysis(source, {validPrice, townKey}) {
  const el=id=>document.getElementById(id);
  const integer=new Intl.NumberFormat('en-US');
  const dollars=new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0});
  const unitPrice=new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:2,maximumFractionDigits:2});
  const percentage=new Intl.NumberFormat('en-US',{style:'percent',minimumFractionDigits:1,maximumFractionDigits:1});
  const numeric=value=>value!=='' && Number.isFinite(Number(value));
  const eligible=source.filter(validPrice);
  const cities=[...new Set(source.map(townKey))].sort();
  const totals=d3.rollup(source,v=>v.length,townKey);
  const universities=[...new Set(source.map(r=>r.university))].sort();
  const bedrooms=[...new Set(source.filter(r=>numeric(r.beds)&&Number.isInteger(+r.beds)&&+r.beds>=0).map(r=>+r.beds))].sort((a,b)=>a-b);
  const defaults={budget:400000,campus:universities[0],beds:bedrooms.includes(3)?3:bedrooms[0],area:1500};
  const distanceEdges=[0,1,3,5,10,Infinity];
  const distanceLabels=['0–<1 mile','1–<3 miles','3–<5 miles','5–<10 miles','10+ miles'];

  function table(id, data) {
    el(id).replaceChildren(...data.map(({cells,winner=false})=>{
      const tr=document.createElement('tr');
      if(winner)tr.className='winner';
      cells.forEach((value,index)=>{const isHeader=index===(id==='q2-rows'?0:1);const cell=document.createElement(isHeader?'th':'td');if(isHeader)cell.scope='row';cell.textContent=value;tr.append(cell);});
      return tr;
    }));
  }
  // Competition ranks retain ties; alphabetical ordering is only a display tie-break.
  function rank(data, ascending=true) {
    data.sort((a,b)=>(a.value===null)-(b.value===null) || (a.value!==null&&b.value!==null?(ascending?a.value-b.value:b.value-a.value):0) || a.city.localeCompare(b.city));
    data.forEach((d,i)=>{d.rank=d.value===null?null:(i&&d.value===data[i-1].value?data[i-1].rank:i+1);});
    return data;
  }
  function cityMedians(filtered, value) {
    const grouped=d3.group(filtered,townKey);
    return rank(cities.map(city=>{const sales=grouped.get(city)||[];return {city,n:sales.length,value:sales.length?d3.median(sales,value):null};}));
  }
  function summary(id,data,format,suffix) {
    const winners=data.filter(d=>d.rank===1);
    el(id).textContent=winners.length
      ? `${winners.length>1?'Tied lowest: ':'Lowest median: '}${winners.map(d=>d.city).join(' · ')} — ${format(winners[0].value)}${suffix}.`
      : 'No eligible sales meet this requirement. Try a different selection.';
  }
  function medianTable(id,data,format) {
    table(id,data.map(d=>({winner:d.rank===1,cells:[d.rank??'—',d.city,d.value===null?'No eligible sales':format(d.value),integer.format(d.n)]})));
  }
  function validInput(id,answer,tableId) {
    if(el(id).value!==''&&el(id).checkValidity()&&Number.isFinite(+el(id).value))return true;
    el(answer).textContent='Enter a valid nonnegative whole number to see results.';
    el(tableId).replaceChildren();
    return false;
  }
  function renderBudget() {
    if(!validInput('budget-input','q1-answer','q1-rows')){el('q1-note').textContent='';el('budget-output').textContent='—';return;}
    const budget=+el('budget-input').value;
    el('budget-output').textContent=dollars.format(budget);
    // An exact input above the slider range is retained; the slider stays at its endpoint.
    el('budget-slider').value=Math.min(budget,2000000);
    const qualified=d3.rollup(eligible.filter(r=>+r.sale_price<=budget),v=>v.length,townKey);
    const ranked=rank(cities.map(city=>({city,value:qualified.get(city)||0})),false);
    const winners=ranked.filter(d=>d.rank===1 && d.value>0);
    el('q1-answer').textContent=winners.length
      ? `${winners.length>1?'Tied most qualifying sales: ':'Most qualifying sales: '}${winners.map(d=>d.city).join(' · ')} — ${integer.format(winners[0].value)} sales at or below ${dollars.format(budget)}.`
      : 'No eligible sales fall within this budget. Increase the budget to compare cities.';
    el('q1-note').textContent=`All ${integer.format(source.length)} recorded sales form the percentage denominators. ${integer.format(source.length-eligible.length)} sales are excluded from qualifying counts by the price rule. Ties share a rank; zero-count cities remain visible.`;
    table('q1-rows',ranked.map(d=>({winner:d.rank===1&&d.value>0,cells:[d.value?d.rank:'—',d.city,integer.format(d.value),percentage.format(d.value/totals.get(d.city)),integer.format(totals.get(d.city))]})));
  }
  function renderDistance() {
    const campus=el('distance-campus').value;
    const campusSales=source.filter(r=>r.university===campus);
    const included=campusSales.filter(r=>validPrice(r)&&numeric(r.miles_to_campus)&&+r.miles_to_campus>=0);
    const data=distanceLabels.map((label,i)=>{
      const band=included.filter(r=>+r.miles_to_campus>=distanceEdges[i]&&+r.miles_to_campus<distanceEdges[i+1]);
      return {label,n:band.length,value:band.length?d3.median(band,r=>+r.sale_price):null};
    });
    const medians=data.filter(d=>d.value!==null).map(d=>d.value);
    el('q2-answer').textContent=medians.length
      ? `${campus}: band medians range from ${dollars.format(d3.min(medians))} to ${dollars.format(d3.max(medians))}.`
      : `${campus}: no eligible sales with reported distance.`;
    el('q2-note').textContent=`${integer.format(included.length)} eligible sales; ${integer.format(campusSales.length-included.length)} excluded for price or missing/invalid distance. Empty bands have no median, not a zero price. These groups describe recorded sales, not a causal effect of distance.`;
    table('q2-rows',data.map(d=>({cells:[d.label,d.value===null?'No eligible sales':dollars.format(d.value),integer.format(d.n)]})));
    const width=900,height=330,left=130,right=180;
    const svg=d3.select('#distance-chart').selectAll('svg').data([null]).join('svg').attr('viewBox',`0 0 ${width} ${height}`).attr('role','img').attr('aria-label',`Median sale price by distance for ${campus}. Exact medians and counts follow in the table.`);
    svg.selectAll('*').remove();
    const x=d3.scaleLinear().domain([0,d3.max(medians)||1]).nice().range([left,width-right]);
    x.ticks(4).forEach(tick=>{
      svg.append('line').attr('class','chart-grid').attr('x1',x(tick)).attr('x2',x(tick)).attr('y1',20).attr('y2',280);
      svg.append('text').attr('class','chart-label').attr('x',x(tick)).attr('y',310).attr('text-anchor','middle').text(dollars.format(tick));
    });
    data.forEach((d,i)=>{
      const y=30+i*50;
      svg.append('text').attr('class','chart-label').attr('x',left-12).attr('y',y+20).attr('text-anchor','end').text(d.label);
      if(d.value!==null)svg.append('rect').attr('class','price-bar').attr('x',left).attr('y',y).attr('height',30).attr('width',x(d.value)-left).attr('rx',3).append('title').text(`${d.label}: ${dollars.format(d.value)}, ${integer.format(d.n)} eligible sales`);
      svg.append('text').attr('class','chart-value').attr('x',(d.value===null?left:x(d.value))+8).attr('y',y+20).text(d.value===null?'No eligible sales':dollars.format(d.value));
    });
  }
  function renderBedrooms() {
    const beds=+el('bedroom-count').value;
    const matching=source.filter(r=>numeric(r.beds)&&+r.beds===beds);
    const included=matching.filter(validPrice);
    const data=cityMedians(included,r=>+r.sale_price);
    summary('q3-answer',data,v=>dollars.format(v),` for exactly ${beds} bedrooms`);
    el('q3-note').textContent=`${integer.format(included.length)} eligible sales with exactly ${beds} bedrooms; ${integer.format(matching.length-included.length)} matching sales excluded by the price rule. No minimum sample size; small groups can produce unstable rankings. Ties use unrounded medians.`;
    medianTable('q3-rows',data,v=>dollars.format(v));
  }
  function renderArea() {
    if(!validInput('minimum-area','q4-answer','q4-rows')){el('q4-note').textContent='';return;}
    const minimum=+el('minimum-area').value;
    const withArea=eligible.filter(r=>numeric(r.living_area_sqft)&&+r.living_area_sqft>0);
    const included=withArea.filter(r=>+r.living_area_sqft>=minimum);
    const data=cityMedians(included,r=>+r.sale_price/+r.living_area_sqft);
    summary('q4-answer',data,v=>unitPrice.format(v),` / sq ft for homes of at least ${integer.format(minimum)} sq ft`);
    el('q4-note').textContent=`${integer.format(included.length)} eligible sales. Price rule excludes ${integer.format(source.length-eligible.length)} records; another ${integer.format(eligible.length-withArea.length)} lack a positive living area; ${integer.format(withArea.length-included.length)} fall below your minimum. Medians display two decimals; ranks and ties use unrounded values.`;
    medianTable('q4-rows',data,v=>unitPrice.format(v));
  }
  el('distance-campus').replaceChildren(...universities.map(c=>new Option(c,c)));
  el('bedroom-count').replaceChildren(...bedrooms.map(b=>new Option(`${b} bedrooms`,b)));
  el('distance-campus').value=defaults.campus;
  el('bedroom-count').value=defaults.beds;
  el('budget-input').value=defaults.budget;
  el('minimum-area').value=defaults.area;
  el('budget-slider').oninput=()=>{el('budget-input').value=el('budget-slider').value;renderBudget();};
  el('budget-input').oninput=renderBudget;
  el('distance-campus').onchange=renderDistance;
  el('bedroom-count').onchange=renderBedrooms;
  el('minimum-area').oninput=renderArea;
  el('budget-reset').onclick=()=>{el('budget-input').value=defaults.budget;renderBudget();};
  el('distance-reset').onclick=()=>{el('distance-campus').value=defaults.campus;renderDistance();};
  el('bedroom-reset').onclick=()=>{el('bedroom-count').value=defaults.beds;renderBedrooms();};
  el('area-reset').onclick=()=>{el('minimum-area').value=defaults.area;renderArea();};
  renderBudget();renderDistance();renderBedrooms();renderArea();
  document.querySelectorAll('#q1 .question-controls, #q2 .question-controls, #q3 .question-controls, #q4 .question-controls').forEach(control=>control.disabled=false);
}
