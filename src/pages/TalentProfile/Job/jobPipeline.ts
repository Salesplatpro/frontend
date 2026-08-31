export type PipelineStageId =
  | 'personality'
  | 'personalized'
  | 'prescreening'
  | 'cv_similarity'

export type PipelineStepId = 'details' | PipelineStageId

export const STAGE_LABELS: Record<PipelineStageId | 'completed', string> = {
  personality: 'Personality',
  personalized: 'Personalized',
  prescreening: 'Prescreening',
  cv_similarity: 'CV match',
  completed: 'Complete',
}

export const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  shortlisted: 'Shortlisted',
  rejected: 'Rejected',
  awaiting_decision: 'Awaiting decision',
  retake_assessment: 'Retake assessment',
  not_proceeding: 'Not proceeding',
}

export const humanStatus = (status?: string | null) =>
  STATUS_LABELS[status ?? ''] ?? (status ? status.replace(/_/g, ' ') : '—')

export const humanStage = (stage?: string | null) => {
  if (!stage) return '—'
  if (stage in STAGE_LABELS) {
    return STAGE_LABELS[stage as keyof typeof STAGE_LABELS]
  }
  return stage.replace(/_/g, ' ')
}

const STAGE_IDS: PipelineStageId[] = [
  'personality',
  'personalized',
  'prescreening',
  'cv_similarity',
]

const isStageId = (value: string): value is PipelineStageId =>
  STAGE_IDS.includes(value as PipelineStageId)

export const TALENT_OWNED_STAGES: PipelineStageId[] = [
  'personality',
  'personalized',
]

/** Walk the linked-list stages map the same way createStages built it. */
export const orderedStageKeys = (
  stages: Record<string, string> | null | undefined,
): PipelineStageId[] => {
  if (!stages) return []
  const values = new Set(Object.values(stages))
  const keys = Object.keys(stages)
  const entry = keys.find((key) => !values.has(key))
  const ordered: PipelineStageId[] = []
  const visited = new Set<string>()
  let cursor: string | undefined = entry
  while (cursor && cursor !== 'completed' && !visited.has(cursor)) {
    visited.add(cursor)
    if (isStageId(cursor)) ordered.push(cursor)
    cursor = stages[cursor]
  }
  return ordered
}

export type PipelineCrumb = {
  id: PipelineStepId
  label: string
}

/** Auto stages the talent never sees as crumbs — prescreening is global, CV match is recruiter-only. */
const HIDDEN_JOB_CRUMB_STAGES = new Set<PipelineStageId>([
  'prescreening',
  'cv_similarity',
])

export const buildPipelineCrumbs = (
  stages: Record<string, string> | null | undefined,
): PipelineCrumb[] => [
  { id: 'details', label: 'Job details' },
  ...orderedStageKeys(stages)
    .filter((id) => !HIDDEN_JOB_CRUMB_STAGES.has(id))
    .map((id) => ({
      id,
      label: STAGE_LABELS[id],
    })),
]

export const isStageComplete = (
  stage: PipelineStageId,
  currentStage: string | null | undefined,
  stages: Record<string, string> | null | undefined,
): boolean => {
  if (!currentStage) return false
  const ordered = orderedStageKeys(stages)
  if (!ordered.includes(stage)) return false
  if (currentStage === 'completed') return true
  const currentIndex = ordered.indexOf(currentStage as PipelineStageId)
  const stageIndex = ordered.indexOf(stage)
  if (currentIndex < 0) return false
  return stageIndex < currentIndex
}

export const firstRemainingStep = (
  currentStage: string | null | undefined,
  stages: Record<string, string> | null | undefined,
): PipelineStepId => {
  if (!currentStage || currentStage === 'completed') return 'details'
  if (isStageId(currentStage) && HIDDEN_JOB_CRUMB_STAGES.has(currentStage)) {
    return 'details'
  }
  if (isStageId(currentStage)) return currentStage
  const ordered = orderedStageKeys(stages).filter(
    (id) => !HIDDEN_JOB_CRUMB_STAGES.has(id),
  )
  return ordered[0] ?? 'details'
}

export const canVisitStep = ({
  step,
  currentStage,
  stages,
}: {
  step: PipelineStepId
  currentStage: string | null | undefined
  stages: Record<string, string> | null | undefined
}): boolean => {
  if (isStageId(step) && HIDDEN_JOB_CRUMB_STAGES.has(step)) return false
  if (!currentStage) return step === 'details'
  if (currentStage === 'completed') return true
  if (step === 'details') return true

  const ordered = orderedStageKeys(stages)
  const currentIndex = ordered.indexOf(currentStage as PipelineStageId)
  const stepIndex = ordered.indexOf(step as PipelineStageId)
  if (stepIndex < 0) return false
  return stepIndex <= currentIndex
}
