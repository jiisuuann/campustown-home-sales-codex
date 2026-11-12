# Agent log

## 2026-11-10: Median sale price chart and table

- **Asked:** "Read AGENTS.md and docs/data_description_sheet.md first. Then show every median sale price on index.html rounded to whole dollars, in both the chart and the table."
- **Agent produced:** Replaced the construction placeholder with a page that computes median sale prices for every town from the CSV and shows whole-dollar values in a bar chart and table.
- **Checked or changed:** Read the data description first and used its $1,000 low-price exclusion consistently; the page also reports how many sales contribute to each town median.

Add a dated entry each time you work with your AI coding agent, with the newest entry at the bottom. Each entry records what you asked the agent, what it produced, and what you checked or changed. Paste your key prompts in exactly as you typed them. Include at least one time the agent got something wrong, and how you caught it.

Copy this outline for each entry:

```markdown
## YYYY-MM-DD: What you worked on

- **Asked:** "Paste your prompt here."
- **Agent produced:** What it made or changed.
- **Checked or changed:** How you checked it, and what you fixed.
```

## 2026-11-12: Part 2 Phase 1 dashboard foundation

**Asked (exact development prompt):**

```text
We are developing Part 2 of the College-Town Home Sales project.\
\
Repository: jiisuuann/campustown-home-sales-codex\
\
Read AGENTS.md and docs/data_description_sheet.md before development.\
\
Build a new presentation-style, interactive data visualization dashboard from scratch. You may replace the existing Part 1 website interface, but preserve the official dataset, documentation, existing agent logs, and GitHub Pages compatibility.\
\
The final website will answer 12 Level 2 housing analysis questions, but this is Phase 1. Do not implement the 12 questions yet.\
\
PHASE 1 REQUIREMENTS\
\
1\. Dashboard foundation\
\- Create a professional, visually engaging presentation-style housing analytics dashboard.\
\- Organize the interface into clear sections that can accommodate future analytical charts.\
\- Use clear typography, informative numerical cards, and consistent chart styling.\
\- Prioritize data storytelling and visual clarity over a traditional real estate listing interface.\
\
2\. Geographic map filter\
\- Display a recognizable U.S. map with markers for all 18 college towns in the dataset.\
\- Use actual geographic coordinates from the dataset.\
\- Provide campus and city dropdowns.\
\- Implement bidirectional synchronization: clicking a map marker updates the dropdown, and selecting a location in a dropdown highlights the corresponding map marker.\
\- Selecting a university should highlight its associated towns.\
\- Update relevant housing statistics and visualizations when a location is selected.\
\- Include a clear/reset selection option.\
\
3\. Basic data display\
\- Show the number of sales and median sale price for the selected geography.\
\- Include at least one meaningful chart using the actual dataset.\
\- Preserve the data-quality rules described in the dataset documentation.\
\- Do not invent analytical values.\
\
4\. Future compatibility\
\- Structure the interface so that future phases can add more filters, visualizations, responsive layouts, and a light/dark toggle.\
\- Avoid implementing advanced analytics or unrelated features in this phase.\
\
5\. Development documentation\
\- Preserve existing AGENT_LOG.md entries and append this development prompt and a summary of changes.\
\- Create or update docs/EXPERIMENT_LOG.md to record key decisions, errors, and corrections.\
\
WORKFLOW\
\- Work on a separate development branch; do not modify main directly.\
\- Prioritize implementation over extensive testing to conserve tokens.\
\- Perform only lightweight checks when practical, and do not claim unperformed tests.\
\- Do not merge any changes into main without my approval.\
\- At the end, summarize what was implemented and any known limitations.
```

