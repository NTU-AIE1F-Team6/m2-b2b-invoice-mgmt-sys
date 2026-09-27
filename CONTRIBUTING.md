# Contributing (team agreement)

This repo is on GitHub Free (private), so branch protection / required reviews can't be turned on
for `main` yet (that needs GitHub Pro/Team, or a public repo). Until then, this file **is** the
rule: follow it even though GitHub won't stop you from skipping it.

## Branch naming

`<type>/<short-name>-<owner>`, e.g. `feat/mockapi-users-roles-john`, `fix/invoice-total-jenn`.

Types: `feat/`, `fix/`, `docs/`, `chore/`.

## Workflow

1. Branch off `main`.
2. Commit small and often, with descriptive messages (grading looks at individual commit history).
3. Before opening a PR: `git pull --rebase origin main` to pick up anyone else's merges.
4. Open the PR using the template (`.github/pull_request_template.md`): what/why, test plan,
   screenshots for UI changes.
5. Reviewer follows the rotation below. Address feedback, then the reviewer approves.
6. Merge (pick **squash merge** so `main`'s history stays one commit per feature) and delete the
   branch.
7. `main` is never pushed to directly.

## Review rotation

Per the PRD (§11.2): **Jenn's PRs -> Ralph reviews. Ralph's PRs -> John reviews. John's PRs -> Jenn
reviews.** If the assigned reviewer is unavailable, either of the other two can stand in — say so
in the PR.

## Code ownership

`.github/CODEOWNERS` lists suggested reviewers per area (routing hint only, not enforced — see
above). Update it if ownership shifts.

## The EasyInvoice rename PR

The rename (InvoiceNow SG -> EasyInvoice, folder restructure) touches almost every file, so it
will conflict with anything in flight. Agree on a day with the team, merge it when no one else has
an open PR, and everyone should `git pull --rebase origin main` on their own branches right after
it lands.

## Project tracking

Each task from the handoffs / PRD stories should be a GitHub issue: assignee, a label
(`feature`/`bug`/`docs`/`mockapi`/`roles`), and the `Submission (Lesson 2.19)` milestone. Track
status on the repo's Projects board (Todo / In progress / In review / Done).
