import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { formatTimeAgo } from './calculateDaysFromCreation'

describe('formatTimeAgo', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-08-31T12:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns just now for timestamps under a minute', () => {
    expect(formatTimeAgo('2026-08-31T11:59:30.000Z')).toBe('just now')
  })

  it('uses min / mins', () => {
    expect(formatTimeAgo('2026-08-31T11:59:00.000Z')).toBe('1 min ago')
    expect(formatTimeAgo('2026-08-31T11:55:00.000Z')).toBe('5 mins ago')
  })

  it('uses hour / hours', () => {
    expect(formatTimeAgo('2026-08-31T11:00:00.000Z')).toBe('1 hour ago')
    expect(formatTimeAgo('2026-08-31T09:00:00.000Z')).toBe('3 hours ago')
  })

  it('uses day / days and week / weeks', () => {
    expect(formatTimeAgo('2026-08-30T12:00:00.000Z')).toBe('1 day ago')
    expect(formatTimeAgo('2026-08-28T12:00:00.000Z')).toBe('3 days ago')
    expect(formatTimeAgo('2026-08-24T12:00:00.000Z')).toBe('1 week ago')
  })

  it('returns an empty string for missing or invalid dates', () => {
    expect(formatTimeAgo(null)).toBe('')
    expect(formatTimeAgo('not-a-date')).toBe('')
  })
})
