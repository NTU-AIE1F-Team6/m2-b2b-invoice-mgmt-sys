# Product Requirements Document
# B2B Invoice Management System

**Version:** 1.0 · **Date:** 22 September 2026  
**Status:** Review draft based on Starter Prompt V4  
**Team:** Jenn Fang, Ralph, John  
**Delivery window:** Seven days  
**Platform:** React + Vite frontend, MockAPI persistence, Vercel deployment, shared GitHub repository

## 1. Purpose and Product Outcome

Build a training application that enables a small business team to create, review, track, and manage B2B invoices. The application must demonstrate React engineering and shared persistent data through an understandable invoice lifecycle, including a basic maker-checker approval process.

The product is a working demonstration. IRAS, Peppol/InvoiceNow, and PayNow interactions are simulated. Successful simulation is not intended to be presented as actual end to end solution.

Success means the team can demonstrate invoice creation, persistence across browsers and users, search/filtering, role restrictions, controlled invoice changes, and approval/rejection at the deployed URL, with automated tests passing and every team member able to explain their contribution.

### 1.1 Source and decision precedence

| Source | How it informs this PRD |
|---|---|
| Starter Prompt-B2B Invoice Mgmt Sys_V4.md | Primary product scope, five epics, 18 stories, technology requirements, testing requirement, and open questions. |
| module2-project-brief.pdf | Assignment requirements, collaboration evidence, submission checklist, and presentation expectations. |
| singapore_invoicenow_app.html | Visual/interaction reference. Its localStorage persistence, status wording, and implementation details do not override V4. Relevant status and calculation code was inspected; visual fidelity is not prescribed. |
| Conversation decisions | Vercel hosts the frontend; MockAPI holds shared data. Prefer a resource-efficient model; two resources are proposed below. |


## 2. Users, Goals, and Boundaries

| Actor | Goal | Access |
|---|---|---|
| View-only user | Review invoices, totals, and statuses | Read-only application access; exact delete ambiguity resolved by proposal D1. |
| Edit user / maker | Create invoices and request controlled changes | Create and permitted management actions. |
| Eligible approver | Independently review a requested change | An Edit user meeting maker-checker rules; not a separate role. |

One shared demonstration company and one invoice collection serve the team. No customer-facing portal is required. Customers and products are predefined backend reference data.

### 2.1 Scope

| Classification | Included behaviour |
|---|---|
| Confirmed core | Login; dashboard; invoice list/detail; search/status filters; create with customer/product selection, number and due-date defaults, totals, save/cancel; shared persistence; role controls; due-date, delete, and Paid requests; basic approval/rejection. |
| Confirmed simulations | IRAS submission, Peppol/InvoiceNow integration, and PayNow QR generation. Simulations need visible labels; no external business transaction is performed. |
| Confirmed engineering | Vite, functional React/hooks, routing, controlled forms, Yup validation, state management, loading/error handling, Vitest, React Testing Library, GitHub Actions, public Vercel deployment, shared Git workflow. |
| Deferred in V4 | Customer-management and product-management features. |
| Ambiguous simulation scope | V4 also lists full audit trail, complex queues, PDF generation, email sending, and multi-company support under “Simulated”. Proposed D11 treats these as deferred rather than adding stub screens to the seven-day build. Basic maker-checker remains core. |

Basic approval and automated testing are not silently downgraded to optional work. If time is insufficient, record a scope revision before deferring a confirmed feature.

## 3. Outcomes and Release Measures

| Outcome | Acceptance evidence |
|---|---|
| Shared persistent invoices | Save in browser/session A; retrieve in browser/session B using the same MockAPI project; verify approved changes and deletion are also reflected after refetch. |
| Correct domain behaviour | Calculation, validation, role, and transition tests pass against agreed rules. |
| Independent approval | Maker cannot approve; a different eligible Edit user can approve or reject a pending request. |
| Recoverable operations | Failed reads expose retry; failed writes preserve input and do not display success or apply an unconfirmed local result. |
| Assignment completion | Public URL, working routes/create/read/delete, loading/errors, README and presentation, visible contribution from each member. |
| Repeatable checks | Tests execute on pushes and pull requests; build and lint checks pass for the release revision. |

