# Contributing to AuxHR Frontend

This document is the source of truth for how we branch, commit, review, test, and release. If anything here conflicts with tribal knowledge or an older note in `README.md`, **this file wins** — and please open a PR to fix the conflict.

---

## 1. Branching strategy

Two permanent branches:

| Branch        | Purpose                                                                  | Protection                                                                         |
| ------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| `main`        | Production — always deployable, always stable                            | Protected: PR + approvals + passing CI required, no direct pushes, no force-pushes |
| `development` | Integration — where features land and get tested together before release | Protected: PR + passing CI required, no direct pushes, no force-pushes             |

Everything else is a **short-lived working branch**, named by type and ticket:

```
feature/<ticket>-<slug>     e.g. feature/AUX-142-job-filter
fix/<ticket>-<slug>         e.g. fix/AUX-291-token-expiry
hotfix/<ticket>-<slug>      e.g. hotfix/AUX-401-login-failure   (branches from main — see § Hotfixes)
```

- `<ticket>` references the tracking issue/ticket ID (e.g. `AUX-142`). If there's no ticket yet, create one first — an untracked branch is how we ended up with 30 stale, unattributable branches (`Paul`, `timmy`, `Share-Copy`, …) that nobody could confidently delete.
- `<slug>` is a short, lowercase, hyphenated description of the change.
- Branch off the latest `development` (or `main`, for hotfixes) — always `git pull` first.
- **Delete your branch once its PR merges.** GitHub can do this for you automatically — see § Keeping the repo clean.

### Hotfixes

A `hotfix/*` branch is for production-breaking issues that can't wait for the normal `development → main` cycle. It branches from `main`, and once merged must be merged into **both** `main` and `development` (so the fix isn't lost on the next regular release).

---

## 2. Commit messages — Conventional Commits (enforced)

Every commit message must follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>: <short, present-tense description>

