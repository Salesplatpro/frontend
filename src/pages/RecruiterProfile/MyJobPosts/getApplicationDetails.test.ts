import { describe, expect, it } from 'vitest'

import { getApplicationDetails } from './getApplicationDetails'

describe('getApplicationDetails', () => {
  it('extracts flat talent fields, not a nested profile object', () => {
    const data = {
      data: {
        application: {
          talent: {
            firstName: 'Ada',
            lastName: 'Lovelace',
            bio: 'Mathematician and writer',
            experience: '10+ years',
            prescreeningScore: 88,
            id: 'talent-1',
            cvFileName: 'ada-cv.pdf',
            cvUploadedAt: '2026-01-01T00:00:00.000Z',
          },
          cvSimilarityScore: 72,
          personalizedScore: 65,
          mbtiType: 'INTJ',
          status: 'awaiting_decision',
          matchVerdict: 'high',
          matchVerdictReasoning: 'Strong alignment with the role.',
          matchRecommendation: 'hire',
          matchStrengths: ['Strong TypeScript background.'],
          matchWeaknesses: ['No leadership experience.'],
          matchRisks: ['May need ramp-up time.'],
        },
      },
    }

    const result = getApplicationDetails(data)

    expect(result).toEqual({
      firstName: 'Ada',
      lastName: 'Lovelace',
      bio: 'Mathematician and writer',
      experience: '10+ years',
      prescreeningScore: 88,
      cvSimilarityScore: 72,
      personalizedScore: 65,
      type: 'INTJ',
      jodStatus: 'awaiting_decision',
      talentId: 'talent-1',
      cvFileName: 'ada-cv.pdf',
      hasCv: true,
      matchVerdict: 'high',
      matchVerdictReasoning: 'Strong alignment with the role.',
      matchRecommendation: 'hire',
      matchStrengths: ['Strong TypeScript background.'],
      matchWeaknesses: ['No leadership experience.'],
      matchRisks: ['May need ramp-up time.'],
    })
  })

  it('falls back to placeholder text when a score is missing, but keeps a real 0 score', () => {
    const data = {
      data: {
        application: {
          talent: { firstName: 'Bo', lastName: 'Ng', prescreeningScore: 0 },
          cvSimilarityScore: 0,
          personalizedScore: null,
        },
      },
    }

    const result = getApplicationDetails(data)

    expect(result.prescreeningScore).toBe(0)
    expect(result.cvSimilarityScore).toBe(0)
    expect(result.personalizedScore).toBe('No personality test')
  })

  it('handles a completely empty payload without throwing', () => {
    const result = getApplicationDetails({})

    expect(result.firstName).toBe('')
    expect(result.prescreeningScore).toBe('No pre-assessment test')
    expect(result.hasCv).toBe(false)
    expect(result.cvFileName).toBeNull()
    expect(result.talentId).toBeNull()
    expect(result.matchVerdict).toBeNull()
    expect(result.matchRecommendation).toBeNull()
    expect(result.matchStrengths).toBeNull()
    expect(result.matchWeaknesses).toBeNull()
    expect(result.matchRisks).toBeNull()
  })
})
