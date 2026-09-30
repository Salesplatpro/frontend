/**
 * Canonical public origin for links that leave the app — social share targets
 * and copied job links.
 *
 * Deliberately not window.location.origin: these URLs are consumed by third
 * parties, so a localhost origin yields a link that is dead the moment it is
 * pasted, and a Vercel preview origin sits behind deployment protection, so a
 * crawler fetching it gets a 401 and renders no preview card at all.
 *
 * Must stay in agreement with SITE_ORIGIN in middleware.ts, which reads the
 * same variable via process.env — otherwise the canonical URL advertised to
 * crawlers disagrees with the URL that was actually shared.
 */
export const appOrigin = (
  import.meta.env.VITE_PUBLIC_APP_URL ?? 'https://auxhr.com'
).replace(/\/+$/, '')

export const buildJobShareUrl = (jobId: string): string =>
  `${appOrigin}/job/postedjob/${encodeURIComponent(jobId)}`

export type ShareNetwork = 'facebook' | 'x' | 'linkedin' | 'whatsapp'

export const buildShareTargets = (
  url: string,
  title: string,
): Record<ShareNetwork, string> => {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    x: `https://x.com/intent/post?url=${encodedUrl}&text=${encodedTitle}`,
    // share-offsite is LinkedIn's current endpoint; the older shareArticle one
    // silently fails unless it is also passed mini=true.
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    // WhatsApp has no separate url param, and its linkifier only builds a
    // preview card when the URL is the last thing in the message.
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
  }
}
