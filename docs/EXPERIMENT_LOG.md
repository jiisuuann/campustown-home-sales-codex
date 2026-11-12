# Experiment log

## 2026-11-12 — Part 2, Phase 1 dashboard

### Decisions

- Read AGENTS.md and the data description before development. The user's explicit Phase 1 request authorizes the interface replacement and limits the broader AGENTS.md goals: defer the 12 analytical questions and light/dark toggle.
- Work on `development/part2-phase1-dashboard`; no main changes, merge or deployment.
- Use plain HTML/CSS/JS with local, pinned D3, TopoJSON and U.S. boundary assets. Keep relative URLs and the existing Pages workflow.
- Separate geography, summary, distribution and methodology sections; use CSS theme tokens and a shared filter state for later expansion.
- Count all unique listing IDs. Fail visibly on missing/duplicate IDs instead of silently dropping transactions. Keep identifier columns as strings; never deduplicate addresses.
- Use prices >= $1,000 for medians and price-band counts, with no upper exclusion. Blank or nonfinite prices are excluded, not coerced to zero. Show included/excluded counts and exact chart values in a table. Retain extreme prices in the $2m+ band. Unequal bands are disclosed and represent counts, not probability density.
- For each city/state, calculate median latitude/longitude and choose the existing transaction coordinate pair nearest that center (squared degree distance). The displayed marker uses that actual dataset coordinate, not a geocoded city or an invented coordinate. Derive campus associations from the rows.
- Campus selection clears city selection and highlights every associated town. City/marker selection sets the associated campus; clearing the city retains its campus. Global reset clears both and resets map zoom.
- Keep all 18 markers at true positions. Nearby towns overlap nationally; zoom/pan, keyboard marker activation, dropdowns and a town list provide selection alternatives.

### Problems and corrections

- FAIL (initial browser setup): Playwright's default Chromium executable was absent. Used existing `/usr/bin/chromium`; browser smoke checks then passed without installing dependencies.
- Visual review found the chart labels shrank too far on a narrow phone. Corrected with an internally scrollable chart of minimum width and a labeled keyboard-focusable chart region. Chart data remains available in an HTML table.
- Visual review found map dots too small on phones. Corrected marker radius to account for rendered SVG size, while preserving geographic positions and constant-size dots during zoom.
- No analytical result was fabricated to populate the dashboard. The independent Python CSV check matched the global JavaScript result.

### Scope and review

- Replaced the Part 1 interface; preserved original documentation, agent-log history, all five official datasets and Pages configuration.
- Basic responsive layouts included. Advanced analytics, the 12 Level 2 questions, theme switching, and exhaustive browser/accessibility/performance testing are deferred.
- See VALIDATION.md for checks actually performed. Review the branch/PR; main remains the existing live site until an approved merge.

### Publication blocker

- Git CLI push returned HTTP 403 (`Permission ... denied`). The connected GitHub app also returned HTTP 403 (`Resource not accessible by integration`) when attempting to create the same development branch. No remote branch or pull request could be published. The implementation is committed on the local development branch; repository write access is required to publish it for review. No approval-review rejection occurred; these were GitHub authorization failures.

## 2026-11-12 — Publication retry after connector access update

- User updated the ChatGPT Codex Connector's repository access and requested publication of the existing branch, preserving the implementation and commits, with no merge.
- PASS: `git push -u origin development/part2-phase1-dashboard` succeeded on the first retry. Original commits `0f9b47d` and `2300c44` were preserved unchanged.
- PASS: Opened PR #1 targeting `main`: https://github.com/jiisuuann/campustown-home-sales-codex/pull/1 . GitHub confirmed the PR is open and not merged.
- Added this outcome and the retry prompt as a separate documentation commit. No website, dataset, dependency or workflow changes; no new implementation tests were needed or performed. No merge or production deployment was performed.

## 2026-11-12 — State highlighting and zoom-to-selection

