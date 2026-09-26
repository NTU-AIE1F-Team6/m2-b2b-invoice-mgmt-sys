# EasyInvoice

A React + Vite simulation of Singapore's Peppol e-invoicing network (InvoiceNow), built for the
NTU AI Engineering Module 2 group project. Live at https://artificialintelligence.sg/easyinvoice/
behind a login gate.

## Run it locally

```bash
npm install
npm run dev        # http://localhost:5173/easyinvoice/
npm run build      # writes dist/ (plus one index.html per route for static hosting)
npm run preview
```

Node 18+ is required. If the project folder lives on Google Drive, `npm install` fails with
EBADF; copy the folder to a local disk first (`scripts/deploy.ps1` does this automatically).

## Login

The app is gated like artificialintelligence.sg/citylife/: the password is hashed with SHA-256 in
the browser and compared with a stored digest, and the session lives in `sessionStorage` (it ends
when the tab closes). Demo accounts are defined in `src/data/users.js`; the usernames, passwords
and every live link are listed in the `README.md` one folder up (`AIE Project/README.md`).
This is a demo gate, not real security: everything runs in the browser.

## Demo aids

- **Tour page** at `/easyinvoice/tour/` (public, no login): one card per React concept with the file
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
| Fetches data with loading and error handling | `src/hooks/useFetch.js`, `useInvoices.js`; mock API in `public/api/*.json`; free APIs Frankfurter (FX) and randomuser.me (contacts) |
| Form with controlled inputs to create an item | `src/components/InvoiceForm.jsx`, `src/pages/CreateInvoicePage.jsx` |
| Displays the collection (Read) and deletes an item | `src/components/InvoiceList.jsx`, `InvoiceCard.jsx`, `DashboardPage.jsx` |
| Bonus: edit an existing item | `src/pages/EditInvoicePage.jsx` |
| Deployed to a public URL | https://artificialintelligence.sg/easyinvoice/ (static nginx on a NAS behind Cloudflare) |

## Data sources

- `public/api/invoices.json`: mock Access Point API, fetched once with `useEffect`, then persisted in `localStorage` (Reset demo reloads it).
- `public/api/customers.json`: mock buyer directory, used by the Customers page and the form's autocomplete.
- `public/api/products.json`: mock product catalogue, used by the Products page and the line-item dropdown on the form.
- Users are hardcoded in `src/data/users.js` (course table: 3 endpoints + hardcoded users).
- https://api.frankfurter.dev/v1: live SGD exchange rates on the dashboard (free, no key).
- https://randomuser.me: a contact person per buyer on the Customers page (free, no key).

## Project structure

```
src/
  components/   AppShell, Navbar, RequireAuth, Toast, LoadingSpinner, ErrorBanner,
                PeppolStatusBadge, StatCards, FxRatesCard, SearchFilter,
                InvoiceList, InvoiceCard, InvoiceForm
  context/      AuthContext (login, logout, session)
  hooks/        useInvoices (useReducer + fetch + localStorage), useFetch (generic)
  pages/        LoginPage, TourPage, DashboardPage, CreateInvoicePage, EditInvoicePage, CustomersPage, ProductsPage
  data/         constants (GST rate, statuses, UEN pattern, API URLs), users (hashed demo logins)
  utils/        invoice maths and formatting, sha256
public/api/     mock JSON endpoints
scripts/        postbuild.mjs (route folders for static hosting), deploy.ps1 (build + copy to site)
```

## Deploy

**Vercel / Netlify / GitHub Pages (domain root):** `npm run build` with no extra settings. The
build uses base path `/`, and `vercel.json` rewrites every route to `index.html` for React Router.

**artificialintelligence.sg/easyinvoice/ (sub-folder on the NAS):** `powershell -File scripts/deploy.ps1`
copies the source to a local build folder, sets `BASE_PATH=/easyinvoice/`, runs `npm install` and
`npm run build`, then mirrors `dist/` into the artificialintelligence.sg site repo (`easyinvoice/`)
and the NAS web root. Pass `-SkipNas` to stop after the site repo copy.
