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
