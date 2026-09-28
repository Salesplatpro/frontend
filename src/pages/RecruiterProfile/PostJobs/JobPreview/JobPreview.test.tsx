import { render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it } from 'vitest'

import { EMPTY_JOB_FORM } from '../utils/generatedJobToForm'
import { JobPreview } from './JobPreview'

describe('JobPreview', () => {
  it('shows placeholders and progress for an empty form', () => {
    render(<JobPreview values={EMPTY_JOB_FORM} roleName="" />)
    expect(screen.getByText('0 of 8 done')).toBeTruthy()
    expect(screen.getByText('Job title')).toBeTruthy()
    expect(screen.getByText(/your job brief appears here/i)).toBeTruthy()
  })

  it('renders the job as candidates will see it', () => {
    render(
      <JobPreview
        roleName="backend engineer"
        companyName="Acme"
        values={{
          ...EMPTY_JOB_FORM,
          role: 'role-1',
          workMode: ['hybrid'],
          location: {
            country: { name: 'Nigeria', isoCode: 'NG' },
            state: { name: 'Lagos', isoCode: 'LA' },
            city: { name: '', isoCode: '' },
          },
          experienceLevel: '4-6 years',
          currency: 'NGN',
          minSalary: '500000',
          maxSalary: '800000',
          compensationPeriod: 'monthly',
          jobBrief: '<p>Build APIs</p>',
          skills: ['Go'],
          goals: ['Ship v2'],
        }}
      />,
    )
    expect(screen.getByText('Backend Engineer')).toBeTruthy()
    expect(screen.getByText('Acme')).toBeTruthy()
    expect(screen.getByText('Hybrid')).toBeTruthy()
    expect(screen.getByText('Lagos, Nigeria')).toBeTruthy()
    expect(screen.getByText(/NGN 500,000 - 800,000 \/ Month/)).toBeTruthy()
    expect(screen.getByText('Build APIs')).toBeTruthy()
    expect(screen.getByText('Go')).toBeTruthy()
    expect(screen.getByText('Ship v2')).toBeTruthy()
    expect(screen.getByText('7 of 8 done')).toBeTruthy()
  })

  it('strips unsafe markup from the brief', () => {
    const { container } = render(
      <JobPreview
        roleName="x"
        values={{
          ...EMPTY_JOB_FORM,
          jobBrief: '<p>Hi</p><img src=x onerror="alert(1)">',
        }}
      />,
    )
    expect(container.querySelector('img')).toBeNull()
  })
})
