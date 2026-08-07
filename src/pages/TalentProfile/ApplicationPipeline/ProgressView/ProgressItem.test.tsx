import { describe, expect, it } from 'vitest'

import { isNumericOrPercentResult } from './ProgressItem'

describe('isNumericOrPercentResult', () => {
  it('accepts plain numbers and percentages', () => {
    expect(isNumericOrPercentResult('82')).toBe(true)
    expect(isNumericOrPercentResult('82%')).toBe(true)
    expect(isNumericOrPercentResult('82.5')).toBe(true)
    expect(isNumericOrPercentResult('82.5%')).toBe(true)
  })

  it('rejects non-numeric results such as MBTI types or empty values', () => {
    expect(isNumericOrPercentResult('INTJ')).toBe(false)
    expect(isNumericOrPercentResult('Completed')).toBe(false)
    expect(isNumericOrPercentResult(null)).toBe(false)
    expect(isNumericOrPercentResult(undefined)).toBe(false)
    expect(isNumericOrPercentResult('')).toBe(false)
    expect(isNumericOrPercentResult('  ')).toBe(false)
  })
})
