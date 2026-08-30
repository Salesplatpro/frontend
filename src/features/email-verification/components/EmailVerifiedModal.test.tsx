import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import { EmailVerifiedModal } from './EmailVerifiedModal'

const { navigateMock, authState } = vi.hoisted(() => ({
  navigateMock: vi.fn(),
  authState: {
    user: { userRole: 'talent' } as { userRole?: string } | undefined,
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

const renderWithState = (state: unknown, pathname = '/talentDashboard') =>
  render(
    <MemoryRouter initialEntries={[{ pathname, state }]}>
      <Routes>
        <Route path={pathname} element={<EmailVerifiedModal />} />
      </Routes>
    </MemoryRouter>,
  )

describe('EmailVerifiedModal', () => {
  it('renders nothing when showEmailVerifiedModal is not set', () => {
    renderWithState(null)

    expect(screen.queryByText('Email verified!')).toBeNull()
  })

  it('shows the talent celebration message when showEmailVerifiedModal is true', () => {
    authState.user = { userRole: 'talent' }
    renderWithState({ showEmailVerifiedModal: true })

    expect(screen.getByText('Email verified!')).toBeTruthy()
    expect(screen.getByText('🎉')).toBeTruthy()
    expect(
      screen.getByText(
        "Your email address is confirmed. You're all set to start your job search.",
      ),
    ).toBeTruthy()
  })

  it('shows the recruiter celebration message when the user is a recruiter', () => {
    authState.user = { userRole: 'recruiter' }
    renderWithState(
      { showEmailVerifiedModal: true },
      '/recruiterDashboard/dashboard',
    )

    expect(
      screen.getByText(
        "Your email address is confirmed. You're all set to start hiring.",
      ),
    ).toBeTruthy()
  })

  it('clears the location state (so it does not reappear) when dismissed', () => {
    authState.user = { userRole: 'talent' }
    renderWithState({ showEmailVerifiedModal: true })

    fireEvent.click(screen.getByTestId('close-button'))

    expect(navigateMock).toHaveBeenCalledWith('/talentDashboard', {
      replace: true,
      state: null,
    })
  })
})