## 4. Functional Requirements: Epic → User Story → Acceptance Criteria / Business Rules

The following 18 stories retain V4 IDs, wording, acceptance criteria, and open-question references for traceability. Proposed resolutions are collected in section 5 rather than silently rewriting source decisions.

| Epic | Name | Source UC | Stories |
|---|---|---|---|
| E1 | Login and Dashboard | UC1 | US1.1–US1.3 |
| E2 | Invoice Creation | UC2 | US2.1–US2.6 |
| E3 | Invoice Management | UC3 | US3.1–US3.4 |
| E4 | Access Control | UC9 | US4.1–US4.2 |
| E5 | Approval Flow | UC10 | US5.1–US5.3 |

### E1 — Login and Dashboard

| Story | User Story | Acceptance Criteria / Business Rules | Dependencies / Notes |
|---|---|---|---|
| US1.1 — Log in | As a registered user, I want to log in, so that I can access the invoice dashboard with my assigned permissions. | AC1: A login screen is provided. AC2: After successful login, the dashboard is displayed. BR1: The logged-in user determines the access role. | Depends on user and role data and E4. Authentication mechanism is unspecified. |
| US1.2 — View dashboard | As a user, I want to view invoice statistics and the invoice list, so that I can monitor invoice activity and open an invoice. | AC1: Display invoice count, overdue total, and paid total. AC2: Display the invoice list with each invoice's status. AC3: Selecting an invoice opens Manage Invoice. AC4: Display invoice action buttons according to role and status. BR1: Editing is available only for Draft invoices. | Depends on persisted invoices, E3, and E4. See Q1 and Q2. |
| US1.3 — Find invoices | As a user, I want to search and filter invoices, so that I can locate invoices requiring attention. | AC1: Search input filters the invoice list. AC2: Direct status-filter buttons filter the list by the selected status. | Search fields, matching behaviour, status list, and combined search/filter behaviour require definition (Q3). |

### E2 — Invoice Creation

| Story | User Story | Acceptance Criteria / Business Rules | Dependencies / Notes |
|---|---|---|---|
| US2.1 — Enter invoice details | As an edit-access user, I want to enter an invoice for a customer, so that I can record a billable transaction. | AC1: Customer selection uses a dropdown populated from predefined backend customers. AC2: The system automatically generates the invoice number. AC3: The initial due date is automatically populated. BR1: Creation requires Edit access. | Customer management remains a later-phase feature. Numbering and default due-date rules are unspecified (Q4). |
| US2.2 — Add billable items | As an edit-access user, I want to add products or services to an invoice, so that the invoice describes the charges and total amount. | AC1: Line items can be added. AC2: Products are selected from a dropdown populated from predefined backend products. AC3: Selecting a product automatically fills its description. AC4: Invoice totals are calculated automatically using frontend logic. | Product management remains a later-phase feature. Line fields, validation, formula, tax treatment, and rounding need definition (Q5). |
| US2.3 — Include simulated payment option | As an edit-access user, I want to select a PayNow QR option, so that the invoice can demonstrate instant B2B settlement. | AC1: Provide a checkbox to embed a Dynamic PayNow UEN QR code. BR1: QR generation and external payment integration are simulated. | No real payment processing is specified. |
| US2.4 — Save draft | As an edit-access user, I want to save an invoice as a draft, so that I can return to it later. | AC1: On successful save, persist the invoice with Draft status. AC2: Return to the dashboard. AC3: The saved invoice remains available across sessions and user access. | Depends on invoice entry and persistence. Validation details require definition (Q5). |
| US2.5 — Transmit invoice | As an edit-access user, I want to submit an invoice through a simulated IRAS transmission, so that I can demonstrate the submission flow. | AC1: Persist the invoice when submitted. AC2: Simulate sending to IRAS for “gst reg”, as described in the source. BR1: External interfaces are simulated. | Submission meaning, resulting status, and error behaviour are unresolved (Q6). |
| US2.6 — Cancel creation | As an edit-access user, I want to cancel invoice creation, so that I can discard unsaved input and return to the dashboard. | AC1: Cancel discards newly entered, unsaved data, if any. AC2: Navigate to Home (Dashboard). | Applies to unsaved invoice creation. |

