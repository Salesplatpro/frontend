// Vercel Edge Middleware — root-level convention, runs before the SPA is
// served. Injects OG/Twitter-card meta tags, JobPosting JSON-LD and a
// crawlable text body for known crawler requests to a public job page; every
// other request passes through to the SPA untouched. Kept dependency-free and
// simple (fetch JSON, template HTML) since the Edge Runtime does not support
// the full Node API surface.

const CRAWLER_UA_PATTERN =
  /facebookexternalhit|facebookcatalog|Facebot|Twitterbot|LinkedInBot|Slackbot|Slack-ImgProxy|WhatsApp|Discordbot|TelegramBot|Bluesky|Mastodon|redditbot|Pinterest(?:bot)?|Applebot|SkypeUriPreview|embedly|iframely|vkShare|XING-contenttabreceiver|Nuzzel|Qwantify|outbrain|W3C_Validator|Googlebot|Google-InspectionTool|bingbot|BingPreview|DuckDuckBot|YandexBot|Baiduspider/i

const JOB_PATH_PATTERN = /^\/job\/postedjob\/([^/?#]+)/

// Same env var the SPA build injects into `import.meta.env.VITE_API_BASE_URL`
// (src/utils/baseConfig.ts) — Vercel exposes project env vars to Edge
// Middleware via `process.env` regardless of the VITE_ prefix, since that
// prefix only governs what Vite inlines into the client bundle.
const API_BASE_URL =
  process.env['VITE_API_BASE_URL'] ?? 'https://api.auxhr.com/v1'

// Canonical public origin, shared with buildJobShareUrl in
// src/utils/shareLinks.ts. og:url and rel=canonical are identity claims, so
// they must name production even when a preview deployment renders them.
const SITE_ORIGIN =
  process.env['VITE_PUBLIC_APP_URL'] ?? 'https://www.auxhr.com'

const API_TIMEOUT_MS = 2500

interface JobResponse {
  data?: {
    job?: {
      id?: string
      jobBrief?: string
      requirements?: string | null
      skills?: string[] | null
      role?: { name?: string }
      organization?: {
        id?: string
        name?: string | null
        logoUrl?: string | null
        website?: string | null
      } | null
      postedBy?: { firstName?: string; lastName?: string }
      locationCountry?: string | null
      locationState?: string | null
      locationCity?: string | null
      workMode?: string[] | null
      experienceLevel?: string | null
      currency?: string | null
      minSalary?: number | null
      maxSalary?: number | null
      compensationPeriod?: string | null
      createdAt?: string
      status?: string
    }
  }
}

type Job = NonNullable<NonNullable<JobResponse['data']>['job']>

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const HTML_ENTITIES: Record<string, string> = {
  nbsp: ' ',
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  '#39': "'",
}

const stripHtml = (html: string): string =>
  html
    .replace(/<[^>]*>/g, ' ')
    .replace(
      /&(nbsp|amp|lt|gt|quot|#39);/g,
      (_, entity: string) => HTML_ENTITIES[entity] ?? '',
    )
    .replace(/\s+/g, ' ')
    .trim()

const titleCase = (value: string): string =>
  value.replace(/\b\w/g, (character) => character.toUpperCase())

const truncate = (text: string, limit: number): string =>
  text.length > limit ? `${text.slice(0, limit - 1)}…` : text

const DESCRIPTION_LIMIT = 160

const shortenDescription = (text: string): string => {
  if (text.length <= DESCRIPTION_LIMIT) return text

  const head = text.slice(0, DESCRIPTION_LIMIT)
  const sentenceEnd = Math.max(
    head.lastIndexOf('. '),
    head.lastIndexOf('! '),
    head.lastIndexOf('? '),
  )
  if (sentenceEnd > 0) return head.slice(0, sentenceEnd + 1)

  const wordEnd = head.lastIndexOf(' ', DESCRIPTION_LIMIT - 1)
  const cut = head.slice(0, wordEnd > 0 ? wordEnd : DESCRIPTION_LIMIT - 1)
  return `${cut.replace(/[,;:]$/, '')}…`
}

const buildLocation = (job: Job): string =>
  [job.locationCity, job.locationState, job.locationCountry]
    .filter(Boolean)
    .join(', ')

const buildSalary = (job: Job): string => {
  if (job.minSalary == null) return ''

  const currency = job.currency ? `${job.currency} ` : ''
  const min = job.minSalary.toLocaleString('en-US')
  const range =
    job.maxSalary != null
      ? `${min} – ${job.maxSalary.toLocaleString('en-US')}`
      : min
  const period = job.compensationPeriod === 'monthly' ? 'month' : 'year'

  return `${currency}${range} / ${period}`
}

const buildHtml = (job: Job, jobId: string, origin: string): string => {
  const company = job.organization?.name?.trim() || null
  const recruiter = job.postedBy
    ? `${job.postedBy.firstName ?? ''} ${job.postedBy.lastName ?? ''}`.trim()
    : ''
  const employer = company ?? (recruiter || null)

  const role = job.role?.name ? titleCase(job.role.name) : undefined
  const fullTitle = role
    ? employer
      ? `${role} at ${employer}`
      : `${role} — Job Opening`
    : 'Job Opening'
  const title = truncate(fullTitle, 70)

  const rawDescription =
    stripHtml(job.jobBrief ?? '') || 'View this job opening and apply.'
  const description = shortenDescription(rawDescription)

  const canonicalUrl = `${SITE_ORIGIN}/job/postedjob/${jobId}`
  // Served by the same deployment that rendered these tags, so preview
  // deployments and `vercel dev` produce an inspectable card.
  const imageUrl = `${origin}/api/og/job?id=${encodeURIComponent(jobId)}`

  const location = buildLocation(job)
  const salary = buildSalary(job)
  const isRemote = !!job.workMode?.includes('remote')
  const workModeLabel = job.workMode?.length ? job.workMode.join(', ') : ''
  const requirements = job.requirements ? stripHtml(job.requirements) : ''

  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'JobPosting',
    title: role ?? fullTitle,
    description: rawDescription,
    datePosted: job.createdAt,
    url: canonicalUrl,
    directApply: true,
    // TODO: employmentType and validThrough are omitted deliberately. The Job
    // entity has no employment-type column (workMode is remote/onSite/hybrid
    // and experienceLevel is a seniority string, neither of which maps to the
    // schema.org enum) and no expiry column — and a synthesized validThrough
    // would delist live postings from Google Jobs the moment it passed.
    identifier: {
      '@type': 'PropertyValue',
      name: employer ?? 'Auxhr',
      value: job.id ?? jobId,
    },
    hiringOrganization: {
      '@type': 'Organization',
      name: employer ?? undefined,
      logo: job.organization?.logoUrl ?? undefined,
      sameAs: job.organization?.website ?? undefined,
    },
    jobLocation: location
      ? {
          '@type': 'Place',
          address: {
            '@type': 'PostalAddress',
            addressLocality: job.locationCity ?? undefined,
            addressRegion: job.locationState ?? undefined,
            addressCountry: job.locationCountry ?? undefined,
          },
        }
      : undefined,
    jobLocationType: isRemote ? 'TELECOMMUTE' : undefined,
    // Required by Google whenever jobLocationType is TELECOMMUTE.
    applicantLocationRequirements: isRemote
      ? { '@type': 'Country', name: job.locationCountry ?? 'Worldwide' }
      : undefined,
    baseSalary:
      job.minSalary != null
        ? {
            '@type': 'MonetaryAmount',
            currency: job.currency ?? undefined,
            value: {
              '@type': 'QuantitativeValue',
              minValue: job.minSalary,
              maxValue: job.maxSalary ?? undefined,
              unitText: job.compensationPeriod === 'monthly' ? 'MONTH' : 'YEAR',
            },
          }
        : undefined,
  }

  const safeTitle = escapeHtml(title)
  const safeDescription = escapeHtml(description)

  const facts = [workModeLabel, job.experienceLevel ?? '', salary]
    .filter(Boolean)
    .join(' · ')

  const section = (heading: string, text: string): string =>
    text ? `<h2>${heading}</h2><p>${escapeHtml(text)}</p>` : ''

  const skills = job.skills?.length
    ? `<h2>Skills</h2><ul>${job.skills
        .map((skill) => `<li>${escapeHtml(skill)}</li>`)
        .join('')}</ul>`
    : ''

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>${safeTitle}</title>
    <meta name="description" content="${safeDescription}" />
    <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />

    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Auxhr" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${safeDescription}" />
    <meta property="og:image" content="${escapeHtml(imageUrl)}" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${safeTitle}" />
    <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${safeDescription}" />
    <meta name="twitter:image" content="${escapeHtml(imageUrl)}" />
    <meta name="twitter:image:alt" content="${safeTitle}" />

    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
  </head>
  <body>
    <h1>${safeTitle}</h1>
    ${employer ? `<p>${escapeHtml(employer)}</p>` : ''}
    ${location ? `<p>${escapeHtml(location)}</p>` : ''}
    ${facts ? `<p>${escapeHtml(facts)}</p>` : ''}
    ${section('Job Brief', rawDescription)}
    ${section('Requirements', requirements)}
    ${skills}
    <p><a href="${escapeHtml(canonicalUrl)}">Apply for this position</a></p>
  </body>
</html>`
}

export default async function middleware(request: Request) {
  const userAgent = request.headers.get('user-agent') ?? ''
  if (!CRAWLER_UA_PATTERN.test(userAgent)) {
    return
  }

  const url = new URL(request.url)
  const match = JOB_PATH_PATTERN.exec(url.pathname)
  const jobId = match?.[1]
  if (!jobId) {
    return
  }

  const controller = new AbortController()
  // Kept well under Slack's ~3s budget, above which it renders no card at all.
  const timer = setTimeout(() => controller.abort(), API_TIMEOUT_MS)

  try {
    const apiResponse = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
      signal: controller.signal,
      headers: { accept: 'application/json' },
    })
    if (!apiResponse.ok) {
      return
    }
    const body = (await apiResponse.json()) as JobResponse
    const job = body.data?.job
    if (!job) {
      return
    }

    const html = buildHtml(job, jobId, url.origin)
    return new Response(html, {
      status: 200,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control':
          'public, max-age=0, s-maxage=600, stale-while-revalidate=86400',
        // Without this, any intermediary cache could hand this crawler-only
        // stub to a real visitor.
        vary: 'user-agent',
      },
    })
  } catch {
    // On any failure, fall through to the normal SPA rather than error out.
    return
  } finally {
    clearTimeout(timer)
  }
}

// Scoped to job pages only, which is also why /api/og/job is not intercepted —
// widening this to a catch-all would make middleware swallow its own image
// route, and would need `['/((?!api|_next|.*\\..*).*)']` instead.
export const config = {
  matcher: '/job/postedjob/:jobId*',
}
