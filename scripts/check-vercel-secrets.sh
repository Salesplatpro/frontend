#!/usr/bin/env bash
# Fails the production deploy loudly when the Vercel secrets are not set.
# Used by the deploy-production job in .github/workflows/ci.yml; see VERCEL-SETUP.md.
set -euo pipefail

missing=()
for name in VERCEL_TOKEN VERCEL_ORG_ID VERCEL_PROJECT_ID; do
  if [ -z "${!name:-}" ]; then
    missing+=("${name}")
  fi
done

if [ "${#missing[@]}" -gt 0 ]; then
  echo "::error title=Vercel secrets missing::Production was NOT deployed. Missing repository secret(s): ${missing[*]}. Add them in GitHub > Settings > Secrets and variables > Actions (see VERCEL-SETUP.md)."
  exit 1
fi

echo "All Vercel secrets are set."
