# John — Task List

- [x] MockAPI project setup, seed script (`scripts/seed-mockapi.mjs`)
- [x] API layer with offline fallback: `src/api/client.js`, `invoices.js`, `referenceData.js`
- [x] Rewrite `useInvoices` off localStorage onto MockAPI (state only changes once the API confirms)
- [x] Roles/permissions: `src/data/roles.js` (`can()`), updated `src/data/users.js`
- [x] Tests: `roles.test.js`, `invoices.test.js`, updated component/page tests for the new shape (37 total)
- [x] CI workflow (`.github/workflows/ci.yml`)
- [x] GitHub structure review (`docs/handoffs/John/github-structure-review.md`) + CODEOWNERS, PR template, CONTRIBUTING.md
- [x] Rename InvoiceNow SG -> EasyInvoice (product branding, not folder structure)
- [x] Dependency upgrade: React 19, react-router 7, Vite 8 (matches the course's current scaffold versions)
- [x] Vercel deployment (auto-redeploys on merge to `main`)
- [x] PRs #3-#7 and #9 reviewed-and-merged into `main` (self-merged; formal team review still
      pending on most — see the review-rotation note below)
- [x] Engineering/planning docs: `docs/engineering/architecture.md`, `testing.md`,
      `docs/planning/roadmap.md`, `presentation-outline.md`, `docs/decisions/decisions-log.md`
- [ ] PR #8 (README local-dev-url fix) — open, unmerged
- [ ] Get an actual review from Jenn or Ralph on at least one PR (everything so far has been
      self-merged out of time pressure, not because the rotation in `CONTRIBUTING.md` was followed)
- [ ] Presentation slide deck (outline exists at `docs/planning/presentation-outline.md`, deck
      itself not built)
- [ ] GitHub Issues/labels/Projects board (flagged in `docs/handoffs/John/github-structure-review.md`,
      never actioned)

Full detail: `docs/handoffs/John/HANDOFF-easyinvoice-mockapi.md`.
