# Lesson 2.19 presentation — outline

Per the brief (`docs/requirements/module2-project-brief.pdf`, p.16-17): **10-15 minutes per team,
including a live demo.** Keep slides brief — screenshots and a working demo over dense text; this
is a presentation with a demo, not a design document.

## Required slide content

1. **Problem statement** — what EasyInvoice does and who it's for.
   > A small business finance/AR team's tool to create, transmit, track and collect payment on
   > Peppol-style e-invoices, simulating Singapore's InvoiceNow network.

2. **Technologies used** — stack, libraries, data source, and *why*.
   - React 19 + Vite 8 + react-router 7 + Tailwind CSS 4 (see `docs/engineering/architecture.md` §2
     for the full list and rationale)
   - MockAPI as the backend (no server to run/host ourselves; free tier's 2-resource limit shaped
     the `referenceData` design — see architecture.md §4.1 and `docs/decisions/decisions-log.md`)
   - Two free public APIs: Frankfurter (live FX rates) and randomuser.me (customer contacts)
   - Vitest + React Testing Library for tests, GitHub Actions for CI

3. **Screenshots** — `docs/screenshots/dashboard.jpg` at minimum; consider adding one each for
   create-invoice, roles in action (VIEW_ONLY vs EDIT), and the tour page.

4. **Learnings of each team member** — fill in per person, e.g.:
   - Ralph: first full React app build — components, routing, state
   - Jenn: setting up a real test suite from scratch (Vitest, RTL, mocking)
   - John: integrating a third-party mock backend, role-based access control, team GitHub workflow

5. **Challenges encountered** — candidates drawn from what actually happened this project:
   - MockAPI's schema editor silently wipes real data on save (discovered mid-project, documented
     in the README and architecture doc so it doesn't happen again)
   - MockAPI's free-tier 2-resource limit forced a design change (2 resources instead of the
     originally-discussed 3)
   - Coordinating a large rename (EasyInvoice) and a large feature branch (MockAPI/roles) that
     touch many of the same files — resolved via a deliberate merge order, not by avoiding the
     conflict
   - A silent cross-branch bug: two branches each independently valid, that combined to break
     login in tests (a hardcoded pre-rename session-storage key) — no merge conflict flagged it,
     needed running the test suite after merging to catch it

## Live demo checklist

Walk through, in order (matches the acceptance flow already verified against the live deployment):
1. Log in (show two roles: `viewer` = read-only, `john` = full access)
2. Dashboard: search/filter, live FX rates
3. Create an invoice, transmit it
4. Edit an invoice; mark one paid; delete one
5. Customers / Products pages
6. (If time) the Tour page — "how it's built"

## Where this deck should live

Not decided yet — options: Google Slides (link it from here once created), or a `.pptx` in this
folder. Whoever builds the deck, update this file with the actual link/file.
