import { afterEach, describe, expect, it } from 'vitest'

import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from '../utils/authPersistence'
import { useAuthStore } from './useAuthStore'

const user = {
  id: 'user-1',
  email: 'talent@example.com',
  userRole: 'talent' as const,
}

afterEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  useAuthStore.setState({
    user: null,
    token: null,
    isLoggedIn: false,
    isSubmitting: false,
    error: null,
  })
})

describe('useAuthStore session persistence', () => {
  it('persists a remembered login to localStorage', () => {
    useAuthStore
      .getState()
      .setSession({ user, token: 'jwt' }, { persist: true })

    expect(useAuthStore.getState().isLoggedIn).toBe(true)
    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBe('jwt')
    expect(sessionStorage.getItem(AUTH_TOKEN_KEY)).toBeNull()
    expect(
      JSON.parse(localStorage.getItem(AUTH_USER_KEY) || 'null').email,
    ).toBe(user.email)
  })

  it('keeps a non-remembered login in sessionStorage', () => {
    useAuthStore
      .getState()
      .setSession({ user, token: 'jwt' }, { persist: false })

    expect(useAuthStore.getState().isLoggedIn).toBe(true)
    expect(sessionStorage.getItem(AUTH_TOKEN_KEY)).toBe('jwt')
    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull()
  })

  it('does not persist a session when login never succeeds', () => {
    useAuthStore.getState().setError('Invalid email or password')

    expect(useAuthStore.getState().isLoggedIn).toBe(false)
    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull()
    expect(sessionStorage.getItem(AUTH_TOKEN_KEY)).toBeNull()
  })
})
