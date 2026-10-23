# Vercel: deploy to production only after tests pass

**Who:** Isaac (or anyone with admin on this GitHub repo and access to the Vercel project).
**Branch:** `ci/vercel-deploy-after-tests`

## What this branch changes

- **Before:** Vercel deploys every push to `main` to production straight away, even if CI fails.
- **After:**
  - `vercel.json` turns off Vercel's automatic deploy from `main` (`"git": { "deploymentEnabled": { "main": false } }`).
  - A new `deploy-production` job in `.github/workflows/ci.yml` deploys to production with the Vercel CLI, and only after the `build` job (lint, type-check, unit tests, build) has passed for that same commit.
  - Preview deploys for other branches and PRs are unchanged.

## ⚠️ Merge this branch only AFTER the 3 secrets exist

Once this is merged, Vercel no longer deploys `main` by itself. If the secrets are missing, the deploy job fails with a red "Vercel secrets missing" error, and **production stops updating** until they are added.

## The 3 secrets

Add them in GitHub: **Salesplatpro/frontend → Settings → Secrets and variables → Actions → New repository secret**.

| Secret name         | Where to get it                                                                                                              |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `VERCEL_TOKEN`      | vercel.com → Account Settings → Tokens → Create. Scope it to the team that owns the project.                                 |
| `VERCEL_ORG_ID`     | Vercel → the team's Settings → General → **Team ID** (starts with `team_`). For a personal account, use your user ID instead. |
| `VERCEL_PROJECT_ID` | Vercel → the frontend project → Settings → General → **Project ID** (starts with `prj_`).                                    |

Shortcut for both IDs: run `npx vercel link` in a local checkout. It writes `.vercel/project.json` with `orgId` and `projectId`. Don't commit that folder.

## After merging

1. Open the merge commit's **CI** run in GitHub Actions. You should see `Build` pass, then `Deploy to Vercel (production)` run.
2. The deploy job prints the production URL. Check that the site shows the new change.
3. In Vercel → the project → Deployments, the newest production deployment should come from the CLI, not from a Git push.

## Undo

Set `"main": true` back in `vercel.json` (or revert the merge). Vercel goes back to deploying every push to `main` itself.
