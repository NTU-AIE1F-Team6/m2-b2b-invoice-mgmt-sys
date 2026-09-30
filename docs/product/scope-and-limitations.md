# Product scope, constraints, and limitations

**Release baseline:** 1.0.0  
**Status:** learning demonstration

## Purpose and audience

EasyInvoice demonstrates React application engineering through an invoice-management domain. The
intended demo user is a small-business finance or accounts receivable team member. The intended
learning audience is the project team and Module 2 assessors.

It is not intended for real invoices, customers, tax reporting, Peppol transmission, or payment
processing.

## Implemented scope

### User experience

- Client-side login/logout and protected application routes.
- Dashboard with totals, invoice cards, status, search, filtering, loading/error/empty states.
- Controlled create/edit form with customer/product selections and multiple line items.
- Automatic invoice number, due-date default, line totals, 9% GST, and total.
- Draft creation, edit, simulated transmit/retry, mark-paid, and delete actions.
- VIEW_ONLY and EDIT role behaviour.
- Customer and product catalogue pages, FX rate card, illustrative contact data, Tour, and hints.

### Data and persistence

- MockAPI `invoices` CRUD resource.
- Combined MockAPI `referenceData` resource with customer/product `type` discriminators.
- Static read-only JSON fallback when `VITE_MOCKAPI_URL` is absent.
- Loading, retry, HTTP errors, mutation errors, busy-state double-submit prevention, and API-first
  state updates.

### Engineering

- React 19 functional components/hooks, React Router 7, Vite 8, Tailwind CSS 4.
- Reducer-based shared invoice state and Context-based demo session state.
- Vitest/React Testing Library suite and GitHub Actions test/build pipeline.
- Vercel deployment, SPA rewrite, and route-folder postbuild support for static hosting.

## Deferred future phases

### Phase 2 - workflow integrity

- Maker-checker request, approval, and rejection for controlled changes.
- Server-side state-transition enforcement and immutable audit trail.
- Concurrency/version checks and idempotent writes.
- Server-generated unique invoice numbers.

### Phase 3 - production integrations

- Authenticated identity provider and server-side role enforcement.
- Real Peppol/InvoiceNow Access Point and IRAS integration.
- Dynamic PayNow QR generation and verified payment status.
- Email delivery, PDF invoices, webhooks, notifications, and reconciliation.

### Phase 4 - broader product capability

- Customer/product administration and validation.
- Multi-company/tenant separation.
- Reporting, pagination, exports, attachments, and retention controls.
- Expanded accessibility, performance, security, end-to-end, and contract testing.

## Constraints and limitations

### Security and privacy

- Accounts, password digest, permissions, and rules are downloaded to the browser.
- Route guards and hidden buttons do not secure the underlying MockAPI endpoints.
- MockAPI has no application-specific authentication; possession of its URL enables direct access.
- There is no secrets vault, per-user API token, server-side authorization, encryption policy,
  privacy assessment, or production logging/redaction.
- Only synthetic demo data should be used.

### Data integrity

- MockAPI stores JSON but does not enforce the documented invoice/reference-data schema.
- There are no foreign keys, transactions, uniqueness constraints, migrations, or atomic workflow
  transitions.
- Full-record PUT operations and last-write-wins behaviour can overwrite concurrent changes.
- Invoice numbers are computed from the currently loaded client list and can collide.
- The seed command deletes existing records before recreating demo data.

### Domain fidelity

- Transmission is a timer plus a UEN-format test, not network delivery or directory lookup.
- `includePayNowQR` stores intent but does not generate a QR code.
- GST is a fixed 9% client-side calculation; exemptions, rounding policies, currencies, credits,
  partial payments, and regulatory invoice requirements are outside the demo.
- Status transitions are simplified and have no backend enforcement or audit proof.

### Availability and operations

- MockAPI, Frankfurter, randomuser.me, GitHub, and Vercel are external dependencies with their own
  free-tier limits and availability.
- Static fallback provides read-only demo data, not offline synchronisation.
- There is no staging environment, uptime monitoring, alerting, backup/restore procedure,
  disaster-recovery objective, or automated rollback.
- Client errors are displayed to users but are not sent to an observability service.

### Quality coverage

- Unit/component/integration-style tests cover important calculations, roles, API paths, state
  failure semantics, and dashboard behaviour.
- There is no automated lint script, static type system, schema validation, accessibility scan,
  security scan, visual regression test, or full browser end-to-end CI job.
- Dedicated tests for InvoiceForm, route guards, Customers, and Products remain deferred.

## Why these choices fit the assignment

The assignment evaluates component composition, hooks/state, routing, data fetching/persistence,
controlled forms, CRUD behaviour, collaboration, and public deployment. MockAPI makes shared
persistence observable without adding an ungraded server implementation. Keeping rules in the
React application exposes state transitions and error handling for discussion and testing.

The trade-off is intentional: this design is clear for learning, but its client trust model and
mock persistence are unsuitable for business-critical invoice processing.