### Implementation and decisions

- Started `feature/map-selection-navigation` from fetched `origin/main` at `0f6d505` (merged Phase 1). Preserved the existing dashboard, datasets, calculation functions, dropdown behavior, and page layout.
- Joined the dataset's state abbreviations to bundled geometry names with a mapping for all 11 states currently present. Selected states receive a muted green fill and outline; clearing selection removes the class.
- All selection sources use the existing `render()` flow, which now also updates state highlighting and map framing. Fit projected marker bounds with 100 viewBox-unit padding; cap automatic campus zoom at 10x and city zoom at 14x. Manual zoom retains its 1–24x range.
- Animate selection changes for 550 ms; honor reduced-motion preferences with zero-duration selection transitions. Interrupt previous map transitions before replacing them, including manual zoom actions, to avoid an old selection animation overriding a reset.
- Global reset clears both filters, state highlighting and data selection, and returns to the U.S. view. The existing “Fit U.S.” control remains a viewport-only action: it retains filters and highlights.

### Problems, corrections and limitations

- No implementation or browser-check failures encountered. Prevented competing reset/selection animations by routing map movement through a shared interruptible transition helper instead of combining an immediate reset with an active transition.
- State-code mapping covers the official dataset; extending the dataset to additional states requires extending that mapping.
- Tight neighboring towns can still overlap on narrow screens at capped automatic zoom levels. Existing manual zoom and dropdown/town-list alternatives remain available; positions are never displaced.
- Automatic framing fits town markers, not the entire highlighted state boundary. No new analysis questions or redesigns were introduced.

### Lightweight verification

- PASS: `node --check assets/dashboard.js` and `git diff --check`.
- PASS: installed Chromium via Playwright; all 11 campuses highlight a state, automatically zoom, and keep selected markers inside padded bounds.
- PASS: Urbana city selects Illinois at 14x; sampled Illinois/Urbana statistics remain 3,664 campus sales and $229,900 city median. Davis marker updates dropdowns, highlights California and zooms to 14x.
- PASS: global reset and clearing campus restore identity transform, no state highlights and all-location data (35,442 sales). Reset during an active selection transition remains reset.
- PASS: manual zoom, mouse drag pan, and viewport-only Fit U.S.; 390px viewport campus-marker bounds; reduced-motion city selection; no JavaScript page errors during the smoke check.
- NOT TESTED: other browsers, physical touch/pinch gestures, comprehensive accessibility testing, production deployment. No full analytical revalidation needed because calculation code is unchanged.

## 2026-11-12 — Phase 2: Price & Affordability

### Scope and decisions

- Read AGENTS.md and data description; fast-forward pulled the existing `feature/map-selection-navigation` branch (already current at `84468f3`). Continued on that branch; did not restart from main or rebuild the dashboard.
- Added only Q1–Q4 below the existing price distribution. Existing map controls, selection state, state highlights and geographic zoom code are unchanged. The dashboard initializes a separate `price-analysis.js` module once with the official CSV rows.
- Q1/Q3/Q4 compare all cities regardless of the overview map filters. Q2 owns its own university selector. The scope is stated above the question navigation, so independent filters cannot silently alter each other's comparison universe.
- All price-based eligibility uses the established finite sale_price >= $1,000 rule. Retain high-price outliers, original transaction IDs, and text identifiers. Do not use unreliable home_type or deduplicate addresses.
- Q1: inclusive budget; count qualifying transactions by city; qualifying percentage uses **all recorded transactions in that city** as denominator, including records excluded by the price rule. Show denominator, counts, percentage and exclusions. Slider is $0–$2m in $1,000 steps; a whole-dollar exact input supports values beyond the slider range without excluding expensive records. Reset to $400,000.
- Q2: independent university selector, reset to the first alphabetical university. Bands are [0,1), [1,3), [3,5), [5,10), [10,infinity) straight-line miles. Require nonblank finite nonnegative distance and eligible price. Show median and eligible count for each band, including explicit no-data bands. Include an interactive-by-selection horizontal bar chart, exact table and exclusion count.
- Q3: exact bedroom selector derived from actual nonnegative integer bedroom values, including unusually high reported counts; no arbitrary merging into “5+”. Reset to 3 bedrooms. Show each city's eligible sample size and median, lowest first. No minimum sample-size suppression; disclose small-sample limitations.
- Q4: whole-square-foot minimum, inclusive; reset to 1,500 sq ft. Exclude blank, nonfinite or nonpositive living area. Calculate sale_price/living_area_sqft per transaction, then city medians. Show disjoint exclusion counts (price rule, invalid area, below minimum).
- Ties use unrounded values and shared competition ranks, with alphabetical display tie-breaks. Highlight all tied leaders. Empty median groups stay visible/unranked; no false winner when no transactions qualify. Dollar medians display whole dollars; $/sq ft displays cents; percentages display one decimal.

