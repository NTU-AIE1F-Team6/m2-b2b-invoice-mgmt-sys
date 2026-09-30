# Roadmap

## Current baseline

EasyInvoice currently
includes the React/Vite application, MockAPI persistence, VIEW_ONLY/EDIT roles, 37 automated tests,
GitHub Actions, Vercel deployment configuration, and engineering documentation.

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

The full rationale and limitations are in `docs/requirements/scope-and-limitations.md`.