[optional longer body]
[optional footer(s)]
```

Allowed `<type>` values (enforced by `commitlint.config.js`):

| Type       | Use for                                                                 |
| ---------- | ----------------------------------------------------------------------- |
| `feat`     | A new feature                                                           |
| `fix`      | A bug fix                                                               |
| `chore`    | Maintenance — tooling, deps, config, no production-code behavior change |
| `refactor` | Code change that neither fixes a bug nor adds a feature                 |
| `docs`     | Documentation only                                                      |
| `test`     | Adding or correcting tests                                              |
| `build`    | Build system or external dependency changes                             |
| `ci`       | CI configuration/scripts                                                |
| `perf`     | A performance improvement                                               |
| `style`    | Formatting, whitespace — no code-behavior change                        |
| `revert`   | Reverting a previous commit                                             |

**Examples** (good):

```
feat: add onboarding flow
fix: resolve token refresh bug
refactor: extract user service
chore: bump vitest to v3
ci: add coverage reporting to CI pipeline
```

**This is mechanically enforced** — a `commit-msg` Husky hook runs `commitlint` on every commit. A non-conforming message is rejected locally, before it ever reaches GitHub:

```
$ git commit -m "updated stuff"
⧗   input: updated stuff
✖   subject may not be empty [subject-empty]
✖   type may not be empty [type-empty]
✖   found 2 problems, 0 warnings
husky - commit-msg hook exited with code 1 (error)
```

If you ever see a hook reject your commit, **fix the message** — don't reach for `--no-verify`. Bypassing the hook just means the same check fails later in CI, on a commit you can no longer easily edit.

---

## 3. Pull request workflow

```
feature/* ──▶ development ──▶ (QA verification) ──▶ main
   fix/*  ──┘
```

1. **Open the PR against `development`** (the default branch) using the template in `.github/pull_request_template.md` — fill in Summary, Changes, Screenshots (for UI changes), Testing, and the Checklist.
2. **CI must pass** — `ci.yml` runs Lint, Format check, Typecheck, Test + coverage, and Build on every PR. A red check blocks merge once branch protection is configured to require these status checks (Settings → Branches → Add rule → "Require status checks to pass" — `Lint`, `Format check`, `Typecheck`, `Test + coverage`, `Build`).
3. **Get the required approvals** from a reviewer (CODEOWNERS routes review requests automatically — see `CODEOWNERS`).
4. **Squash or merge** once approved and green — whichever the reviewer prefers, but keep the final commit message Conventional-Commits-formatted (it becomes the permanent history on `development`).
5. **Release to production**: once `development` has been verified (QA / staging / manual smoke-test, depending on the change), open a PR from `development → main`. This is the release — see § Releases.

**No direct commits to `main` or `development`.** Always go through a PR, even for "trivial" changes — the CI gate is what catches the trivial-looking change that breaks the build.

---

## 4. Local development workflow

```bash
# Use the pinned Node version (see .nvmrc)
nvm use

# Install dependencies (yarn only — see § Why yarn)
yarn install

# Start the dev server
yarn dev

# Before committing / pushing, these run automatically via Husky — but you can run them yourself too:
yarn lint           # ESLint with autofix (local convenience)
yarn lint:check     # ESLint without autofix (what CI runs — use this to see what CI will see)
yarn format         # Prettier --write
yarn format:check   # Prettier --check (what CI runs)
yarn type-check     # tsc --noEmit
yarn test           # vitest (watch mode)
yarn test run       # vitest (single run — what CI runs)
yarn build          # production build
```

### What the Git hooks do (Husky)

| Hook         | Runs                                                                | Purpose                                                                                                                                              |
| ------------ | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `commit-msg` | `commitlint`                                                        | Rejects non-Conventional-Commit messages                                                                                                             |
| `pre-commit` | `lint-staged` (ESLint `--fix` + Prettier `--write` on staged files) | Auto-fixes what it can before it's committed — keeps the repo consistently formatted without you having to remember to run it                        |
| `pre-push`   | `type-check`, `test run`, `build`                                   | Catches type errors, failing tests, and build breaks **before** they reach GitHub — the same gates CI runs, just earlier, so you get faster feedback |

### Why yarn

The committed lockfile is `yarn.lock`. **Use `yarn` for everything** — installing with `npm` against a `yarn.lock` can resolve a different dependency tree than what's actually shipped (this was a real, confirmed bug in the old `lint.yml`, which ran `npm install` against this `yarn.lock`-only project — fixed by standardizing `ci.yml` on `yarn`). Don't commit a `package-lock.json` or `pnpm-lock.yaml`.

---

## 5. Releases

There's currently no formal versioning — "release" means "merge `development` into `main`." Going forward:

1. Open a `development → main` PR, get it reviewed and merged through the same CI-gated process.
2. Tag the resulting `main` commit (`git tag vX.Y.Z && git push origin vX.Y.Z`) so "what's in production right now" is answerable without reading commit history.
3. The `deploy.yml` workflow runs automatically on every push to `main`, building fresh from source and swapping it onto the server via SSH. It currently has no rollback path or health check — a deploy-process redesign (atomic build-then-swap, health checks, staging) is a known follow-up for the infra owner, not yet implemented.

---

## 6. Keeping the repo clean

This repo accumulated **30 branches** — most stale for 9–18 months — before a cleanup pass removed 24 confirmed-merged ones (verified via `git merge-base --is-ancestor` against `development`; the remaining 4 contained unmerged work and were flagged for owner sign-off rather than auto-deleted). To not repeat that:

- **Delete your branch once its PR merges.** Better yet, ask an admin to enable **"Automatically delete head branches"** (Settings → General → Pull Requests) so this happens for everyone, automatically, every time.
- **Reference a ticket in your branch name** (`feature/AUX-142-...`) — an unticketed branch named `Share-Copy` or `timmytest` becomes unattributable the moment its author moves on, and unattributable branches are how stale branches survive 18 months.

---

## 7. Best practices (carried over from the original README, still true)

- Always pull the latest `development` before creating a new branch.
- Resolve merge conflicts locally before opening/updating a PR.
- Don't commit directly to `main` or `development`.
- Keep PRs focused and reviewable — a 2,000-line PR gets a worse review than five 400-line ones.