### E3 — Invoice Management

| Story | User Story | Acceptance Criteria / Business Rules | Dependencies / Notes |
|---|---|---|---|
| US3.1 — View invoice | As a user, I want to view an existing invoice, so that I can review its details and status. | AC1: An invoice can be opened from the dashboard. AC2: Its stored details and current status are displayed. BR1: View-only and Edit roles support viewing. | The original UC3 specified Edit access for the combined management flow; viewing follows the UC9 role definitions. |
| US3.2 — Request due-date change | As an edit-access user, I want to request a due-date change, so that payment terms can be updated after review. | AC1: Provide a Due Date change action. BR1: Changing the due date requires approval. BR2: Apply the Draft-only editing restriction from UC1. | Depends on E4 and E5. Clarify applicability of Draft-only editing and approval timing (Q7). |
| US3.3 — Request deletion | As an edit-access user, I want to request invoice deletion, so that an invoice can be removed after review. | AC1: Provide a delete-request action. BR1: Invoice deletion requires approval. | Depends on E4 and E5. Original delete-permission wording is inconsistent (Q1). |
| US3.4 — Request paid-status update | As an edit-access user, I want to request that an invoice be marked Paid, so that received payment can be reflected after review. | AC1: Provide an action to request Paid status. BR1: The update requires approval. | Depends on E4 and E5. Eligible starting statuses and payment evidence requirements are unspecified (Q7). |

### E4 — Access Control

| Story | User Story | Acceptance Criteria / Business Rules | Dependencies / Notes |
|---|---|---|---|
| US4.1 — Review with View-only access | As a view-only user, I want to review invoice information, so that I can inspect invoices without changing them. | AC1: Invoice viewing is available. BR1: Apply the View-only role through business logic coded in the system. BR2: Mutation actions are governed by the permission matrix to be finalised. | Resolve the conflicting deletion wording before finalising acceptance checks (Q1). |
| US4.2 — Work with Edit access | As an edit-access user, I want to access invoice management and eligible approval actions, so that I can manage invoices within the permitted workflow. | BR1: The Edit role includes View, Edit, and Approver capabilities. BR2: Apply invoice-status restrictions to actions. BR3: Approval also requires the maker-checker conditions in E5. | Role assignment or administration UI is not specified. |

### E5 — Approval Flow

| Story | User Story | Acceptance Criteria / Business Rules | Dependencies / Notes |
|---|---|---|---|
| US5.1 — Review pending request | As an eligible approver, I want to pick up an invoice pending approval, so that I can review a controlled action. | AC1: An eligible Edit user can pick up an invoice with Pending Approval status. BR1: Approval is a special case of Manage Invoice. BR2: Approval requires Edit access. BR3: The approver cannot be the maker; UC10 explicitly excludes the invoice creator. BR4: Delete, due-date change, and Paid update require this flow. | Clarify whether maker also means change requester, and define entry into Pending Approval (Q8). |
| US5.2 — Approve request | As an eligible approver, I want to approve a pending action, so that an authorised invoice change can proceed. | AC1: Enable Approve when the invoice is Pending Approval and the user meets the Edit and maker-checker rules. BR1: The approved action follows the agreed execution and status-transition rules. | Detailed execution and post-approval status rules remain to be defined before implementation and testing (Q9). |
| US5.3 — Reject request | As an eligible approver, I want to reject a pending action, so that an unsuitable request does not proceed. | AC1: Enable Reject when the invoice is Pending Approval and the user meets the Edit and maker-checker rules. AC2: On rejection, change invoice status to Draft. | Handling of proposed changes and the previous invoice status requires clarification (Q10). |

## 5. Decision Register: Proposed Defaults for Review

These decisions make the PRD implementable but remain proposals. The Q references correspond to V4's unresolved requirements.

