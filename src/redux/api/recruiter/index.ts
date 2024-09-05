import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { getToken } from '../../../utils'

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
    fetchRecruiterJobPost: builder.query({
      query: () => '/jobs/me?limit=10&offset=0',
    }),
    fetchRecruiterJobPostDetails: builder.query({
      query: (jobId: string) => `/jobs/applications/${jobId}`,
    }),
    genJpPersonality: builder.mutation({
      query: (data) => ({
        url: `/questions/personality`,
        method: 'POST',
        body: data,
      }),
    }),
    fetchApplicantProgress: builder.query({
      query: (applicantId: string) => `applications/${applicantId}`,
    }),

    cvAndCoverLetter: builder.mutation({
      query: (data) => ({
        url: `/cv-batching/cv-and-cover-letter`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
})

export const {
  useJobPostCreationMutation,
  useAiConfigMutation,
  usePatchAiConfigMutation,
  useFetchRecruiterJobPostQuery,
  useFetchRecruiterJobPostDetailsQuery,
  useGenJpPersonalityMutation,
  useFetchApplicantProgressQuery,
  useCvAndCoverLetterMutation,
} = recruiterApi
