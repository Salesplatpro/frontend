import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'

import { getToken } from './authUtils'
import { baseUrl } from './baseConfig'
import { notify } from './toastNotifications'

export const customBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const token = getToken()
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    },
  })

  const result = await baseQuery(args, api, extraOptions)

  if (result.error?.status === 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    notify('error', 'Session expired. Please log in again.', {
      autoClose: 5000,
    })
    window.location.href = '/login'
  }

  return result
}
