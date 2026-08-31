import { describe, expect, it } from 'vitest'

import {
  buildPipelineCrumbs,
  canVisitStep,
  firstRemainingStep,
  orderedStageKeys,
} from './jobPipeline'

const stages = {
  personality: 'personalized',
  personalized: 'prescreening',
  prescreening: 'cv_similarity',
  cv_similarity: 'completed',
}

describe('jobPipeline', () => {
  it('orders crumbs from the stages map with Job details first, omitting prescreening and CV match', () => {
    expect(buildPipelineCrumbs(stages).map((c) => c.id)).toEqual([
      'details',
      'personality',
      'personalized',
      'cv_similarity',
    ])
  })

  it('walks a subset of enabled stages', () => {
    expect(
      orderedStageKeys({
        personalized: 'cv_similarity',
        cv_similarity: 'completed',
      }),
    ).toEqual(['personalized', 'cv_similarity'])
  })

  it('blocks skipping forward while incomplete', () => {
    expect(
      canVisitStep({
        step: 'personalized',
        currentStage: 'personality',
        stages,
      }),
    ).toBe(false)
    expect(
      canVisitStep({
        step: 'personality',
        currentStage: 'personality',
        stages,
      }),
    ).toBe(true)
    expect(
      canVisitStep({
        step: 'details',
        currentStage: 'personality',
        stages,
      }),
    ).toBe(true)
  })

  it('allows free navigation when complete', () => {
    expect(
      canVisitStep({
        step: 'cv_similarity',
        currentStage: 'completed',
        stages,
      }),
    ).toBe(true)
  })

  it('uses currentStage as the next crumb after apply', () => {
    expect(firstRemainingStep('personality', stages)).toBe('personality')
    expect(firstRemainingStep('completed', stages)).toBe('details')
  })

  it('keeps the talent on job details while the global prescreening gate runs', () => {
    expect(firstRemainingStep('prescreening', stages)).toBe('details')
  })
})
