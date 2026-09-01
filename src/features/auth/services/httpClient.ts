import axios from 'axios'

import { baseUrl } from '@/utils/baseConfig'
import { notify } from '@/utils/toastNotifications'

import { useAuthStore } from '../store/useAuthStore'

const UNAUTHENTICATED_AUTH_PATHS = [
  '/auth/login',
  '/auth/register',
  '/auth/register/recruiter',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/validate-reset-token',
  '/auth/verify-email',
]

const isUnauthenticatedAuthRequest = (url = ''): boolean => {
  const path = url.split('?')[0]
  return UNAUTHENTICATED_AUTH_PATHS.some(
    (candidate) => path === candidate || path.endsWith(candidate),
  )
}

export const httpClient = axios.create({ baseURL: baseUrl })

httpClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token && !isUnauthenticatedAuthRequest(config.url)) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const sentAuthHeader = error.config?.headers?.Authorization
    const currentToken = useAuthStore.getState().token
    const isCurrentSession =
      Boolean(currentToken) && sentAuthHeader === `Bearer ${currentToken}`
    if (error.response?.status === 401 && isCurrentSession) {
      useAuthStore.getState().logout()
      notify('error', 'Session expired. Please log in again.', {
        autoClose: 2000,
      })
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)
