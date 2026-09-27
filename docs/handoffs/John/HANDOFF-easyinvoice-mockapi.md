# Handoff: EasyInvoice — MockAPI, users/roles, rename (John)

**Written:** 26 Sep 2026 · **Owner:** John · **Resume with:** Claude Code in the macOS terminal at the repo root
**Start Claude Code with:** "Read docs/handoffs/John/HANDOFF-easyinvoice-mockapi.md and follow it. Start at section 1."

---

## 0. Context in one paragraph

NTU AIE Module 2 group project (team: Jenn Fang, Ralph, John). Brief: `docs/requirements/module2-project-brief.pdf`. PRD: `docs/requirements/PRD-B2B Invoice Management System-V1.md`.
Ralph's PR #1 (`feat/invoicenow-vite-app`) delivered a working React 18 + Vite 5 + React Router 6 + Tailwind 4 app called "InvoiceNow SG". It meets most brief requirements, but invoices come from static `public/api/*.json` and are then kept in **localStorage**, so data is not shared across browsers or users. John's job is to replace that with **MockAPI**, define **users and roles in code**, and **rename the app to EasyInvoice** with a cleaner folder structure.

## 1. Decisions (agreed; these override the PRD where they conflict)

| # | Decision | Owner |
|---|---|---|
| 1 | Create the MockAPI project/resources and wire the app to it (shared persistence) | John |
| 2 | Users and roles defined in code (`src/data/users.js`), no user resource in MockAPI | John |
| 3 | **Maker-checker / approval flow (PRD E5, D8–D10) deferred to next phase.** Do not build Pending Approval, request/approve/reject. Leave data shape room for it (see §4). | — |
| 4 | App name is **EasyInvoice**. Remove "InvoiceNow SG" branding; restructure folders (see §6). | John |

Record decision 3 in the PRD decision register (D11 scope) when convenient.

## 2. First steps (git hygiene; do before any code)

`main` currently has **staged, uncommitted** files from an earlier session:
- `package-lock.json` → keep (commit on the branch)
- `docs/design/InvoiceNow-SG-architecture_…{png,svg}` → keep
- `docs/handoffs/John/Architecture-Diagram.svg.tmp.svg` → **do not commit** (`.tmp` scratch)

```bash
git restore --staged .
git fetch --all --prune
git branch -a                      # confirm Jenn's branch exists; check what it touches
git log --oneline --all --graph -20
git checkout -b feat/mockapi-users-roles
```
Never commit to `main`. PR flow per PRD §11.2: **John authors → Jenn Fang reviews → John merges.**
Before touching shared files, read Jenn's branch diff (`git diff main...origin/<jenn-branch> --stat`) to avoid conflicts; tell Ralph/Jenn when the invoice data shape changes.

Also add `docs/handoffs/**/*.tmp.*` to `.gitignore`.

## 3. Current code map (what exists)

| Area | File | Notes |
|---|---|---|
| Invoice store | `src/hooks/useInvoices.js` | useReducer; fetches `public/api/invoices.json` once, then localStorage key `invoicenow-sg-invoices-v1`; simulated transmit with 900 ms delay + UEN check → Transmitted/Failed |
| Generic fetch | `src/hooks/useFetch.js` | loading/error/refetch, AbortController |
| Auth | `src/context/AuthContext.jsx` | SHA-256 password digest compare; session in sessionStorage key `invoicenow-session` |
| Users | `src/data/users.js` | `admin` (Finance Manager) / `clerk` (AR Officer); roles `admin`/`clerk` are **not used for permissions anywhere** |
| Constants | `src/data/constants.js` | GST 9%, STATUS (Draft/Queued/Transmitted/Paid/Failed), UEN regex, FX + randomuser API URLs |
| Form | `src/components/InvoiceForm.jsx` | loads customers/products via useFetch from `public/api/*.json` |
| Routes | `src/App.jsx`, `src/components/AppShell.jsx` | `/login`, `/tour`, `/`, `/create`, `/edit/:id`, `/customers`, `/products` |
| Invoice record | `public/api/invoices.json` | `{ id:"INV-2026-001", buyerName, buyerUEN, peppolId, issueDate, dueDate, items:[{description, qty, unitPrice}], includePayNowQR, status, createdAt }` |

