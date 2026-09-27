# Business-to-Business Invoice Management System
## React Frontend starting prompt 
This document is a starter prompt to produce Product Requirements Document for B2B Invoice Management System Reactjs Frontend.

Frontend is to be built using Reactjs, mockapi, Vercel deployment from shared Github repo. Data to be persisted across sessions and user access.

Solution to be built as a training assignment but should be meaningful for real world application. Hybrid coding using AI with human coding input. 

Frontend coding team comprises Jenn Fang, Ralph, John. 

Timeline is 7 days. Team is managing daytime work and can only commit 6 hours daily for this project. Scope that cannot fit into timeline will be deferred into future phases. 


## Related documents and sources
- File: module2-project-brief.pdf
- when producing detailed plan read the project brief pdf for Reactjs concepts to be demonstrated in solution.  
- Previous project done by Team showing the react concepts implemented. Folder: ~/Documents/code/NTU-AIE/ai-2.11-form-validation-deployment/simple-crm-web-soln/
- architecture of previous project "simple-crm-web-soln" File: simple-crm-architecture (Qwen3.8-27B-mlx).svg 


## Team Capability Baseline — Previous CRM Project

Source: the supplied `simple-crm-architecture (Qwen3.8-27B-mlx).svg` architecture diagram and the team's confirmation that form validation was included. This baseline describes capabilities represented in the previous project; it is not a source-code audit.

| Existing Capability | Evidence in Previous Project | Application to Invoice Project |
|---|---|---|
| React + Vite and component composition | Functional React SPA, shared components, CSS Modules, and static build | Reuse the page/component organisation for the invoice dashboard, list, detail, and forms. |
| Routing and access controls | React Router, nested layout with Outlet, ProtectedRoute, AuthContext, login/logout, and role checks | Adapt the existing demo-login and route-protection patterns for View-only and Edit roles. |
| Shared state and asynchronous data | CustomerProvider with Context + useReducer; loading, error, and submitting states | Adapt these patterns to invoice state and API operations. |
| REST CRUD and persistence | Customer GET, POST, PUT, and DELETE calls through json-server backed by db.json | Adapt the API integration to hosted MockAPI for shared invoice persistence. The diagram identifies the old API as development-only. |
| Search, filters, and dashboard | Derived filteredCustomers, search/status filters, and dashboard summary | Apply the existing patterns to invoice search, status filters, and summary totals. |
| Form validation with Yup | customerSchema for required fields and email; interactionSchema for minimum text length and no-future-date checks; validateAt on blur and validate on submit | Reuse the schema-validation approach for invoice forms. Define invoice-specific customer, due-date, quantity, price, and line-item rules; do not copy CRM rules without checking their relevance. |
| Build and code quality tooling | Vite build, ESLint, Prettier, environment-based API URL, and SPA fallback configuration | Reuse the build and lint workflow; configure the hosted API URL and Vercel routing for this project. |
| Additional React patterns | React.lazy, Suspense, useMemo, and useCallback | Apply where the invoice application benefits; these are available experience rather than additional feature requirements. |

Planning should treat form validation, CRUD, routing, shared state, and search/filter implementation as existing team experience. Invoice line-item calculations, invoice status transitions, and maker-checker approval are new domain-specific work. Vitest, React Testing Library, and GitHub Actions test automation are required for this project but are not evidenced in the supplied diagram. Allow time for their setup and adoption. The diagram shows a static deployment pattern, not proof of an already working hosted production API.

## Core Technical Requirements
- Component-based UI with JSX, props, and composition
- State with useState , and useReducer where it fits
- Handling events and lifting state up
- Form validation using the team's existing Yup schema-validation approach, including field validation on blur and form validation on submit; invoice-specific rules to be defined
- Conditional rendering and rendering lists
- Fetching and displaying data with useEffect
- Context API, where the app's complexity warrants it
- Client-side routing with React Router
- Working as a team on a shared codebase with Git and GitHub
- Built with Vite
- Functional components and React hooks throughout, no class components
- UI organised into multiple, sensibly scoped components, with props passed cleanly
- At least two client-side routes with React Router, with navigation between them
- Shared state managed with useState / useReducer ; Context only where it genuinely helps
- All external interfaces integrations are simulated, including IRAS, Peppol, Paynow QR, etc.
- Automated testing will use Vitest for unit tests and React Testing Library for component tests. Prioritise invoice calculations, form validation, role permissions, maker-checker restrictions, and approval transitions. Mock API responses during tests to avoid dependency on live MockAPI data. Configure GitHub Actions to run tests on pushes and pull requests.

