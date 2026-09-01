import { afterEach, describe, expect, it } from 'vitest'

import { AuthUser } from '../types'
import {
  AUTH_TOKEN_KEY,
  AUTH_USER_KEY,
  clearPersistedSession,
  readPersistedSession,
  writePersistedSession,
  writePersistedUser,
} from './authPersistence'

const user: AuthUser = {
  id: 'user-1',
  email: 'talent@example.com',
  userRole: 'talent',
}

const token = 'jwt-token'

afterEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

describe('authPersistence', () => {
  it('stores a remembered session in localStorage and clears sessionStorage', () => {
    sessionStorage.setItem(AUTH_TOKEN_KEY, 'stale')
    writePersistedSession(user, token, true)

    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBe(token)
    expect(JSON.parse(localStorage.getItem(AUTH_USER_KEY) || 'null')).toEqual(
      user,
    )
    expect(sessionStorage.getItem(AUTH_TOKEN_KEY)).toBeNull()
    expect(sessionStorage.getItem(AUTH_USER_KEY)).toBeNull()
  })

  it('stores a non-remembered session in sessionStorage and clears localStorage', () => {
    localStorage.setItem(AUTH_TOKEN_KEY, 'stale')
    writePersistedSession(user, token, false)

    expect(sessionStorage.getItem(AUTH_TOKEN_KEY)).toBe(token)
    expect(JSON.parse(sessionStorage.getItem(AUTH_USER_KEY) || 'null')).toEqual(
      user,
    )
    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull()
    expect(localStorage.getItem(AUTH_USER_KEY)).toBeNull()
  })

  it('never writes a password into either storage', () => {
    writePersistedSession(user, token, true)
    writePersistedSession(user, token, false)

    expect(JSON.stringify(localStorage)).not.toContain('password')
    expect(JSON.stringify(sessionStorage)).not.toContain('password')
  })

  it('prefers sessionStorage when hydrating after a refresh', () => {
    writePersistedSession(user, 'remembered', true)
    writePersistedSession(
      { ...user, email: 'tab@example.com' },
      'tab-token',
      false,
    )

    const persisted = readPersistedSession()
    expect(persisted.token).toBe('tab-token')
    expect(persisted.user?.email).toBe('tab@example.com')
  })

  it('falls back to a remembered localStorage session when sessionStorage is empty', () => {
    writePersistedSession(user, token, true)
    sessionStorage.clear()

    const persisted = readPersistedSession()
    expect(persisted.token).toBe(token)
    expect(persisted.user).toEqual(user)
  })

  it('updates the user in the active storage without moving the session', () => {
    writePersistedSession(user, token, false)
    writePersistedUser({ ...user, firstName: 'Ada' })

    expect(sessionStorage.getItem(AUTH_TOKEN_KEY)).toBe(token)
    expect(
      JSON.parse(sessionStorage.getItem(AUTH_USER_KEY) || 'null').firstName,
    ).toBe('Ada')
    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull()
  })

  it('clears both storages on logout / expired session', () => {
    writePersistedSession(user, token, true)
    writePersistedSession(user, 'other', false)
    // last write was session; leftover local should already be cleared, plant both:
    localStorage.setItem(AUTH_TOKEN_KEY, token)
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))

    clearPersistedSession()

    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull()
    expect(localStorage.getItem(AUTH_USER_KEY)).toBeNull()
    expect(sessionStorage.getItem(AUTH_TOKEN_KEY)).toBeNull()
    expect(sessionStorage.getItem(AUTH_USER_KEY)).toBeNull()
    expect(readPersistedSession()).toEqual({ user: null, token: null })
  })
})
