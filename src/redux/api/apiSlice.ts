import { createApi } from '@reduxjs/toolkit/query/react'

import { customBaseQuery } from '../../utils/customBaseQuery'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: customBaseQuery,
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
