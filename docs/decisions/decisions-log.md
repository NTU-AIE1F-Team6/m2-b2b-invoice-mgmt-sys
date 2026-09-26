# Decisions log

Running log of team decisions and task assignments made outside the formal PRD decision register
(`docs/requirements/PRD-B2B Invoice Management System-V1.md`, §5, D1-D13). Append new dated
entries at the top.

## 25 Sep 2026

- **Name of the app is EasyInvoice.** (Implemented: `chore/rename-easyinvoice`.)
- **Keep the hints.** The React-concept hints toggle (`src/components/Hint.jsx`, the "Hints"
  button in the navbar) stays — not being removed as part of the rename or any other cleanup.
- **Enhance "how the app was built" — Ralph.** The Tour page (`src/pages/TourPage.jsx`,
  content in `src/data/tour.js`). Note: John has already touched `tour.js` while working on
  the MockAPI/rename branches (`feat/mockapi-users-roles`) — fixed stale localStorage/static-JSON
  code snippets that would otherwise misdescribe the new MockAPI-backed store, and added a
  roles/permissions concept card. Coordinate before both editing the same file.
- **Update password to same for build.** All demo accounts now share one password,
  `Password123` — this is a learning-project demo gate, not production security.
  (Implemented: `feat/mockapi-users-roles`, see `src/data/users.js`.)
- **Create 3x MockAPI — John.** Implemented as **2 MockAPI resources** (`invoices`,
  `referenceData`), not 3 — the free tier caps a project at 2 resources. Customers and products
  share the `referenceData` resource, told apart by a `type` field. This matches the PRD's own
  formal decision register, D13 ("Use two MockAPI resources: invoices and referenceData"), so
  it's not a departure from plan, just a note that "3x" here meant 3 conceptual entities
  (invoices, customers, products), not 3 separate MockAPI resources.
- **User and roles defined in code — John.** `src/data/users.js` (4 hardcoded accounts) +
  `src/data/roles.js` (`VIEW_ONLY` / `EDIT`, single `can()` permission function). (Implemented:
  `feat/mockapi-users-roles`.)
- **Tests — Jenn Fang.** Test infrastructure and initial tests landed in PR #2
  (`feature-validation`). John added further tests (`roles.test.js`, `invoices.test.js`, updated
  component/page tests) alongside the MockAPI/roles work — 37 tests total on
  `feat/mockapi-users-roles`.
