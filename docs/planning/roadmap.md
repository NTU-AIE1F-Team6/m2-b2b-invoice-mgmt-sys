# Roadmap

## Open branches, in intended merge order

| # | Branch | PR | Depends on | Notes |
|---|---|---|---|---|
| 1 | `chore/remove-unused-docs` | #3 | — | Trivial, no conflicts expected |
| 2 | `chore/github-workflow` | #4 | — | Trivial, no conflicts expected |
| 3 | `feat/mockapi-users-roles` | #5 | — | The core feature branch |
| 4 | `chore/rename-easyinvoice` | #6 | — | **Will conflict with #5** (both touch README, AppShell, Navbar, tour.js, useInvoices.js, etc.). Merge order between #5 and #6 doesn't matter functionally, but whichever merges second needs a conflict-resolution pass. Verified locally (`integration/all-local`, not pushed): ~4 conflicts, all mechanical, plus one non-obvious fix (a test's hardcoded pre-rename session key) that only surfaces by re-running the suite after merging, not from git's conflict markers. |
| 5 | `chore/upgrade-react19-vite8` | not yet opened | #5, #6 | Deliberately held back until #5 and #6 land, since it touches the same route files (`react-router-dom` → `react-router` import rename) as both. Verified working combined with everything else on `integration/all-local`. |
| 6 | `docs/submission-checklist` | not yet opened | #3-#6 | README's team/AI-disclosure/bonus-challenges sections currently describe *pre-merge* `main`; needs a pass once the above land to update login credentials (admin/clerk → viewer/john/jennfang/ralph), branding, and the MockAPI setup section from "in review" to "live." |

`main` is already deployed to Vercel (`https://aie1f-easyinvoice.vercel.app`) and auto-redeploys on
every merge, so each PR above should be spot-checked on the live URL after merging, not just
tested locally.

## Deferred / explicitly out of scope

- **Maker-checker (PRD E5, D8-D10)** — request/approve/reject flow for EDIT actions. Schema has
  room for it (`pendingRequest`, always `null` today) but it is not implemented. Biggest single
  piece of future work if this continues past the course submission.
- **Optimistic UI updates** — writes wait for the API to confirm before updating the UI, by
  design (see `docs/engineering/architecture.md` §5). Revisit only if the MockAPI round-trip
  latency becomes a real UX problem.
- **Drag-and-drop reordering** (brief's "Hard" bonus) — not attempted.
- **Folder restructure** (handoff §6's proposed `components/layout/`, `components/invoices/`
  split) — explicitly excluded from the rename PR; needs the team's sign-off on the proposed
  layout before anyone starts it.
- **NAS deploy** (`scripts/deploy.ps1`, `artificialintelligence.sg/invoicenow/`) — was Ralph's
  original prototype deployment, not the project's canonical one. **Vercel is the project's live
  deployment** (`https://aie1f-easyinvoice.vercel.app`). The NAS script/URL are kept only as
  reference and are not being updated to track the app's current state (still pre-rename,
  pre-MockAPI, old credentials).
- **`InvoiceForm`, `CreateInvoicePage`/`EditInvoicePage` guards, `CustomersPage`/`ProductsPage`
  tests** — see `docs/engineering/testing.md` "Not yet covered."
