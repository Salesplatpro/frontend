// Tests for the Vercel "deploy only after tests pass" gate.
// Runs with Node's built-in test runner (no dependencies): node --test scripts/vercel-gate.check.mjs
// CI runs it in the build job. Named *.check.mjs so vitest does not collect it.
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const script = path.join(repo, 'scripts/check-vercel-secrets.sh')
const SECRETS = ['VERCEL_TOKEN', 'VERCEL_ORG_ID', 'VERCEL_PROJECT_ID']

function check(env) {
  const clean = { PATH: process.env.PATH }
  const res = spawnSync('bash', [script], {
    env: { ...clean, ...env },
    encoding: 'utf8',
  })
  return { code: res.status, output: `${res.stdout}${res.stderr}` }
}

test('secrets check fails loudly and names every missing secret', () => {
  const res = check({})
  assert.equal(res.code, 1)
  for (const name of SECRETS) assert.match(res.output, new RegExp(name))
  assert.match(res.output, /Production was NOT deployed/)
  assert.match(res.output, /VERCEL-SETUP\.md/)
  assert.match(res.output, /^::error/m)
})

test('secrets check names only the secret that is missing', () => {
  const res = check({
    VERCEL_TOKEN: 't',
    VERCEL_ORG_ID: 'team_x',
    VERCEL_PROJECT_ID: '',
  })
  assert.equal(res.code, 1)
  assert.match(res.output, /VERCEL_PROJECT_ID/)
  assert.doesNotMatch(res.output, /VERCEL_TOKEN|VERCEL_ORG_ID/)
})

test('secrets check passes when all three secrets are set', () => {
  const res = check({
    VERCEL_TOKEN: 't',
    VERCEL_ORG_ID: 'team_x',
    VERCEL_PROJECT_ID: 'prj_y',
  })
  assert.equal(res.code, 0, res.output)
})

test("vercel.json turns off Vercel's automatic production deploy from main", () => {
  const vercel = JSON.parse(
    readFileSync(path.join(repo, 'vercel.json'), 'utf8'),
  )
  assert.equal(vercel.git?.deploymentEnabled?.main, false)
})

test('CI deploys to Vercel production only after the build job passes, on pushes to main', () => {
  const ci = readFileSync(path.join(repo, '.github/workflows/ci.yml'), 'utf8')
  const deploy = ci.slice(ci.indexOf('\n  deploy-production:'))
  assert.ok(
    ci.includes('\n  deploy-production:'),
    'ci.yml has a deploy-production job',
  )
  assert.match(deploy, /needs: build/)
  assert.match(
    deploy,
    /github\.event_name == 'push' && github\.ref == 'refs\/heads\/main'/,
  )
  assert.match(deploy, /scripts\/check-vercel-secrets\.sh/)
  assert.match(deploy, /vercel@[\d.]+ pull --yes --environment=production/)
  assert.match(deploy, /vercel@[\d.]+ build --prod/)
  assert.match(deploy, /vercel@[\d.]+ deploy --prebuilt --prod/)
  for (const name of SECRETS)
    assert.match(deploy, new RegExp(`secrets\\.${name}`))
})

test('CI runs these gate tests in the build job', () => {
  const ci = readFileSync(path.join(repo, '.github/workflows/ci.yml'), 'utf8')
  assert.match(ci, /node --test scripts\/vercel-gate\.check\.mjs/)
})
