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
