import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ResetPasswordPage } from './ResetPasswordPage'

const { submitValidateTokenMock, submitResetPasswordMock, navigateMock } =
  vi.hoisted(() => ({
    submitValidateTokenMock: vi.fn(),
    submitResetPasswordMock: vi.fn(),
    navigateMock: vi.fn(),
  }))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom',
  )
  return { ...actual, useNavigate: () => navigateMock }
})

vi.mock('../hooks/useResetPassword', () => ({
  useResetPassword: () => ({
    submitValidateToken: submitValidateTokenMock,
    submitResetPassword: submitResetPasswordMock,
    isValidating: false,
    isResetting: false,
  }),
}))

vi.mock('../components/AuthLayout', () => ({
  AuthLayout: ({
    title,
    subtitle,
    children,
  }: {
    title: string
    subtitle: string
    children: React.ReactNode
  }) => (
    <div>
      <h1>{title}</h1>
      <p>{subtitle}</p>
      {children}
    </div>
  ),
}))

const renderAt = (search: string) =>
  render(
    <MemoryRouter initialEntries={[`/reset-password${search}`]}>
      <Routes>
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/forgot-password" element={<div>Forgot page</div>} />
      </Routes>
    </MemoryRouter>,
  )

describe('ResetPasswordPage', () => {
  beforeEach(() => {
    navigateMock.mockReset()
    submitValidateTokenMock.mockReset()
    submitResetPasswordMock.mockReset()
    submitValidateTokenMock.mockResolvedValue({ data: { valid: true } })
    submitResetPasswordMock.mockResolvedValue({
      data: {
        user: { userRole: 'talent' },
        token: 'new-jwt',
      },
    })
  })

  it('shows the password form when the token is valid', async () => {
    renderAt('?token=valid-token')

    await waitFor(() =>
      expect(screen.getByLabelText('New password')).toBeTruthy(),
    )
    expect(screen.getByLabelText('Confirm password')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Change password' })).toBeTruthy()
    expect(submitValidateTokenMock).toHaveBeenCalledWith('valid-token')
  })

  it('shows the expired message when the token is missing', () => {
    renderAt('')

    expect(screen.getByText('Reset link expired')).toBeTruthy()
    expect(screen.queryByLabelText('New password')).toBeNull()
    expect(
      screen.getByRole('link', { name: 'Request a new reset' }),
    ).toBeTruthy()
    expect(submitValidateTokenMock).not.toHaveBeenCalled()
  })

  it('shows the expired message when the token is rejected', async () => {
    submitValidateTokenMock.mockRejectedValue(new Error('invalid'))
    renderAt('?token=expired-token')

    await waitFor(() =>
      expect(screen.getByText('Reset link expired')).toBeTruthy(),
    )
    expect(screen.queryByLabelText('New password')).toBeNull()
  })

  it('blocks submit when passwords do not match', async () => {
    renderAt('?token=valid-token')
    await waitFor(() =>
      expect(screen.getByLabelText('New password')).toBeTruthy(),
    )

    fireEvent.change(screen.getByLabelText('New password'), {
      target: { value: 'NewPassword1!' },
    })
    fireEvent.change(screen.getByLabelText('Confirm password'), {
      target: { value: 'Mismatch1!' },
    })
    fireEvent.blur(screen.getByLabelText('Confirm password'))
    fireEvent.click(screen.getByRole('button', { name: 'Change password' }))

    await waitFor(() =>
      expect(screen.getByText('Passwords must match')).toBeTruthy(),
    )
    expect(submitResetPasswordMock).not.toHaveBeenCalled()
  })

  it('blocks submit when the password is too weak', async () => {
    renderAt('?token=valid-token')
    await waitFor(() =>
      expect(screen.getByLabelText('New password')).toBeTruthy(),
    )

    fireEvent.change(screen.getByLabelText('New password'), {
      target: { value: 'weak' },
    })
    fireEvent.change(screen.getByLabelText('Confirm password'), {
      target: { value: 'weak' },
    })
    fireEvent.blur(screen.getByLabelText('New password'))
    fireEvent.click(screen.getByRole('button', { name: 'Change password' }))

    await waitFor(() =>
      expect(
        screen.getByText('Password must be between 8 and 72 characters'),
      ).toBeTruthy(),
    )
    expect(submitResetPasswordMock).not.toHaveBeenCalled()
  })

  it('blocks submit when fields are empty', async () => {
    renderAt('?token=valid-token')
    await waitFor(() =>
      expect(screen.getByLabelText('New password')).toBeTruthy(),
    )

    fireEvent.click(screen.getByRole('button', { name: 'Change password' }))

    expect(submitResetPasswordMock).not.toHaveBeenCalled()
  })

  it('authenticates and redirects after a successful reset', async () => {
    renderAt('?token=valid-token')
    await waitFor(() =>
      expect(screen.getByLabelText('New password')).toBeTruthy(),
    )

    fireEvent.change(screen.getByLabelText('New password'), {
      target: { value: 'NewPassword1!' },
    })
    fireEvent.change(screen.getByLabelText('Confirm password'), {
      target: { value: 'NewPassword1!' },
    })
    fireEvent.submit(
      screen.getByRole('button', { name: 'Change password' }).closest('form')!,
    )

    await waitFor(() =>
      expect(submitResetPasswordMock).toHaveBeenCalledWith({
        token: 'valid-token',
        password: 'NewPassword1!',
      }),
    )
    expect(navigateMock).toHaveBeenCalledWith('/talentDashboard', {
      replace: true,
    })
  })

  it('shows an API error when password reset fails', async () => {
    submitResetPasswordMock.mockRejectedValue(
      new Error('Failed to update password. Please try again.'),
    )
    renderAt('?token=valid-token')
    await waitFor(() =>
      expect(screen.getByLabelText('New password')).toBeTruthy(),
    )

    fireEvent.change(screen.getByLabelText('New password'), {
      target: { value: 'NewPassword1!' },
    })
    fireEvent.change(screen.getByLabelText('Confirm password'), {
      target: { value: 'NewPassword1!' },
    })
    fireEvent.submit(
      screen.getByRole('button', { name: 'Change password' }).closest('form')!,
    )

    await waitFor(() =>
      expect(
        screen.getByText('Failed to update password. Please try again.'),
      ).toBeTruthy(),
    )
    expect(navigateMock).not.toHaveBeenCalled()
  })
})
