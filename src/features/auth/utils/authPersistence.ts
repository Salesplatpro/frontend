import { AuthUser } from '../types'

export const AUTH_TOKEN_KEY = 'token'
export const AUTH_USER_KEY = 'user'

export type PersistMode = 'local' | 'session'

let activeMode: PersistMode = 'local'

const storageFor = (mode: PersistMode): Storage =>
  mode === 'session' ? sessionStorage : localStorage

const otherStorage = (mode: PersistMode): Storage =>
  mode === 'session' ? localStorage : sessionStorage

const parseUser = (raw: string | null): AuthUser | null => {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as unknown
    if (parsed && typeof parsed === 'object') return parsed as AuthUser
    return null
  } catch {
    return null
  }
}

export const getActivePersistMode = (): PersistMode => activeMode

export const readPersistedSession = (): {
  user: AuthUser | null
  token: string | null
} => {
  const sessionToken = sessionStorage.getItem(AUTH_TOKEN_KEY)
  if (sessionToken) {
    activeMode = 'session'
    return {
      token: sessionToken,
      user: parseUser(sessionStorage.getItem(AUTH_USER_KEY)),
    }
  }

  const localToken = localStorage.getItem(AUTH_TOKEN_KEY)
  if (localToken) {
    activeMode = 'local'
    return {
      token: localToken,
      user: parseUser(localStorage.getItem(AUTH_USER_KEY)),
    }
  }

  return { user: null, token: null }
}

export const writePersistedSession = (
  user: AuthUser,
  token: string,
  persist?: boolean,
): void => {
  const mode: PersistMode =
    persist === false ? 'session' : persist === true ? 'local' : activeMode
  activeMode = mode

  const target = storageFor(mode)
  const unused = otherStorage(mode)
  unused.removeItem(AUTH_TOKEN_KEY)
  unused.removeItem(AUTH_USER_KEY)
  target.setItem(AUTH_TOKEN_KEY, token)
  target.setItem(AUTH_USER_KEY, JSON.stringify(user))
}

export const writePersistedUser = (user: AuthUser): void => {
  storageFor(activeMode).setItem(AUTH_USER_KEY, JSON.stringify(user))
}

export const clearPersistedSession = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(AUTH_USER_KEY)
  sessionStorage.removeItem(AUTH_TOKEN_KEY)
  sessionStorage.removeItem(AUTH_USER_KEY)
}
