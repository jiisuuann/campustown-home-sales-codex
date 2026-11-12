# Validation

## 2026-11-12 — Phase 1

Lightweight checks only; no Level 2 questions implemented or validated.

| Check | Result | Evidence |
|---|---|---|
| JavaScript syntax | PASS | `node --check assets/dashboard.js` |
| Independent official CSV calculation | PASS | Python csv + statistics: 35,442 records, 35,442 unique listing IDs, 35,438 prices >= $1,000, $410,000 median |
| Browser initial view | PASS | Headless installed Chromium via Playwright: 18 SVG town markers, 35,442 total sales, $410,000 median |
| Campus → map + statistics | PASS | Illinois campus: 3 highlighted towns, 3,664 sales |
| City → statistics | PASS | Urbana: 1,131 sales, $229,900 median |
| Map → both dropdowns | PASS | Click Davis marker: Davis city and UC Davis campus selected; $889,000 median |
| Global reset | PASS | Restores 35,442 sales |
| Chart coverage | PASS | Price-band counts total 35,438 eligible transactions |
| Desktop and mobile screenshots | PASS | Inspected at 1440px and 390px; corrected mobile chart readability and marker size |
| Mobile page overflow | PASS | Document width does not exceed 390px viewport; chart scrolls internally |
| Runtime JS errors | PASS | None during smoke interactions |
| Official files and previous log entries | PASS | Git diff confirms no changes to five dataset files, existing docs or Pages workflow; AGENT_LOG append only |
| GitHub Pages production deployment | NOT TESTED | Branch is not merged or deployed |
| Other browsers, full accessibility, touch device and performance audit | NOT TESTED | Outside lightweight Phase 1 verification |

Calculation method: numeric median after filtering sale_price >= 1000; even samples average the middle pair, displayed to the nearest dollar. Sale counts retain all rows, including excluded prices and missing sale dates. No date-based or property-type analysis is performed. Chart intervals are lower-inclusive, upper-exclusive, with an unbounded final interval. No source data is modified.

## 2026-11-12 — Phase 2 Q1–Q4

Independent reference: `python scripts/verify_price_analysis.py` reads the unchanged official CSV using Python csv/statistics; output compared against browser-rendered table values in installed Chromium via Playwright. Every city row was compared, not only the winner. Calculations run in the browser from the CSV; the following results are documentation, not hardcoded UI values.

| Question/default | Independently verified result | Status |
|---|---|---|
| Q1: maximum $400,000 | Gainesville, FL: 3,499 qualifying sales / 5,477 recorded sales = 63.9% displayed | PASS |
| Q2: Purdue, 0–<1 mile | Median $405,500; 102 eligible sales | PASS |
| Q2: Purdue, 1–<3 miles | Median $240,500; 1,348 eligible sales | PASS |
| Q2: Purdue, 3–<5 miles | Median $277,000; 1,707 eligible sales | PASS |
| Q2: Purdue, 5–<10 miles | Median $340,000; 1,393 eligible sales | PASS |
| Q2: Purdue, 10+ miles | Median $360,500; 66 eligible sales | PASS |
| Q3: exactly 3 bedrooms | Champaign, IL: lowest median $215,000; 1,106 eligible sales | PASS |
| Q4: minimum 1,500 sq ft | Urbana, IL: lowest median $147.13/sq ft (unrounded 147.13194259203243); 618 eligible sales | PASS |

Additional PASS checks:

- All city counts/denominators/percentages at budgets $0, $400,000, $1m and $100m (last exceeds slider range). $0 produces no qualifying winner.
- City medians/counts for all 19 observed bedroom choices: 1–16, 30, 31, 34.
- City medians/counts at living-area minima 0, 1,500, 3,000 and 1 billion sq ft. Minimum zero still excludes missing/nonpositive areas; extreme minimum yields no eligible medians.
- Every band's median/count for all 11 campuses, including empty bands. Count comparisons are exact; currency comparisons allow only displayed rounding (half a dollar or half a cent).
- Empty and negative budget/area inputs clear results; resets restore independent defaults. Changing budget leaves Q2–Q4 unchanged; changing map campus leaves all four questions unchanged.
- Existing overview after Illinois campus selection retains 3 highlighted markers, a highlighted state, and a zoomed transform. Map calculation functions were not changed.
- JavaScript syntax, no browser page errors, desktop/mobile budget screenshot inspection and desktop distance-chart inspection, no document overflow at 390px.

NOT TESTED: exhaustive cross-browser, keyboard/screen-reader accessibility audit, physical touch/pinch, live deployment. No additional Level 2 questions implemented. Method details, exclusions, scope and limitations are recorded in EXPERIMENT_LOG.md and displayed in each panel.

## 2026-11-12 — Phase 3 Q5–Q9

Reference: `python scripts/verify_market_analysis.py` independently reads the official CSV using Python datetime/statistics and emits JSON for a local Chromium comparison. No generated analytical values are used by the website.

| Check | Independently verified result | Status |
|---|---|---|
| Q5 Ann Arbor annual medians / eligible counts | 2023: $555,000 / 919; 2024: $571,000 / 909; 2025: $585,000 / 1,054; 2026: $564,000 / 138 | PASS |
| Q6 all cities, price >= $1,000 | Mean 509437.91210000566; median 410000; absolute difference 99437.91210000566; n=35,438. UI rounds to $509,438 / $410,000 / $99,438 | PASS |
| Q7 garage, all cities | With: $427,000 / 25,457; Without: $350,000 / 9,981; Not reported: no median / 0. With-minus-without difference +$77,000 | PASS |
| Q8 all cities, 1,500–2,500 sq ft | Before 1940: $460,000 / 1,221; 1940–59: $410,000 / 1,975; 1960–79: $375,000 / 3,961; 1980–99: $401,000 / 3,175; 2000–19: $397,000 / 3,326; 2020+: $425,000 / 2,004 | PASS |
| Q9 Ann Arbor 2023 monthly counts Jan–Dec | 0, 0, 14, 110, 145, 143, 119, 97, 71, 86, 74, 61. Busiest: May, 145. These are recorded counts, with partial coverage | PASS |

Browser/reference scenarios (counts exact, monetary display tolerance at most half a dollar):

- Q5 annual and quarterly tables for Ann Arbor, Pittsboro and Gainesville; all period medians/counts and sample flags.
- Q6 all-city unbounded and $500k-capped ranges, Gainesville unbounded, and Pittsboro $1,000–$1,001 empty range; means, medians, absolute differences and counts.
- Q7 garage, basement and fireplace for all towns and State College, including separate Not reported groups.
- Q8 area ranges 0–unbounded, 1,500–2,500, 3,000–4,000 and 1 billion–unbounded (empty), including no-data groups and sample flags.
- Q9 each of Ann Arbor, Pittsboro and Gainesville for 2023, 2025 and 2026; all month counts and highlighted maximum-count rows.

PASS: blank/inverted required ranges clear results; all five reset controls restore defaults; Q5 changes do not affect Q6–Q9; Phase 3 scenarios leave Phase 2 unchanged; overview map selection leaves Phase 3 unchanged and retains 3 Illinois markers/state highlight. No runtime errors or 390px document overflow. Inspected desktop feature and mobile mean/median screenshots. Existing Phase 2 reference/browser check also passed again after integration.

NOT TESTED: all other city/range combinations, direct automated assertions of every Q5 delta/percentage, every possible tied/no-sale monthly case, full keyboard/screen-reader audit, physical touch, other browsers, production deployment. Closing-date validation and UTC grouping are implemented; comprehensive malformed-date fixture tests were not added. Official dataset files remain unchanged.
