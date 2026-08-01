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
      import('@/redux/api/apiSlice'),
      import('@/redux/api/talent'),
      import('@/redux/api/recruiter'),
      import('@/redux/features/filesSlice/fileSlice'),
      import('@/features/profile/store/useProfileStore'),
      import('@/features/admin/store/useCandidatesStore'),
      import('@/features/admin/store/useRolesStore'),
      import('@/features/jobs/store/useJobDraftStore'),
      import('@/features/jobs/store/useJobEditDraftStore'),
      import('@/features/jobs/store/useAiConfigDraftStore'),
      import('@/features/pre-assessment/store'),
      import('@/features/pre-assessment/lockStore'),
    ])
      .then(
        ([
          { store },
          { api },
          { talentApi },
          { recruiterApi },
          { clearScoutUploads },
          { useProfileStore },
          { useCandidatesStore },
          { useRolesStore },
          { useJobDraftStore },
          { useJobEditDraftStore },
          { useAiConfigDraftStore },
          { usePreAssessmentStore },
          { useAssessmentLockStore },
        ]) => {
          store.dispatch(api.util.resetApiState())
          store.dispatch(talentApi.util.resetApiState())
          store.dispatch(recruiterApi.util.resetApiState())
          store.dispatch(clearScoutUploads())
          useProfileStore.getState().clearProfile()
          useCandidatesStore.getState().reset()
          useRolesStore.getState().reset()
          useJobDraftStore.getState().clearDraft()
          useJobEditDraftStore.getState().clearAllDrafts()
          useAiConfigDraftStore.getState().clearAllDrafts()
          usePreAssessmentStore.getState().reset()
          useAssessmentLockStore.getState().unlock()
        },
      )
      .finally(() => {
        // A full reload guarantees no stale in-memory state survives into the
        // next session, matching the 401-interceptor's existing behavior — the
        // explicit resets above are defense-in-depth for anything read
        // synchronously before the reload completes.
        window.location.href = '/login'
      })
  },
}))
