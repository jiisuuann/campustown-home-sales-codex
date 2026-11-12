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