### Issues and corrections

- Workflow discrepancy: user requested updating open PR #2, but GitHub reported it was already merged at 2026-11-12T18:06:10Z, before Phase 2 work. A merged PR cannot be reopened. Asked the user and received approval to open a new Phase 2 PR from the same branch. No merge was performed by the agent.
- During implementation review, narrowed sticky-header styling to table column headers; row header cells remain in normal table flow. Also assigned the distance-band name (rather than its median) as that table's accessible row header.
- Avoided a slider limited by the reported $81.51m extreme: retained a practical $0–$2m slider and provided an unrestricted exact budget input with an explicit range note. Exact budgets above the slider maximum remain active until changed or reset.
- Blank/negative input must not show stale results: clear the affected result table and show a validation message. Existing dataset comparison and browser checks passed with no reported mismatches or runtime errors.

### Verification and limitations

- PASS: syntax/diff checks; independent Python csv/statistics reference against browser results for all table rows under four budgets, all 19 observed bedroom counts, four area thresholds and all 11 university distance-band tables. Reference generator is `scripts/verify_price_analysis.py`; output belongs under `work/` and is not served as analytical data.
- PASS: question resets, exact budgets beyond slider range, slider updates, blank/negative/no-result controls, budget isolation from Q2–Q4, overview-map isolation from all questions, preserved state highlight and automatic zoom, 390px page overflow, and no browser page errors. Inspected budget desktop/mobile and distance desktop screenshots.
- Limitations: recorded sales describe this collection, not current inventory or full affordability (income, interest, taxes and financing are not modeled). Retained outliers and small samples can change rankings. The area rule validates positive reported area but does not independently verify it. Q2 is descriptive, not causal. Narrow tables/charts scroll internally.
- NOT TESTED: full cross-browser/accessibility audits, physical touch gestures, production deployment. Q5–Q12 and theme toggle remain out of scope.

Publication: pushed Phase 2 commit `f2d2f37` to the existing working branch and, with the user's approval, opened PR #3 targeting main: https://github.com/jiisuuann/campustown-home-sales-codex/pull/3 . GitHub confirmed it is open and unmerged. PR #2 remains the previously merged navigation change; no merge or production deployment was performed for Phase 2.

## 2026-11-12 — Phase 3: Time and home characteristics (Q5–Q9)

### Scope and implementation

