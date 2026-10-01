# EasyInvoice — architecture and API design

See the top-level `README.md` for delivered scope and `docs/requirements/scope-and-limitations.md` for the
boundary between this learning demo and a production design.

## 1. Overview

EasyInvoice is a React + Vite simulation of Singapore's Peppol e-invoicing network (InvoiceNow),
for a small business finance/AR team to create, transmit, track and collect payment on e-invoices.
Built for the NTU AI Engineering Module 2 group project.

For the architecture diagram, see `docs/engineering/easyinvoice-architecture.svg` (the superseded
pre-rename version is in `docs/archive/`) — high level, this is a single-page React app talking
directly to a hosted mock REST API (MockAPI) and two free public APIs, with no backend of its own.

## 2. Tech stack

| Layer | Choice |
|---|---|
| Build tool | Vite 8 |
| UI | React 19, functional components + hooks only |
| Routing | react-router 7 (declarative mode: `BrowserRouter`/`Routes`/`Route`) |
| Styling | Tailwind CSS 4 |
| Data / persistence | MockAPI (hosted mock REST backend), with a static-JSON read-only fallback |
| Auth | Client-side SHA-256 password gate, hardcoded demo accounts |
| Tests | Vitest 5 + React Testing Library + jsdom |
| Deployment | Vercel, auto-deploys on push to `main` |

## 3. Routes

| Path | Page | Auth |
|---|---|---|
| `/login` | `LoginPage` | public |
| `/tour` | `TourPage` ("how it's built") | public |
| `/` | `DashboardPage` | required |
| `/create` | `CreateInvoicePage` | required, EDIT role only (`can(user, 'create')`) |
| `/edit?id=` | `EditInvoicePage` | required, EDIT role + invoice must be Draft/Failed |
| `/customers` | `CustomersPage` | required |
| `/products` | `ProductsPage` | required |

`/edit` uses a query param (`?id=`) rather than `/edit/:id` so a page refresh still resolves on a
static host with no server-side rewrite rules (see `scripts/postbuild.mjs`).

## 4. Data model and API design

### 4.1 MockAPI project

One MockAPI project (`easyinvoice`) with two resources — the free tier's limit:

- **`invoices`** — one record per invoice
- **`referenceData`** — customers and products in one resource, told apart by a `type` field

Base URL is set via the `VITE_MOCKAPI_URL` environment variable (see `.env.example`). MockAPI has
no authentication — anyone with the URL can read and write. Acceptable for a course demo; would
not be for production.

**Important caveat:** MockAPI's own "schema" (configured in its dashboard when a resource is
created) is a fake-data generation template only — it is never validated against on read or
write. Every record also carries whatever fields MockAPI auto-generated for that resource
originally (typically `name`, `avatar`, `createdAt`) alongside our real fields; the client code
ignores these. Editing/saving a resource's schema in the MockAPI dashboard regenerates its fake
data and **wipes real records** — treat that screen as read-only.

### 4.2 Invoice schema

```jsonc
{
  "id": "1",                        // MockAPI-assigned string id — used for routing (/edit?id=)
  "invoiceNumber": "INV-2026-001",  // human display id, client-generated: INV-<year>-<seq>
  "buyerName": "Temasek Tech Solutions Pte Ltd",
  "buyerUEN": "202012345E",         // Singapore UEN, validated client-side (UEN_PATTERN)
  "peppolId": "202012345E@SGUEN",   // derived: `${buyerUEN}@SGUEN`
  "issueDate": "2026-09-01",        // YYYY-MM-DD
  "dueDate": "2026-10-01",
  "items": [
    { "description": "Cloud Infrastructure Setup", "sku": "SVC-CLOUD", "qty": 1, "unitPrice": 3500 }
  ],
  "includePayNowQR": true,
  "status": "Draft",                // Draft | Queued | Transmitted | Paid | Failed
  "failureReason": null,            // set when status is Failed
  "createdBy": "john",              // username from the session
  "updatedBy": "john",              // set on update/transmit/markPaid, absent until then
  "createdAt": "2026-09-01T09:12:00.000Z",
  "updatedAt": "2026-09-01T09:12:00.000Z",
  "pendingRequest": null            // reserved for maker-checker (deferred, see §7)
}
```

Status transitions (`src/data/constants.js#STATUS`, driven by `useInvoices.js#simulateTransmit`):

```
Draft --transmit--> Queued --(900ms simulated network delay)--> Transmitted | Failed
Failed --retry (transmit again)--> Queued --> Transmitted | Failed
Transmitted --markPaid--> Paid
```

A UEN that matches `UEN_PATTERN` (`src/data/constants.js`) transmits successfully; anything else
settles as `Failed` with a canned `failureReason`. This is a deliberately simple client-side
simulation, not a real Peppol Access Point.

### 4.3 ReferenceData schema

```jsonc
// customer
{ "id": "1", "type": "customer", "uen": "202012345E", "name": "Temasek Tech Solutions Pte Ltd",
  "industry": "IT Services", "area": "Raffles Place", "peppolRegistered": true }

// product
{ "id": "7", "type": "product", "sku": "SVC-CLOUD", "description": "Cloud Infrastructure Setup",
  "unitPrice": 3500, "unit": "per project", "category": "Services" }
```

### 4.4 Client API layer

`src/api/client.js` — `request(path, { method, body, signal })`: thin fetch wrapper, throws a
readable `Error` on any non-2xx response (never fails silently); `hasMockApi()` reports whether
`VITE_MOCKAPI_URL` is set.

`src/api/invoices.js`:

