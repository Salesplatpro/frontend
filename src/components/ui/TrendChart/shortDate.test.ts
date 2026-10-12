import { describe, expect, it } from 'vitest'

import { shortDate } from './shortDate'

describe('shortDate', () => {
  it('formats a calendar date without timezone drift', () => {
    expect(shortDate('2026-03-05')).toBe('Mar 5')
    expect(shortDate('2026-12-31')).toBe('Dec 31')
  })
})
