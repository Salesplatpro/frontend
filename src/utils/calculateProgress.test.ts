import { describe, expect, it } from 'vitest'

import { EMPTY_LOCATION } from '@/components/forms/LocationSelect'
import { ProfileFormValues } from '@/features/profile/types'

import {
  calculateProgress,
  getIncompleteProfileFields,
  getProfileCompletionErrors,
} from './calculateProgress'

const emptyValues: ProfileFormValues = {
  bio: '',
  role: [],
  location: { ...EMPTY_LOCATION },
  experience: '',
  minSalary: '',
  maxSalary: '',
  currency: '',
  compensationPeriod: '',
  workType: [],
}

describe('profile completion helpers', () => {
  it('reports every required field when the profile is empty', () => {
    const incomplete = getIncompleteProfileFields(emptyValues, false)
    expect(incomplete.map((field) => field.name)).toEqual([
      'bio',
      'role',
      'experience',
      'workType',
      'location.country.name',
      'minSalary',
      'maxSalary',
      'cv',
    ])
    expect(calculateProgress(emptyValues, false)).toBe(0)
  })

  it('returns nested Formik errors for incomplete fields', () => {
    const { errors, cv } = getProfileCompletionErrors(emptyValues, false)
    expect(errors.bio).toBe('Add a short bio so recruiters know who you are.')
    expect(errors.location).toEqual({
      country: { name: 'Country is required.' },
    })
    expect(cv).toBe('Upload your CV to continue.')
  })

  it('treats a filled profile with a CV as complete', () => {
    const values: ProfileFormValues = {
      ...emptyValues,
      bio: 'I sell software.',
      role: ['1'],
      experience: 'mid',
      workType: ['remote'],
      location: {
        ...EMPTY_LOCATION,
        country: { name: 'Nigeria', isoCode: 'NG' },
      },
      minSalary: '100000',
      maxSalary: '200000',
    }

    expect(getIncompleteProfileFields(values, true)).toEqual([])
    expect(calculateProgress(values, true)).toBe(100)
  })
})