Known gaps vs brief: no tests/CI, README missing team/work split/screenshot/AI disclosure, empty `docs/handoffs/Tasklist-*.md`, not yet on Vercel.
Note: the local `node_modules` must be installed on macOS (`npm ci`); do not reuse a copy built elsewhere.

## 4. Task A — MockAPI (John)

### 4.1 Set up on mockapi.io
1. Create project `easyinvoice`. Check the free-tier limits (projects, resources, records) on the account; PRD D13 assumed 2 resources.
2. Resources (preferred, fits 2-resource limit):
   - `invoices`: the invoice records.
   - `referenceData`: customers + products with a `type` field (`customer` | `product`).
   - Fallback if only 1 resource or short on time: `invoices` only; keep customers/products as static JSON.
3. Put the base URL in `.env.local` (git-ignored) and create a committed `.env.example`:
   ```
   VITE_MOCKAPI_URL=https://<project-id>.mockapi.io/api/v1
   ```
4. Round-trip spike: POST one invoice with nested `items[]`, then GET it and confirm nesting and types are preserved.

### 4.2 Invoice record (target shape)
MockAPI assigns its own string `id`; keep the human number separately.
```js
{
  id,                    // MockAPI id (opaque string) — used in routes: /invoices/:id, /edit/:id
  invoiceNumber,         // "INV-2026-001" (display; generated client-side)
  buyerName, buyerUEN, peppolId,
  issueDate, dueDate,    // "YYYY-MM-DD"
  items: [{ description, sku, qty, unitPrice }],
  includePayNowQR, status, failureReason,
  createdBy,             // username from session (needed later for maker-checker)
  createdAt, updatedAt,  // ISO UTC
  pendingRequest: null   // reserved for next-phase maker-checker; always null for now
}
```
Update every place that displays or links `invoice.id` to use `invoiceNumber` for display and `id` for routing (`InvoiceCard`, `InvoiceList`, `DashboardPage` search, `EditInvoicePage`, `utils/invoice.js#nextInvoiceId`).

### 4.3 Code changes
1. **`src/api/client.js`** (new): `request(path, {method, body, signal})` using `import.meta.env.VITE_MOCKAPI_URL`; throws readable errors on non-2xx; JSON in/out.
2. **`src/api/invoices.js`** (new): `listInvoices`, `getInvoice`, `createInvoice`, `updateInvoice`, `deleteInvoice`. `src/api/referenceData.js`: `listCustomers`, `listProducts` (filter by `type`).
3. **Fallback**: if `VITE_MOCKAPI_URL` is unset, read the static `public/api/*.json` (read-only) and show a small "offline demo data" banner. That keeps tests and anyone without `.env.local` working.
4. **`useInvoices.js`**: remove localStorage cache/persist effect. Load = GET. `addInvoice` = POST, `updateInvoice`/`transmitInvoice`/`markPaid` = PUT full record, `deleteInvoice` = DELETE. Dispatch to the reducer **only after the API confirms** (PRD §3: failed writes keep input, show error, no fake success). Add `saving`/`busyId` state to disable double-submits. Refetch after mutations. (Optional bonus: optimistic update + rollback.)
5. **Transmit simulation** stays client-side (UEN check → Transmitted/Failed), then PUT the resulting status.
6. **`resetDemo`**: replace the localStorage clear with a call to the seed routine or remove the button (decide; seeding from the browser is fine for a demo).
7. **`InvoiceForm`/`CustomersPage`/`ProductsPage`**: switch customers/products to `referenceData` (if §4.1 option 2).
8. **Seed script** `scripts/seed-mockapi.mjs`: reads `public/api/*.json`, maps to the new shape (adds `invoiceNumber`, `createdBy`, `pendingRequest:null`), POSTs to MockAPI. Run once; add `"seed": "node scripts/seed-mockapi.mjs"` to `package.json`.
9. **Vercel**: import the repo, set `VITE_MOCKAPI_URL` env var, deploy, and test deep-link refresh (`vercel.json` rewrite already exists).

