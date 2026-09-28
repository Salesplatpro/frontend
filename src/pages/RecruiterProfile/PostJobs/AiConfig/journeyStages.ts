import { AiConfigFieldValues, personalityTotal } from './aiConfigModel'

export interface JourneyStage {
  key: string
  title: string
  detail: string
  /** Minutes the candidate spends on this stage; 0 when it runs automatically. */
  minutes: number
}

const MINUTES_PER_TAILORED_QUESTION = 3
const MINUTES_PER_PERSONALITY_QUESTION = 1.5
const MINUTES_TO_APPLY = 2

const count = (value: string | number) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 0
}

export const candidateJourney = (
  values: AiConfigFieldValues,
): { stages: JourneyStage[]; totalMinutes: number } => {
  const stages: JourneyStage[] = [
    {
      key: 'apply',
      title: 'Apply',
      detail: 'Sends their profile and CV',
      minutes: MINUTES_TO_APPLY,
    },
    {
      key: 'skillsTest',
      title: 'Skills test',
      detail:
        values.minPrescreeningScore !== ''
          ? `Needs ${values.minPrescreeningScore}% or more (taken once, reused for every job)`
          : 'Taken once, reused for every job',
      minutes: 0,
    },
  ]

  if (values.cvSimilarity === 'true') {
    stages.push({
      key: 'cvMatch',
      title: 'CV match',
      detail:
        values.minCvSimilarityScore !== ''
          ? `Automatic — needs ${values.minCvSimilarityScore}% or more`
          : 'Automatic',
      minutes: 0,
    })
  }

  const tailored = count(values.noPersonalizedQuestions)
  if (values.personalizedAssessment === 'true' && tailored > 0) {
    stages.push({
      key: 'tailored',
      title: 'Tailored questions',
      detail: `${tailored} written question${tailored === 1 ? '' : 's'}`,
      minutes: tailored * MINUTES_PER_TAILORED_QUESTION,
    })
  }

  const ownQuestions = (values.uploadedQuestions ?? []).filter((q) =>
    q.trim(),
  ).length
  const personality = personalityTotal(values) + ownQuestions
  if (values.personalityEvaluation === 'true' && personality > 0) {
    stages.push({
      key: 'personality',
      title: 'Personality check',
      detail: `${personality} workplace question${
        personality === 1 ? '' : 's'
      }`,
      minutes: Math.ceil(personality * MINUTES_PER_PERSONALITY_QUESTION),
    })
  }

  stages.push({
    key: 'review',
    title: 'You review',
    detail: 'Ranked and ready in your job post',
    minutes: 0,
  })

  return {
    stages,
    totalMinutes: stages.reduce((sum, stage) => sum + stage.minutes, 0),
  }
}
