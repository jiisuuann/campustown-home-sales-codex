"""Independent CSV/statistics reference for Q5–Q9; JSON stdout, no data edits."""
import csv, json, statistics, datetime
from collections import defaultdict
with open('data/college_town_home_sales.csv', newline='') as f:
    rows=list(csv.DictReader(f))
city=lambda r:f"{r['city']}, {r['state']}"
valid=lambda r:bool(r['sale_price']) and float(r['sale_price'])>=1000

def date(r):
    try:return datetime.date.fromisoformat(r['sale_date'])
    except ValueError:return None

def stats(rs):
    prices=[float(r['sale_price']) for r in rs]
    return {'n':len(rs),'median':statistics.median(prices) if prices else None}

result={str(q):[] for q in range(5,10)}
for town in ['Ann Arbor, MI','Pittsboro, NC','Gainesville, FL']:
    all=[r for r in rows if city(r)==town]
    for period in ['year','quarter']:
        key=lambda r:date(r).year*(4 if period=='quarter' else 1)+((date(r).month-1)//3 if period=='quarter' else 0)
        dated=[r for r in all if date(r)]
        keys=[key(r) for r in dated]
        values=[stats([r for r in dated if key(r)==k and valid(r)]) for k in range(min(keys),max(keys)+1)]
        result['5'].append({'city':town,'period':period,'values':values})
    for year in [2023,2025,2026]:
        counts=[sum(bool(date(r)) and date(r).year==year and date(r).month==m for r in all) for m in range(1,13)]
        result['9'].append({'city':town,'year':year,'values':counts})
for town,minimum,maximum in [('',1000,None),('',1000,500000),('Gainesville, FL',1000,None),('Pittsboro, NC',1000,1001)]:
    rs=[r for r in rows if (not town or city(r)==town) and valid(r) and float(r['sale_price'])>=minimum and (maximum is None or float(r['sale_price'])<=maximum)]
    s=stats(rs);s['mean']=statistics.mean(float(r['sale_price']) for r in rs) if rs else None;s['difference']=abs(s['mean']-s['median']) if rs else None
    result['6'].append({'city':town,'min':minimum,'max':maximum,'values':s})
for town in ['', 'State College, PA']:
    for feature in ['has_garage','has_basement','has_fireplace']:
        rs=[r for r in rows if (not town or city(r)==town) and valid(r)]
        values=[stats([r for r in rs if (r[feature]==flag if flag!='unknown' else r[feature] not in ['0','1'])]) for flag in ['1','0','unknown']]
        result['7'].append({'city':town,'feature':feature,'values':values})
for minimum,maximum in [(0,None),(1500,2500),(3000,4000),(1000000000,None)]:
    rs=[r for r in rows if valid(r) and r['living_area_sqft'] and float(r['living_area_sqft'])>0 and minimum<=float(r['living_area_sqft']) and (maximum is None or float(r['living_area_sqft'])<=maximum) and r['year_built'] and int(r['year_built'])>0]
    edges=[0,1940,1960,1980,2000,2020,float('inf')]
    result['8'].append({'min':minimum,'max':maximum,'values':[stats([r for r in rs if edges[i]<=int(r['year_built'])<edges[i+1]]) for i in range(6)]})
print(json.dumps(result))
