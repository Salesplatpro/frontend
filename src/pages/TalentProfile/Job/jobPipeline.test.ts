import { describe, expect, it } from 'vitest'

import {
  buildPipelineCrumbs,
  canVisitStep,
  firstRemainingStep,
  humanTalentStage,
  orderedStageKeys,
  talentFacingStage,
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

  it('allows free navigation of visible crumbs when complete', () => {
    expect(
      canVisitStep({
        step: 'personalized',
        currentStage: 'completed',
        stages,
      }),
    ).toBe(true)
    expect(
      canVisitStep({
        step: 'cv_similarity',
        currentStage: 'completed',
        stages,
      }),
    ).toBe(false)
  })

  it('uses currentStage as the next crumb after apply', () => {
    expect(firstRemainingStep('personality', stages)).toBe('personality')
    expect(firstRemainingStep('completed', stages)).toBe('details')
  })

  it('keeps the talent on job details while the global prescreening gate runs', () => {
    expect(firstRemainingStep('prescreening', stages)).toBe('details')
  })

  it('keeps the talent on job details while CV match runs in the background', () => {
    expect(firstRemainingStep('cv_similarity', stages)).toBe('details')
  })

  it('surfaces talent-owned stages and hides CV match / prescreening', () => {
    expect(talentFacingStage('personality', stages)).toBe('personality')
    expect(talentFacingStage('personalized', stages)).toBe('personalized')
    expect(talentFacingStage('prescreening', stages)).toBe('completed')
    expect(talentFacingStage('cv_similarity', stages)).toBe('completed')
    expect(talentFacingStage('cv_similarity')).toBe('completed')
    expect(talentFacingStage('prescreening')).toBe('completed')
    expect(talentFacingStage('completed', stages)).toBe('completed')
    expect(talentFacingStage(null)).toBeNull()
    expect(humanTalentStage('personality', stages)).toBe('Personality')
    expect(humanTalentStage('cv_similarity', stages)).toBe('Complete')
  })

  it('skips a leading CV match stage to the next talent-owned step', () => {
    const inverted = {
      cv_similarity: 'personalized',
      personalized: 'personality',
      personality: 'completed',
    }
    expect(talentFacingStage('cv_similarity', inverted)).toBe('personalized')
    expect(humanTalentStage('cv_similarity', inverted)).toBe('Personalized')
  })
})
