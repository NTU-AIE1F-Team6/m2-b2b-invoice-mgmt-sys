# Ralph — Task List

- [x] Initial React + Vite app scaffold (PR #1, `feat/invoicenow-vite-app`):
  - Login page (SHA-256 password gate) and route guard
  - Dashboard: invoice list, search/status filter, stat cards
  - Create / edit / delete an invoice, with the transmit-to-Peppol simulation
  - Customers and products pages
  - Tour / "how it's built" page with in-app React-concept hints
  - `useInvoices` (useReducer) + localStorage persistence (later replaced with MockAPI in PR #5)
- [ ] Review John's PRs per the team's review rotation (Ralph's PRs → John reviews; John's PRs →
      Jenn reviews) — not done yet on any of #3-#9; all were self-merged out of time pressure
- [ ] Enhance "how the app was built" (Tour page) — per the 25 Sep decisions log
      (`docs/decisions/decisions-log.md`); note John has already touched `tour.js` for the
      MockAPI/rename work, coordinate before both editing it

_This list was populated from commit/PR history — Ralph, please correct or expand it._
