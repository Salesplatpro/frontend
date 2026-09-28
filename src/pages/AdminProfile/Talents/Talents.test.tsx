import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { store } from '@/redux/store/store'

import Talents from './Talents'

const { fetchTalentsMock } = vi.hoisted(() => ({ fetchTalentsMock: vi.fn() }))

vi.mock('@/features/admin/services/adminService', () => ({
  fetchAdminTalents: fetchTalentsMock,
  deleteAdminTalent: vi.fn(),
}))

vi.mock('@/features/admin/store/useRolesStore', () => ({
  useRolesStore: () => ({ roles: [], fetchRoles: vi.fn() }),
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

const talent = (overrides: Record<string, unknown> = {}) => ({
  id: 't1',
  firstName: 'Ada',
  lastName: 'Lovelace',
  email: 'ada@example.com',
  experience: null,
  prescreeningScore: null,
  createdAt: '2026-09-01T00:00:00.000Z',
  userRoles: [],
  onboarding: {
    stage: 'take_assessment',
    emailsSent: 2,
    lastEmailAt: new Date().toISOString(),
    followUp: 'emailed',
  },
  ...overrides,
})

const renderTalents = () =>
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Talents />
      </MemoryRouter>
    </Provider>,
  )

const pickFilter = async (current: string, option: string) => {
  if (!screen.queryByText(current)) {
    fireEvent.click(screen.getByRole('button', { name: /filters/i }))
  }
  fireEvent.click(screen.getByText(current))
  fireEvent.click(await screen.findByText(option))
}

describe('Admin Talents — onboarding', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    fetchTalentsMock.mockResolvedValue({ users: [talent()], total: 1 })
  })

  it('shows each talent’s onboarding stage and follow-up history', async () => {
    renderTalents()
    expect(await screen.findByText('Stuck: Take assessment')).toBeTruthy()
    expect(screen.getByText('Emailed 2× · last today')).toBeTruthy()
  })

  it('shows a dash for a talent without onboarding data', async () => {
    fetchTalentsMock.mockResolvedValue({
      users: [talent({ onboarding: null })],
      total: 1,
    })
    renderTalents()
    await screen.findByText('Ada Lovelace')
    expect(screen.queryByText(/stuck:/i)).toBeNull()
  })

  it('asks the server for the chosen onboarding stage', async () => {
    renderTalents()
    await screen.findByText('Ada Lovelace')

    await pickFilter('Any stage', 'Stuck: Complete profile')

    await waitFor(() =>
      expect(fetchTalentsMock).toHaveBeenLastCalledWith(
        expect.objectContaining({
          onboardingStage: 'complete_profile',
          followUp: '',
        }),
      ),
    )
  })

  it('asks the server for the chosen follow-up status', async () => {
    renderTalents()
    await screen.findByText('Ada Lovelace')

    await pickFilter('Any follow-up', 'Progressed after email')

    await waitFor(() =>
      expect(fetchTalentsMock).toHaveBeenLastCalledWith(
        expect.objectContaining({ followUp: 'progressed' }),
      ),
    )
  })

  it('opens the follow-up drawer for a row and refreshes the list after sending', async () => {
    renderTalents()
    fireEvent.click(await screen.findByRole('button', { name: 'Follow up' }))

    expect(
      screen.getByRole('dialog', { name: 'Follow up with Ada Lovelace' }),
    ).toBeTruthy()
    const callsBefore = fetchTalentsMock.mock.calls.length
    fireEvent.click(screen.getByRole('button', { name: 'Pretend send' }))

    await waitFor(() =>
      expect(fetchTalentsMock.mock.calls.length).toBe(callsBefore + 1),
    )
    expect(screen.getByRole('button', { name: 'Follow up' })).toBeTruthy()
  })
})
