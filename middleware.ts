// Vercel Edge Middleware — root-level convention, runs before the SPA is
// served. Injects OG/Twitter-card meta tags for known social-crawler
// requests to a public job page; every other request passes through to the
// SPA untouched. Kept dependency-free and simple (fetch JSON, template
// HTML) since the Edge Runtime does not support the full Node API surface.

const CRAWLER_UA_PATTERN =
  /facebookexternalhit|Twitterbot|Slackbot|LinkedInBot|WhatsApp|Instagram/i

const JOB_PATH_PATTERN = /^\/job\/postedjob\/([^/?#]+)/

// Same env var the SPA build injects into `import.meta.env.VITE_API_BASE_URL`
// (src/utils/baseConfig.ts) — Vercel exposes project env vars to Edge
// Middleware via `process.env` regardless of the VITE_ prefix, since that
// prefix only governs what Vite inlines into the client bundle.
const API_BASE_URL =
  process.env['VITE_API_BASE_URL'] ?? 'https://api.auxhr.com/v1'

const FALLBACK_IMAGE_PATH = '/og-image.png'

interface JobResponse {
  data?: {
    job?: {
      id?: string
      jobBrief?: string
      role?: { name?: string }
      postedBy?: { firstName?: string; lastName?: string }
      locationCountry?: string | null
      locationState?: string | null
      locationCity?: string | null
      workMode?: string[] | null
      currency?: string | null
      minSalary?: number | null
      maxSalary?: number | null
      compensationPeriod?: string | null
      createdAt?: string
      status?: string
    }
  }
}

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const stripHtml = (html: string): string =>
  html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const truncate = (text: string, limit: number): string =>
  text.length > limit ? `${text.slice(0, limit - 1)}…` : text

const buildLocation = (
  job: NonNullable<NonNullable<JobResponse['data']>['job']>,
): string =>
  [job.locationCity, job.locationState, job.locationCountry]
    .filter(Boolean)
    .join(', ')

const buildHtml = (
  job: NonNullable<NonNullable<JobResponse['data']>['job']>,
  pageUrl: string,
  origin: string,
): string => {
  const title = job.role?.name
    ? `${job.role.name} — Job Opening`
    : 'Job Opening'
  const rawDescription = job.jobBrief
    ? stripHtml(job.jobBrief)
    : 'View this job opening and apply.'
  const description = truncate(rawDescription, 200)
  const imageUrl = `${origin}${FALLBACK_IMAGE_PATH}`
  const location = buildLocation(job)

  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'JobPosting',
    title: job.role?.name ?? title,
    description: rawDescription,
    datePosted: job.createdAt,
    hiringOrganization: {
      '@type': 'Organization',
      name: job.postedBy
        ? `${job.postedBy.firstName ?? ''} ${
            job.postedBy.lastName ?? ''
          }`.trim()
        : undefined,
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
    jobLocationType: job.workMode?.includes('remote')
      ? 'TELECOMMUTE'
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

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>${safeTitle}</title>
    <meta name="description" content="${safeDescription}" />

    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Auxhr" />
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${safeDescription}" />
    <meta property="og:image" content="${escapeHtml(imageUrl)}" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:url" content="${escapeHtml(pageUrl)}" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${safeDescription}" />
    <meta name="twitter:image" content="${escapeHtml(imageUrl)}" />

    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
  </head>
  <body>
    <h1>${safeTitle}</h1>
    <p>${safeDescription}</p>
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

  try {
    const apiResponse = await fetch(`${API_BASE_URL}/jobs/${jobId}`)
    if (!apiResponse.ok) {
      return
    }
    const body = (await apiResponse.json()) as JobResponse
    const job = body.data?.job
    if (!job) {
      return
    }

    const html = buildHtml(job, url.toString(), url.origin)
    return new Response(html, {
      status: 200,
      headers: { 'content-type': 'text/html; charset=utf-8' },
    })
  } catch {
    // On any failure, fall through to the normal SPA rather than error out.
    return
  }
}

export const config = {
  matcher: '/job/postedjob/:jobId*',
}
