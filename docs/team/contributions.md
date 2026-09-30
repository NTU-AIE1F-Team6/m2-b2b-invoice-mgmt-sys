# Team contributions

This page summarises work visible in Git history. It should not be used to infer hours worked or
unrecorded planning/support. Commit hashes and PR numbers provide traceability for assessment.

## Verified delivered work

| Member | Evidence | Delivered contribution |
|---|---|---|
| Ralph Koh | `09ada9f`, PR #1,#10 | Initial InvoiceNow SG React/Vite application: routing, login, reducer-backed invoice workflows, dashboard/list/cards, form/create/edit/delete, customer/product/tour pages, static data, styling, Vercel/NAS configuration, and smoke-test script. |
| Ang Jenn Fang | `b29ba4a`, PR #2,#11 | Testing foundation: Vitest, jsdom, jest-dom, React Testing Library, user-event, npm test scripts, shared setup, and initial tests for invoice utilities, invoice store, invoice cards, and dashboard behaviour. |
| John Phang | `76c443d`, `3744cd7`-`61f4bc6`, PRs #3-#7 and #9 | PRD/architecture; MockAPI API layer, shared persistence and seeding; reference-data design; roles/permissions; API and role tests; CI, CODEOWNERS, PR template and contribution workflow; EasyInvoice rename; React 19/Router 7/Vite 8 upgrade; integration fixes and engineering/submission documentation. |
 

## Assignment participation matrix

The brief asks every member to touch state management, at least one route, and at least one
data-fetching or component-composition task.

| Member | State management | Route | Data fetching/composition | 
|---|---|---|---|
| Ralph KOH Kwan Liang  | Initial `useInvoices`, auth/form/dashboard state | Initial login, tour, dashboard, create/edit, customer/product routes | Initial reusable UI and data-source composition | 
| ANG Jenn Fang | Tests exercise hook and page state | Dashboard-page tests exercise routed navigation | Component/page test composition and mocked store behaviour | 
| John PHANG | MockAPI-backed reducer/store integration and mutation states | Role guards and route integration fixes | API clients, reference-data composition, useFetch/store integration |



