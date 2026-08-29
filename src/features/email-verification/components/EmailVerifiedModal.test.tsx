import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import { EmailVerifiedModal } from './EmailVerifiedModal'

const { navigateMock } = vi.hoisted(() => ({
  navigateMock: vi.fn(),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom',
  )
  return { ...actual, useNavigate: () => navigateMock }
})

const renderWithState = (state: unknown) =>
  render(
    <MemoryRouter initialEntries={[{ pathname: '/talentDashboard', state }]}>
      <Routes>
        <Route path="/talentDashboard" element={<EmailVerifiedModal />} />
      </Routes>
    </MemoryRouter>,
  )

describe('EmailVerifiedModal', () => {
  it('renders nothing when showEmailVerifiedModal is not set', () => {
    renderWithState(null)

    expect(screen.queryByText('Email verified!')).toBeNull()
  })

  it('shows the celebration message when showEmailVerifiedModal is true', () => {
    renderWithState({ showEmailVerifiedModal: true })

    expect(screen.getByText('Email verified!')).toBeTruthy()
    expect(screen.getByText('🎉')).toBeTruthy()
  })

  it('clears the location state (so it does not reappear) when dismissed', () => {
    renderWithState({ showEmailVerifiedModal: true })

    fireEvent.click(screen.getByTestId('close-button'))

    expect(navigateMock).toHaveBeenCalledWith('/talentDashboard', {
      replace: true,
      state: null,
    })
  })
})
