# Coffee House Invoice Manager — Seven-Day Team Plan

**Team:** Jenn Fang, Ralph, John  
**Decision:** Deliver one complete invoice workflow in seven calendar days alongside studies.  
**Budget:** Target 7 hours each, with up to 1 hour contingency each.  
**Status:** Proposed implementation plan.

## 1. Goal and assignment fit

A café staff member needs to prepare an itemised invoice for a corporate coffee or catering order, find it later, and remove an incorrect draft. Example: 20 coffees at $5 and 20 pastries at $4 total $180.

The MVP is a classroom demonstration with fictional customers. All saved invoices are drafts; saving does not send an invoice or process payment.

The assignment requires Vite, functional React components/hooks, shared state, at least two React Router routes, a controlled create form, collection display and deletion, external/mock data or persistence with loading/errors, and a public deployment. Each member must implement state, a route, and fetching or composition, with visible commits and collaboration. Styling and Update are optional.

Confirm scope, data source, any reused artifact code, and the actual submission date with the instructor on Day 1. Submit one GitHub repository link through NTU Blackboard before Lesson 2.19; prepare a 10–15 minute presentation including a live demo. Seven calendar days do not imply seven full workdays.

## 2. Use cases: in scope

| ID | Use case | User flow and completion condition |
| --- | --- | --- |
| UC1 | Create a draft invoice | Select a fictional customer, add 1–10 line items with description, integer quantity and unit price, then Save. Show success only after MockAPI confirms creation. |
| UC2 | Browse invoices | Open the invoice list; see customer, date and total. Loading, empty and error states are clear; Retry/Refresh retrieves the latest records. |
| UC3 | View an invoice | Open a saved invoice through its URL; display customer snapshot, line items and calculated total. A missing record has a helpful message. |
| UC4 | Delete an incorrect draft | Confirm deletion; delete through MockAPI, then update the shared state and return to the list. On failure, retain the record and offer retry. |
| UC5 | View a teammate's saved work | Another browser opens or refreshes the list and sees the same stored invoice. No redeployment is needed. |

**Fixed customer list:** Three fictional businesses in bundled JSON; no customer-management screen. Use one currency, SGD. Use the API record ID for the invoice reference; no sequential-number generator.

**Validation:** At least one nonblank description; quantities 1–100; nonnegative prices with at most two decimal places. Define a sensible price ceiling in the shared data contract. Calculate money in integer cents. Derive totals from line items instead of maintaining separate editable total state.

## 3. Future phases — excluded from the seven-day submission

| Phase | Use cases / capabilities | Why deferred |
| --- | --- | --- |
| Phase 2 | Create/edit customers; edit draft invoices; search/filter; mark Sent/Paid; print/save as PDF | Adds forms, relationships, update logic and presentation work |
| Phase 2 | Dashboard summaries, discounts, configurable tax, payment terms and business settings | Adds calculation rules and more edge cases |
| Phase 3 | Accounts/roles, protected customer data, audit trail, backups, email delivery | Needs a backend and access controls suitable for real use |
| Phase 3 | Real payments, concurrent-edit protection, automatic live updates | Requires further service integration and reliability work |

Do not implement future features as “quick extras” during the final days. Reassess them after submission. Real customer/bank data is outside this demo's scope.

## 4. Technical architecture and persistence

![Seven-day architecture: solid boxes are MVP, dashed box is future work](../design/iinvoice-architecture-Phase1.svg)

[Open the SVG](../design/invoice-architecture-Phase1.svg)

- **GitHub:** One team repository containing source, issues, PRs and documentation.
- **Vercel:** Builds the Vite app and hosts its files. Use `npm run build`, output `dist`, and a React Router SPA rewrite. The browser runs React.
- **MockAPI.io:** One shared `invoices` resource. Every browser uses the same API base URL; MockAPI stores the records. The team does not operate a database or custom server.
- **React Router:** `/invoices`, `/invoices/new`, `/invoices/:id`; `/` redirects to the list; unknown paths show a helpful page.
- **Shared state:** One `InvoicesProvider` above the routes uses `useState` and Context to share invoices and actions across the three tracks. Context is justified here by cross-route ownership. `useEffect` loads the collection; direct detail URLs fetch the individual record.
- **Local state:** Controlled form inputs/line items in the create page; confirmation and per-operation errors in the detail page. Avoid one global loading flag blocking unrelated actions.
- **Composition:** Pages assemble shared layout, loading/error feedback, invoice rows, form fields, line items and totals.
- **CRUD:** `POST /invoices` (Create), `GET /invoices` and `GET /invoices/:id` (Read), `DELETE /invoices/:id` (Delete). `PUT/PATCH` (Update) is future scope.

### Data contract agreed on Day 1

```json
{
  "id": "assigned-by-api",
  "customerId": "demo-acme",
  "customerName": "Acme Training (Demo)",
  "invoiceDate": "2026-09-21",
  "items": [
    { "description": "Coffee", "quantity": 20, "unitPriceCents": 500 },
    { "description": "Pastry", "quantity": 20, "unitPriceCents": 400 }
  ],
  "totalCents": 18000,
  "status": "draft"
}
```

