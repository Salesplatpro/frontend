import { describe, expect, it } from 'vitest'

import { AI_CONFIG_DEFAULT_VALUES } from './aiConfigModel'
import {
  aiConfigFromApi,
  aiConfigToPayload,
  withConfigDefaults,
} from './aiConfigPayload'

const allOn = {
  ...AI_CONFIG_DEFAULT_VALUES,
  name: 'Setup',
  minPrescreeningScore: '60',
  cvSimilarity: 'true',
  minCvSimilarityScore: '70',
  personalizedAssessment: 'true',
  noPersonalizedQuestions: '5',
  personalityEvaluation: 'true',
  noOfEIQuestions: '2',
  noOfSNQuestions: '',
  noOfTFQuestions: '1',
  noOfJPQuestions: '',
  uploadedQuestions: ['  Weekends ok? ', '', '   '],
  recruiterGuide: 'Must know Go',
}

describe('aiConfigToPayload', () => {
  it('sends real booleans and every enabled setting', () => {
    const payload = aiConfigToPayload(allOn)
    expect(payload).toMatchObject({
      name: 'Setup',
      prescreeningAssessment: true,
      cvSimilarity: true,
      minCvSimilarityScore: '70',
      personalizedAssessment: true,
      noPersonalizedQuestions: '5',
      personalityEvaluation: true,
      noOfEIQuestions: '2',
      noOfTFQuestions: '1',
      recruiterGuide: 'Must know Go',
    })
  })

  it('drops blank trait counts instead of sending empty strings', () => {
    const payload = aiConfigToPayload(allOn)
    expect(payload).not.toHaveProperty('noOfSNQuestions')
    expect(payload).not.toHaveProperty('noOfJPQuestions')
  })

  it('trims your own questions and drops empty ones', () => {
    expect(aiConfigToPayload(allOn).uploadedQuestions).toEqual(['Weekends ok?'])
  })

  it('drops settings that belong to switched-off steps', () => {
    const payload = aiConfigToPayload({
      ...allOn,
      cvSimilarity: 'false',
      personalizedAssessment: 'false',
      personalityEvaluation: 'false',
    })
    for (const key of [
      'minCvSimilarityScore',
      'noPersonalizedQuestions',
      'uploadedQuestions',
      'noOfEIQuestions',
      'noOfTFQuestions',
    ]) {
      expect(payload).not.toHaveProperty(key)
    }
    expect(payload).toMatchObject({
      cvSimilarity: false,
      personalizedAssessment: false,
      personalityEvaluation: false,
    })
  })

  it('drops notes that are only whitespace', () => {
    expect(
      aiConfigToPayload({ ...allOn, recruiterGuide: '   ' }),
    ).not.toHaveProperty('recruiterGuide')
  })
})

describe('aiConfigFromApi', () => {
  it('turns a saved config back into form values', () => {
    expect(
      aiConfigFromApi({
        name: 'Saved',
        prescreeningAssessment: true,
        minPrescreeningScore: 55,
        cvSimilarity: false,
        minCvSimilarityScore: null,
        personalizedAssessment: true,
        noPersonalizedQuestions: 4,
        personalityEvaluation: true,
        noOfEIQuestions: 3,
        uploadedQuestions: [],
        recruiterGuide: null,
      }),
    ).toMatchObject({
      name: 'Saved',
      prescreeningAssessment: 'true',
      minPrescreeningScore: 55,
      cvSimilarity: 'false',
      minCvSimilarityScore: '',
      noPersonalizedQuestions: 4,
      personalityEvaluation: 'true',
      noOfEIQuestions: 3,
      noOfSNQuestions: '',
      uploadedQuestions: [''],
      recruiterGuide: '',
    })
  })
})

describe('withConfigDefaults', () => {
  it('fills keys missing from an older saved draft', () => {
    const merged = withConfigDefaults({ name: 'Old draft', cvSimilarity: '' })
    expect(merged.name).toBe('Old draft')
    expect(merged.cvSimilarity).toBe('false')
    expect(merged.personalityEvaluation).toBe('false')
    expect(merged.uploadedQuestions).toEqual([''])
  })

  it('keeps switches that were on', () => {
    expect(
      withConfigDefaults({ personalityEvaluation: 'true' })
        .personalityEvaluation,
    ).toBe('true')
  })

  it('returns defaults for no draft', () => {
    expect(withConfigDefaults(null)).toEqual(AI_CONFIG_DEFAULT_VALUES)
  })
})
