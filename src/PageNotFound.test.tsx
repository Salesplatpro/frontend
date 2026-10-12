import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { AuthUser } from '@/features/auth/types'

import PageNotFound from './PageNotFound'

const { navigateMock } = vi.hoisted(() => ({ navigateMock: vi.fn() }))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom',
  )
  return { ...actual, useNavigate: () => navigateMock }
})

const renderPage = () => render(<PageNotFound />, { wrapper: MemoryRouter })

const signIn = (userRole: string) =>
  useAuthStore.setState({
    isLoggedIn: true,
    token: 'token',
    user: { userRole } as unknown as AuthUser,
  })

describe('PageNotFound', () => {
  beforeEach(() => {
    navigateMock.mockClear()
    useAuthStore.setState({ isLoggedIn: false, token: null, user: null })
  })

  it('explains the page is missing', () => {
    renderPage()

    expect(screen.getByText('404')).toBeTruthy()
    expect(
      screen.getByRole('heading', { level: 1, name: 'Page not found' }),
    ).toBeTruthy()
  })

  it('sends a signed-out visitor back to the home page', () => {
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: 'Back to home' }))

    expect(navigateMock).toHaveBeenCalledWith('/')
  })

  it('sends an admin back to the admin overview', () => {
    signIn('admin')
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: 'Back to dashboard' }))

    expect(navigateMock).toHaveBeenCalledWith('/adminDashboard')
  })

  it('sends a recruiter back to the recruiter dashboard', () => {
    signIn('recruiter')
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: 'Back to dashboard' }))

    expect(navigateMock).toHaveBeenCalledWith('/recruiterDashboard/dashboard')
  })

  it('goes back in history', () => {
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: /go back/i }))

    expect(navigateMock).toHaveBeenCalledWith(-1)
  })
})