Omit `id` from POST; use the server-returned ID. Keep the customer-name snapshot in the invoice. Store line items inside that invoice, not in a second API resource. Verify MockAPI round-trips the nested array on Day 1. Calculate `totalCents` at save and display consistently; these client calculations are for a demo, not a trusted billing backend.

Configure `VITE_API_BASE_URL` in each developer's `.env.local` and in Vercel, then redeploy after configuration changes. Commit `.env.example` with a placeholder. A `VITE_` value is browser-visible, so it is not a place for secrets. Use fictional data and document that the demo API is not private.

**Save behaviour:** Disable Save while pending; retain inputs on error. Update shared state using the returned record only after success. A network timeout can leave the outcome uncertain: refresh/check the list before resubmitting. Do not automatically retry POST. Cancel/ignore obsolete fetch results so they cannot overwrite newer state.

**Shared does not mean live:** Load on page entry and provide Refresh. Do not use localStorage as the invoice source of truth or silently fall back to local saves when the API fails. Re-fetching is required to see another person's edits/deletions.

Use a separate test API project if available within the chosen plan; otherwise reserve clearly labelled demo records and coordinate deletions. Preview deployments pointed at the same API will change the same records.

Reference: [MockAPI quick start](https://github.com/mockapi-io/docs/wiki/Quick-start-guide), [Vite environment variables](https://vite.dev/guide/env-and-mode), [Vercel Vite deployment](https://vercel.com/docs/frameworks/frontend/vite).

## 5. Tracks and individual contribution

| Member | Owned route | State implementation | Fetching / composition implementation |
| --- | --- | --- | --- |
| Jenn Fang | `/invoices` | Shared collection, load/error/retry state | GET collection; compose invoice rows/list |
| Ralph | `/invoices/new` | Controlled form, line-item array, save/error state | POST invoice; compose form/line-item editor |
| John | `/invoices/:id` | Selected invoice, detail loading/error and delete state | GET by ID and DELETE; compose detail/totals |

Each member implements their own work and commits it under their own identity. Review alone is not implementation evidence. Everyone reviews another track and learns the full app.

John scaffolds the router/provider interface and deploys the shell. Jenn Fang owns collection loading; Ralph owns create behaviour; John owns detail/delete behaviour. Keep operation-specific hooks in each track and integrate through a small, stable shared Context contract:

```text
Shared context:
  invoices, listLoading, listError
  refreshInvoices(), upsertInvoice(savedInvoice), removeInvoice(id)

Create track:
  POST -> upsertInvoice(serverRecord) -> navigate to details

Detail track:
  GET by ID -> local detail state
  successful DELETE -> removeInvoice(id) -> navigate to list
```

The provider must also prevent an older in-flight collection response from undoing a successful local mutation; abort/invalidate that request or re-fetch after the mutation. Coordinate shared-file edits rather than implementing separate stores in each route.

## 6. Proposed repository structure

Use folders by feature, not folders named after people. Each track includes its page, hook and components, reducing conflicts while preserving one deployable app.

```text
coffee-house-invoices/
├── public/
├── src/
│   ├── app/                           # John scaffolds; coordinate edits
│   │   ├── App.jsx                    # Router + provider + layout
│   │   └── InvoicesProvider.jsx        # Jenn Fang owns collection logic
│   ├── features/
│   │   └── invoices/
│   │       ├── list/                  # Jenn Fang
│   │       │   ├── InvoiceListPage.jsx
│   │       │   └── InvoiceRow.jsx
│   │       ├── create/                # Ralph
│   │       │   ├── NewInvoicePage.jsx
│   │       │   ├── InvoiceForm.jsx
│   │       │   ├── LineItemEditor.jsx
│   │       │   └── useCreateInvoice.js
│   │       └── detail/                # John
│   │           ├── InvoiceDetailPage.jsx
│   │           ├── InvoiceDetails.jsx
│   │           └── useInvoiceDetail.js
│   ├── shared/                        # Agree changes in PRs
│   │   ├── api/invoicesApi.js          # GET / POST / DELETE wrappers
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   ├── LoadingMessage.jsx
│   │   │   └── ErrorMessage.jsx
│   │   └── utils/money.js              # Shared calculation/formatting
│   ├── data/customers.json            # Fixed fictional customers
│   ├── main.jsx
│   └── styles.css
├── assets/invoice-architecture-7-days.svg
├── docs/
│   ├── INVOICE_PROJECT_PLAN_7_DAYS.md
│   ├── data-contract.md
│   ├── screenshots/
│   └── presentation.pdf               # Add before submission
├── .github/pull_request_template.md
├── .env.example
├── .gitignore                         # Ignore .env.local, dist, node_modules
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── eslint.config.js
├── vercel.json
└── README.md
```

Use component-local CSS files if needed to avoid three people editing `styles.css`. Keep a single dependency lockfile; coordinate dependency additions with John. This is a proposed tree, not an existing scaffold.

## 7. Git workflow: stay current without breaking each other

**One repository, working `main`, short-lived issue branches.** Do not keep separate member branches for all seven days or copy files between personal repositories. `main` is the latest reviewed working code, not everyone else's unfinished work.

1. Create issues with owner and acceptance criteria. Board: Ready -> In progress -> Review -> Done. Keep one active implementation issue per person.
2. Branch from current `main`: `feat/invoice-list`, `feat/invoice-form`, `feat/invoice-detail`, then smaller fix branches as needed.
3. Commit meaningful increments in your own track. Push and open a PR early; merge small working slices at least daily where possible.
4. Review rotation: Jenn Fang reviews Ralph; Ralph reviews John; John reviews Jenn Fang. PRs include linked issue, behaviour, checks, and screenshot where useful.
5. Require one teammate review and successful lint/build before merge. Also manually check the affected route on a preview or locally. Enable branch protection if available.
6. Use merge commits to retain individual authorship. After a PR merges, teammates fetch and merge `origin/main` into their active feature branches. Restart the dev server if configuration changes; run `npm ci` if dependencies changed.
7. Resolve conflicts with the relevant owner. Do not force-push shared branches or blindly accept one side of a conflict. Stable interfaces and small PRs make updates easier.

```bash
# Start a new task
 git switch main
 git pull --ff-only origin main
 git switch -c feat/invoice-list

# Share your completed slice
 git add src/features/invoices/list
 git commit -m "feat: display shared invoice list"
 git push -u origin feat/invoice-list
# Open PR, obtain review, and merge through GitHub.

# Bring newly merged teammate code into your active branch
# First commit your current work; these commands assume a clean working tree.
 git fetch origin
 git merge origin/main
 npm run lint
 npm run build
```

For an urgent dependency, merge a small working contract/scaffold PR first. Do not wait for an entire route to be polished. A branch is not updated automatically when a teammate pushes; fetching/merging is explicit.

## 8. Seven-day delivery schedule

| Day | Team milestone | Ownership / exit condition |
| --- | --- | --- |
| 1 | Freeze scope; agree data/API contracts; set up repo, MockAPI and deployed Vite shell | All agree; John scaffolds; Jenn Fang seeds customers; Ralph validates invoice schema. All three routes render placeholders. |
| 2 | First working slices | Jenn Fang: GET/list. Ralph: controlled form/calculations. John: GET/detail. Review and merge small PRs. |
| 3 | Complete mutations | Ralph: POST/save errors. John: DELETE/confirmation. Jenn Fang: refresh/empty/error states. Integrate each track. |
| 4 | Hard MVP deadline | All demonstrate create -> list -> detail -> delete on Vercel, including a second browser reading the saved invoice. |
| 5 | Reliability and cross-review | Fix failed requests, validation, stale state, deep-link refresh and narrow layouts. Feature freeze. |
| 6 | Submission materials | Ralph coordinates README; John slides; Jenn Fang screenshots/checklist. All add learnings/disclosures and rehearse. |
| 7 | Buffer and submission | Critical fixes only. John submits; Ralph verifies receipt; Jenn Fang verifies deployed URL. |

**Time budget per member:** 0.5 h planning + 3 h implementation + 1.5 h integration/review + 0.75 h verification + 1.25 h documentation/rehearsal = 7 h; reserve up to 1 h for problems. Rebalance supporting tasks when scaffolding or integration takes longer. If behind, reduce visual polish and line-item UI complexity; never drop required routes, controlled form, read/delete, errors, or deployment.

## 9. Acceptance and submission checklist

- [ ] Each member has implemented state, a route, fetching/composition, and visible commits/PRs.
- [ ] A valid form saves one draft; invalid quantities/prices/blank descriptions are rejected.
- [ ] Twenty coffees at $5 plus twenty pastries at $4 display $180.00 consistently.
- [ ] MockAPI returns saved nested line items unchanged; refresh retains the invoice.
- [ ] A second browser sees the invoice after fetching/refreshing; deletion is reflected after refresh.
- [ ] Loading, empty, API failure/retry, missing invoice and unknown route states work.
- [ ] Cancel deletion changes nothing; failed deletion leaves the record visible.
- [ ] Direct visit/refresh on `/invoices/:id` works on Vercel.
- [ ] Clean install, lint and production build pass; no unexplained console errors.
- [ ] README includes purpose, team/work split, setup/configuration, deployed URL, screenshot/recording, completed bonuses (or none), limitations, and AI/tools/adapted-code disclosure.
- [ ] Slides cover problem, stack/reasons, screenshots, member learnings and challenges. Everyone can explain the full app.
- [ ] Rehearse a 10–15 minute presentation including the live flow; retain screenshots as a fallback.
- [ ] Submit the repository link through NTU Blackboard before Lesson 2.19.