| ID / Source | Proposed default | Impact / confirmation needed |
|---|---|---|
| D1   | View-only users cannot create, modify, delete, transmit, or approve. Only Edit users can request deletion. | Resolves conflicting “View/Edit” wording in favour of the named roles. |
| D2 | Persist Draft, Transmitted, Pending Approval, or Paid. Treat Overdue as a derived flag for unpaid transmitted invoices whose due date is before today; retain that flag while an approval request is pending. | Avoids replacing workflow status with a date-derived status. Use Singapore calendar dates for this demo. |
| D3 | Search invoice number and customer name with trimmed, case-insensitive substring matching. Combine search and status filter with AND. Filters: All, Draft, Transmitted, Pending Approval, Paid, Overdue. | Overdue filter may include pending invoices whose prior status was Transmitted. Summary cards use all invoices, not the filtered subset. |
| D4 | Assign a client-generated UUID as stable client reference once per new form; display invoice number INV- followed by that UUID. Default issue date to today and due date to issue date + 30 calendar days. | Avoids sequential-number collisions without server coordination. MockAPI's record ID remains separate. No gapless or legal numbering guarantee. |
| D5 | Single SGD currency; positive whole-number quantity; unit price with at most two decimals; at least one line; no discounts/partial payments. Calculate each line in integer cents, then subtotal. Apply a configurable demo tax rate, initially 9%, rounding tax once to the nearest cent with half-up rounding. | The initial rate follows the supplied mockup, not a claim of tax compliance. Tax is a simulation setting, captured on each invoice. |
| D6 | “Transmit” means simulated invoice submission, not GST registration. Successful submission sets Transmitted and records simulated transmission time/reference; failure leaves the prior state or unsaved form intact. | Replace the ambiguous “gst reg” wording in UI. No actual IRAS or Peppol call. |
| D7 | Existing due-date changes are allowed only from Draft. Delete requests are allowed from Draft or Transmitted. Paid requests are allowed only from Transmitted. Block all new changes while pending; Paid invoices are read-only. | Conservative state policy consistent with Draft-only editing; extending a transmitted invoice's due date would require a scope/rule change. |
| D8 | Approver must differ from both invoice creator and change requester. Permit one pending request per invoice; requesting a change persists Pending Approval plus the prior status and proposed values. | Stricter than creator-only wording. If creator and requester differ, a third Edit user is needed. Seed at least three Edit demo users and one View-only user. |
| D9 | Approve due-date change: apply date and return to Draft. Approve Paid: set Paid. Approve deletion: delete the record. Clear the pending request after a successful non-delete decision. | Proposed execution rules; deletion does not preserve an audit record. |
| D10 | Reject any request: discard proposed changes, clear pending request, retain existing invoice fields, set Draft. | Preserves V4's explicit rejection rule. A rejected Paid/delete request on a transmitted invoice therefore returns it to Draft; previous simulated transmission metadata may remain as historical context. |
| D11 / scope | Defer full audit history, advanced queues, actual/stub PDF and email features, and multi-company support. Keep only basic approval and the named submission/payment simulations. | Clarifies the ambiguous “Simulated” list without expanding the MVP. |
| D12 / login | Use predefined demo identities and roles, with a local session selection; no real credentials or account administration. | Reuses the CRM mock-auth approach. Browser role checks are demonstration controls, not server-enforced authorization. |
| D13 / resources | Use two MockAPI resources: invoices and referenceData. Embed line items and pending requests inside invoices; put customers, products, and demo identities in typed reference records. | Confirm account capacity and nested-value round-trip in a setup spike. Resource allowance is not assumed from a pricing claim. |

## 6. Proposed Permission and Lifecycle Rules

### 6.1 Action matrix

| Action | View-only | Edit | Status / additional condition |
|---|---|---|---|
| Dashboard, search, filter, view | Yes | Yes | Any existing invoice |
| Create and save new invoice | No | Yes | Valid new form |
| Simulate transmission | No | Yes | Valid new form or existing Draft; no pending request |
| Request due-date change | No | Yes | Draft only |
| Request deletion | No | Yes | Draft or Transmitted |
| Request Paid | No | Yes | Transmitted only |
| Approve / reject | No | Eligible users only | Pending Approval; actor differs from creator and requester |

Apply these rules both to displayed controls and to action handlers. Direct navigation must not expose editable controls to an ineligible user. Persisted Draft editing is limited to due-date requests; reopening a draft does not imply customer or line-item editing, which V4 does not specify.

### 6.2 Transition table