- **Agent produced:** New presentation dashboard with geographic context, all 18 town markers using actual sale coordinates, campus/city/map synchronization, reset and zoom controls, data-derived summary cards, a price-band chart and accessible table, methodology notes, local version-pinned map/chart assets, and basic responsive styling. Added experiment and validation documentation. Deferred the 12 questions and theme toggle.
- **Checked or changed:** JavaScript syntax, independent Python CSV totals and median, and lightweight Chromium interaction checks. Visual inspection caught tiny phone chart labels and markers; corrected chart scrolling and marker scaling. Playwright initially failed because its bundled browser was absent; corrected to use installed Chromium. Full results and limitations are in docs/VALIDATION.md. Official datasets and existing documentation remain unchanged. Work is on a separate development branch, with no merge or production deployment.
- **Publication status:** Local commit completed. Both Git push and the connected GitHub app rejected branch publication with HTTP 403. No remote PR, merge or deployment was performed; repository write access is needed to publish the review branch.

## 2026-11-12: Publish existing Phase 1 branch after access update

**Asked (exact prompt):**

```text
I have updated the ChatGPT Codex Connector's GitHub repository access to include jiisuuann/campustown-home-sales-codex.\
\
Please retry publishing the existing Phase 1 work on development/part2-phase1-dashboard. Preserve the current implementation and commits. Do not regenerate or rewrite the website.\
\
Push the existing branch and open a pull request targeting main. Do not merge it.\
\
If access is still denied, report the exact error and stop without repeated retries. Record the outcome in docs/EXPERIMENT_LOG.md.
```

- **Agent produced:** Published the existing development branch and opened PR #1 targeting main. Preserved the website and original commits; appended publication records in a new documentation commit.
- **Checked or changed:** Git push succeeded on its first retry. GitHub confirmed https://github.com/jiisuuann/campustown-home-sales-codex/pull/1 is open and unmerged. No implementation tests rerun; no merge or deployment performed.

## 2026-11-12: State highlighting and automatic map navigation

**Asked (exact prompt):**

```text
Please enhance the existing geographic map with **state highlighting and automatic zoom-to-selection**.

The current map, campus/city dropdown synchronization, and analytical results are working well. Preserve the existing implementation and visual design.

### Requirements

1. **State highlighting**
   - When a city or university is selected, highlight the corresponding U.S. state on the map.
   - Use a subtle fill color or outline that remains visually consistent with the existing dashboard.
   - Restore the default state appearance when the selection is cleared.
2. **Automatic zoom and pan**
   - When a university is selected, smoothly zoom and pan to the area containing all associated college towns.
   - When an individual city is selected, zoom closer to that city while keeping its marker clearly visible.
   - If multiple towns belong to the selected university, ensure all relevant markers remain visible with appropriate padding.
   - Avoid excessive zoom levels that make nearby towns difficult to distinguish.
3. **Bidirectional behavior**
   - Apply the same map highlighting and automatic zoom whether a location is selected by clicking a map marker, using the city dropdown, or using the university dropdown.
   - Preserve the existing synchronization between map selections, dropdowns, charts, and numerical results.
4. **Reset behavior**
   - Reset must restore the full U.S. map, default state colors, and all-location data view.
   - Preserve manual zoom and pan controls.
5. **Development documentation**
   - Record this request and the implementation changes in `AGENT_LOG.md`.
   - Document any problems, corrections, and limitations in `docs/EXPERIMENT_LOG.md`.

### Workflow

Work from the latest `main` branch on a new feature branch.

Focus only on improving map navigation and highlighting. Do not implement additional analysis questions or unrelated redesigns.

Keep verification lightweight to conserve tokens. Clearly report any functionality that was not tested.

Do not merge changes into `main` without my approval.
```

- **Agent produced:** Branched `feature/map-selection-navigation` from latest `origin/main` (`0f6d505`). Added subtle selected-state styling and a shared animated map-fit helper. Campus bounds include all associated markers with padding; city views zoom closer. Reset clears state styling and restores the national view. Manual controls and existing calculations remain intact.
- **Checked or changed:** JavaScript syntax and a lightweight Chromium smoke check: all 11 campus selections, selected marker bounds, state highlights, city/marker synchronization, sampled original statistics, reset during transitions, manual zoom/pan, Fit U.S., narrow-screen bounds, and reduced-motion selection. No runtime errors. No merge or production deployment.