### 4.4 Done when
- Invoice created in browser A appears in browser B after reload; edit/transmit/paid/delete persist.
- Load error shows `ErrorBanner` with retry; failed save keeps form values.
- Works with and without `VITE_MOCKAPI_URL`.

## 5. Task B — Users and roles in code (John)

Replace `admin`/`clerk` with PRD roles (maker-checker deferred, but seed enough users for it later):

| username | name | role |
|---|---|---|
| `viewer` | View-only User | `VIEW_ONLY` |
| `john` | John | `EDIT` |
| `jenn` | Jenn Fang | `EDIT` |
| `ralph` | Ralph | `EDIT` |

Keep the SHA-256 digest approach; pick demo passwords and list them in the README (demo gate, not security).

1. `src/data/roles.js` (new): `ROLES = { VIEW_ONLY, EDIT }` and a single permission function:
   ```js
   export function can(user, action, invoice) // action: 'create'|'edit'|'transmit'|'markPaid'|'delete'
   ```
   Rules for this phase: VIEW_ONLY → none of the above. EDIT → create; edit/transmit only when status is Draft or Failed; markPaid only when Transmitted; delete when not Paid. (Paid invoices are read-only.)
2. Use `can()` both to **hide/disable buttons** (InvoiceCard, Dashboard, Navbar "Create") **and to guard handlers/routes** (`/create`, `/edit/:id` redirect a VIEW_ONLY user with a message).
3. Show the logged-in name + role in the Navbar.
4. Stamp `createdBy` (and `updatedBy`) on writes.
5. Unit tests for `can()` (every allowed and denied path) — see §7.

## 6. Task C — Rename to EasyInvoice + folder structure (John)

Do this as its **own small PR, merged first or last, never mixed with feature work**, and announce it to Ralph/Jenn (it touches many files → merge conflicts).

Rename references found (outside `docs/`): `README.md`, `index.html`, `package.json` (`name: "easyinvoice"`), `vite.config.js` + `scripts/deploy.ps1` + `scripts/postbuild.mjs` (`/invoicenow/` base path), `src/main.jsx`, `AppShell`, `Navbar`, `LoginPage`, `DashboardPage`, `CreateInvoicePage`, `TourPage`, `data/tour.js`, `data/constants.js`, storage keys in `AuthContext`/`useInvoices`. Find them with:
```bash
grep -rni "invoicenow" --exclude-dir=node_modules --exclude-dir=docs --exclude=package-lock.json .
```
Keep "InvoiceNow/Peppol" only where it names the **simulated external network** (e.g. status badge "Peppol transmitted"), not the product.

Proposed structure (**confirm with team before moving files**):
```
src/
  api/          client.js, invoices.js, referenceData.js        (new)
  context/      AuthContext.jsx
  data/         users.js, roles.js, constants.js, tour.js
  hooks/        useInvoices.js, useFetch.js
  components/   layout/ (AppShell, Navbar, RequireAuth)
                invoices/ (InvoiceForm, InvoiceList, InvoiceCard, StatCards, SearchFilter, PeppolStatusBadge)
                common/ (Toast, LoadingSpinner, ErrorBanner, Hint, FxRatesCard)
  pages/        (unchanged)
  utils/        invoice.js, hash.js
  __tests__/ or *.test.js beside files
mockup/         → move into docs/reference/
```
Also decide whether the NAS deploy (`scripts/deploy.ps1`, `/invoicenow/` base path) is kept; if Vercel becomes the submission URL, remove or rename it.

## 7. Tests + CI (small, supports John's tasks)
- Add `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`; scripts `"test": "vitest run"`.
- Tests: `roles.can()` matrix; `api/invoices` with `fetch` mocked (success, HTTP error, network error); `useInvoices` failure keeps state unchanged.
- `.github/workflows/ci.yml`: `npm ci` → `npm test` → `npm run build` on push and PR.