## UI/UX Mockup
- refer to mockup for visual design as a guide.
- File: singapore_invoicenow_app.html


## Epics, User Stories, and Acceptance Criteria / Business Rules

The hierarchy is **Epic → User Story → Acceptance Criteria / Business Rules**. Epics group related user outcomes; stories describe individual needs; acceptance criteria define observable results, and business rules constrain behaviour. Field defaults, automatic calculations, and permission checks are included under stories rather than treated as standalone stories.

Original main UC identifiers are retained below for traceability. Story IDs are new and replace the lettered UC breakdown from the previous revision. Core scope means functionality described by this starter prompt, subject to the existing timeline constraint. External integrations remain simulated. Unresolved requirements are listed separately rather than silently decided.

| Epic | Epic Name | Original Reference | Scope |
|---|---|---|---|
| E1 | Access and Monitor Invoices | UC1 | Core login, dashboard, search, and filters |
| E2 | Invoice Creation | UC2 | Core creation and draft saving; simulated external submission and PayNow QR |
| E3 | Invoice Management | UC3 | Core viewing and controlled change requests |
| E4 | Access Control | UC9 | Core View-only and Edit permissions |
| E5 | Invoice Approval | UC10 | Basic maker-checker approval flow |

### E1 — Access and Monitor Invoices

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

### E5 — Invoice Approval

| Story | User Story | Acceptance Criteria / Business Rules | Dependencies / Notes |
|---|---|---|---|
| US5.1 — Review pending request | As an eligible approver, I want to pick up an invoice pending approval, so that I can review a controlled action. | AC1: An eligible Edit user can pick up an invoice with Pending Approval status. BR1: Approval is a special case of Manage Invoice. BR2: Approval requires Edit access. BR3: The approver cannot be the maker; UC10 explicitly excludes the invoice creator. BR4: Delete, due-date change, and Paid update require this flow. | Clarify whether maker also means change requester, and define entry into Pending Approval (Q8). |
| US5.2 — Approve request | As an eligible approver, I want to approve a pending action, so that an authorised invoice change can proceed. | AC1: Enable Approve when the invoice is Pending Approval and the user meets the Edit and maker-checker rules. BR1: The approved action follows the agreed execution and status-transition rules. | Detailed execution and post-approval status rules remain to be defined before implementation and testing (Q9). |
| US5.3 — Reject request | As an eligible approver, I want to reject a pending action, so that an unsuitable request does not proceed. | AC1: Enable Reject when the invoice is Pending Approval and the user meets the Edit and maker-checker rules. AC2: On rejection, change invoice status to Draft. | Handling of proposed changes and the previous invoice status requires clarification (Q10). |

### Requirements to Clarify

| Reference | Open Requirement |
|---|---|
| Q1 | UC1 says delete is available to a “View/Edit access role”, while UC3 requires Edit and UC9 defines View-only. Confirm that only Edit users may request deletion. |
| Q2 | Define overdue calculation, dashboard total calculation, and status precedence. |
| Q3 | Define searchable fields, matching rules, supported statuses, and interaction between search and status filters. |
| Q4 | Define invoice-number format, uniqueness and generation timing, plus default payment terms for the due date. |
| Q5 | Define line-item fields, form validation, calculation formulas, tax treatment, and rounding. |
| Q6 | Clarify simulated IRAS “gst reg” submission meaning, resulting status, and failure behaviour. |
| Q7 | Confirm eligible statuses for each change request, how Draft-only editing applies to due-date changes, when changes are persisted, and any payment evidence requirements. |
| Q8 | Define maker as invoice creator, change requester, or both; define the Pending Approval transition and storage of the requested action and proposed values. |
| Q9 | Define execution and resulting invoice status for approval of deletion, due-date change, and Paid update. |
| Q10 | Confirm whether rejection always returns to Draft regardless of the previous status, and specify how proposed changes are discarded or retained. |

## Simulated
- Peppol / InvoiceNow integration.
- IRAS submission.
- PayNow QR generation.
- Full maker-checker audit trail.
- Complex approval queues. Only basic maker-checker flow. 
- PDF invoice generation.
- Email sending.
- Multi-company support.
- Customers already defined in backend. Manage Customer feature in later phase.
- Products already defined in backend. Manage Products feature in later phase.