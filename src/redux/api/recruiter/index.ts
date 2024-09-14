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
    createJD: builder.mutation({
      query: (data) => ({
        url: `/scout/jobs`,
        method: 'POST',
        body: data,
      }),
    }),
    searchTalentDb: builder.query({
      query: (data) => {
        const { role, experienceLevel, location, scoutJobId } = data

        const roleId = role || ''
        const experience = experienceLevel || ''
        const country = location?.country?.name || ''

        return {
          url: `/scout/${scoutJobId}/talents?roleId=${roleId}&experience=${experience}&location=${encodeURIComponent(
            country,
          )}&remote=true`,
          method: 'GET',
        }
      },
    }),
    fetchTalentProfile: builder.query({
      query: ({ id }) => ({
        url: `/user/profile/${id}`,
        method: 'GET',
      }),
    }),
    uploadCVOnly: builder.mutation({
      query: (data) => ({
        url: `/scout/cv`,
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
  useCreateJDMutation,
  useSearchTalentDbQuery,
  useFetchTalentProfileQuery,
  useUploadCVOnlyMutation,
} = recruiterApi
