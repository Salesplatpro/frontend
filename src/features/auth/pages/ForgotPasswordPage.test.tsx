import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ForgotPasswordPage } from './ForgotPasswordPage'

const { submitForgotPasswordMock, flowState } = vi.hoisted(() => ({
  submitForgotPasswordMock: vi.fn(),
  flowState: { isRequesting: false },
}))

vi.mock('../hooks/useForgotPassword', () => ({
  useForgotPassword: () => ({
    submitForgotPassword: submitForgotPasswordMock,
    isRequesting: flowState.isRequesting,
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

const renderPage = () =>
  render(
    <MemoryRouter>
      <ForgotPasswordPage />
    </MemoryRouter>,
  )

describe('ForgotPasswordPage', () => {
  beforeEach(() => {
    submitForgotPasswordMock.mockReset()
    submitForgotPasswordMock.mockResolvedValue({ status: true })
    flowState.isRequesting = false
  })

  it('sends a reset request for a valid email and shows the success modal', async () => {
    renderPage()

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'talent@example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Send reset link' }))

    await waitFor(() =>
      expect(submitForgotPasswordMock).toHaveBeenCalledWith({
        email: 'talent@example.com',
      }),
    )
    expect(screen.getByText('Check your mailbox')).toBeTruthy()
    expect(
      screen.getByText(
        'A password reset email was sent. Check your mailbox for a link to continue.',
      ),
    ).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Close' })).toBeTruthy()
    expect(screen.getByTestId('close-button')).toBeTruthy()
  })

  it('rejects an invalid email format without calling the API', async () => {
    renderPage()

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'not-an-email' },
    })
    fireEvent.blur(screen.getByLabelText('Email'))
    fireEvent.click(screen.getByRole('button', { name: 'Send reset link' }))

    await waitFor(() =>
      expect(screen.getByText('Enter a valid email address')).toBeTruthy(),
    )
    expect(submitForgotPasswordMock).not.toHaveBeenCalled()
  })

  it('rejects an empty email without calling the API', async () => {
    renderPage()

    fireEvent.submit(
      screen.getByRole('button', { name: 'Send reset link' }).closest('form')!,
    )

    await waitFor(() =>
      expect(screen.getByText('Email is required')).toBeTruthy(),
    )
    expect(submitForgotPasswordMock).not.toHaveBeenCalled()
  })

  it('disables submit while a request is in flight', () => {
    flowState.isRequesting = true
    renderPage()

    const submit = screen.getByRole('button')
    expect(submit).toHaveProperty('disabled', true)
    fireEvent.submit(submit.closest('form')!)
    expect(submitForgotPasswordMock).not.toHaveBeenCalled()
  })

  it('shows an API error without claiming the email was sent', async () => {
    submitForgotPasswordMock.mockRejectedValue(
      new Error('Something went wrong.'),
    )
    renderPage()

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'talent@example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Send reset link' }))

    await waitFor(() =>
      expect(screen.getByText('Something went wrong.')).toBeTruthy(),
    )
    expect(screen.queryByText('Check your mailbox')).toBeNull()
  })
})
