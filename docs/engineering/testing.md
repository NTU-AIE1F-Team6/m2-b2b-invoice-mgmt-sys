# Testing

**Status:** current `main` baseline: 6 test files and 37 passing tests, verified on 30 September
2026. See `docs/handoffs/John/HANDOFF-easyinvoice-mockapi.md` for the implementation history.

## Stack

Vitest 5 + React Testing Library + `@testing-library/jest-dom` + `@testing-library/user-event`,
jsdom as the DOM environment. Config lives in `vite.config.js#test` (not a separate
`vitest.config.js`) plus `src/test/setup.js` (imports jest-dom's matchers).

```bash
npm test          # vitest run - one-shot, used in CI
npm run test:watch  # vitest --watch - for local development
```

## What's tested and where

| File | Covers |
|---|---|
| `src/utils/invoice.test.js` | `lineTotal`, `computeTotals`, `nextInvoiceId` — pure functions, no mocking needed |
| `src/data/roles.test.js` | `can()` — every action × every status × VIEW_ONLY/EDIT combination |
| `src/api/invoices.test.js` | `listInvoices`/`createInvoice`/`updateInvoice`/`deleteInvoice` against a mocked `global.fetch`: success, HTTP error, and the offline (`VITE_MOCKAPI_URL` unset) path |
| `src/hooks/useInvoices.test.jsx` | The reducer's loading/error states, and that a failed `addInvoice` leaves `invoices` unchanged (`vi.mock('../api/invoices.js')`, so it tests the hook's own logic, not the network) |
| `src/components/InvoiceCard.test.jsx` | Rendering, and that role/status gate which buttons appear (`user` prop with `EDIT`/`VIEW_ONLY`) |
| `src/pages/DashboardPage.test.jsx` | Search/status filtering, delete confirmation, navigation to edit — wrapped in a real `AuthProvider` with a seeded `sessionStorage` session, since the page reads `useAuth()` directly |

## Conventions

- **Mock at the API layer, not `fetch` directly, when testing consumers.** `useInvoices.test.jsx`
  mocks `../api/invoices.js` wholesale (`vi.mock`) rather than stubbing `global.fetch`, so the test
  doesn't need to know about MockAPI's URL shape or the offline fallback — that's `invoices.test.js`'s
  job. `invoices.test.js` is the one place that mocks `fetch` directly, since it's testing the
  fetch wrapper itself.
- **Stub env vars with `vi.stubEnv`, not module-level constants.** `src/api/client.js` reads
  `import.meta.env.VITE_MOCKAPI_URL` lazily inside a function (`baseUrl()`), not into a
  module-level `const`, specifically so `vi.stubEnv('VITE_MOCKAPI_URL', ...)` can change it
  per-test. A module-level constant would only be evaluated once, before any test runs, which
  would make it impossible for `invoices.test.js` to exercise both the offline fallback and the
  live-MockAPI path in the same file.
- **Wrap anything using `useAuth()` in a real `<AuthProvider>`**, and seed `sessionStorage` under
  the actual session key (`easyinvoice-session`) before rendering — don't mock the context. This
  bit us once already: a test file's hardcoded pre-rename session key silently desynced from
  `AuthContext.jsx` after a merge, and every role-gated button just disappeared with no error
  (see `docs/decisions/decisions-log.md` / the merge commit on `integration/all-local` for detail).
- **Prefer real timers over fake ones for the transmit simulation.** `useInvoices.test.jsx` calls
  `transmitInvoice` directly and awaits the real 900ms delay (with a bumped per-test timeout)
  rather than `vi.useFakeTimers()` + `userEvent` — mixing fake timers with `userEvent`'s internal
  timing proved flaky in practice.

## Not yet covered

- `InvoiceForm.jsx` (validation, line-item add/remove) — no dedicated test file yet
- `CreateInvoicePage.jsx` / `EditInvoicePage.jsx` route-guard redirects — `can()` itself is fully
  tested, but the page-level "redirect a disallowed user" behaviour isn't
- `CustomersPage.jsx` / `ProductsPage.jsx`
- automated accessibility, visual-regression, security, and full browser end-to-end checks
- CI lint/type/schema-contract checks (there is currently no lint script or static type system)