| Current state | Event | Result after successful API response |
|---|---|---|
| New unsaved form | Save Draft | Persist Draft and return to dashboard |
| New unsaved form | Simulate transmission | Persist Transmitted and return to dashboard |
| Draft | Simulate transmission | Transmitted |
| Draft | Request due-date change or deletion | Pending Approval; original values preserved |
| Transmitted | Request Paid or deletion | Pending Approval; original values preserved |
| Pending Approval: due date | Approve | Apply proposed due date; Draft |
| Pending Approval: Paid | Approve | Paid; record decision time |
| Pending Approval: delete | Approve | Record removed; return to dashboard |
| Pending Approval: any action | Reject | Draft; discard request; preserve original invoice fields |
| Any attempted write | API failure | No confirmed transition; retain input and show actionable error |
| Paid | Mutation attempt | Denied; remains Paid |

Overdue is never written as a workflow transition. An invoice due today is not overdue. For Pending Approval, use priorStatus when calculating whether it represents an unpaid transmitted invoice.

**Dashboard definitions:** invoice count is all existing records; paid total is the sum of totals for Paid records; overdue total is the sum of totals satisfying the overdue predicate. No partial-payment balance is modelled. Loading or unavailable data must not be represented as confirmed zero values.

## 7. Proposed Forms and Calculation Rules

| Field / action | Validation and behaviour |
|---|---|
| Customer | Required; selected from available backend customer records; retain customer ID and display-name snapshot. |
| Invoice number | Generated and read-only; retained through failed saves and retries. |
| Issue/due dates | Valid date-only values; initial due date +30 days; due date cannot precede issue date. Existing approved/seeded past due dates remain displayable. A proposed new due date must also be today or later. |
| Line items | At least one line; product required from backend list; description populated from product and retained as snapshot. Proposed remove-line control may remove a row, but the submitted form must still contain one valid line. |
| Quantity | Required positive whole number; reject zero, negatives, fractions, and non-numeric values. |
| Unit price | Required non-negative amount with at most two decimal places; populate from product and permit correction during new invoice entry. Reject non-finite values. |
| Totals | Derived, read-only; line cents = quantity × unit-price cents; subtotal = sum of line cents; tax cents = round-half-up(subtotal cents × captured tax rate); total = subtotal + tax. Reject values outside safe supported arithmetic bounds. |
| PayNow option | Boolean retained on invoice; checked state displays a clearly labelled simulated QR placeholder. No real payment destination. |
| Save / transmit | Validate on blur using Yup and validate the entire controlled form on submit. Show field errors and block invalid submission. Draft uses the same minimum validation rules as transmit in this MVP. |
| Request / decision | Display action summary and proposed change; require a valid eligible state and user; disable repeated submission while awaiting response. Rejection reason is not required in the MVP. |

Example calculation using the proposed 9% demo rate: 2 × SGD 12.50 plus 1 × SGD 5.00 gives subtotal SGD 30.00, tax SGD 2.70, total SGD 32.70. Half-cent rounding example: SGD 0.50 subtotal yields SGD 0.045 tax, rounded to SGD 0.05.

## 8. Data and Persistence Requirements

Vercel serves the frontend; MockAPI is the shared application-data source. React state holds loaded data and unsaved input. localStorage may retain the demo session but must not be the authoritative invoice store. Seed data once during setup, not on every page load.

### 8.1 Proposed resource model

| Resource | Fields / structure |
|---|---|
| invoices | id (MockAPI ID); clientReference; invoiceNumber; customerId; customerSnapshot; issueDate; dueDate; currency; items[]; subtotalCents; taxRate; taxCents; totalCents; status; includePayNowQR; createdBy; createdAt; updatedAt; simulatedTransmission; pendingRequest; lastDecision. |
| invoices.items[] | lineId, productId, productName, description, quantity, unitPriceCents, lineTotalCents. Embedded snapshots preserve historic display if reference data changes. |
| invoices.pendingRequest | requestId, action (CHANGE_DUE_DATE / DELETE / MARK_PAID), requestedBy, requestedAt, priorStatus, proposedDueDate when applicable. Null if no request. |
| invoices.lastDecision | requestId, action, result, decidedBy, decidedAt. Only the most recent result; not a full audit log. Removed with the invoice on approved deletion. |
| invoices.simulatedTransmission | Explicit simulated flag, reference, transmittedAt; null before transmission. |
| referenceData | id, type (customer / product / user), name, active; customer fields such as customer code; product description and unitPriceCents; demo user role (VIEW_ONLY / EDIT). No real passwords. |