| Function | HTTP | Notes |
|---|---|---|
| `listInvoices(signal)` | `GET /invoices` | falls back to static `public/api/invoices.json` (read-only) if no MockAPI URL |
| `getInvoice(id, signal)` | `GET /invoices/:id` | offline mode: rejects |
| `createInvoice(invoice, signal)` | `POST /invoices` | offline mode: rejects |
| `updateInvoice(id, invoice, signal)` | `PUT /invoices/:id` | full-record replace, offline mode: rejects |
| `deleteInvoice(id, signal)` | `DELETE /invoices/:id` | offline mode: rejects |

`src/api/referenceData.js`:

| Function | Behaviour |
|---|---|
| `listCustomers(signal)` | `GET /referenceData`, filters `type === 'customer'` (or static `customers.json` fallback) |
| `listProducts(signal)` | `GET /referenceData`, filters `type === 'product'` (or static `products.json` fallback) |

**Offline fallback:** if `VITE_MOCKAPI_URL` is unset, reads succeed against the static JSON files
in `public/api/`, and writes reject with a clear "offline demo data" message rather than
pretending to succeed. `useInvoices.js` exposes this as `offline: !hasMockApi()`, shown as a
banner on the dashboard.

### 4.5 Seeding

`scripts/seed-mockapi.mjs` (`npm run seed`) purges whatever MockAPI auto-generated for each
resource and POSTs the static demo data (`public/api/*.json`) in the shapes above. Throttled
(350ms between calls) with retry-on-429, since the free tier rate-limits bursts.

## 5. State management

`src/hooks/useInvoices.js`: a `useReducer` store, one instance owned by `AppShell` and passed down
as a prop (not Context — the store is only read a few levels deep, so prop-drilling is simpler).

Reducer actions: `load/start`, `load/success`, `load/error`, `busy` (marks an invoice id "in
flight" to disable double-submits), `add`, `replace`, `remove`. **State only changes after the API
call confirms** — every mutating function (`addInvoice`, `updateInvoice`, `deleteInvoice`,
`transmitInvoice`, `markPaid`) calls the API first and only dispatches on success, so a failed
write leaves the in-memory list untouched and the caller sees a thrown `Error` to show the user.

`createdBy`/`updatedBy` are stamped from the session's `username`, passed into `useInvoices(username)`
by `AppShell` via `useAuth()`.

## 6. Roles and permissions

`src/data/roles.js`: two roles (`VIEW_ONLY`, `EDIT`) and one function,
`can(user, action, invoice)`, the single place permission logic lives:

| action | VIEW_ONLY | EDIT |
|---|---|---|
| `create` | never | always |
| `edit` / `transmit` | never | only Draft or Failed invoices |
| `markPaid` | never | only Transmitted invoices |
| `delete` | never | anything except Paid |

The same `can()` call both hides/disables UI (buttons in `InvoiceCard`, the "Create invoice" link
in `Navbar`/`DashboardPage`) and guards routes (`/create`, `/edit` redirect a disallowed user with
a toast) — one source of truth, so the UI and the guard can't disagree.

Maker-checker (PRD E5, D8-D10: request/approve/reject for EDIT actions) is explicitly deferred.
`pendingRequest` is reserved on the invoice schema for that future work but always `null` today.

## 7. Auth

`src/context/AuthContext.jsx` + `src/data/users.js`: four hardcoded demo accounts (`viewer` /
`john` / `jennfang` / `ralph`), all sharing one password (`Password123` — a learning-project demo
gate, not production security). Password is SHA-256-hashed client-side and compared against a
stored digest; session lives in `sessionStorage` under `easyinvoice-session` and ends when the tab
closes.

## 8. Deployment

Vercel project connected via GitHub integration, tracking `main` as the production branch — every
merge to `main` auto-redeploys. `VITE_MOCKAPI_URL` is set as a Vercel environment variable so the
production deployment talks to the shared MockAPI project. See `docs/engineering/deployment.md`
for the release flow, configuration, verification checklist, and operational limitations.

## 9. Module 2 core React requirements

This section makes the implementation evidence for the Module 2 brief's core requirements
explicit. The underlying architecture is described in more detail in sections 3-5 above.

### 9.1 Data fetching

`useInvoices` loads invoices in a `useEffect`, while the reusable `useFetch` hook loads customers,
products, FX rates, and generated contacts. Both use `AbortController` cleanup and expose loading,
error, and retry states. `src/api/` keeps HTTP and static-fallback behaviour outside UI components.

### 9.2 Component composition

Pages compose focused components through props and callbacks: for example, `DashboardPage`
combines `SearchFilter`, `StatCards`, `FxRatesCard`, loading/error UI, and `InvoiceList`;
`InvoiceList` maps records into `InvoiceCard` instances. `InvoiceForm` is reused by both Create and
Edit pages, avoiding duplicate form logic.

### 9.3 React Router

`App.jsx` separates public `/login` and `/tour` routes from authenticated routes wrapped by
`RequireAuth`. `AppShell.jsx` defines Dashboard, Create, Edit, Customers, and Products routes.
`Link`/`NavLink` provide navigation, `useNavigate` handles action-driven redirects, and
`useSearchParams` carries invoice, customer, or product selections between views.

### 9.4 Shared state and Context

Invoice state is lifted into `AppShell` through one `useInvoices`/`useReducer` store and passed to
the pages that read or mutate it. Local concerns such as forms, filters, hints, and toasts use
`useState`. Context is reserved for authentication because the current user is needed across the
login flow, route guard, navbar, and permission checks; invoice state remains props-based because
its consumers are close to `AppShell`.

### 9.5 Data persistence

MockAPI persists shared invoice CRUD data and typed customer/product `referenceData` across users
and browser sessions. Reducer state changes only after the API confirms a mutation. Without
`VITE_MOCKAPI_URL`, the application reads static JSON but rejects writes. `sessionStorage` retains
the demo login for one tab and `localStorage` retains only the Hints preference; neither is the
authoritative invoice store.
