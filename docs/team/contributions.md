# Team contributions

This page summarises work visible in Git history. It should not be used to infer hours worked or
unrecorded planning/support. Commit hashes and PR numbers provide traceability for assessment.

## Verified delivered work

| Member | Evidence | Delivered contribution |
|---|---|---|
| Ralph Koh | `09ada9f`, PR #1 | Initial InvoiceNow SG React/Vite application: routing, login, reducer-backed invoice workflows, dashboard/list/cards, form/create/edit/delete, customer/product/tour pages, static data, styling, Vercel/NAS configuration, and smoke-test script. |
| Ang Jenn Fang | `b29ba4a`, PR #2 | Testing foundation: Vitest, jsdom, jest-dom, React Testing Library, user-event, npm test scripts, shared setup, and initial tests for invoice utilities, invoice store, invoice cards, and dashboard behaviour. |
| John Phang | `76c443d`, `3744cd7`-`61f4bc6`, PRs #3-#7 and #9 | PRD/architecture; MockAPI API layer, shared persistence and seeding; reference-data design; roles/permissions; API and role tests; CI, CODEOWNERS, PR template and contribution workflow; EasyInvoice rename; React 19/Router 7/Vite 8 upgrade; integration fixes and engineering/submission documentation. |

John's commits appear under both `John Phang` and `johnphs` with the same email. They are one
contributor identity for the purpose of this summary.

## Assignment participation matrix

The brief asks every member to touch state management, at least one route, and at least one
data-fetching or component-composition task.

| Member | State management | Route | Data fetching/composition | Evidence status |
|---|---|---|---|---|
| Ralph | Initial `useInvoices`, auth/form/dashboard state | Initial login, tour, dashboard, create/edit, customer/product routes | Initial reusable UI and data-source composition | Visible in `09ada9f` |
| Jenn | Tests exercise hook and page state | Dashboard-page tests exercise routed navigation | Component/page test composition and mocked store behaviour | Production-code ownership beyond tests should be confirmed by Jenn before submission |
| John | MockAPI-backed reducer/store integration and mutation states | Role guards and route integration fixes | API clients, reference-data composition, useFetch/store integration | Visible across MockAPI/roles PRs |

## Collaboration and review evidence

- Shared repository with commits from all three members.
- Feature branches and merged PRs are visible in history.
- PR template, CODEOWNERS routing hints, review rotation, and workflow are documented in
  `CONTRIBUTING.md`.
- GitHub Actions runs tests/build on pull requests and `main`.
- The private/free repository previously could not enforce branch protection; reviewers therefore
  had to follow the documented workflow voluntarily.
- The three task-list files under `docs/handoffs/` provide repository-local project-management
  evidence. Add a GitHub Projects board link here if one exists: **TODO: project-board URL**.

## Individual learning statements

The assignment presentation requires each member's learning. These statements must be confirmed
in each member's own words rather than inferred from commits.

### Ralph Koh

**TODO (Ralph):** Add two or three sentences covering the React/component/routing/state lessons
from creating the initial prototype and one challenge overcome.

### Ang Jenn Fang

**TODO (Jenn):** Add two or three sentences covering Vitest/React Testing Library, mocking or
interaction testing, and one challenge overcome.

### John Phang

**TODO (John):** Add two or three sentences covering API persistence, state/permissions,
integration/CI, and one challenge overcome.

## Contribution sign-off

- [ ] Each member confirms their row is accurate.
- [ ] Jenn confirms whether additional production state/route/fetch work should be listed.
- [ ] Each member replaces their learning placeholder.
- [ ] The final presentation uses the same contribution wording.