Store timestamps in UTC and business dates as YYYY-MM-DD. Apply the agreed Singapore date policy when deriving today and overdue state. Keep record IDs as opaque strings. Line items, dashboards, approval queues, and calculations do not require separate API resources.

### 8.2 API operations

| Operation | Expected API interaction |
|---|---|
| Load dashboard or refresh | GET invoices |
| Open invoice | GET invoices/:id |
| Load predefined data | GET referenceData, then separate by type |
| Save new / submit new | POST invoices |
| Transmit existing / request change / approve non-delete / reject | Update invoices/:id with the complete resulting invoice state |
| Approve delete | DELETE invoices/:id |

Before a decision, refetch the invoice and verify request ID, status, and actor eligibility. If the request has changed, reload and explain that it can no longer be processed. This reduces stale actions but cannot guarantee atomic multi-user updates with a simple mock backend. Simultaneous decision conflict resolution is outside the demo guarantee and requires backend enforcement for a production version.

Disable duplicate submits. Following an ambiguous create timeout, check for the same clientReference before retrying; do not blindly issue another create. A missing invoice opens a not-found state and dashboard link. Failed saves leave entered values available for retry. Refetch after successful mutations and on entering relevant screens; automatic realtime updates are not required.

## 9. UX, Routing, and Technical Structure

### 9.1 Proposed screens

| Route | Main responsibility |
|---|---|
| /login | Choose/sign in as a predefined demo user; clear invalid-login feedback |
| /app/dashboard | Summary cards, search, status filters, invoice list, role-aware actions |
| /app/invoices/new | Controlled creation form, line items, totals, PayNow simulation option, Save Draft / Transmit / Cancel |
| /app/invoices/:id | Detail, permitted requests, and approval controls with original/proposed values |
| Unmatched route | Not-found view with a usable navigation link |

Provide logout and display the active demo identity/role so maker-checker demonstrations are understandable. An unauthenticated protected-route visit redirects to login. Deep links must load correctly after a browser refresh on Vercel.

Reuse the supplied mockup's visual structure as a guide, while replacing claims of compliance with explicit simulation wording. Forms need visible labels, field-linked errors, keyboard-operable controls, and disabled/loading states. Status must be conveyed in text, not colour alone. Show distinct loading, empty collection, no search results, missing record, and API-failure states. Use a usable narrow-screen layout without making visual polish a delivery blocker.

**Visual Mockup** 

[View Mockup](./singapore_invoicenow_app.html)

### 9.2 Implementation constraints

- Use React with Vite, functional components, hooks, JSX, props, and component composition; no class components.
- Use React Router for client-side navigation. Share state through useState/useReducer, using Context where it helps multiple routes.
- Adapt the CRM AuthProvider and CustomerProvider patterns into demo-auth and invoice state. Separate API calls, calculations, validation schemas, and permission/transition functions from page components so they can be tested independently.
- Use useEffect for loading data and represent loading/error/submitting state explicitly. Keep form input local until persisted.
- Use Yup for field validation on blur and whole-form validation on submit.
- Keep API base configuration outside components through the build environment. Do not put secrets in frontend configuration; the demo uses no genuine credentials or customer data.
- Reuse existing styling/component patterns. Lazy loading and memoization are optional tools, not required features.

### 9.3 Ideal API design

| Available endpoints | Suggested arrangement |
| --- | --- |
| 2 | Invoices + reference data | 
| 3 | Invoices + customers + products; predefined mock users in the frontend | 
| 4 | Invoices + customers + products + mock users |

### 9.4 Starting Highlevel Architecture
![System Architecture](./B2B-Invoice-System-Technical-Architecture_PRD-V1.svg)


## 10. Automated Testing and Verification

Automated testing will use Vitest for unit tests and React Testing Library for component tests. Prioritise invoice calculations, form validation, role permissions, maker-checker restrictions, and approval transitions. Mock API responses during tests to avoid dependency on live MockAPI data. Configure GitHub Actions to run tests on pushes and pull requests.

