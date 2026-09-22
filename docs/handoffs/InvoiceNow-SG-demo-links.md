# InvoiceNow SG: demo links

NTU AI Engineering, Module 2 group project. A React + Vite app that simulates Singapore's
Peppol e-invoicing network. Source code is in the `invoicenow-sg/` folder.

## Start here (no password needed)

- **How it is built (tour page):** https://artificialintelligence.sg/invoicenow/tour/

  One card per React concept with the files and the real code. Click
  **"Open the app with hints on"** at the top to jump into the app with the purple labels showing.

## The app (login required)

| Page | Link |
|---|---|
| Login | https://artificialintelligence.sg/invoicenow/login/ |
| Dashboard | https://artificialintelligence.sg/invoicenow/ |
| Create invoice | https://artificialintelligence.sg/invoicenow/create/ |
| Customers | https://artificialintelligence.sg/invoicenow/customers/ |
| Products | https://artificialintelligence.sg/invoicenow/products/ |

### Login accounts

| Username | Password | Role |
|---|---|---|
| admin | invoicenow2026 | Finance Manager |
| clerk | peppol2026 | AR Officer |

The login is a demo gate: the password is hashed in the browser and compared with a stored
digest, and the session ends when the tab closes. It is not real security.

## Data endpoints (open to see the raw JSON)

| Endpoint | Link | Used by |
|---|---|---|
| Invoices | https://artificialintelligence.sg/invoicenow/api/invoices.json | Dashboard (seed data, then kept in localStorage) |
| Customers | https://artificialintelligence.sg/invoicenow/api/customers.json | Customers page, buyer autocomplete on the form |
| Products | https://artificialintelligence.sg/invoicenow/api/products.json | Products page, product dropdown on each invoice line |
| Users | hardcoded in `invoicenow-sg/src/data/users.js` | Login |

This matches the course's "3 endpoints, hardcode users" arrangement.

Two free public APIs are also called live: Frankfurter (SGD exchange rates on the dashboard)
and randomuser.me (a contact person per customer).

## Where it is listed

- Showcase page: https://artificialintelligence.sg/showcase.html
  (card "InvoiceNow SG · Peppol Portal", also in the Showcase menu on every page of the site)

## Suggested 5-minute demo

1. Open the tour page, then click "Open the app with hints on" and sign in as admin.
2. On the dashboard, read the purple labels: useReducer store, useFetch, lists with keys.
3. Products, then "Add to new invoice": the form opens with the line prefilled (React Router query params).
4. Pick a different product from the dropdown, change the quantity, transmit, watch the toast and the new card.
5. Mark it paid, edit it, delete it, refresh the page: the list is persisted (localStorage effect).

## Files in this folder

- `invoicenow-sg/`: the app source. See its own README for how to run, build and deploy it.
- `STATUS.md`: handoff notes (current state, next steps, decisions, gotchas).
- `requirements.txt`, `Project brief.txt`, `module2-project-brief.pdf`: the course brief.
- `singapore_invoicenow_app/`: the original single-file mock-up, kept for reference only.
