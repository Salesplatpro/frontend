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
    fetchDashboard: builder.query({
      query: ({ jobId }: { jobId?: string }) => {
        const baseUrl = '/recruiter/dashboard'
        const url = jobId ? `${baseUrl}?jobId=${jobId}` : baseUrl
        return {
          url,
          method: 'GET',
        }
      },
    }),
    fetchAllApplications: builder.query({
      query: () => ({
        url: `/recruiter/applications`,
        method: 'GET',
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
        const state = location?.state?.name || ''
        const city = location?.city?.name || ''

        const queryParams = new URLSearchParams()

        if (roleId) queryParams.append('roleId', roleId)
        if (experience) queryParams.append('experience', experience)
        if (country) queryParams.append('country', country)
        if (state) queryParams.append('state', state)
        if (city) queryParams.append('city', city)

        return {
          url: `/scout/${scoutJobId}/talents?${queryParams.toString()}`,
          method: 'GET',
        }
      },
    }),
    uploadCVOnly: builder.mutation({
      query: (data) => ({
        url: `/scout/cv`,
        method: 'POST',
        body: data,
      }),
    }),
    uploadCvAndCoverLetter: builder.mutation({
      query: (data) => ({
        url: `scout/cv-and-cover-letter`,
        method: 'POST',
        body: data,
      }),
    }),
    getCampaignName: builder.query({
      query: ({ id }) => ({
        url: `/scout/jobs/${id}`,
        method: 'GET',
      }),
    }),
    getRecruiterShortlist: builder.query({
      query: () => `recruiter/shortlist/`,
    }),
    patchApplicationStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/applications/${id}/status`,
        method: 'PATCH',
        body: status,
      }),
    }),
    sendTalentMessage: builder.mutation({
      query: ({ data }) => ({
        url: '/messages',
        method: 'POST',
        body: data,
      }),
    }),
    getMessagesSentToTalent: builder.query({
      query: ({ applicationId }) => ({
        url: `messages?application=${applicationId}`,
        method: 'GET',
      }),
    }),
  }),
})

export const {
  useJobPostCreationMutation,
  useFetchDashboardQuery,
  useFetchAllApplicationsQuery,
  useAiConfigMutation,
  usePatchAiConfigMutation,
  useFetchRecruiterJobPostQuery,
  useFetchRecruiterJobPostDetailsQuery,
  useGenJpPersonalityMutation,
  useFetchApplicantProgressQuery,
  useCvAndCoverLetterMutation,
  useCreateJDMutation,
  useSearchTalentDbQuery,
  useUploadCVOnlyMutation,
  useUploadCvAndCoverLetterMutation,
  useGetCampaignNameQuery,
  useGetRecruiterShortlistQuery,
  usePatchApplicationStatusMutation,
  useSendTalentMessageMutation,
  useGetMessagesSentToTalentQuery,
} = recruiterApi
