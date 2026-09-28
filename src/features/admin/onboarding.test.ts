import { describe, expect, it } from 'vitest'

import {
  daysAgo,
  FOLLOW_UP_OPTIONS,
  followUpCaption,
  RECRUITER_STAGE_OPTIONS,
  STAGE_LABEL,
  stageBadge,
  stageOptions,
  TALENT_STAGE_OPTIONS,
} from './onboarding'
import { OnboardingStage } from './types'

const now = new Date('2026-09-28T12:00:00Z')

describe('onboarding labels', () => {
  it('has a label and a tone for every stage', () => {
    for (const stage of Object.keys(STAGE_LABEL) as OnboardingStage[]) {
      const badge = stageBadge(stage)
      expect(badge.label).toBeTruthy()
      expect(['success', 'warning', 'danger', 'neutral']).toContain(badge.tone)
    }
  })

  it('marks active users green and stuck users as stuck', () => {
    expect(stageBadge('active')).toEqual({ label: 'Active', tone: 'success' })
    expect(stageBadge('take_assessment')).toEqual({
      label: 'Stuck: Take assessment',
      tone: 'warning',
    })
    expect(stageBadge('verify_email').tone).toBe('danger')
  })

  it('offers each role only its own stages, plus "any"', () => {
    const talentValues = stageOptions(TALENT_STAGE_OPTIONS).map((o) => o.value)
    expect(talentValues[0]).toBe('')
    expect(talentValues).toContain('take_assessment')
    expect(talentValues).not.toContain('post_job')
    const recruiterValues = stageOptions(RECRUITER_STAGE_OPTIONS).map(
      (o) => o.value,
    )
    expect(recruiterValues).toContain('publish_job')
    expect(recruiterValues).not.toContain('apply_to_job')
  })

  it('offers every follow-up status', () => {
    expect(FOLLOW_UP_OPTIONS.map((o) => o.value)).toEqual([
      '',
      'none',
      'emailed',
      'progressed',
    ])
  })
})

describe('daysAgo', () => {
  it.each([
    ['2026-09-28T08:00:00Z', 'today'],
    ['2026-09-27T11:00:00Z', '1 day ago'],
    ['2026-09-25T12:00:00Z', '3 days ago'],
    ['2026-09-29T12:00:00Z', 'today'],
  ])('%s → %s', (date, text) => {
    expect(daysAgo(date, now)).toBe(text)
  })
})

describe('followUpCaption', () => {
  it('is empty before any email', () => {
    expect(
      followUpCaption(
        {
          stage: 'post_job',
          emailsSent: 0,
          lastEmailAt: null,
          followUp: 'none',
        },
        now,
      ),
    ).toBeNull()
  })

  it('shows the count and when the last email went out', () => {
    expect(
      followUpCaption(
        {
          stage: 'post_job',
          emailsSent: 2,
          lastEmailAt: '2026-09-25T12:00:00Z',
          followUp: 'emailed',
        },
        now,
      ),
    ).toBe('Emailed 2× · last 3 days ago')
  })

  it('notes when the user progressed after the email', () => {
    expect(
      followUpCaption(
        {
          stage: 'active',
          emailsSent: 1,
          lastEmailAt: '2026-09-28T09:00:00Z',
          followUp: 'progressed',
        },
        now,
      ),
    ).toBe('Emailed 1× · last today · progressed')
  })
})