## 2026-11-12: Phase 2 — Price & Affordability (Q1–Q4)

**Asked (exact development prompt):**

```text
Continue developing the College-Town Home Sales Part 2 dashboard.

**Repository:** `jiisuuann/campustown-home-sales-codex`\
**Working branch:** `feature/map-selection-navigation`

Use the latest version of the working branch, which includes state highlighting and automatic geographic zoom. Do not restart from `main` or rebuild the dashboard.

## Phase 2 — Price & Affordability

Implement interactive features that answer the first four Level 2 analysis questions.

**Q1. Which college town has the largest number of recorded home sales within a selected budget?**

- Add a budget slider.
- Show a ranked table of cities with qualifying sale counts and qualifying percentages.
- Clearly identify the city with the largest number of qualifying sales.

**Q2. How does the median sale price vary with distance from campus?**

- Allow users to select a university.
- Group sales into clear distance bands.
- Display median sale price and sale count for each band.
- Use a bar chart or another appropriate visualization.

**Q3. Which city has the lowest median sale price for homes with a selected number of bedrooms?**

- Add a bedroom-count selector.
- Rank cities by median sale price.
- Display median prices and qualifying sale counts.
- Highlight the city with the lowest median.

**Q4. Which city has the lowest median sale price per square foot for homes meeting a selected minimum living-area requirement?**

- Add a minimum living-area control.
- Calculate price per square foot for each eligible transaction before computing city medians.
- Exclude missing or zero living-area values.
- Show a ranked city table with median price per square foot and qualifying sale counts.

## UI Requirements

- Integrate the new analysis into the existing presentation-style dashboard.
- Reuse the current design and navigation patterns.
- Keep the geographic map, dropdown synchronization, state highlighting, and automatic zoom fully functional.
- Use intuitive controls, interactive charts, and clearly labeled numerical answers.
- Allow users to reset question-specific filters.
- Ensure that each question has its own controls so one question's filters do not unintentionally alter another question's results.
- Do not implement the remaining Level 2 questions yet.

## Data & Documentation

- Read `AGENTS.md` and `docs/data_description_sheet.md`.
- Use the official CSV without modifying source data.
- Apply documented data-quality rules consistently.
- Do not hardcode analytical answers.
- Append this prompt and implementation summary to `AGENT_LOG.md`.
- Update `docs/EXPERIMENT_LOG.md` with issues and corrections.

## Workflow

- Continue on `feature/map-selection-navigation`.
- Keep the existing PR #2 open.
- Commit and push Phase 2 changes to that branch so PR #2 updates automatically.
- Do not merge into
```

**Clarification:** GitHub reported that PR #2 had already been merged before this phase. Asked whether to open a new Phase 2 PR from the same branch; the user replied exactly: `Open a new Phase 2 PR`.

- **Agent produced:** Four independent question sections: budget slider plus exact budget input and city count/percentage ranking; university distance-band median chart/table; exact-bedroom city median ranking; minimum-area city median transaction-level price-per-square-foot ranking. Added question resets, computed answer callouts, ties/empty states, exclusions, accessible tables and responsive controls. Continued the existing branch without rebuilding or changing map logic. Q5–Q12 remain deferred.
- **Checked or changed:** Independent Python reference computations matched browser results across four budgets, all reported bedroom values, four area thresholds and all 11 campuses. Tested invalid/no-result inputs, resets, slider/map independence, state highlighting and autozoom, mobile page overflow, and no page errors. Inspected desktop/mobile budget screenshots and desktop distance chart. Data files unchanged. Details in docs/VALIDATION.md and docs/EXPERIMENT_LOG.md; no merge or production deployment performed.
