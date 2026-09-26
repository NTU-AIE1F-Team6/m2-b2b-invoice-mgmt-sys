# InvoiceNow SG

A React + Vite simulation of Singapore's Peppol e-invoicing network (InvoiceNow), built for the
NTU AI Engineering Module 2 group project. Live at https://artificialintelligence.sg/invoicenow/
behind a login gate.

## Run it locally

```bash
npm install
npm run dev        # http://localhost:5173/invoicenow/
npm run build      # writes dist/ (plus one index.html per route for static hosting)
npm run preview
```

Node 18+ is required. If the project folder lives on Google Drive, `npm install` fails with
EBADF; copy the folder to a local disk first (`scripts/deploy.ps1` does this automatically).

To connect a shared MockAPI backend instead of the static offline demo data, copy `.env.example`
to `.env.local` and set `VITE_MOCKAPI_URL` (see "MockAPI setup" below).

## Login

The app is gated like artificialintelligence.sg/citylife/: the password is hashed with SHA-256 in
the browser and compared with a stored digest, and the session lives in `sessionStorage` (it ends
when the tab closes). This is a demo gate, not real security: everything runs in the browser.
Demo accounts (defined in `src/data/users.js`) all share one password, `Password123` - this is a
learning-project demo gate, not production security:

| username | password | role |
|---|---|---|
| `viewer` | `Password123` | VIEW_ONLY (read-only, no create/edit/transmit/delete) |
| `john` | `Password123` | EDIT |
| `jenn` | `Password123` | EDIT |
| `ralph` | `Password123` | EDIT |

## Demo aids

- **Tour page** at `/invoicenow/tour/` (public, no login): one card per React concept with the file
  names, the real code lines, and a "See it live" link. Content lives in `src/data/tour.js`.
- **Hints toggle** in the app navbar: adds `.hints-on` to the app wrapper so every `<Hint>` label
  (`src/components/Hint.jsx`) appears, naming the React feature behind that part of the screen.
  The choice is remembered in localStorage.

## Requirement checklist

| Requirement | Where |
|---|---|
| Built with Vite | `vite.config.js`, `package.json` |
| Functional components and hooks only | every file in `src/` |
| Multiple sensibly scoped components, props passed cleanly | `src/components/` (13 components), `src/pages/` (5 pages) |
| At least two client-side routes with React Router | `src/App.jsx` (`/login`, `/tour`, `/*`) and `src/components/AppShell.jsx` (`/`, `/create`, `/edit`, `/customers`, `/products`) |
| Shared state with useState / useReducer | `src/hooks/useInvoices.js` (useReducer), lifted into `AppShell` and passed down as props |
| Context only where it genuinely helps | `src/context/AuthContext.jsx` (session read by navbar, route guard and login page) |
| Fetches data with loading and error handling | `src/hooks/useFetch.js`, `useInvoices.js`; MockAPI via `src/api/*.js` (falls back to static `public/api/*.json` if `VITE_MOCKAPI_URL` is unset); free APIs Frankfurter (FX) and randomuser.me (contacts) |
| Roles / permissions | `src/data/roles.js` (`can(user, action, invoice)`), enforced in `InvoiceCard`, `Navbar`, and the `/create` and `/edit` routes |
| Form with controlled inputs to create an item | `src/components/InvoiceForm.jsx`, `src/pages/CreateInvoicePage.jsx` |
| Displays the collection (Read) and deletes an item | `src/components/InvoiceList.jsx`, `InvoiceCard.jsx`, `DashboardPage.jsx` |
| Bonus: edit an existing item | `src/pages/EditInvoicePage.jsx` |
| Deployed to a public URL | https://artificialintelligence.sg/invoicenow/ (static nginx on a NAS behind Cloudflare) |

## Data sources

- **Invoices** (`src/api/invoices.js`): a MockAPI `invoices` resource, shared across every browser/user. GET on load; every change (create, edit, transmit, mark paid, delete) is a POST/PUT/DELETE, and the UI only updates once the API confirms.
- **Customers + products** (`src/api/referenceData.js`): one MockAPI `referenceData` resource holding both, told apart by a `type: "customer" | "product"` field. Used by the Customers/Products pages and the invoice form's autocomplete and line-item dropdown.
- **Offline fallback**: if `VITE_MOCKAPI_URL` is unset, both of the above read the static, read-only `public/api/*.json` files instead (a banner on the dashboard says so). Writes fail with a clear "offline demo data" message rather than pretending to succeed.
- Users and roles are hardcoded in `src/data/users.js` / `src/data/roles.js` (course table: 3 endpoints + hardcoded users).
- https://api.frankfurter.dev/v1: live SGD exchange rates on the dashboard (free, no key).
- https://randomuser.me: a contact person per buyer on the Customers page (free, no key).

## MockAPI setup

1. Create a project at [mockapi.io](https://mockapi.io) with two resources: `invoices` and `referenceData` (free tier is limited to 2 resources per project).
2. Copy `.env.example` to `.env.local` and set `VITE_MOCKAPI_URL` to the project's base URL (e.g. `https://<project-id>.mockapi.io`, no `/api/v1` suffix, no trailing slash and no resource name).
3. Run `npm run seed` once. This purges whatever MockAPI auto-generated for each new resource and POSTs the real seed data (from `public/api/*.json`) in the app's shape (see `scripts/seed-mockapi.mjs`).
4. `npm run dev` — the dashboard should now load the seeded invoices, and a create/edit/delete in one browser should be visible in another.

## Project structure

```
src/
  api/          client (fetch wrapper), invoices, referenceData (MockAPI, with static fallback)
  components/   AppShell, Navbar, RequireAuth, Toast, LoadingSpinner, ErrorBanner,
                PeppolStatusBadge, StatCards, FxRatesCard, SearchFilter,
                InvoiceList, InvoiceCard, InvoiceForm
  context/      AuthContext (login, logout, session)
  hooks/        useInvoices (useReducer + MockAPI), useFetch (generic, URL or fetcher function)
  pages/        LoginPage, TourPage, DashboardPage, CreateInvoicePage, EditInvoicePage, CustomersPage, ProductsPage
  data/         constants (GST rate, statuses, UEN pattern, API URLs), users (hashed demo logins), roles (can())
  utils/        invoice maths and formatting, sha256
public/api/     static JSON, used only as the offline demo-data fallback
scripts/        seed-mockapi.mjs (one-off MockAPI seed), postbuild.mjs (route folders for static hosting), deploy.ps1 (build + copy to site)
```

## Deploy

**Vercel / Netlify / GitHub Pages (domain root):** `npm run build` with no extra settings. The
build uses base path `/`, and `vercel.json` rewrites every route to `index.html` for React Router.

**artificialintelligence.sg/invoicenow/ (sub-folder on the NAS):** `powershell -File scripts/deploy.ps1`
copies the source to a local build folder, sets `BASE_PATH=/invoicenow/`, runs `npm install` and
`npm run build`, then mirrors `dist/` into the artificialintelligence.sg site repo (`invoicenow/`)
and the NAS web root. Pass `-SkipNas` to stop after the site repo copy.
