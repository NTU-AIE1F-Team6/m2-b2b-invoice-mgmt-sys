# Engineering design, deployment, and CI/CD

## Environments

| Environment | Base path | Data source | Purpose |
|---|---|---|---|
| Local default | `/` | Static `public/api/*.json` | Read-only development/demo with no secret configuration |
| Local MockAPI | `/` | `VITE_MOCKAPI_URL` | Full CRUD and cross-browser persistence testing |
| Vercel production | `/` | Vercel environment variable | Canonical public deployment |
| Legacy NAS prototype | `/easyinvoice/` | Script-dependent | Historical/reference path; not canonical or guaranteed current |

## Build and runtime design

- Vite compiles the React single-page application into `dist/`.
- `BASE_PATH` defaults to `/` and can be overridden for subfolder hosting.
- Vercel uses `vercel.json` to rewrite all paths to `/index.html`, allowing React Router to resolve
  refreshed deep links.
- `scripts/postbuild.mjs` copies `index.html` into each known route directory for plain static
  hosts that have no SPA rewrite rule.
- Runtime configuration exposes `VITE_MOCKAPI_URL` to browser JavaScript. It must therefore be
  treated as a public endpoint, not a secret.

## Canonical deployment flow

```text
feature branch
    -> pull request
    -> GitHub Actions: npm ci -> npm test -> npm run build
    -> review and merge to main
    -> Vercel Git integration builds/deploys main
    -> manual production smoke check
```

The repository records Vercel as the canonical deployment at
<https://aie1f-easyinvoice.vercel.app>. Verify the current project settings and live URL before
submission; deployment-provider state is outside this repository.

## GitHub Actions

`.github/workflows/ci.yml` runs on every pull request and pushes to `main` using Node 22:

1. Check out the revision.
2. Install exactly from `package-lock.json` with `npm ci`.
3. Run all Vitest tests with `npm test`.
4. Compile and post-process the production build with `npm run build`.

### Current gaps

- No lint, formatting, type-check, schema-contract, accessibility, dependency/security, or
  browser end-to-end job.
- No preview-environment smoke test in CI.
- No deployment verification or automatic rollback job.
- Required checks/approvals may not be enforceable on the repository's private free plan; see
  `CONTRIBUTING.md` and the GitHub structure review.

## Configuration and data safety

| Setting | Location | Notes |
|---|---|---|
| MockAPI base URL | `.env.local` / Vercel environment | Public in the browser bundle; do not treat as a credential |
| Static demo records | `public/api/*.json` | Synthetic, read-only fallback and seed input |
| Demo accounts | `src/data/users.js` | Public client-side learning accounts |
| Status/validation constants | `src/data/constants.js` | Client-side only |

`npm run seed` deletes all records in both configured MockAPI resources and repopulates them from
the static files. Confirm the URL and use only disposable demo data before running it.

## Software-engineering practices

- **Separation of concerns:** pages compose reusable components; API modules own HTTP; hooks own
  async state; pure utilities own calculations; role policy is centralised.
- **Failure semantics:** mutations update reducer state only after the remote call succeeds.
- **Abortable reads:** fetch effects use `AbortController` during component cleanup.
- **Traceability:** PRD, decisions, release log, scope boundary, CODEOWNERS, task lists, and PR
  template are versioned with the code.
- **Review:** contributors use feature branches, small commits, a reviewer rotation, test plan,
  and screenshots for UI changes.
- **Reproducibility:** package lock and `npm ci` are used in CI; static seed data supports repeatable
  demos.

## Release checklist

- [ ] Rebase/merge the intended final branch and inspect the diff.
- [ ] Run `npm ci`, `npm test`, and `npm run build`.
- [ ] Confirm GitHub Actions passes on the final revision.
- [ ] Confirm the Vercel project uses `main`, base `/`, and the intended MockAPI URL.
- [ ] From a clean browser, refresh `/login`, `/tour`, `/create`, and `/edit?id=<valid-id>`.
- [ ] Test VIEW_ONLY and EDIT behaviour.
- [ ] Create/update/delete a disposable invoice and verify it from a second session.
- [ ] Check loading, retry, failure messages, and public API degradation.
- [ ] Confirm screenshots/recording and documentation match the deployed revision.
- [ ] Tag/document the release and update `docs/releases/release-log.md`.

## Rollback and recovery limitations

- Frontend rollback is manual through Vercel/Git; no repository workflow automates it.
- MockAPI mutations are not versioned with frontend releases and have no documented backup.
- Reseeding is destructive and restores demo data, not user changes.
- A production-grade successor should separate deployment from migrations, add backups/versioning,
  and validate forward/backward API compatibility.

