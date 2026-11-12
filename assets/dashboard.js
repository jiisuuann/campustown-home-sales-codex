/* Static dashboard: one selection state drives map, controls, cards and chart. */
'use strict';
const $ = id => document.getElementById(id);
const count = new Intl.NumberFormat('en-US');
const money = new Intl.NumberFormat('en-US', {style:'currency', currency:'USD', maximumFractionDigits:0});
const selection = {campus:'', city:''};
const townKey = row => `${row.city}, ${row.state}`;
const validPrice = row => row.sale_price !== '' && Number.isFinite(Number(row.sale_price)) && Number(row.sale_price) >= 1000;
const bands = [1000,250000,500000,750000,1000000,1500000,2000000,Infinity];
const bandLabels = ['$1k–<250k','$250k–<500k','$500k–<750k','$750k–<1m','$1m–<1.5m','$1.5m–<2m','$2m+'];
let rows=[], towns=[], map, zoom, markers;
function selectedRows() {
  return rows.filter(r => (!selection.campus || r.university === selection.campus) && (!selection.city || townKey(r) === selection.city));
}
function selectTown(town) {
  selection.city=town.key;
  // The official data currently assigns one campus per town. Derive, never hardcode.
  selection.campus=town.campuses.length === 1 ? town.campuses[0] : '';
  render();
}
function drawMap(topology) {
  const features=topojson.feature(topology,topology.objects.states);
  const projection=d3.geoAlbersUsa().fitExtent([[25,30],[935,525]],features);
  map=d3.select('#map');
  const layer=map.append('g');
  layer.selectAll('path').data(features.features).join('path').attr('class','state').attr('d',d3.geoPath(projection));
  markers=layer.selectAll('circle').data(towns).join('circle')
    .attr('class','marker').attr('cx',t=>projection(t.coordinates)[0]).attr('cy',t=>projection(t.coordinates)[1])
    .attr('r',6).attr('tabindex',0).attr('role','button').attr('aria-label',t=>`Select ${t.key}`)
    .on('click',(event,t)=>{event.stopPropagation();selectTown(t);})
    .on('keydown',(event,t)=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();selectTown(t);}})
    .on('mouseenter focus',(event,t)=>{$('map-tooltip').textContent=t.key;})
    .on('mouseleave blur',()=>{$('map-tooltip').textContent='';});
  markers.append('title').text(t=>t.key);
  zoom=d3.zoom().scaleExtent([1,24]).on('zoom',event=>{
    layer.attr('transform',event.transform);
    markers.attr('r',Math.max(6,5*960/$('map').clientWidth)/event.transform.k);
  });
  map.call(zoom).on('dblclick.zoom',null);
  new ResizeObserver(()=>markers.attr('r',Math.max(6,5*960/$('map').clientWidth)/d3.zoomTransform(map.node()).k)).observe($('map'));
  $('zoom-in').onclick=()=>map.transition().duration(200).call(zoom.scaleBy,2);
  $('zoom-out').onclick=()=>map.transition().duration(200).call(zoom.scaleBy,.5);
  $('map-reset').onclick=()=>map.transition().duration(250).call(zoom.transform,d3.zoomIdentity);
}
function drawDistribution(prices) {
  const values=bandLabels.map((label,i)=>({label,n:prices.filter(p=>p>=bands[i]&&p<bands[i+1]).length}));
  const width=1000,height=300,margin={left:55,right:15,top:35,bottom:45};
  const svg=d3.select('#distribution').selectAll('svg').data([null]).join('svg').attr('viewBox',`0 0 ${width} ${height}`).attr('role','img').attr('aria-label','Number of completed sales by price band; exact counts are in the chart data table.');
  svg.selectAll('*').remove();
  const x=d3.scaleBand().domain(bandLabels).range([margin.left,width-margin.right]).padding(.3);
  const y=d3.scaleLinear().domain([0,d3.max(values,d=>d.n)||1]).nice().range([height-margin.bottom,margin.top]);
  for(const tick of y.ticks(4)) {
    svg.append('line').attr('class','chart-grid').attr('x1',margin.left).attr('x2',width-margin.right).attr('y1',y(tick)).attr('y2',y(tick));
    svg.append('text').attr('class','chart-label').attr('x',margin.left-10).attr('y',y(tick)+4).attr('text-anchor','end').text(count.format(tick));
  }
  values.forEach(d=>{
    svg.append('rect').attr('class','price-bar').attr('x',x(d.label)).attr('y',y(d.n)).attr('width',x.bandwidth()).attr('height',y(0)-y(d.n)).attr('rx',3).append('title').text(`${d.label}: ${count.format(d.n)} sales`);
    svg.append('text').attr('class','chart-value').attr('text-anchor','middle').attr('x',x(d.label)+x.bandwidth()/2).attr('y',y(d.n)-9).text(count.format(d.n));
    svg.append('text').attr('class','chart-label').attr('text-anchor','middle').attr('x',x(d.label)+x.bandwidth()/2).attr('y',height-18).text(d.label);
  });
  $('chart-table').replaceChildren(...values.map(d=>{const tr=document.createElement('tr');[d.label,count.format(d.n)].forEach(v=>{const td=document.createElement('td');td.textContent=v;tr.append(td);});return tr;}));
}
function render() {
  $('campus').value=selection.campus;
  const available=towns.filter(t=>!selection.campus||t.campuses.includes(selection.campus));
  $('city').replaceChildren(new Option('All towns in campus area',''),...available.map(t=>new Option(t.key,t.key)));
  if(!selection.campus) $('city').options[0].text='All towns';
  $('city').value=selection.city;
  const selected=selectedRows(),prices=selected.filter(validPrice).map(r=>Number(r.sale_price));
  const active=new Set(selected.map(townKey));
  const label=selection.city||selection.campus||'All campus areas';
  $('selection-label').textContent=label;
  $('lens').textContent=selection.city||selection.campus||'The full collection';
  $('sales').textContent=count.format(selected.length);
  $('median').textContent=prices.length?money.format(d3.median(prices)):'No eligible sales';
  $('price-count').textContent=`${count.format(prices.length)} eligible sales · ≥ $1,000`;
  $('town-count').textContent=count.format(active.size);
  const campusCount=new Set(selected.map(r=>r.university)).size;
  $('campus-count').textContent=`Across ${campusCount} campus ${campusCount===1?'area':'areas'}`;
  $('chart-subtitle').textContent=`${label} · completed sales by price band`;
  $('chart-note').textContent=`${count.format(prices.length)} sales shown; ${count.format(selected.length-prices.length)} excluded from price summaries. Bands include their lower bound and exclude their upper bound. Unequal band widths; bar height shows counts, not density. No upper price cutoff.`;
  markers.classed('dimmed',t=>!active.has(t.key)).classed('chosen',t=>Boolean(selection.campus||selection.city)&&active.has(t.key)).attr('aria-pressed',t=>String(active.has(t.key)));
  $('town-list-title').textContent=selection.campus?'TOWNS IN CAMPUS AREA':'TOWNS IN THE COLLECTION';
  $('town-list').replaceChildren(...available.map(t=>{
    const b=document.createElement('button');b.className='town-button';b.setAttribute('aria-pressed',String(selection.city===t.key));
    b.append(document.createTextNode(t.city));const s=document.createElement('span');s.textContent=t.state;b.append(s);b.onclick=()=>selectTown(t);return b;
  }));
  drawDistribution(prices);
}
async function init() {
  try {
    const [csvResponse,mapResponse]=await Promise.all([fetch('data/college_town_home_sales.csv'),fetch('assets/us-states.json')]);
    if(!csvResponse.ok||!mapResponse.ok) throw new Error('Data or map file could not be loaded.');
    rows=d3.csvParse(await csvResponse.text()); // All fields remain text, including ZIP, FIPS and parcel IDs.
    if(!rows.length||rows.some(r=>!r.listing_id)||new Set(rows.map(r=>r.listing_id)).size!==rows.length) throw new Error('Transaction IDs are missing or duplicated. Please check the dataset.');
    towns=Array.from(d3.group(rows,townKey),([key,sales])=>{
      const lat=d3.median(sales,r=>Number(r.latitude)),lon=d3.median(sales,r=>Number(r.longitude));
      const representative=d3.least(sales,r=>(Number(r.latitude)-lat)**2+(Number(r.longitude)-lon)**2);
      return {key,city:sales[0].city,state:sales[0].state,campuses:[...new Set(sales.map(r=>r.university))],coordinates:[Number(representative.longitude),Number(representative.latitude)]};
    }).sort((a,b)=>a.key.localeCompare(b.key));
    $('campus').append(...[...new Set(rows.map(r=>r.university))].sort().map(c=>new Option(c,c)));
    drawMap(await mapResponse.json());
    $('campus').onchange=()=>{selection.campus=$('campus').value;selection.city='';render();};
    $('city').onchange=()=>{const town=towns.find(t=>t.key===$('city').value);if(town)selectTown(town);else{selection.city='';render();}};
    $('reset').onclick=()=>{selection.campus='';selection.city='';render();map.call(zoom.transform,d3.zoomIdentity);};
    render();
    ['campus','city','reset'].forEach(id=>$(id).disabled=false);
    $('status').textContent='';
  } catch(error) {
    $('status').textContent=`Unable to load dashboard: ${error.message} Reload the page to retry.`;
    $('status').setAttribute('role','alert');
    console.error(error);
  }
}
init();
