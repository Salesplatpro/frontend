import { FollowUpStatus, OnboardingStage, OnboardingSummary } from './types'

export type OnboardingTone = 'success' | 'warning' | 'danger' | 'neutral'

export const STAGE_LABEL: Record<OnboardingStage, string> = {
  verify_email: 'Verify email',
  complete_profile: 'Complete profile',
  take_assessment: 'Take assessment',
  apply_to_job: 'Apply to a job',
  create_company: 'Create company',
  post_job: 'Post a job',
  set_up_screening: 'Set up screening',
  publish_job: 'Publish a job',
  active: 'Active',
}

export const TALENT_STAGE_OPTIONS: OnboardingStage[] = [
  'verify_email',
  'complete_profile',
  'take_assessment',
  'apply_to_job',
  'active',
]

export const RECRUITER_STAGE_OPTIONS: OnboardingStage[] = [
  'verify_email',
  'create_company',
  'post_job',
  'set_up_screening',
  'publish_job',
  'active',
]

export const FOLLOW_UP_LABEL: Record<FollowUpStatus, string> = {
  none: 'Not emailed',
  emailed: 'Emailed, no change yet',
  progressed: 'Progressed after email',
}

export const stageOptions = (stages: OnboardingStage[]) => [
  { value: '', label: 'Any stage' },
  ...stages.map((stage) => ({
    value: stage,
    label:
      stage === 'active'
        ? 'Active (not stuck)'
        : `Stuck: ${STAGE_LABEL[stage]}`,
  })),
]

export const FOLLOW_UP_OPTIONS = [
  { value: '', label: 'Any follow-up' },
  ...(Object.keys(FOLLOW_UP_LABEL) as FollowUpStatus[]).map((status) => ({
    value: status,
    label: FOLLOW_UP_LABEL[status],
  })),
]

export const stageBadge = (
  stage: OnboardingStage,
): { label: string; tone: OnboardingTone } =>
  stage === 'active'
    ? { label: 'Active', tone: 'success' }
    : stage === 'verify_email'
    ? { label: `Stuck: ${STAGE_LABEL[stage]}`, tone: 'danger' }
    : { label: `Stuck: ${STAGE_LABEL[stage]}`, tone: 'warning' }

const DAY_MS = 24 * 60 * 60 * 1000

export const daysAgo = (date: string | Date, now: Date = new Date()) => {
  const days = Math.floor((now.getTime() - new Date(date).getTime()) / DAY_MS)
  if (days <= 0) return 'today'
  if (days === 1) return '1 day ago'
  return `${days} days ago`
}

/** Short line under the badge, e.g. "Emailed 2× · last 3 days ago · progressed". */
export const followUpCaption = (
  summary: OnboardingSummary,
  now: Date = new Date(),
): string | null => {
  if (summary.emailsSent === 0 || !summary.lastEmailAt) return null
  return [
    `Emailed ${summary.emailsSent}×`,
    `last ${daysAgo(summary.lastEmailAt, now)}`,
    summary.followUp === 'progressed' ? 'progressed' : null,
  ]
    .filter(Boolean)
    .join(' · ')
}
