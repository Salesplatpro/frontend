import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { AuthUser } from '@/features/auth/types'

import PostedJob from './PostedJob'

const { navigateMock, jobQueryMock } = vi.hoisted(() => ({
  navigateMock: vi.fn(),
  jobQueryMock: vi.fn(),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom',
  )
  return { ...actual, useNavigate: () => navigateMock }
})

vi.mock('@/redux/api/talent', () => ({
  useIndividualJobQuery: jobQueryMock,
}))

const JOB_ID = '0f4c1a2e-9b3d-4c7a-8e15-2d6f7b8c9a01'

const job = (overrides: Record<string, unknown> = {}) => ({
  role: { name: 'sales lead' },
  status: 'active',
  jobBrief: '<p>Lead the team.</p>',
  noOfApplicants: 9,
  organization: { name: 'Acme Ltd' },
  ...overrides,
})

const respondWith = (
  jobData: Record<string, unknown> | null,
  error?: unknown,
) =>
  jobQueryMock.mockReturnValue({
    data: jobData ? { data: { job: jobData } } : undefined,
    error,
    isLoading: false,
    refetch: vi.fn(),
  })

const signIn = (userRole: string) =>
  useAuthStore.setState({
    isLoggedIn: true,
    token: 'token',
    user: { userRole } as unknown as AuthUser,
  })

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={[`/job/postedjob/${JOB_ID}`]}>
      <Routes>
        <Route path="/job/postedjob/:jobId" element={<PostedJob />} />
      </Routes>
    </MemoryRouter>,
  )

describe('PostedJob', () => {
  beforeEach(() => {
    navigateMock.mockClear()
    useAuthStore.setState({ isLoggedIn: false, token: null, user: null })
  })

  it('lets a visitor apply and never shows the applicant count or a back button', () => {
    respondWith(job())
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: 'Apply now' }))

    expect(navigateMock).toHaveBeenCalledWith(`/apply/${JOB_ID}`)
    expect(screen.queryByText(/applicants?/i)).toBeNull()
    expect(screen.queryByRole('button', { name: /back/i })).toBeNull()
  })

  it('sends a talent who already applied to their application', () => {
    signIn('talent')
    respondWith(job({ hasApplied: true }))
    renderPage()

    fireEvent.click(
      screen.getByRole('button', { name: 'View your application' }),
    )

    expect(navigateMock).toHaveBeenCalledWith(`/talentDashboard/job/${JOB_ID}`)
    expect(screen.queryByRole('button', { name: 'Apply now' })).toBeNull()
  })

  it('shows no apply action to recruiters', () => {
    signIn('recruiter')
    respondWith(job())
    renderPage()

    expect(screen.queryByRole('button', { name: 'Apply now' })).toBeNull()
    expect(
      screen.queryByRole('button', { name: 'View your application' }),
    ).toBeNull()
  })

  it('points visitors to open jobs when the job is closed', () => {
    respondWith(job({ status: 'closed' }))
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: 'Browse open jobs' }))

    expect(navigateMock).toHaveBeenCalledWith('/talentDashboard/jobs')
  })

  it('points recruiters to their dashboard when the job is unavailable', () => {
    signIn('recruiter')
    respondWith(null, { status: 404 })
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: 'Go to dashboard' }))

    expect(navigateMock).toHaveBeenCalledWith('/recruiterDashboard/dashboard')
  })
})
