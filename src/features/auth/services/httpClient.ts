import axios from 'axios'

import { baseUrl } from '@/utils/baseConfig'
import { notify } from '@/utils/toastNotifications'

import { useAuthStore } from '../store/useAuthStore'

export const httpClient = axios.create({ baseURL: baseUrl })

httpClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only treat this as a session expiry if the failing request carried
    // the CURRENT session's token. Comparing against the live store token
    // (not just checking that *a* header was present) matters because a
    // slow request can be sent with an old/expired token — from a stale
    // localStorage session or a page visited pre-login — and only resolve
    // after a fresh login has stored a brand-new token. That stale
    // response would otherwise still read as "had a token" and log the
    // user straight back out of the session they just established.
    const sentAuthHeader = error.config?.headers?.Authorization
    const currentToken = useAuthStore.getState().token
    const isCurrentSession =
      Boolean(currentToken) && sentAuthHeader === `Bearer ${currentToken}`
    if (error.response?.status === 401 && isCurrentSession) {
      useAuthStore.getState().logout()
      notify('error', 'Session expired. Please log in again.', {
        autoClose: 5000,
      })
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)
