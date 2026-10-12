import { describe, expect, it } from 'vitest'

import {
  formatNaira,
  humanizeKey,
  percentChange,
  recruiterFunnelBars,
  stuckStageBars,
  talentFunnelBars,
  toBars,
} from './overview'

describe('percentChange', () => {
  it('rounds the change against the previous period', () => {
    expect(percentChange(15, 10)).toBe(50)
    expect(percentChange(5, 10)).toBe(-50)
    expect(percentChange(10, 10)).toBe(0)
  })

  it('has no percentage when growing from zero', () => {
    expect(percentChange(4, 0)).toBeNull()
    expect(percentChange(0, 0)).toBe(0)
  })
})

describe('formatNaira', () => {
  it('formats small amounts in full and large ones in millions', () => {
    expect(formatNaira(5000)).toBe('₦5,000')
    expect(formatNaira(2_500_000)).toBe('₦2.5M')
    expect(formatNaira(0)).toBe('₦0')
  })
})

describe('humanizeKey', () => {
  it('turns snake case keys into sentence case', () => {
    expect(humanizeKey('pending_payment')).toBe('Pending payment')
    expect(humanizeKey('pay_per_use')).toBe('Pay per use')
  })
})

describe('toBars', () => {
  it('maps buckets to labelled bars and attaches links', () => {
    const bars = toBars(
      [{ key: 'awaiting_decision', count: 3 }],
      undefined,
      () => '/adminDashboard/applications',
    )
    expect(bars).toEqual([
      {
        key: 'awaiting_decision',
        label: 'Awaiting decision',
        value: 3,
        href: '/adminDashboard/applications',
      },
    ])
  })
})

describe('funnels', () => {
  it('keeps every talent stage in order and zero-fills missing ones', () => {
    const bars = talentFunnelBars([
      { key: 'active', count: 4 },
      { key: 'verify_email', count: 2 },
    ])
    expect(bars.map((bar) => bar.key)).toEqual([
      'verify_email',
      'complete_profile',
      'take_assessment',
      'apply_to_job',
      'active',
    ])
    expect(bars.map((bar) => bar.value)).toEqual([2, 0, 0, 0, 4])
  })

  it('keeps every recruiter stage in order', () => {
    expect(recruiterFunnelBars([]).map((bar) => bar.key)).toEqual([
      'verify_email',
      'create_company',
      'post_job',
      'set_up_screening',
      'publish_job',
      'active',
    ])
  })
})

describe('stuckStageBars', () => {
  it('uses the application stage labels', () => {
    const [bar] = stuckStageBars([{ key: 'prescreening', count: 2 }])
    expect(bar.value).toBe(2)
    expect(bar.label.length).toBeGreaterThan(0)
    expect(bar.label).not.toBe('prescreening')
  })
})
