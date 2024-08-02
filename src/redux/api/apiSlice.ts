import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { getToken } from '../../utils/authUtils'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://supportpro-backend.onrender.com/v1',
    prepareHeaders: (headers) => {
      const token = getToken()
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    talentReg: builder.mutation({
      query: (data) => ({
        url: `/auth/register`,
        method: 'POST',
        body: data,
      }),
    }),

    recruiterReg: builder.mutation({
      query: (data) => ({
        url: `/auth/register/recruiter`,
        method: 'POST',
        body: data,
      }),
    }),

    userLogin: builder.mutation({
      query: (data) => ({
        url: `/auth/login`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
})

export const {
  useTalentRegMutation,
  useRecruiterRegMutation,
  useUserLoginMutation,
} = api
