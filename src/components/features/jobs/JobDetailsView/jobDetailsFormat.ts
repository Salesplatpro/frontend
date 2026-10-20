import { capitalizeFirstWord } from '@/utils'

import type { JobDetailsJob } from './types'

const WORK_MODE_LABEL: Record<string, string> = {
  remote: 'Remote',
  hybrid: 'Hybrid',
  onSite: 'On-site',
}

export const formatWorkMode = (job: JobDetailsJob): string | null =>
  job.workMode?.length
    ? job.workMode
        .map((mode) => WORK_MODE_LABEL[mode] ?? capitalizeFirstWord(mode))
        .join(' · ')
    : null

export const formatLocation = (job: JobDetailsJob): string | null => {
  const parts = [job.locationCity, job.locationState, job.locationCountry]
    .filter(Boolean)
    .map((part) => capitalizeFirstWord(part ?? undefined))
  return parts.length > 0 ? parts.join(', ') : null
}

export const formatExperience = (job: JobDetailsJob): string | null =>
  job.experienceLevel ? capitalizeFirstWord(job.experienceLevel) : null

export const formatPoster = (job: JobDetailsJob): string | null =>
  job.postedBy?.firstName
    ? `${job.postedBy.firstName} ${job.postedBy.lastName ?? ''}`.trim()
    : null

export const hasRichText = (html?: string | null): boolean =>
  !!html &&
  html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim().length > 0

// Company websites are typed in by recruiters, so only http(s) URLs and bare
// domains become links — never another scheme.
export const toWebsiteLink = (
  website?: string | null,
): { href: string; label: string } | null => {
  const value = website?.trim()
  if (!value) return null

  let href: string
  if (/^https?:\/\//i.test(value)) href = value
  else if (/^[\w-]+(\.[\w-]+)+(\/\S*)?$/.test(value)) href = `https://${value}`
  else return null

  try {
    const url = new URL(href)
    return { href: url.href, label: url.hostname.replace(/^www\./, '') }
  } catch {
    return null
  }
}
