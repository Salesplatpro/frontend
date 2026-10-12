import { STAGE_LABELS } from '@/pages/TalentProfile/Job/jobPipeline'

import { daysAgo } from './onboarding'
import {
  ApplicationFollowUpStatus,
  ScreeningStage,
  StuckApplicationSummary,
} from './types'

export type StuckTone = 'success' | 'warning' | 'danger' | 'neutral'

const STUCK_THRESHOLD_MS = 24 * 60 * 60 * 1000

/** Client-side mirror of the backend's isApplicationStuck() — lets a table badge
 * show instantly from fields already on the row, without a follow-up detail fetch. */
export const isRowStuck = (row: {
  status?: string | null
  currentStage?: string | null
  updatedAt: string
}): boolean =>
  row.status === 'pending' &&
  row.currentStage !== 'completed' &&
  Date.now() - new Date(row.updatedAt).getTime() >= STUCK_THRESHOLD_MS

export const STAGE_LABEL: Record<ScreeningStage, string> = STAGE_LABELS

export const STUCK_STAGE_OPTIONS: ScreeningStage[] = [
  'personality',
  'personalized',
  'prescreening',
  'cv_similarity',
]

export const FOLLOW_UP_LABEL: Record<ApplicationFollowUpStatus, string> = {
  none: 'Not emailed',
  emailed: 'Emailed, no change yet',
  progressed: 'Progressed after email',
}

export const stuckStageOptions = (stages: ScreeningStage[]) => [
  { value: '', label: 'Any stage' },
  ...stages.map((stage) => ({
    value: stage,
    label: `Stuck: ${STAGE_LABEL[stage]}`,
  })),
]

export const FOLLOW_UP_OPTIONS = [
  { value: '', label: 'Any follow-up' },
  ...(Object.keys(FOLLOW_UP_LABEL) as ApplicationFollowUpStatus[]).map(
    (status) => ({
      value: status,
      label: FOLLOW_UP_LABEL[status],
    }),
  ),
]

export const stuckBadge = (
  stage: ScreeningStage,
): { label: string; tone: StuckTone } => ({
  label: `Stuck: ${STAGE_LABEL[stage]}`,
  tone: 'warning',
})

/** Short line under the badge, e.g. "Emailed 2× · last 3 days ago · progressed". */
export const followUpCaption = (
  summary: StuckApplicationSummary,
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
