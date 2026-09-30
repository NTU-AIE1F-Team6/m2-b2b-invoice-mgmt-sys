# Testing

**Current baseline:** 6 test files and 37 passing tests, verified on 1 October 2026. This document
consolidates the suite summary from `Testing exercise.pdf` with the repository's testing strategy
and conventions.

## Stack and commands

The suite uses Vitest 5, React Testing Library, `@testing-library/jest-dom`,
`@testing-library/user-event`, and jsdom. Test configuration is in `vite.config.js`; shared matcher
setup is in `src/test/setup.js`.

```bash
npm test          # one-shot run used by CI
npm run test:watch # local watch mode
```

GitHub Actions runs `npm ci`, `npm test`, and `npm run build` on every pull request and push to
`main`.

## Coverage by suite

| Test file | Tests | Verified behaviour |
|---|---:|---|
| `src/utils/invoice.test.js` | 4 | Line-item totals; subtotal, GST and invoice total; next invoice number; first number for an empty year |
| `src/components/InvoiceCard.test.jsx` | 7 | Invoice details and total; Draft/Transmitted actions; callback IDs; VIEW_ONLY restrictions; Paid deletion restriction |
| `src/hooks/useInvoices.test.jsx` | 6 | Initial loading; successful/failed load; valid UEN transmission; invalid UEN rejection; failed creation leaves state unchanged and rethrows |
| `src/pages/DashboardPage.test.jsx` | 6 | Buyer rendering; text search; status filtering; empty result; edit navigation; confirmed deletion handler |
| `src/api/invoices.test.js` | 7 | Successful GET/POST/PUT/DELETE requests; readable HTTP errors; network-error propagation; offline write rejection |
| `src/data/roles.test.js` | 7 | No-user and VIEW_ONLY denial; EDIT create permission; status-based edit/transmit/mark-paid/delete rules; unknown-action denial |
| **Total** | **37** | Calculation, component, hook, page workflow, API-boundary, and permission-policy coverage |

The utility and permission suites test pure business rules. API tests verify the HTTP boundary.
Hook tests cover asynchronous state transitions and failure semantics. Component and page tests
exercise user-visible behaviour with realistic rendering and interaction.

## Testing conventions

### Mock at the boundary owned by the test

- API tests mock `global.fetch` because HTTP construction and response handling are the subject.
- Hook and UI tests mock `src/api/invoices.js`, so they do not depend on MockAPI URLs or network
  behaviour already covered by the API suite.

### Keep environment-dependent code testable

`src/api/client.js` reads `import.meta.env.VITE_MOCKAPI_URL` inside `baseUrl()` rather than once at
module import. Tests can therefore use `vi.stubEnv` to exercise configured and offline modes in the
same run.

### Render authentication consumers with the real provider

Tests for components that call `useAuth()` use a real `<AuthProvider>` and seed `sessionStorage`
under `easyinvoice-session`. This catches integration errors between the session shape, provider,
and permission-dependent UI instead of hiding them behind a mocked Context.

### Prefer observable behaviour and stable timing

Tests assert rendered content, available actions, callbacks, navigation, API calls, and final state
rather than component internals or snapshots. Transmission tests await the real 900 ms simulation
with an extended timeout; fake timers combined with `userEvent` were avoided because they proved
flaky.

## Known gaps

- `InvoiceForm.jsx`: field validation, customer/product selection, and line-item add/edit/remove.
- `CreateInvoicePage.jsx` and `EditInvoicePage.jsx`: permission redirects and submission flows.
- `CustomersPage.jsx` and `ProductsPage.jsx`: loading, errors, reference-data rendering, and links.
- Browser-level persistence across two sessions and deployed deep-link smoke tests.
- Automated accessibility, visual-regression, security, and performance checks.
- CI lint, formatting, type, and runtime schema-contract checks.

These gaps do not invalidate the current 37 tests, but they identify the highest-value additions
for a future phase.
