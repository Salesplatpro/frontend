import { describe, expect, it } from 'vitest'

import {
  AI_CONFIG_DEFAULT_VALUES,
  personalityTotal,
  splitPersonalityCount,
} from './aiConfigModel'

describe('splitPersonalityCount', () => {
  it('spreads the total evenly, giving leftovers to earlier traits', () => {
    expect(splitPersonalityCount(8)).toEqual({
      noOfEIQuestions: '2',
      noOfSNQuestions: '2',
      noOfTFQuestions: '2',
      noOfJPQuestions: '2',
    })
    expect(splitPersonalityCount(6)).toEqual({
      noOfEIQuestions: '2',
      noOfSNQuestions: '2',
      noOfTFQuestions: '1',
      noOfJPQuestions: '1',
    })
  })

  it('leaves traits blank rather than 0 when the total is small', () => {
    expect(splitPersonalityCount(1)).toEqual({
      noOfEIQuestions: '1',
      noOfSNQuestions: '',
      noOfTFQuestions: '',
      noOfJPQuestions: '',
    })
  })

  it('treats zero, negatives and fractions safely', () => {
    const blank = {
      noOfEIQuestions: '',
      noOfSNQuestions: '',
      noOfTFQuestions: '',
      noOfJPQuestions: '',
    }
    expect(splitPersonalityCount(0)).toEqual(blank)
    expect(splitPersonalityCount(-3)).toEqual(blank)
    expect(splitPersonalityCount(4.9)).toEqual(splitPersonalityCount(4))
  })
})

describe('personalityTotal', () => {
  it('adds up the four traits, ignoring blanks and junk', () => {
    expect(
      personalityTotal({
        ...AI_CONFIG_DEFAULT_VALUES,
        noOfEIQuestions: '3',
        noOfSNQuestions: 2,
        noOfTFQuestions: '',
        noOfJPQuestions: 'abc',
      }),
    ).toBe(5)
  })

  it('round-trips with splitPersonalityCount', () => {
    for (const total of [0, 1, 3, 7, 13]) {
      expect(
        personalityTotal({
          ...AI_CONFIG_DEFAULT_VALUES,
          ...splitPersonalityCount(total),
        }),
      ).toBe(total)
    }
  })
})
