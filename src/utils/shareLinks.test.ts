import { afterEach, describe, expect, it, vi } from 'vitest'

import { appOrigin, buildJobShareUrl, buildShareTargets } from './shareLinks'

const JOB_ID = '0f4c1a2e-9b3d-4c7a-8e15-2d6f7b8c9a01'

describe('appOrigin', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it('falls back to the production origin when unset', () => {
    expect(appOrigin).toBe('https://auxhr.com')
  })

  it('strips trailing slashes from a configured origin', async () => {
    vi.stubEnv('VITE_PUBLIC_APP_URL', 'https://staging.auxhr.com//')
    vi.resetModules()

    const reloaded = await import('./shareLinks')

    expect(reloaded.appOrigin).toBe('https://staging.auxhr.com')
    expect(reloaded.buildJobShareUrl(JOB_ID)).toBe(
      `https://staging.auxhr.com/job/postedjob/${JOB_ID}`,
    )
  })
})

describe('buildJobShareUrl', () => {
  it('builds the public job path on the canonical origin', () => {
    expect(buildJobShareUrl(JOB_ID)).toBe(
      `https://auxhr.com/job/postedjob/${JOB_ID}`,
    )
  })

  it('encodes the job id', () => {
    expect(buildJobShareUrl('a b/c')).toBe(
      'https://auxhr.com/job/postedjob/a%20b%2Fc',
    )
  })
})

describe('buildShareTargets', () => {
  const url = 'https://auxhr.com/job/postedjob/abc'
  const title = 'Senior Sales Executive at Acme & Co'
  const targets = buildShareTargets(url, title)

  it('encodes the shared url for every network', () => {
    const encoded = encodeURIComponent(url)

    expect(targets.facebook).toContain(encoded)
    expect(targets.x).toContain(encoded)
    expect(targets.linkedin).toContain(encoded)
    expect(targets.whatsapp).toContain(encodeURIComponent(url))
  })

  it('uses the current x and linkedin endpoints', () => {
    expect(targets.x).toContain('x.com/intent/post')
    expect(targets.x).not.toContain('twitter.com/share')
    expect(targets.linkedin).toContain('linkedin.com/sharing/share-offsite/')
    expect(targets.linkedin).not.toContain('shareArticle')
  })

  it('pre-fills the x post with the job title', () => {
    expect(targets.x).toContain(`text=${encodeURIComponent(title)}`)
  })

  it('puts the url last in the whatsapp message so it linkifies', () => {
    expect(targets.whatsapp).toBe(
      `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    )
  })
})
