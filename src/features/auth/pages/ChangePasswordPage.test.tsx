import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ChangePasswordPage } from './ChangePasswordPage'

const { submitChangePasswordMock, flowState } = vi.hoisted(() => ({
  submitChangePasswordMock: vi.fn(),
  flowState: { isChanging: false },
}))

vi.mock('../hooks/useChangePassword', () => ({
  useChangePassword: () => ({
    submitChangePassword: submitChangePasswordMock,
    isChanging: flowState.isChanging,
  }),
}))

const renderPage = () =>
  render(
    <MemoryRouter>
      <ChangePasswordPage />
    </MemoryRouter>,
  )

const fillForm = ({
  current = 'OldPassword1!',
  next = 'NewPassword1!',
  confirm = 'NewPassword1!',
}: {
  current?: string
  next?: string
  confirm?: string
} = {}) => {
  fireEvent.change(screen.getByLabelText('Current password'), {
    target: { value: current },
  })
  fireEvent.change(screen.getByLabelText('New password'), {
    target: { value: next },
  })
  fireEvent.change(screen.getByLabelText('Confirm password'), {
    target: { value: confirm },
  })
}

describe('ChangePasswordPage', () => {
  beforeEach(() => {
    submitChangePasswordMock.mockReset()
    submitChangePasswordMock.mockResolvedValue({ status: true })
    flowState.isChanging = false
  })

  it('submits current and new passwords and clears the form', async () => {
    renderPage()

    fillForm()
    fireEvent.submit(
      screen.getByRole('button', { name: 'Change password' }).closest('form')!,
    )

    await waitFor(() =>
      expect(submitChangePasswordMock).toHaveBeenCalledWith({
        oldPassword: 'OldPassword1!',
        newPassword: 'NewPassword1!',
      }),
    )
    expect(
      (screen.getByLabelText('Current password') as HTMLInputElement).value,
    ).toBe('')
    expect(
      (screen.getByLabelText('New password') as HTMLInputElement).value,
    ).toBe('')
  })

  it('blocks submit when passwords do not match', async () => {
    renderPage()

    fillForm({ confirm: 'Mismatch1!' })
    fireEvent.blur(screen.getByLabelText('Confirm password'))
    fireEvent.click(screen.getByRole('button', { name: 'Change password' }))

    await waitFor(() =>
      expect(screen.getByText('Passwords must match')).toBeTruthy(),
    )
    expect(submitChangePasswordMock).not.toHaveBeenCalled()
  })

  it('blocks submit when the new password matches the current password', async () => {
    renderPage()

    fillForm({
      current: 'SamePassword1!',
      next: 'SamePassword1!',
      confirm: 'SamePassword1!',
    })
    fireEvent.blur(screen.getByLabelText('New password'))
    fireEvent.click(screen.getByRole('button', { name: 'Change password' }))

    await waitFor(() =>
      expect(
        screen.getByText(
          'New password must be different from current password',
        ),
      ).toBeTruthy(),
    )
    expect(submitChangePasswordMock).not.toHaveBeenCalled()
  })

  it('shows an API error when the change fails', async () => {
    submitChangePasswordMock.mockRejectedValue(
      new Error('Failed to change password. Please try again.'),
    )
    renderPage()

    fillForm()
    fireEvent.submit(
      screen.getByRole('button', { name: 'Change password' }).closest('form')!,
    )

    await waitFor(() =>
      expect(
        screen.getByText('Failed to change password. Please try again.'),
      ).toBeTruthy(),
    )
  })
})
