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
    // Only treat this as a session expiry if the failing request actually
    // carried a token. Requests fired from public pages while logged out
    // (no Authorization header) 401 as a matter of course — forcing a
    // logout for those would wipe out a session established by a login
    // that completed *after* one of those requests was sent but before it
    // resolved (e.g. a slow request from a page visited pre-login).
    const hadToken = Boolean(error.config?.headers?.Authorization)
    if (error.response?.status === 401 && hadToken) {
      useAuthStore.getState().logout()
      notify('error', 'Session expired. Please log in again.', {
        autoClose: 5000,
      })
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)