- Continued `feature/map-selection-navigation` at `ad83339`, pulled fast-forward (already up to date) and confirmed PR #3 was open. No restart from main, new PR, dataset edits or map redesign.
- Added `market-analysis.js` initialized once from the same original CSV, using the shared price rule and city keys. New controls and resets are local to each question and independent of Q1–Q4 and map state. Reused existing panels, charts, table styling, layout and typography.
- Q5: selected city, annual or quarterly calendar groups from UTC closing dates. Fill the period sequence between the city's earliest/latest recorded date; absent periods show no median and zero eligible transactions. Compute adjacent-period dollar changes only when both medians exist. The headline compares the first/last nonempty periods using unrounded medians. Default first alphabetic city and annual grouping.
- Q6: optional city and inclusive price range (minimum required, blank maximum means unbounded). Compute arithmetic mean, median, absolute mean-minus-median difference, and count from the exact same transactions. Difference is calculated before rounding; retain upper outliers unless the user sets a maximum. Defaults all towns, $1,000 minimum, no maximum.
- Q7: optional city and one of garage/basement/fireplace. Only literal `1` is With and `0` is Without; missing/unrecognized flags are a separate Not reported group with its own median and count. Report signed With-minus-Without median difference only when both groups have eligible sales. Default garage, all towns.
- Q8: all towns and inclusive minimum/maximum living area, with optional unbounded maximum. Require finite positive area and positive integer construction year; exclude missing values. Construction groups: before 1940, 1940–1959, 1960–1979, 1980–1999, 2000–2019, 2020+. Report each group's median/count and the range of observed group medians. Default 1,500–2,500 sq ft.
- Q9: one city and a year chosen from all dataset closing years. Count every transaction with a valid closing date in that city/year, regardless of price; render all 12 months, zero where no sales are recorded. Highlight all tied busiest months; no winner if the year has no records. Default first alphabetic city and latest observed year.

### Data rules and interpretation

- Q5–Q8 consistently apply finite sale_price >= $1,000, retaining high-price outliers. Q9 counts all dated transactions, consistent with the overview's all-sale count. No address deduplication, identifier coercion or property-type analysis.
- Validate YYYY-MM-DD closing dates by UTC round-trip; blank/invalid dates are excluded, never assigned a fake month/year. Dataset date coverage is 2023-03-27 through 2026-03-25. City-specific first/last recorded dates and partial-coverage caveats are displayed in Q5/Q9. No assumption that periods with records represent complete market coverage.
- Groups with 1–9 sales are labeled Small sample; zero groups say No sales and have no price statistic. Ten is a disclosure threshold, not a significance test; no observations are suppressed. Comparisons are descriptive, not causal. Q5 is not a repeat-sales index, Q7 is not a feature-installation valuation, and Q8 does not isolate building age from geography and other differences.
- Price and dollar-change displays round to whole dollars; Q5 headline percentage change rounds to one decimal. All calculations use unrounded values. Q6 absolute difference need not equal the subtraction of two rounded display values.

### Issues and corrections

- Scope review found Phase 2's initialization enabled every `.question-controls` fieldset. Narrowed it to Q1–Q4 so Phase 3 controls remain disabled until their own data initialization completes; no Phase 2 analytical changes.
- Prevented fractional tick labels in low-count monthly charts by retaining only integer count ticks. Empty/missing price groups are not drawn as zero-price bars.
- Invalid/inverted ranges clear the affected table/chart and show a helpful input message instead of retaining stale analytical results. Blank maximum is explicitly supported as no limit.
- No mismatches or JavaScript page errors were reported in the independent reference/browser verification. Visual review retained the existing design without additional CSS or dependencies.

### Verification and remaining limits

- PASS: syntax and whitespace checks; independent Python reference scenarios for all Q5–Q9 result rows; Chromium checks for missing/empty groups, small-sample flags, mean/median/difference/count, all 12 months and busiest-row count, invalid range handling, resets and question isolation; map highlighting; no 390px page overflow. Inspected desktop Q7 and mobile Q6 screenshots.
- PASS: existing Phase 2 browser/reference smoke check after integration, including its map highlight/zoom checks.
- NOT TESTED: every possible filter combination, physical touch gestures, other browsers, comprehensive accessibility and performance audits, live deployment. No new external data was used to assess collection completeness or verify reported home characteristics. Q10–Q12 remain deferred.
- Changes are for the same open PR #3; no merge or production deployment was performed.
