import { describe, expect, it } from 'vitest'

import { buildHeatmapWeeks, heatmapLevel, toDateKey } from './heatmap'

describe('heatmap helpers', () => {
  it('builds 12 weeks of 7 days ending this week', () => {
    const weeks = buildHeatmapWeeks(
      [{ date: '2026-09-14', count: 2 }],
      new Date('2026-09-14T12:00:00'),
    )
    expect(weeks).toHaveLength(12)
    expect(weeks[0]).toHaveLength(7)
    expect(weeks[11]?.[0]?.date).toBe('2026-09-14')
  })

  it('maps counts onto intensity levels', () => {
    expect(heatmapLevel(0, 8)).toBe(0)
    expect(heatmapLevel(1, 8)).toBe(1)
    expect(heatmapLevel(8, 8)).toBe(4)
  })

  it('formats local dates as YYYY-MM-DD', () => {
    expect(toDateKey(new Date(2026, 8, 14))).toBe('2026-09-14')
  })
})
