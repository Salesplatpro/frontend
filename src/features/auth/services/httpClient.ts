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
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      notify('error', 'Session expired. Please log in again.', {
        autoClose: 5000,
      })
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)
