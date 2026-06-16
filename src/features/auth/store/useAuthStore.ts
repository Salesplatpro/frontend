import { create } from 'zustand'

import { AuthResponseData, AuthUser } from '../types'

type AuthState = {
  user: AuthUser | null
  token: string | null
  isLoggedIn: boolean
  isSubmitting: boolean
  error: string | null
  setSubmitting: (isSubmitting: boolean) => void
  setError: (error: string | null) => void
  setSession: (data: AuthResponseData) => void
  setUser: (user: AuthUser) => void
  logout: () => void
}

const persistedUser: AuthUser | null = JSON.parse(
  localStorage.getItem('user') || 'null',
)
const persistedToken = localStorage.getItem('token')

export const useAuthStore = create<AuthState>()((set) => ({
  user: persistedUser,
  token: persistedToken,
  isLoggedIn: !!persistedToken,
  isSubmitting: false,
  error: null,
  setSubmitting: (isSubmitting) => set({ isSubmitting }),
  setError: (error) => set({ error }),
  setSession: ({ user, token }) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    set({ user, token, isLoggedIn: true, error: null })
  },
  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user))
    set({ user, isLoggedIn: true })
  },
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ user: null, token: null, isLoggedIn: false, error: null })

    void Promise.all([
      import('@/redux/store/store'),
      import('@/redux/api/talent'),
      import('@/redux/api/recruiter'),
      import('@/features/profile/store/useProfileStore'),
    ]).then(
      ([{ store }, { talentApi }, { recruiterApi }, { useProfileStore }]) => {
        store.dispatch(talentApi.util.resetApiState())
        store.dispatch(recruiterApi.util.resetApiState())
        useProfileStore.getState().clearProfile()
      },
    )
  },
}))
