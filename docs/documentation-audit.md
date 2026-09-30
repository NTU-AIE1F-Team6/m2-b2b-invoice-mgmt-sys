# Documentation audit

**Audit date:** 30 September 2026  
**Inputs:** assignment brief, PRD, source code, package configuration, Git history, CI workflow,
existing engineering/planning/handoff documentation

## Assignment requirements found in the PDF brief

The 22-page Module 2 brief requires:

- Vite, functional React components/hooks, sensible component composition, shared state, and at
  least two React Router views.
- External or mock data with loading/error handling, a controlled create form, collection read and
  delete behaviour, and a public deployment.
- Visible team collaboration through commits, feature branches/PRs or an agreed equivalent, and
  basic project management.
- A README with app purpose/audience, team/work split, local setup, deployed URL,
  screenshot/recording, bonus challenges, and an AI/tools disclosure.
- A 10-15 minute presentation covering problem, stack/data source and rationale, screenshots,
  individual learnings, challenges, and a live demo.

The brief describes update, mock auth, responsive UI, tests, and search/sort as bonus challenges.
It does not require a production backend or production-grade security.

## Findings and changes made

| Area | Finding before this audit | Resolution |
|---|---|---|
| Root README | Strong setup/data notes, but missing team contributions, AI disclosure, screenshot status, release/decision links, explicit scope boundary, and detailed limitations | Reorganised README around submission evidence and linked detailed documents |
| Runtime instructions | README stated Node 18+ and local `/easyinvoice/`; Vite 8 requires Node 20.19+/22.12+ and default local base is `/` | Corrected prerequisites and URL |
| Architecture | Detailed but its status said already-merged work was still on feature branches | Updated status to the current `main` baseline |
| Testing | Detailed but described 37 tests as branch-only and 18 tests on `main` | Updated to the verified 37-test baseline |
| Scope | PRD mixes desired full scope with actual delivery; deferred items were scattered across roadmap/architecture | Added `docs/product/scope-and-limitations.md` |
| Contributions | Three task-list files were empty and README had no work split | Added evidence-based contribution document and populated task lists |
| Deployment/engineering | Details were spread across README, Vite config, CI, CONTRIBUTING, and scripts | Added `docs/engineering/deployment.md` |
| Release history | Git history existed but there was no human-readable release log | Added `docs/releases/release-log.md` |
| Decision history | Existing log was useful but lacked the final scope/documentation decisions | Added a dated entry and linked it from README |
| Screenshots | No application screenshots or recording were committed | Added a manifest and explicit placeholders; still requires team action |
| Roadmap | Listed PRs #3-#9 as future even though they are merged | Replaced with current submission gaps and future phases |

## Remaining evidence gaps

These items cannot be inferred safely and remain placeholders:

1. **Application screenshots or recording.** Capture the deployed build using demo-only data and
   commit the files listed in `docs/screenshots/README.md`, or add a stable recording URL.
2. **Personal learning statements.** Each member should write two or three sentences in
   `docs/team/contributions.md` in their own words.
3. **Live deployment verification.** Confirm login, deep-link refresh, MockAPI read/write
   persistence, and public API fallbacks from a clean browser shortly before submission.
4. **Presentation deck link/file.** `docs/planning/presentation-outline.md` still has no final deck.
5. **Project-management evidence.** The repository has PR history and now-populated task lists,
   but the prior GitHub review could not confirm a Projects board. Link the board if one exists.
6. **External-source disclosure confirmation.** The repository identifies the supplied HTML
   mockup and AI tools, but each member should confirm whether any additional tutorial/source was
   adapted.

## Documentation risks still visible

- The PRD is a planning baseline and intentionally contains unimplemented maker-checker/Yup/lint
  requirements. Readers should use the README and scope document for the delivered release.
- `scripts/deploy.ps1` is retained for the earlier NAS prototype and is not the canonical Vercel
  path. It should not be presented as current production automation.
- GitHub branch protection/required checks were previously unavailable for the private free-plan
  repository. The documented review and CI rules are therefore partly team conventions rather
  than enforced controls.

The audit also corrected the Tour page's stale React 18/Vite 5/Router 6 stack label.

## Recommended pre-submission sign-off

- [ ] Add and visually inspect the required screenshots/recording.
- [ ] Replace all personal-learning placeholders.
- [ ] Verify the Vercel deployment and MockAPI persistence from two sessions.
- [ ] Run `npm test` and `npm run build` on the final commit.
- [ ] Confirm GitHub Actions is green for the final PR/main revision.
- [ ] Confirm every member can explain state, routes, fetching/composition, and their commits.
- [ ] Add the final slide-deck link and rehearse the 10-15 minute presentation.
