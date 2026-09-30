# Roadmap

## Current baseline

The core integration branches and PRs #3-#7 and #9 are merged into `main`. EasyInvoice currently
includes the React/Vite application, MockAPI persistence, VIEW_ONLY/EDIT roles, 37 automated tests,
GitHub Actions, Vercel deployment configuration, and engineering documentation.

## Before Module 2 submission

| Priority | Work | Owner |
|---|---|---|
| Required | Capture and commit the screenshots/recording listed in `docs/screenshots/README.md` | TODO: assign |
| Required | Replace each learning-statement placeholder in `docs/team/contributions.md` | Ralph, Jenn, John |
| Required | Verify live Vercel login, deep-link refresh, and MockAPI persistence from two sessions | TODO: assign |
| Required | Add final slide deck/link and rehearse a 10-15 minute presentation | TODO: assign |
| Required | Confirm whether additional external/tutorial sources must be disclosed | All members |
| Recommended | Confirm/link GitHub Projects evidence if a board exists | TODO: assign |
| Recommended | Re-run `npm test`, `npm run build`, and production smoke checks on the final revision | Reviewer/release owner |

## Future phases

### Phase 2 - workflow and integrity

- Maker-checker request/approve/reject flow (PRD E5/D8-D10).
- Backend validation, authorization, audit log, version checks, and server-generated invoice IDs.
- Expanded InvoiceForm, route-guard, Customers, Products, accessibility, and end-to-end tests.
- Lint, formatting, static typing or runtime schema validation in CI.

### Phase 3 - integrations and operations

- Real Peppol/InvoiceNow, IRAS, PayNow, email, and PDF integrations.
- Staging, monitoring, alerting, backups, migration/versioning, and rollback automation.
- Customer/product management, multi-company support, reporting, and reconciliation.

### Optional learning challenges

- Optimistic UI with rollback/conflict handling.
- Native drag-and-drop reordering from the assignment's hard bonus challenge.
- Component folder restructuring after the team agrees on ownership/boundaries.

The full rationale and limitations are in `docs/product/scope-and-limitations.md`.
