import { describe, expect, it } from 'vitest'

import {
  AI_CONFIG_DEFAULT_VALUES,
  splitPersonalityCount,
} from './aiConfigModel'
import { getPreset } from './aiConfigPresets'
import { aiConfigValidationSchema } from './aiConfigValidationSchema'

// Formik turns '' into undefined before validating, so mirror that here.
const prepare = (values: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(values).map(([key, value]) => [
      key,
      value === '' ? undefined : value,
    ]),
  )

const errorsFor = async (overrides: Record<string, unknown>) => {
  try {
    await aiConfigValidationSchema.validate(
      prepare({
        ...AI_CONFIG_DEFAULT_VALUES,
        ...getPreset('balanced').values,
        name: 'Setup',
        ...overrides,
      }),
      { abortEarly: false },
    )
    return []
  } catch (err) {
    return (err as { inner: { path: string }[] }).inner.map((e) => e.path)
  }
}

describe('aiConfigValidationSchema', () => {
  it('accepts every preset as-is', async () => {
    for (const id of ['light', 'balanced', 'thorough'] as const) {
      expect(await errorsFor(getPreset(id).values)).toEqual([])
    }
  })

  it('needs a setup name', async () => {
    expect(await errorsFor({ name: '   ' })).toContain('name')
  })

  it('keeps scores between 0 and 100', async () => {
    expect(await errorsFor({ minPrescreeningScore: 101 })).toContain(
      'minPrescreeningScore',
    )
    expect(await errorsFor({ minCvSimilarityScore: -1 })).toContain(
      'minCvSimilarityScore',
    )
    expect(await errorsFor({ minPrescreeningScore: '' })).toContain(
      'minPrescreeningScore',
    )
  })

  it('only needs a CV score while CV match is on', async () => {
    expect(await errorsFor({ minCvSimilarityScore: '' })).toContain(
      'minCvSimilarityScore',
    )
    expect(
      await errorsFor({ cvSimilarity: 'false', minCvSimilarityScore: '' }),
    ).toEqual([])
  })

  it('asks between 1 and 20 tailored questions while they are on', async () => {
    expect(await errorsFor({ noPersonalizedQuestions: 0 })).toContain(
      'noPersonalizedQuestions',
    )
    expect(await errorsFor({ noPersonalizedQuestions: 21 })).toContain(
      'noPersonalizedQuestions',
    )
    expect(await errorsFor({ noPersonalizedQuestions: 2.5 })).toContain(
      'noPersonalizedQuestions',
    )
    expect(
      await errorsFor({
        personalizedAssessment: 'false',
        noPersonalizedQuestions: '',
      }),
    ).toEqual([])
  })

  it('needs at least one personality question while the check is on', async () => {
    expect(await errorsFor({ personalityEvaluation: 'true' })).toContain(
      'personalityDichotomy',
    )
    expect(
      await errorsFor({
        personalityEvaluation: 'true',
        ...splitPersonalityCount(1),
      }),
    ).toEqual([])
  })

  it('rejects a blank switch left over from old drafts', async () => {
    expect(await errorsFor({ cvSimilarity: '' })).toContain('cvSimilarity')
  })
})
