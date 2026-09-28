import { describe, expect, it } from 'vitest'

import { AI_CONFIG_DEFAULT_VALUES } from './aiConfigModel'
import {
  detectPreset,
  getPreset,
  isAutoSetupName,
  SCREENING_PRESETS,
  setupName,
} from './aiConfigPresets'

describe('detectPreset', () => {
  it.each(SCREENING_PRESETS.map((preset) => preset.id))(
    'recognises the %s preset',
    (id) => {
      expect(
        detectPreset({ ...AI_CONFIG_DEFAULT_VALUES, ...getPreset(id).values }),
      ).toBe(id)
    },
  )

  it('treats numbers and strings as the same value', () => {
    expect(
      detectPreset({
        ...AI_CONFIG_DEFAULT_VALUES,
        ...getPreset('balanced').values,
        minPrescreeningScore: 60,
      }),
    ).toBe('balanced')
  })

  it('reports custom once any preset value changes', () => {
    expect(
      detectPreset({
        ...AI_CONFIG_DEFAULT_VALUES,
        ...getPreset('balanced').values,
        minCvSimilarityScore: '80',
      }),
    ).toBe('custom')
  })

  it('ignores fields presets do not set, like the name', () => {
    expect(
      detectPreset({
        ...AI_CONFIG_DEFAULT_VALUES,
        ...getPreset('light').values,
        name: 'Anything',
        recruiterGuide: 'Notes',
      }),
    ).toBe('light')
  })

  it('every preset passes the backend rules it will be sent to', () => {
    for (const preset of SCREENING_PRESETS) {
      const { values } = preset
      if (values.personalizedAssessment === 'true') {
        const count = Number(values.noPersonalizedQuestions)
        expect(count).toBeGreaterThanOrEqual(1)
        expect(count).toBeLessThanOrEqual(20)
      }
      if (values.cvSimilarity === 'true') {
        expect(values.minCvSimilarityScore).not.toBe('')
      }
    }
  })
})

describe('setup names', () => {
  it('joins role and preset', () => {
    expect(setupName(' Backend Engineer ', 'Balanced')).toBe(
      'Backend Engineer – Balanced',
    )
    expect(setupName('', 'Balanced')).toBe('Balanced')
  })

  it('knows which names it generated', () => {
    expect(isAutoSetupName('', 'Engineer')).toBe(true)
    expect(isAutoSetupName('Engineer – Thorough', 'Engineer')).toBe(true)
    expect(isAutoSetupName('Engineer', 'Engineer')).toBe(true)
    expect(isAutoSetupName('Our senior bar', 'Engineer')).toBe(false)
  })
})
