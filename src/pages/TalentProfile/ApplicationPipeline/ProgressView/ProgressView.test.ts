import { describe, expect, it } from 'vitest'

import { Application } from '../../utils/type'
import { getProgresses } from './ProgressView'

const buildApplication = (
  overrides: Partial<Application> = {},
): Application => ({
  currentStage: 'completed',
  status: undefined,
  stages: {
    cv_similarity: 'personalized',
    personalized: 'personality',
    personality: 'completed',
  },
  cvSimilarityScore: 82,
  personalizedScore: 74,
  mbtiType: 'INTJ',
  ...overrides,
})

describe('getProgresses', () => {
  it('never surfaces CV-matching as a talent-facing stage', () => {
    const progresses = getProgresses(buildApplication())

    expect(progresses.find((p) => p.title === 'CV-Matching')).toBeUndefined()
    const personalizedTest = progresses.find(
      (p) => p.title === 'Personalized Test',
    )
    expect(personalizedTest?.result).toBeNull()
  })

  it('keeps the MBTI type on the personality stage result (non-numeric → check UI)', () => {
    const progresses = getProgresses(buildApplication())

    const personality = progresses.find((p) => p.title === 'Personality Test')
    expect(personality?.status).toBe('completed')
    expect(personality?.result).toBe('INTJ')
  })

  it('marks earlier talent stages completed once the pipeline has advanced past them', () => {
    const progresses = getProgresses(
      buildApplication({
        currentStage: 'personality',
        mbtiType: null,
      }),
    )

    expect(progresses.find((p) => p.title === 'CV-Matching')).toBeUndefined()
    expect(
      progresses.find((p) => p.title === 'Personalized Test')?.status,
    ).toBe('completed')
    expect(progresses.find((p) => p.title === 'Personality Test')?.status).toBe(
      'current',
    )
  })

  it('adds an "awaiting-decision" Result step once the pipeline completes and no decision has been made', () => {
    const progresses = getProgresses(buildApplication({ status: undefined }))

    const result = progresses.find((p) => p.title === 'Result')
    expect(result?.status).toBe('awaiting-decision')
  })

  it('reflects the recruiter decision once the application is shortlisted', () => {
    const progresses = getProgresses(
      buildApplication({ status: 'shortlisted' }),
    )

    const result = progresses.find((p) => p.title === 'Result')
    expect(result?.status).toBe('shortlisted')
  })

  it('reflects the recruiter decision once the application is rejected', () => {
    const progresses = getProgresses(buildApplication({ status: 'rejected' }))

    const result = progresses.find((p) => p.title === 'Result')
    expect(result?.status).toBe('rejected')
  })

  it('treats a trailing CV match stage as complete for the talent Result step', () => {
    const progresses = getProgresses(
      buildApplication({
        currentStage: 'cv_similarity',
        status: undefined,
        stages: {
          personality: 'personalized',
          personalized: 'cv_similarity',
          cv_similarity: 'completed',
        },
      }),
    )

    expect(progresses.find((p) => p.title === 'CV-Matching')).toBeUndefined()
    expect(progresses.find((p) => p.title === 'Result')?.status).toBe(
      'awaiting-decision',
    )
  })

  it('survives a cyclic stages map without hanging', () => {
    const progresses = getProgresses(
      buildApplication({
        currentStage: 'personalized',
        stages: {
          cv_similarity: 'personalized',
          personalized: 'cv_similarity',
        },
      }),
    )

    expect(Array.isArray(progresses)).toBe(true)
  })
})
