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
