import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { store } from '@/redux/store/store'

import Recruiters from './Recruiters'

const { fetchRecruitersMock } = vi.hoisted(() => ({
  fetchRecruitersMock: vi.fn(),
}))

vi.mock('@/features/admin/services/adminService', () => ({
  fetchAdminRecruiters: fetchRecruitersMock,
  deleteAdminRecruiter: vi.fn(),
}))

vi.mock('@/utils/toastNotifications', () => ({ notify: vi.fn() }))

vi.mock('../Onboarding/OnboardingDrawer', () => ({
  OnboardingDrawer: ({
    userId,
    userName,
    onSent,
  }: {
    userId: string | null
    userName: string
    onSent?: () => void
  }) =>
    userId ? (
      <div role="dialog" aria-label={`Follow up with ${userName}`}>
        <button type="button" onClick={onSent}>
          Pretend send
        </button>
      </div>
    ) : null,
}))

const recruiter = {
  id: 'r1',
  firstName: 'Bola',
  lastName: 'Ade',
  email: 'bola@example.com',
  createdAt: '2026-09-01T00:00:00.000Z',
  onboarding: {
    stage: 'publish_job',
    emailsSent: 0,
    lastEmailAt: null,
    followUp: 'none',
  },
}

const renderRecruiters = () =>
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Recruiters />
      </MemoryRouter>
    </Provider>,
  )

describe('Admin Recruiters — onboarding', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    fetchRecruitersMock.mockResolvedValue({ users: [recruiter], total: 1 })
  })

  it('shows each recruiter’s onboarding stage', async () => {
    renderRecruiters()
    expect(await screen.findByText('Stuck: Publish a job')).toBeTruthy()
    expect(screen.queryByText(/emailed/i)).toBeNull()
  })

  it('offers recruiter stages in the filter and asks the server for them', async () => {
    renderRecruiters()
    await screen.findByText('Bola Ade')
    fireEvent.click(screen.getByRole('button', { name: /filters/i }))
    fireEvent.click(screen.getByText('Any stage'))

    expect(screen.queryByText('Stuck: Take assessment')).toBeNull()
    fireEvent.click(await screen.findByText('Stuck: Set up screening'))

    await waitFor(() =>
      expect(fetchRecruitersMock).toHaveBeenLastCalledWith(
        expect.objectContaining({ onboardingStage: 'set_up_screening' }),
      ),
    )
  })

  it('opens the follow-up drawer and refreshes after sending', async () => {
    renderRecruiters()
    fireEvent.click(await screen.findByRole('button', { name: 'Follow up' }))
    expect(
      screen.getByRole('dialog', { name: 'Follow up with Bola Ade' }),
    ).toBeTruthy()

    const callsBefore = fetchRecruitersMock.mock.calls.length
    fireEvent.click(screen.getByRole('button', { name: 'Pretend send' }))
    await waitFor(() =>
      expect(fetchRecruitersMock.mock.calls.length).toBe(callsBefore + 1),
    )
  })
})
