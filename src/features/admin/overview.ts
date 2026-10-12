import { STAGE_LABEL as APPLICATION_STAGE_LABEL } from './applicationFollowUp'
import {
  RECRUITER_STAGE_OPTIONS,
  STAGE_LABEL as ONBOARDING_STAGE_LABEL,
  TALENT_STAGE_OPTIONS,
} from './onboarding'
import { OnboardingStage, OverviewBucket, ScreeningStage } from './types'

export interface OverviewBar {
  key: string
  label: string
  value: number
  href?: string
}

export const OVERVIEW_RANGES = [7, 30, 90] as const

export const percentChange = (
  current: number,
  previous: number,
): number | null => {
  if (previous === 0) return current === 0 ? 0 : null
  return Math.round(((current - previous) / previous) * 100)
}

export const formatCount = (value: number) => value.toLocaleString('en-US')

export const formatNaira = (value: number) => {
  if (value >= 1_000_000) {
    return `₦${(value / 1_000_000).toLocaleString('en-NG', {
      maximumFractionDigits: 1,
    })}M`
  }
  return `₦${Math.round(value).toLocaleString('en-NG')}`
}

export const humanizeKey = (key: string) => {
  const spaced = key.replace(/[_-]+/g, ' ').trim()
  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}

const bucketValue = (buckets: OverviewBucket[], key: string) =>
  buckets.find((bucket) => bucket.key === key)?.count ?? 0

export const toBars = (
  buckets: OverviewBucket[],
  labelFor: (key: string) => string = humanizeKey,
  hrefFor?: (key: string) => string | undefined,
): OverviewBar[] =>
  buckets.map((bucket) => ({
    key: bucket.key,
    label: labelFor(bucket.key),
    value: bucket.count,
    href: hrefFor?.(bucket.key),
  }))

const funnelBars = (buckets: OverviewBucket[], stages: OnboardingStage[]) =>
  stages.map((stage) => ({
    key: stage,
    label: ONBOARDING_STAGE_LABEL[stage],
    value: bucketValue(buckets, stage),
  }))

export const talentFunnelBars = (buckets: OverviewBucket[]) =>
  funnelBars(buckets, TALENT_STAGE_OPTIONS)

export const recruiterFunnelBars = (buckets: OverviewBucket[]) =>
  funnelBars(buckets, RECRUITER_STAGE_OPTIONS)

export const stuckStageBars = (buckets: OverviewBucket[]) =>
  toBars(
    buckets,
    (key) => APPLICATION_STAGE_LABEL[key as ScreeningStage] ?? humanizeKey(key),
  )
