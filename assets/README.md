# Dashboard assets

All runtime dependencies are local and version-pinned. No API keys, external tile service, build step or CDN requests are needed at runtime.

- `vendor/d3.min.js`: D3 7.9.0, ISC license; https://cdn.jsdelivr.net/npm/d3@7.9.0/dist/d3.min.js
- `vendor/topojson-client.min.js`: topojson-client 3.1.0, ISC license; https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/dist/topojson-client.min.js
- `us-states.json`: us-atlas 3.0.1 states-10m.json, ISC license; https://cdn.jsdelivr.net/npm/us-atlas@3.0.1/states-10m.json. U.S. Census Bureau cartographic boundaries; Albers USA projection includes Alaska and Hawaii insets. Map geometry supplies boundaries only, never analytical values.
- License files are stored beside the corresponding assets.

`dashboard.js` keeps one geography selection state. All cards and charts derive from the filtered official CSV rows. Add future filters to `selection` and `selectedRows()`, then render new panels from those rows. CSS custom properties provide the foundation for a future theme toggle. Phase 2 adds `price-analysis.js` for Q1–Q4 with independent question controls and the full official CSV as its input; it does not mutate overview map selection. Phase 3 adds `market-analysis.js` for Q5–Q9, also using independent controls. Q5/Q9 use UTC closing dates; Q7 keeps missing feature flags separate from “without”. Neither module mutates overview map selection. No toggle or Q10–Q12 implementation is included.