| Test area | Required examples | Story traceability |
|---|---|---|
| Calculations | Multiple lines; zero-priced line; invalid quantity; cent precision and half-cent tax rounding; totals recomputed from valid values | US2.2 |
| Yup validation | Missing customer/product; zero or fractional quantity; negative price; invalid date; due date before issue date; empty line list; valid submission | US2.1, US2.2, US2.4, US2.5, US3.2 |
| Role permissions | View-only mutation denied; Edit actions by status; direct handler checks; pending and Paid mutation restrictions | US1.2, US4.1, US4.2 |
| Maker-checker | Creator denied; requester denied under D8; eligible other Edit user allowed; View-only denied | US5.1–US5.3 |
| Transition logic | Every allowed transition in section 6; invalid transitions denied; reject returns Draft and discards proposed values; approved due date applied; paid update; delete operation | US3.2–US3.4, US5.2, US5.3 |
| Dashboard and search | Paid/overdue sums; due-today boundary; pending overdue state; case-insensitive matching; combined filter; empty results | US1.2, US1.3 |
| Component behaviour | Blur/submit errors; add line; live totals; submit disabled while saving; save returns dashboard; cancel discards input | US2.1–US2.6 |
| API-backed UI with mocked responses | Loading/error/retry; successful persistence payload; failed save retains input; deleted/missing detail; changed request blocks stale decision | US2.4, US3.1, US5.2, US5.3 |
| Demo authentication | Successful login, role assignment, protected route, logout | US1.1, US4.1, US4.2 |

Run unit and component tests locally during development and once in CI without watch mode. The proposed CI checks are dependency install from lockfile, lint, tests, and production build. Do not require real MockAPI credentials or network access in tests. Coverage reporting is useful for locating untested rules; no arbitrary percentage is required. Every permitted and forbidden permission/approval path must have a test.

Separately perform a small manual deployed smoke test with demo data: browser A creates an invoice, browser B reloads and sees it, a controlled change is reviewed by another identity, then approved deletion removes a disposable invoice. This verifies actual integration without making unit tests depend on live shared data.

## 11. Delivery Plan and Collaboration

The team already has experience with forms and Yup validation, React routing, Context/reducer, CRUD, filtering, and build tooling. New effort centres on invoice arithmetic, consistent status transitions, approval rules, hosted persistence, and test automation.

V4 specifies seven days and “6 hours daily” but does not say whether that is per member or for the team. The assignment estimates roughly 5–8 hours per member outside class. Do not assume a 126-person-hour budget; confirm actual availability at kickoff and adjust workload. The schedule below is sequencing, not an effort guarantee.

| Day | Deliverable / checkpoint |
|---|---|
| 1 | Review D1–D13; agree data contracts and available hours; scaffold routes/state/tests/CI; verify MockAPI nested data and Vercel deep links. |
| 2 | Login/roles and reference data; dashboard/list loading; creation form with Yup and calculation tests. |
| 3 | Complete create/read and shared persistence; search/filter; error handling; seed demo records. |
| 4 | Implement requests, eligibility, and approval/rejection with transition tests; complete real DELETE after approval. |
| 5 | Integrate transmission/QR simulations; component tests; deployed multi-user smoke test. |
| 6 | Fix integration defects; verify assignment checklist; finish README, screenshots, and draft slides. |
| 7 | Run release checks; rehearse the 10–15 minute presentation/demo; submit repository and public URL. |

### 11.1 Suggested ownership, subject to team agreement

- Each member must touch state management, at least one route, and data fetching or component composition. 
- All members must be able to explain the code, including AI-assisted work.

***Option A***

| Member | Primary work | Required cross-cutting contribution |
|---|---|---|
| John | Shared state, domain rules, invoice detail/approval route, CI integration | Reducer/transition tests plus API-backed detail/approval components |
| Jenn Fang | New invoice route, controlled form, Yup schemas, line calculations | Local form state, reference-data loading, calculation and form tests |
| Ralph | Dashboard route, list/search/filter, summary cards, demo login UI | Search/filter state, invoice loading, dashboard/role component tests |

***Option B***

