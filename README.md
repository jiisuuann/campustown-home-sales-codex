
# College-Town Home Sales — Part 2 (Codex Experiment)

## Project Overview

This repository is part of a research experiment evaluating AI coding agents in the development of interactive data analytics websites.

The project builds on the completed Part 1 website and aims to develop an interactive dashboard that answers 12 Level 2 housing sales analysis questions.

A parallel experiment using Claude Code will be conducted from the same starting codebase.

## Project Goals

1. Answer all 12 Level 2 analysis questions using the official college-town home sales dataset.
2. Implement a geographic map filter with bidirectional synchronization between map selections and campus/city dropdowns.
3. Support responsive layouts for desktop, tablet, and mobile devices.
4. Implement a light/dark theme toggle.
5. Validate analytical results against the source dataset.
6. Document AI agent prompts, errors, corrections, and verification results.

## Dataset

- Source: College-Town Home Sales Dataset, Version 1.0
- Records: 35,442 home sales
- Coverage: 18 cities and towns, 11 universities, 11 states
- Primary file: `data/college_town_home_sales.csv`
- Data documentation: `docs/data_description_sheet.md`

The original dataset files must not be modified.

## Development Workflow

- AI coding agent: OpenAI Codex Cloud
- Work in small development cycles.
- Review changes before merging pull requests.
- Keep the main branch stable until changes have been reviewed.
- Record prompts and outcomes in `AGENT_LOG.md`.
- Record issues and resolutions in `docs/EXPERIMENT_LOG.md`.
- Maintain analytical validation results in `docs/VALIDATION.md`.

## Project Documentation

- `AGENTS.md` — Coding agent instructions
- `AGENT_LOG.md` — Agent prompts and work history
- `docs/data_description_sheet.md` — Dataset documentation
- `docs/REQUIREMENTS.md` — Analysis questions and UI requirements
- `docs/EXPERIMENT_LOG.md` — Issues, fixes, and observations
- `docs/VALIDATION.md` — Analytical verification results

Documentation files will be added or updated as development progresses.

## Website

https://jiisuuann.github.io/campustown-home-sales-codex/

## Attribution

College-town home sales dataset, Version 1.0 (2026).
University of Illinois–Deloitte Foundation Center for Business Emerging Technologies.
Data collected March 2026.
