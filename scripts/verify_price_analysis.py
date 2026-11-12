"""Independent Phase 2 reference calculations. Run from repository root.

Prints JSON to stdout; redirect to work/ for local browser comparisons.
Reads the official CSV as text and never modifies it. Python statistics is
independent of the dashboard's D3 calculations.
"""
import csv
import json
import statistics
from collections import defaultdict

with open('data/college_town_home_sales.csv', newline='') as handle:
    rows = list(csv.DictReader(handle))
assert len({r['listing_id'] for r in rows}) == len(rows)
city = lambda r: f"{r['city']}, {r['state']}"
cities = sorted({city(r) for r in rows})
totals = {c: sum(city(r) == c for r in rows) for c in cities}
prices = [r for r in rows if r['sale_price'] and float(r['sale_price']) >= 1000]


def ranked_medians(records, value):
    groups = defaultdict(list)
    for row in records:
        groups[city(row)].append(value(row))
    result = [dict(city=c, n=len(groups[c]), value=statistics.median(groups[c]) if groups[c] else None) for c in cities]
    return sorted(result, key=lambda d: (d['value'] is None, d['value'] or 0, d['city']))


reference = {'budget': {}, 'bedrooms': {}, 'area': {}, 'distance': {}}
for budget in [0, 400000, 1000000, 100000000]:
    counts = {c: sum(city(r) == c and float(r['sale_price']) <= budget for r in prices) for c in cities}
    reference['budget'][budget] = sorted([dict(city=c, n=counts[c], total=totals[c], percent=100*counts[c]/totals[c]) for c in cities], key=lambda d: (-d['n'], d['city']))
for beds in sorted({int(r['beds']) for r in rows if r['beds']}):
    reference['bedrooms'][beds] = ranked_medians([r for r in prices if r['beds'] and int(r['beds']) == beds], lambda r: float(r['sale_price']))
for minimum in [0, 1500, 3000, 1000000000]:
    included = [r for r in prices if r['living_area_sqft'] and float(r['living_area_sqft']) > 0 and float(r['living_area_sqft']) >= minimum]
    reference['area'][minimum] = ranked_medians(included, lambda r: float(r['sale_price'])/float(r['living_area_sqft']))
for campus in sorted({r['university'] for r in rows}):
    bands = [[] for _ in range(5)]
    for row in prices:
        if row['university'] != campus or not row['miles_to_campus']:
            continue
        miles = float(row['miles_to_campus'])
        if miles < 0:
            continue
        index = 0 if miles < 1 else 1 if miles < 3 else 2 if miles < 5 else 3 if miles < 10 else 4
        bands[index].append(float(row['sale_price']))
    reference['distance'][campus] = [dict(n=len(b), value=statistics.median(b) if b else None) for b in bands]
print(json.dumps(reference))