| Member | Independent feature ownership | State and data work | Automated tests |
|---|---|---|---|
| Jenn Fang | New Invoice route and form | Form state, customer/product loading, invoice creation | Yup validation, calculations, save/cancel | 
| Ralph | Dashboard route, list, search/filter, summaries | Invoice loading, filter state, refresh handling | Summary calculations, search/filter, loading/errors |
| John | Invoice Detail route and approval workflow	| Detail loading, pending requests, approval/rejection | Permissions, maker-checker, transitions |

### 11.2 Assignments for Pull Request, Review and Merge action

- Use feature branches and pull requests or an agreed equivalent; all members must commit.
- Maintain issues or a visible task list. 

| PR author | Reviewer | Perform Merge |
| --- | --- | --- | 
| Jenn Fang | Ralph | Jenn Fang |
| Ralph | John | Ralph |
| John | Jenn Fang | John |



## 12. Risks, Limitations, and Mitigations

| Risk | Response |
|---|---|
| Scope exceeds actual available hours | Resolve workflow decisions on day 1; integrate early; defer D11 features first; explicitly revise scope if confirmed features cannot fit. |
| MockAPI plan/resource or nested-data constraints | Verify actual account capacity and round-trip data early; use two resources as proposed; do not assume paid features. |
| Demo role checks mistaken for production security | Label authentication and approvals as demonstrations. Production would need authenticated backend authorization and protected storage. |
| Simultaneous decisions overwrite each other | Refetch and check pending request before writes; document the lack of atomic server enforcement; coordinate demo writes. |
| Ambiguous rejection semantics | Show D10 explicitly and test it; obtain a deliberate decision before release rather than restoring prior state silently. |
| Prototype wording implies real compliance/payment | Show simulation labels and remove compliance claims; no actual external submission or payment call. |
| Tests become fragile or slow | Test observable behaviour and pure rules; mock network responses; avoid snapshot-only coverage or dependence on demo data. |
| Deployed app loads but API/deep links fail | Test deployed routes, configured API base URL, read/write persistence, and refresh before demo day. |

## 13. Release and Submission Checklist

- [ ] Review decisions D1–D13 and update this PRD with accepted outcomes.
- [ ] All 18 stories are implemented against agreed acceptance criteria, or any scope change is explicitly recorded.
- [ ] Draft creation, simulated transmission, due-date approval, Paid approval, rejection, and approved deletion work end to end.
- [ ] Dashboard, search/filter, validation, role restrictions, and maker-checker denial paths work.
- [ ] Data persists across sessions and users; customers/products load from backend reference data.
- [ ] Loading, API failures, empty states, duplicate-submit protection, and missing records are handled.
- [ ] Vitest and React Testing Library tests pass; GitHub Actions runs tests on pushes and pull requests; lint and build pass.
- [ ] Vercel public URL and route refresh work; deployed multi-user smoke test passes.
- [ ] Shared repo shows regular contributions, branches/PRs or equivalent, and visible task allocation.
- [ ] README includes app purpose, team/work division, local setup, environment configuration, deployed URL, screenshot/recording, completed bonus features, and AI/tools disclosure with external-source links.
- [ ] Short slide deck includes problem, technology choices, working screenshots, each member's learning, and challenges; rehearse a 10–15 minute presentation including demo.
- [ ] Submit one team repository link through the assignment submission channel before Lesson 2.19; confirm the actual date with the instructor.

## 14. Assignment Traceability

| Assignment requirement | Planned evidence |
|---|---|
| Vite, functional components/hooks, JSX/props/composition | Application structure and reusable form/list/detail components |
| At least two routed views | Dashboard, create, detail, login routes |
| State management | Form state and invoice reducer/context where justified |
| External/mock data with loading and errors | MockAPI resource loading and mutation UI |
| Controlled create form | Invoice creation with Yup |
| Read and delete collection items | Dashboard/detail and approved invoice deletion |
| Public deployment | Vercel URL |
| Collaboration and contribution | Commits, feature branches/PRs, task board, ownership evidence |
| Bonus examples selected by product scope | Search/filter, Update, mock auth, React Testing Library tests |
| Submission and presentation | README and demo/slide checklist above |

Automated tests and basic approval remain requirements of this product even though React Testing Library is a bonus in the assignment brief. The PRD does not claim the application, tests, deployment, or submission have already been completed.
