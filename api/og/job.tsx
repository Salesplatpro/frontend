// Renders the 1200x630 preview card that middleware.ts advertises as og:image
// for a shared job link. Deliberately dependency-free beyond @vercel/og: the
// "@/*" path alias is not resolved for files outside src/, so the small amount
// of formatting this needs is inlined rather than imported from src/utils.
//
// Every failure path redirects to the static /og-image.png instead of erroring,
// because a 500 here means the crawler renders no image at all.
import { ImageResponse } from '@vercel/og'
import React from 'react'

export const config = { runtime: 'edge' }

const API_BASE_URL =
  process.env['VITE_API_BASE_URL'] ?? 'https://api.auxhr.com/v1'

const FALLBACK_IMAGE_PATH = '/og-image.png'
const API_TIMEOUT_MS = 2500
const LOGO_TIMEOUT_MS = 1500
const MAX_LOGO_BYTES = 1_000_000

// Mirrors src/styles/tokens.css — satori cannot read CSS custom properties.
const BRAND_800 = '#2441ab'
const BRAND_500 = '#4985df'
const ON_DARK = '#ffffff'

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Uploads are not MIME-filtered server side, so logoUrl may be webp, avif, svg
// or not an image at all. Satori throws on the formats it cannot decode, and a
// throw rejects the whole ImageResponse, so only these two are passed through.
const SAFE_LOGO_TYPES = new Set(['image/png', 'image/jpeg', 'image/jpg'])

interface Job {
  id?: string
  role?: { name?: string }
  organization?: { name?: string | null; logoUrl?: string | null } | null
  locationCity?: string | null
  locationState?: string | null
  locationCountry?: string | null
  workMode?: string[] | null
  currency?: string | null
  minSalary?: number | null
  maxSalary?: number | null
  compensationPeriod?: string | null
}

interface JobResponse {
  data?: { job?: Job }
}

const redirectToFallback = (origin: string): Response =>
  new Response(null, {
    status: 302,
    headers: {
      location: `${origin}${FALLBACK_IMAGE_PATH}`,
      // Short, so a transient API blip does not pin the fallback for a day.
      'cache-control': 'public, max-age=0, s-maxage=60',
    },
  })

const fetchWithTimeout = async (
  url: string,
  timeoutMs: number,
): Promise<Response> => {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

const toBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i] as number)
  }
  return btoa(binary)
}

const loadLogoDataUrl = async (url?: string | null): Promise<string | null> => {
  if (!url || !url.startsWith('https://')) return null

  try {
    const response = await fetchWithTimeout(url, LOGO_TIMEOUT_MS)
    if (!response.ok) return null

    const contentType = (response.headers.get('content-type') ?? '')
      .split(';')[0]
      ?.trim()
    if (!contentType || !SAFE_LOGO_TYPES.has(contentType)) return null

    const buffer = await response.arrayBuffer()
    if (buffer.byteLength === 0 || buffer.byteLength > MAX_LOGO_BYTES) {
      return null
    }

    return `data:${contentType};base64,${toBase64(buffer)}`
  } catch {
    return null
  }
}

type FontSet = { name: string; data: ArrayBuffer; weight: 400 | 700 }[]

let fontCache: Promise<FontSet> | null = null

const loadFonts = (origin: string): Promise<FontSet> => {
  fontCache ??= Promise.all([
    fetch(`${origin}/fonts/Inter-Regular.ttf`).then((r) => r.arrayBuffer()),
    fetch(`${origin}/fonts/Inter-Bold.ttf`).then((r) => r.arrayBuffer()),
  ]).then(([regular, bold]) => [
    { name: 'Inter', data: regular, weight: 400 as const },
    { name: 'Inter', data: bold, weight: 700 as const },
  ])
  return fontCache
}

const titleCase = (value: string): string =>
  value.replace(/\b\w/g, (character) => character.toUpperCase())

const truncate = (value: string, limit: number): string =>
  value.length > limit ? `${value.slice(0, limit - 1)}…` : value

const formatLocation = (job: Job): string =>
  [job.locationCity, job.locationState, job.locationCountry]
    .filter(Boolean)
    .map((part) => titleCase(String(part)))
    .join(', ')

const formatSalary = (job: Job): string => {
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

const Card: React.FC<{ job: Job; logo: string | null }> = ({ job, logo }) => {
  const company = job.organization?.name?.trim() || null
  const title = job.role?.name ? titleCase(job.role.name) : 'Job Opening'
  const meta = [
    formatLocation(job),
    job.workMode?.length ? job.workMode.map(titleCase).join(' / ') : '',
    formatSalary(job),
  ].filter(Boolean)

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 64,
        fontFamily: 'Inter',
        color: ON_DARK,
        backgroundImage: `linear-gradient(135deg, ${BRAND_800} 48%, ${BRAND_500} 100%)`,
      }}>
      <div style={{ display: 'flex', alignItems: 'center', minHeight: 88 }}>
        {!company && !logo ? null : logo ? (
          <img
            src={logo}
            alt=""
            width={88}
            height={88}
            style={{
              width: 88,
              height: 88,
              borderRadius: 16,
              background: ON_DARK,
              objectFit: 'contain',
            }}
          />
        ) : (
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.16)',
              fontSize: 44,
              fontWeight: 700,
            }}>
            {(company ?? '').charAt(0).toUpperCase()}
          </div>
        )}
        {company ? (
          <div style={{ marginLeft: 28, fontSize: 32, opacity: 0.92 }}>
            {truncate(company, 40)}
          </div>
        ) : null}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            fontSize: 68,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: -1,
          }}>
          {truncate(title, 60)}
        </div>
        {meta.length > 0 ? (
          <div
            style={{
              display: 'flex',
              marginTop: 24,
              fontSize: 30,
              opacity: 0.85,
            }}>
            {meta.join('  ·  ')}
          </div>
        ) : null}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 26,
          opacity: 0.8,
        }}>
        <div style={{ display: 'flex' }}>auxhr.com</div>
        <div style={{ display: 'flex' }}>View job &amp; apply →</div>
      </div>
    </div>
  )
}

export default async function handler(request: Request) {
  const url = new URL(request.url)
  const origin = url.origin
  const jobId = url.searchParams.get('id')

  // Validated before it reaches the API so a malformed id cannot mint an
  // unbounded set of distinct cached upstream requests.
  if (!jobId || !UUID_PATTERN.test(jobId)) {
    return redirectToFallback(origin)
  }

  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/jobs/${jobId}`,
      API_TIMEOUT_MS,
    )
    if (!response.ok) return redirectToFallback(origin)

    const body = (await response.json()) as JobResponse
    const job = body.data?.job
    if (!job) return redirectToFallback(origin)

    const logo = await loadLogoDataUrl(job.organization?.logoUrl)

    let fonts: FontSet | undefined
    try {
      fonts = await loadFonts(origin)
    } catch {
      // Fall back to the family @vercel/og bundles rather than fail the image.
      fontCache = null
    }

    return new ImageResponse(<Card job={job} logo={logo} />, {
      width: 1200,
      height: 630,
      fonts,
      headers: {
        'content-type': 'image/png',
        'cache-control':
          'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800',
      },
    })
  } catch {
    return redirectToFallback(origin)
  }
}
