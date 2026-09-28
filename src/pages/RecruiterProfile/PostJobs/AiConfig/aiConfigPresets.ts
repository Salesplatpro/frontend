import { AiConfigFieldValues, splitPersonalityCount } from './aiConfigModel'

export type ScreeningPresetId = 'light' | 'balanced' | 'thorough'

type PresetValues = Pick<
  AiConfigFieldValues,
  | 'minPrescreeningScore'
  | 'cvSimilarity'
  | 'minCvSimilarityScore'
  | 'personalizedAssessment'
  | 'noPersonalizedQuestions'
  | 'personalityEvaluation'
  | 'noOfEIQuestions'
  | 'noOfSNQuestions'
  | 'noOfTFQuestions'
  | 'noOfJPQuestions'
>

export interface ScreeningPreset {
  id: ScreeningPresetId
  title: string
  summary: string
  bestFor: string
  values: PresetValues
}

const NO_PERSONALITY = splitPersonalityCount(0)

export const SCREENING_PRESETS: ScreeningPreset[] = [
  {
    id: 'light',
    title: 'Light',
    summary: 'Skills test only',
    bestFor: 'High-volume or entry-level roles where you want many applicants.',
    values: {
      minPrescreeningScore: '50',
      cvSimilarity: 'false',
      minCvSimilarityScore: '',
      personalizedAssessment: 'false',
      noPersonalizedQuestions: '',
      personalityEvaluation: 'false',
      ...NO_PERSONALITY,
    },
  },
  {
    id: 'balanced',
    title: 'Balanced',
    summary: 'Skills test, CV match and 5 tailored questions',
    bestFor: 'Most roles. A good filter without scaring people off.',
    values: {
      minPrescreeningScore: '60',
      cvSimilarity: 'true',
      minCvSimilarityScore: '65',
      personalizedAssessment: 'true',
      noPersonalizedQuestions: '5',
      personalityEvaluation: 'false',
      ...NO_PERSONALITY,
    },
  },
  {
    id: 'thorough',
    title: 'Thorough',
    summary: 'Everything, plus a personality check',
    bestFor: 'Senior or team-critical hires where fit matters a lot.',
    values: {
      minPrescreeningScore: '70',
      cvSimilarity: 'true',
      minCvSimilarityScore: '70',
      personalizedAssessment: 'true',
      noPersonalizedQuestions: '6',
      personalityEvaluation: 'true',
      ...splitPersonalityCount(8),
    },
  },
]

export const DEFAULT_PRESET_ID: ScreeningPresetId = 'balanced'

export const getPreset = (id: ScreeningPresetId) =>
  SCREENING_PRESETS.find((preset) => preset.id === id)!

const same = (a: string | number, b: string | number) =>
  String(a ?? '') === String(b ?? '')

/** Which preset the current values match exactly, or 'custom'. */
export const detectPreset = (
  values: AiConfigFieldValues,
): ScreeningPresetId | 'custom' => {
  const match = SCREENING_PRESETS.find((preset) =>
    (Object.keys(preset.values) as (keyof PresetValues)[]).every((key) =>
      same(values[key], preset.values[key]),
    ),
  )
  return match ? match.id : 'custom'
}

export const setupName = (roleName: string, presetTitle: string) =>
  [roleName.trim(), presetTitle].filter(Boolean).join(' – ')

/** True when the name is empty or still one we generated, so a preset change may replace it. */
export const isAutoSetupName = (name: string, roleName: string) =>
  !name.trim() ||
  name === setupName(roleName, '') ||
  SCREENING_PRESETS.some((preset) => name === setupName(roleName, preset.title))
