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

  // Only treat this as a session expiry if the failing request carried the
  // CURRENT session's token. Comparing against the live store token (not
  // just checking that *a* token was sent) matters because a slow request
  // can be sent with an old/expired token — from a stale localStorage
  // session or a page visited pre-login — and only resolve after a fresh
  // login has stored a brand-new token. That stale response would
  // otherwise still read as "had a token" and log the user straight back
  // out of the session they just established.
  const currentToken = useAuthStore.getState().token
  if (result.error?.status === 401 && token && token === currentToken) {
    useAuthStore.getState().logout()

    notify('error', 'Session expired. Please log in again.', {
      autoClose: 5000,
    })

    window.location.href = '/login'
  }

  return result
}