## 8. Suggested order
1. §2 git hygiene → branch
1a. §10 GitHub setup review (look and report only; share with team early so workflow is agreed before feature PRs)
2. §4.1 MockAPI setup + spike + seed script
3. §4.3 api layer + `useInvoices` rewrite → PR #1 (John)
4. §5 users/roles + tests → PR #2 (or same PR if small)
5. §6 rename/restructure → separate PR, coordinated with team
6. Vercel deploy + README updates (team, work split, deployed URL, AI disclosure — Claude.ai / Claude Code / Cowork used for scaffolding, PRD, planning)
7. Fill `docs/handoffs/Tasklist-John.md` with these items and tick them off (brief requires visible task split)

## 9. Grading reminders (from the brief)
- Every member must touch **state**, **at least one route**, and **data fetching/composition**. John: state (`useInvoices`), fetching (MockAPI); for a route, the role guard on `/create` + `/edit/:id` or a new `/invoices/:id` detail page.
- Commit history = individual assessment → small, regular, descriptive commits on feature branches.
- Every member must be able to explain the code, including AI-written code.

## 10. Task D — Review GitHub setup for 3-person teamwork (John)

**Prereq:** `gh auth status` shows you logged in with admin rights on `NTU-AIE1F-Team6/m2-b2b-invoice-mgmt-sys`. If not: `brew install gh && gh auth login`.

**Rule:** first look and report only. Do not change repo settings, delete branches or push until John approves the proposed changes.

Use `gh` / `gh api` and local git to check, then write findings to `docs/handoffs/John/github-structure-review.md` as a table: *area | current state | problem | recommended change | who does it*.

1. **Access:** collaborators and their permission levels (`gh api repos/{owner}/{repo}/collaborators`). Jenn, Ralph and John all need write access.
2. **Contribution evidence:** commits per author on all branches (`git shortlog -sne --all`). Check that each author's email is linked to their GitHub account (commits must show on their profile). Flag members with no commits (Jenn so far).
3. **Branches:** list remote branches, last commit date and whether merged. Propose a naming convention (`feat/`, `fix/`, `docs/`, `chore/` + short name + owner) and list stale/merged branches to delete.
4. **Protecting `main`:** check branch protection/rulesets. Target: PR required, 1 approval, CI must pass, no direct pushes, no force-push. Note: free plans may not allow protection on private repos. If blocked, write the rule down in CONTRIBUTING.md as a team agreement instead.
5. **Pull requests:** review past PRs (`gh pr list --state all`): were they reviewed, and do they follow the PRD §11.2 rotation (Jenn→Ralph reviews, Ralph→John, John→Jenn)? Propose `.github/pull_request_template.md` (what/why, linked issue, test steps, screenshots, checklist).
6. **Code ownership:** propose `.github/CODEOWNERS` mapping areas to owners (John: `src/api/`, `src/hooks/useInvoices.js`, `src/data/users.js`, `src/data/roles.js`, CI; Jenn: form/create; Ralph: dashboard/list). Confirm with team.
7. **Project management (the brief requires this to be visible):** check issues, labels, milestones and GitHub Projects. Propose: one issue per task from this handoff and the PRD stories, each with an assignee, labels (`feature`, `bug`, `docs`, `mockapi`, `roles`), a milestone "Submission (Lesson 2.19)", and a Projects board (Todo / In progress / In review / Done). Fill in the three `docs/handoffs/Tasklist-*.md` files, or link them to the board.
8. **CI:** there is no `.github/workflows/` yet. Propose `ci.yml` (npm ci → test → build on push and PR) and make it a required check.
9. **Repo tidiness:** tracked scratch files (`git ls-files | grep tmp`: three `.tmp.md` files in `docs/handoffs/John/`) → propose `git rm --cached`. Check that `.DS_Store`, `.env*` and `dist` are not tracked. Point README links at the right paths.
10. **Team workflow doc:** draft `CONTRIBUTING.md`: branch → small commits → `git pull --rebase origin main` before opening a PR → PR with template → reviewer per rotation → squash or merge (pick one) → delete the branch. Also: how to handle the EasyInvoice rename PR (merge it on an agreed day, and everyone rebases afterwards).

**Output:** the review file plus draft PR template, CODEOWNERS, CONTRIBUTING.md and ci.yml on a `chore/github-workflow` branch, opened as one PR for Jenn to review. Share the review with the team before applying repo settings.
