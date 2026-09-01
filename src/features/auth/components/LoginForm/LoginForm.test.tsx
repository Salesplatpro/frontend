import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { LoginForm } from './LoginForm'

const { submitLoginMock } = vi.hoisted(() => ({
  submitLoginMock: vi.fn(),
}))

vi.mock('../../hooks/useLogin', () => ({
  useLogin: () => ({
    submitLogin: submitLoginMock,
    isLoading: false,
  }),
}))

const renderForm = () =>
  render(
    <MemoryRouter>
      <LoginForm />
    </MemoryRouter>,
  )

describe('LoginForm', () => {
  beforeEach(() => {
    submitLoginMock.mockReset()
    submitLoginMock.mockResolvedValue(undefined)
  })

  it('submits with remember=true when Remember me is checked', async () => {
    renderForm()

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'talent@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'Password1!' },
    })
    fireEvent.click(screen.getByLabelText('Remember me'))
    fireEvent.click(screen.getByRole('button', { name: 'Log in' }))

    await waitFor(() =>
      expect(submitLoginMock).toHaveBeenCalledWith({
        email: 'talent@example.com',
        password: 'Password1!',
        remember: true,
      }),
    )
  })

  it('submits with remember=false by default', async () => {
    renderForm()

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'talent@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'Password1!' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Log in' }))

    await waitFor(() =>
      expect(submitLoginMock).toHaveBeenCalledWith({
        email: 'talent@example.com',
        password: 'Password1!',
        remember: false,
      }),
    )
  })

  it('links Forgot password to the forgot-password page', () => {
    renderForm()

    expect(
      screen
        .getByRole('link', { name: 'Forgot password?' })
        .getAttribute('href'),
    ).toBe('/forgot-password')
  })

  it('does not submit when email is empty', async () => {
    renderForm()

    fireEvent.click(screen.getByRole('button', { name: 'Log in' }))

    await waitFor(() =>
      expect(screen.getByText('Email is required')).toBeTruthy(),
    )
    expect(submitLoginMock).not.toHaveBeenCalled()
  })
})
