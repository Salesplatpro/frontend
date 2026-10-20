import { readFileSync } from 'fs'
import path from 'path'
import { describe, expect, it } from 'vitest'

import { PAGE_META_PATTERN, renderJobPage } from '../../../api/job-page'

const shell = readFileSync(
  path.resolve(__dirname, '../../../index.html'),
  'utf8',
)

const JOB_ID = '0f4c1a2e-9b3d-4c7a-8e15-2d6f7b8c9a01'
const ORIGIN = 'https://www.auxhr.com'
const TITLE = 'Senior Sales Executive at Acme &amp; Co'

const job = {
  id: JOB_ID,
  role: { name: 'senior sales executive' },
  organization: { name: 'Acme & Co' },
  jobBrief: '<p>Lead our sales team across West Africa.</p>',
  locationCity: 'Lagos',
  locationCountry: 'Nigeria',
  workMode: ['remote'],
}

describe('index.html page-meta block', () => {
  it('wraps every generic title, description and card tag', () => {
    expect(shell).toMatch(PAGE_META_PATTERN)

    const outside = shell.replace(PAGE_META_PATTERN, '')
    expect(outside).not.toMatch(
      /<title>|name="description"|property="og:|name="twitter:/,
    )
  })
})

describe('renderJobPage', () => {
  const html = renderJobPage(shell, job, JOB_ID, ORIGIN)

  it('puts the role title in the page title and card tags', () => {
    expect(html).toContain(`<title>${TITLE}</title>`)
    expect(html).toContain(`<meta property="og:title" content="${TITLE}" />`)
    expect(html).toContain(`<meta name="twitter:title" content="${TITLE}" />`)
  })

  it('replaces the generic card tags instead of adding to them', () => {
    expect(html).not.toContain('AI-powered hiring that finds the right fit')
    expect(html.match(/property="og:title"/g)).toHaveLength(1)
    expect(html.match(/<title>/g)).toHaveLength(1)
  })

  it('points og:url at the www job page and og:image at its card', () => {
    expect(html).toContain(
      `<meta property="og:url" content="https://www.auxhr.com/job/postedjob/${JOB_ID}" />`,
    )
    expect(html).toContain(
      `<meta property="og:image" content="${ORIGIN}/api/og/job?id=${JOB_ID}" />`,
    )
  })

  it('keeps the app bootstrapping', () => {
    expect(html).toContain('<div id="root"></div>')
    expect(html).toContain('<script type="module" src="/src/main.tsx">')
  })

  it('cannot close the JSON-LD script from job text', () => {
    const hostile = renderJobPage(
      shell,
      {
        ...job,
        jobBrief: '&lt;/script&gt;&lt;script&gt;alert(1)&lt;/script&gt;',
      },
      JOB_ID,
      ORIGIN,
    )
    const jsonLd = hostile.match(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
    )?.[1]

    expect(jsonLd).toBeDefined()
    expect(jsonLd).not.toContain('<')
    expect(JSON.parse(jsonLd as string).description).toBe(
      '</script><script>alert(1)</script>',
    )
  })
})
