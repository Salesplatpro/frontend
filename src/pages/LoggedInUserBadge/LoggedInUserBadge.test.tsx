import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { LoggedInUserBadge } from './LoggedInUserBadge'

const { navigateMock, authState } = vi.hoisted(() => ({
  navigateMock: vi.fn(),
  authState: {
    user: {
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      userRole: 'talent' as string | undefined,
    },
    logout: vi.fn(),
  },
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom',
  )
  return { ...actual, useNavigate: () => navigateMock }
})

vi.mock('@/features/auth/store/useAuthStore', () => ({
  useAuthStore: (selector: (state: typeof authState) => unknown) =>
    selector(authState),
}))

vi.mock('@/features/profile/hooks/useProfile', () => ({
  useProfile: () => ({
    profile: {
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      emailVerifiedAt: '2026-01-01T00:00:00.000Z',
      billingPlan: 'free',
    },
    isLoading: false,
    error: null,
  }),
}))

vi.mock('@/features/notifications/hooks/useNotifications', () => ({
  useNotifications: () => ({ unReadCount: 0 }),
}))

const renderBadge = () =>
  render(
    <MemoryRouter>
      <LoggedInUserBadge />
    </MemoryRouter>,
  )

describe('LoggedInUserBadge', () => {
  beforeEach(() => {
    navigateMock.mockReset()
    authState.logout.mockReset()
    authState.user.userRole = 'talent'
  })

  it('navigates to the change-password route from the account menu', () => {
    renderBadge()

    fireEvent.click(screen.getByRole('button', { name: /Ada Lovelace/ }))
    fireEvent.click(screen.getByRole('menuitem', { name: /Change password/ }))

    expect(navigateMock).toHaveBeenCalledWith(
      '/talentDashboard/change-password',
    )
  })

  it('uses the recruiter change-password route for recruiters', () => {
    authState.user.userRole = 'recruiter'
    renderBadge()

    fireEvent.click(screen.getByRole('button', { name: /Ada Lovelace/ }))
    fireEvent.click(screen.getByRole('menuitem', { name: /Change password/ }))

    expect(navigateMock).toHaveBeenCalledWith(
      '/recruiterDashboard/change-password',
    )
  })

  it('does not show change password for admin', () => {
    authState.user.userRole = 'admin'
    renderBadge()

    fireEvent.click(screen.getByRole('button', { name: /Ada Lovelace/ }))

    expect(
      screen.queryByRole('menuitem', { name: /Change password/ }),
    ).toBeNull()
  })
})
