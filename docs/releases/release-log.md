# Release log

Dates and scope are reconstructed from the `main` branch commit and PR history.

## Unreleased - documentation completion

### 30 September 2026

- Audited the repository against the Module 2 assignment brief.
- Reorganised the root README around submission requirements.
- Added scope/limitations, contribution, deployment/CI, release, screenshot, and documentation-audit
  pages.
- Updated stale architecture/testing/roadmap status text.
- Left explicit placeholders for screenshots, personal learning statements, project-board URL,
  deployment re-verification, and final presentation link.

## 1.0.0 - EasyInvoice learning demo

### 27 September 2026

- Merged repository cleanup/governance (PRs #3 and #4).
- Merged MockAPI persistence, reference-data resource, roles, seed tooling, and expanded tests
  (PRs #5 and #7).
- Renamed InvoiceNow SG to EasyInvoice (PR #6).
- Upgraded to React 19, React Router 7, Vite 8, and matching test tooling (PR #9).
- Recorded Vercel as the canonical public deployment and added final-state architecture/testing
  documentation.

### 26 September 2026

- Added GitHub Actions (`npm ci`, tests, build), CODEOWNERS, PR template, and contribution workflow.
- Added central VIEW_ONLY/EDIT permissions and MockAPI-backed invoice store/API layer.
- Added destructive-but-repeatable MockAPI seeding from static demo data.
- Standardised demo account passwords and integrated/validated parallel feature branches.

## 0.2.0 - automated test foundation

### 25-26 September 2026

- Added Vitest, jsdom, React Testing Library, jest-dom, and user-event.
- Added initial tests for utilities, the invoice hook, invoice cards, and dashboard behaviour
  (PR #2, Ang Jenn Fang).

## 0.1.0 - InvoiceNow SG prototype

### 22 September 2026

- Added the initial React/Vite application with login, dashboard, invoice create/edit/delete,
  customers, products, Tour, styling, static data, public APIs, deployment files, and smoke-test
  script (PR #1, Ralph Koh).
- Added/updated the project PRD (John Phang).

