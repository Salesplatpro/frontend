import { describe, expect, it } from 'vitest'

import {
  EMPTY_JOB_FORM,
  generatedJobToForm,
  matchRoleId,
} from './generatedJobToForm'

const roles = [
  { id: 'role-1', name: 'backend engineer' },
  { id: 'role-2', name: 'Product Designer' },
]

describe('matchRoleId', () => {
  it('returns the id of a role with the same name, ignoring case and spaces', () => {
    expect(matchRoleId('  Backend Engineer ', roles)).toBe('role-1')
  })

  it('returns the trimmed name when no role matches, so the backend creates it', () => {
    expect(matchRoleId(' Data Scientist ', roles)).toBe('Data Scientist')
  })
})

describe('generatedJobToForm', () => {
  it('maps every field the AI returned and counts them', () => {
    const { values, filledCount } = generatedJobToForm(
      {
        role: 'Backend Engineer',
        experienceLevel: '4-6 years',
        workMode: ['hybrid', 'remote'],
        locationCountry: 'Nigeria',
        locationState: 'Lagos',
        locationCity: null,
        currency: 'NGN',
        minSalary: 800000,
        maxSalary: 1200000,
        compensationPeriod: 'monthly',
        jobBrief: 'About the Role:\nBuild APIs',
        requirements: 'Qualifications:\nGo',
        skills: ['Go'],
        goals: ['Ship payments v2'],
      },
      roles,
    )

    expect(values.role).toBe('role-1')
    expect(values.experienceLevel).toBe('4-6 years')
    expect(values.workMode).toEqual(['hybrid', 'remote'])
    expect(values.location.country.name).toBe('Nigeria')
    expect(values.location.state.name).toBe('Lagos')
    expect(values.currency).toBe('NGN')
    expect(values.minSalary).toBe('800000')
    expect(values.maxSalary).toBe('1200000')
    expect(values.compensationPeriod).toBe('monthly')
    expect(values.jobBrief).toBe('<p>About the Role:</p><p>Build APIs</p>')
    expect(values.requirements).toBe('<p>Qualifications:</p><p>Go</p>')
    expect(values.skills).toEqual(['Go'])
    expect(values.goals).toEqual(['Ship payments v2'])
    expect(filledCount).toBe(12)
  })

  it('leaves fields empty when the AI returned nothing for them', () => {
    const { values, filledCount } = generatedJobToForm(
      { role: 'Product Designer', jobBrief: 'Design things' },
      roles,
    )

    expect(values).toEqual({
      ...EMPTY_JOB_FORM,
      role: 'role-2',
      jobBrief: '<p>Design things</p>',
    })
    expect(filledCount).toBe(2)
  })

  it('drops unknown work modes and unknown locations', () => {
    const { values } = generatedJobToForm(
      { workMode: ['remote', 'moon'], locationCountry: 'Atlantis' },
      roles,
    )

    expect(values.workMode).toEqual(['remote'])
    expect(values.location).toEqual(EMPTY_JOB_FORM.location)
  })

  it('handles an empty response without throwing', () => {
    expect(generatedJobToForm({}, []).filledCount).toBe(0)
  })
})
