import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'

import { useAuthStore } from '@/features/auth/store/useAuthStore'

import { getToken } from './authUtils'
import { baseUrl } from './baseConfig'
import { notify } from './toastNotifications'

export const customBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const token = getToken()
  const baseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    },
  })

  const result = await baseQuery(args, api, extraOptions)

  // Only treat this as a session expiry if the failing request actually
  // carried a token. Requests fired from public routes while logged out
  // 401 as a matter of course — forcing a logout for those would wipe out
  // a session established by a login that completed *after* one of those
  // requests was sent but before it resolved.
  if (result.error?.status === 401 && token) {
    useAuthStore.getState().logout()

    notify('error', 'Session expired. Please log in again.', {
      autoClose: 5000,
    })

    window.location.href = '/login'
  }

  return result
}
