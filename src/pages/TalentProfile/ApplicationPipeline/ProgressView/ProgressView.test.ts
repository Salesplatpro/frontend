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
  it('never surfaces the CV-matching or personalized-test scores', () => {
    const progresses = getProgresses(buildApplication())

    const cvMatching = progresses.find((p) => p.title === 'CV-Matching')
    const personalizedTest = progresses.find(
      (p) => p.title === 'Personalized Test',
    )

    expect(cvMatching?.result).toBeNull()
    expect(personalizedTest?.result).toBeNull()
  })

  it('still shows the MBTI type for the personality stage (a type, not a score)', () => {
    const progresses = getProgresses(buildApplication())

    const personality = progresses.find((p) => p.title === 'Personality Test')
    expect(personality?.result).toBe('INTJ')
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

  it('does not add a Result step while the pipeline is still in progress', () => {
    const progresses = getProgresses(
      buildApplication({ currentStage: 'cv_similarity', status: undefined }),
    )

    expect(progresses.find((p) => p.title === 'Result')).toBeUndefined()
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

    // No unambiguous entry stage exists in a pure cycle, so the list may be
    // empty — the important part is that walk terminates.
    expect(Array.isArray(progresses)).toBe(true)
  })
})
