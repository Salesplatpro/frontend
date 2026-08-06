import { describe, expect, it } from 'vitest'

import type { SingleJobDetails } from '@/utils/recruiterJobPostsTypes'

import { selectRankedApplicants } from './exportRankingPdf'

const makeApp = (
  overrides: Partial<SingleJobDetails> & { rank?: number | null },
): SingleJobDetails =>
  ({
    id: overrides.id ?? `app-${overrides.rank}`,
    jobId: 'job-1',
    talent: {
      id: 't1',
      email: 'a@example.com',
      firstName: 'Ada',
      lastName: 'Lovelace',
    },
    applicationType: 'application',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    cvSimilarityScore: 80,
    rank: overrides.rank ?? null,
    matchVerdictReasoning: overrides.matchVerdictReasoning ?? 'Strong CV.',
    ...overrides,
  } as SingleJobDetails)

describe('selectRankedApplicants', () => {
  const apps = [
    makeApp({ id: '1', rank: 1 }),
    makeApp({ id: '2', rank: 2 }),
    makeApp({ id: '3', rank: 3 }),
    makeApp({ id: '4', rank: null }),
  ]

  it('returns the top N ranked applicants', () => {
    expect(selectRankedApplicants(apps, 'top', 2).map((a) => a.id)).toEqual([
      '1',
      '2',
    ])
  })

  it('returns the lowest N ranked applicants', () => {
    expect(selectRankedApplicants(apps, 'lowest', 2).map((a) => a.id)).toEqual([
      '3',
      '2',
    ])
  })

  it('ignores unranked applicants', () => {
    expect(selectRankedApplicants(apps, 'top', 10)).toHaveLength(3)
  })
})
