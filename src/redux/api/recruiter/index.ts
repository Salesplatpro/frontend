import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getToken } from '../../../utils/authUtils'
import { url } from 'inspector'

export const recruiterApi = createApi({
  reducerPath: 'recruiterApi',
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
  tagTypes: ['Recruiter'],
  endpoints: (builder) => ({
    jobPostCreation: builder.mutation({
      query: (data) => ({
        url: `/jobs`,
        method: 'POST',
        body: data,
      }),
    }),
    aiConfig: builder.mutation({
      query: (data) => ({
        url: `/ai-config`,
        method: 'POST',
        body: data,
      }),
    }),
    patchAiConfig: builder.mutation({
      query: ({ jobId, data }) => ({
        url: `/jobs/${jobId}`,
        method: 'PATCH',
        body: data,
      }),
    }),
  }),
})

export const {
  useJobPostCreationMutation,
  useAiConfigMutation,
  usePatchAiConfigMutation,
} = recruiterApi
