import { describe, expect, it } from 'vitest'

import {
  AI_CONFIG_DEFAULT_VALUES,
  splitPersonalityCount,
} from './aiConfigModel'
import { candidateJourney } from './journeyStages'

describe('candidateJourney', () => {
  it('has apply, skills test and review for the lightest setup', () => {
    const { stages, totalMinutes } = candidateJourney({
      ...AI_CONFIG_DEFAULT_VALUES,
      minPrescreeningScore: '50',
    })
    expect(stages.map((stage) => stage.key)).toEqual([
      'apply',
      'skillsTest',
      'review',
    ])
    expect(stages[1].detail).toMatch(/50% or more/)
    expect(totalMinutes).toBe(2)
  })

  it('adds every enabled step with its time', () => {
    const { stages, totalMinutes } = candidateJourney({
      ...AI_CONFIG_DEFAULT_VALUES,
      minPrescreeningScore: '70',
      cvSimilarity: 'true',
      minCvSimilarityScore: '65',
      personalizedAssessment: 'true',
      noPersonalizedQuestions: '5',
      personalityEvaluation: 'true',
      ...splitPersonalityCount(8),
      uploadedQuestions: ['Weekends?', ''],
    })
    expect(stages.map((stage) => stage.key)).toEqual([
      'apply',
      'skillsTest',
      'cvMatch',
      'tailored',
      'personality',
      'review',
    ])
    expect(stages.find((s) => s.key === 'tailored')?.detail).toBe(
      '5 written questions',
    )
    expect(stages.find((s) => s.key === 'personality')?.detail).toBe(
      '9 workplace questions',
    )
    expect(totalMinutes).toBe(2 + 15 + 14)
  })

  it('uses singular wording for one question', () => {
    const { stages } = candidateJourney({
      ...AI_CONFIG_DEFAULT_VALUES,
      personalizedAssessment: 'true',
      noPersonalizedQuestions: 1,
    })
    expect(stages.find((s) => s.key === 'tailored')?.detail).toBe(
      '1 written question',
    )
  })

  it('skips switched-on steps that have no questions yet', () => {
    const { stages } = candidateJourney({
      ...AI_CONFIG_DEFAULT_VALUES,
      personalizedAssessment: 'true',
      noPersonalizedQuestions: '',
      personalityEvaluation: 'true',
    })
    expect(stages.map((stage) => stage.key)).not.toContain('tailored')
    expect(stages.map((stage) => stage.key)).not.toContain('personality')
  })
})
