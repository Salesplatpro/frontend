import { render, screen } from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import JobDetailsView from './JobDetailsView'
import type { JobDetailsAudience, JobDetailsJob } from './types'

const JOB: JobDetailsJob = {
  role: { name: 'senior account executive' },
  status: 'active',
  createdAt: new Date().toISOString(),
  jobBrief:
    '<p><strong>Responsibilities</strong></p><ul><li>Own the pipeline</li></ul>',
  requirements: '<p>3+ years of B2B sales</p>',
  skills: ['Prospecting', 'CRM'],
  goals: ['Close ten enterprise deals'],
  workMode: ['hybrid'],
  locationCity: 'Lagos',
  locationCountry: 'Nigeria',
  experienceLevel: '4-6 years',
  currency: 'NGN',
  minSalary: 400000,
  maxSalary: 600000,
  compensationPeriod: 'monthly',
  noOfApplicants: 12,
  postedBy: { firstName: 'Ada', lastName: 'Obi' },
  organization: { name: 'Acme Ltd', website: 'acme.com' },
}

const renderView = (
  audience: JobDetailsAudience,
  job: JobDetailsJob = JOB,
  extra: { insights?: React.ReactNode } = {},
) =>
  render(
    <JobDetailsView
      jobId="job-1"
      job={job}
      audience={audience}
      action={<button type="button">Apply now</button>}
      {...extra}
    />,
    { wrapper: MemoryRouter },
  )

describe('JobDetailsView', () => {
  it('renders the job for a public visitor without hiring-team data or a back button', () => {
    renderView('public')

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Senior Account Executive',
      }),
    ).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Apply now' })).toBeTruthy()
    expect(screen.getByText('Own the pipeline')).toBeTruthy()
    expect(screen.getByText('Prospecting')).toBeTruthy()
    expect(screen.queryByText(/applicants?/i)).toBeNull()
    expect(screen.queryByText('12')).toBeNull()
    expect(screen.queryByText('Active')).toBeNull()
    expect(screen.queryByRole('button', { name: /back/i })).toBeNull()
  })

  it('hides the applicant count and status from talents but keeps the back button', () => {
    renderView('talent')

    expect(screen.queryByText(/applicants?/i)).toBeNull()
    expect(screen.queryByText('Active')).toBeNull()
    expect(screen.getByRole('button', { name: /back/i })).toBeTruthy()
  })

  it('shows the status and the insights card to recruiters', () => {
    renderView('recruiter', JOB, { insights: <p>12 applicants so far</p> })

    expect(screen.getByText('Active')).toBeTruthy()
    expect(
      screen.getByRole('heading', { name: 'Hiring insights' }),
    ).toBeTruthy()
    expect(screen.getByText('12 applicants so far')).toBeTruthy()
  })

  it('offers share links only for active jobs', () => {
    const { unmount } = renderView('recruiter')
    expect(screen.getByRole('button', { name: 'Share' })).toBeTruthy()
    unmount()

    renderView('recruiter', { ...JOB, status: 'draft' })
    expect(screen.queryByRole('button', { name: 'Share' })).toBeNull()
  })

  it('hides empty requirements', () => {
    renderView('public', { ...JOB, requirements: '<p><br></p>' })

    expect(screen.queryByRole('heading', { name: 'Requirements' })).toBeNull()
    expect(screen.getByRole('heading', { name: 'About the role' })).toBeTruthy()
  })

  it('links the company website and never other URL schemes', () => {
    const { unmount } = renderView('public')
    const links = screen.getAllByRole('link', { name: /acme\.com/ })
    expect(links[0].getAttribute('href')).toBe('https://acme.com/')
    unmount()

    renderView('public', {
      ...JOB,
      organization: { name: 'Acme Ltd', website: 'javascript:alert(1)' },
    })
    expect(screen.queryByRole('link', { name: /alert/ })).toBeNull()
  })
})
