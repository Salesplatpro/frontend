import { createApi } from '@reduxjs/toolkit/query/react'

import { customBaseQuery } from '../../../utils/customBaseQuery'

export const recruiterApi = createApi({
  reducerPath: 'recruiterApi',
  baseQuery: customBaseQuery,
  tagTypes: ['Recruiter', 'RecruiterJob', 'ScoutJob', 'ScoutBatch'],
  endpoints: (builder) => ({
    jobPostCreation: builder.mutation({
      query: (data) => ({
        url: `/jobs`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'RecruiterJob', id: 'LIST' }],
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

    getAiConfig: builder.query({
      query: (aiConfigId: string) => ({
        url: `/ai-config/${aiConfigId}`,
        method: 'GET',
      }),
    }),

    patchAiConfig: builder.mutation({
      query: ({ aiConfigId, data }) => ({
        url: `/ai-config/${aiConfigId}`,
        method: 'PATCH',
        body: data,
      }),
    }),
    fetchRecruiterJobPost: builder.query({
      query: () => '/jobs/me?limit=10&offset=0',
      providesTags: (result) => {
        const jobs = Array.isArray(result?.data)
          ? result.data
          : Array.isArray(result?.data?.jobs)
          ? result.data.jobs
          : []
        return [
          ...jobs.map((job: { id: string }) => ({
            type: 'RecruiterJob' as const,
            id: job.id,
          })),
          { type: 'RecruiterJob' as const, id: 'LIST' },
        ]
      },
    }),
    genJpPersonality: builder.mutation({
      query: (data) => ({
        url: `/questions/personality`,
        method: 'POST',
        body: data,
      }),
    }),
    deletePersonalityQuestion: builder.mutation({
      query: (questionId: string) => ({
        url: `/questions/${questionId}`,
        method: 'DELETE',
      }),
    }),
    createJD: builder.mutation({
      query: (data) => ({
        url: `/scout/jobs`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'ScoutJob', id: 'LIST' }],
    }),
    searchTalentDb: builder.query({
      query: (data) => {
        const { role, experienceLevel, location, scoutJobId, limit, offset } =
          data

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
        if (limit) queryParams.append('limit', String(limit))
        if (offset) queryParams.append('offset', String(offset))

        return {
          url: `/scout/${scoutJobId}/talents?${queryParams.toString()}`,
          method: 'GET',
        }
      },
    }),
    uploadScoutCvBatch: builder.mutation({
      query: (data) => ({
        url: `/scout/cv-batch`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_result, _error, data: FormData) => [
        { type: 'ScoutBatch', id: String(data.get('scoutJobId')) },
      ],
    }),
    getCampaignName: builder.query({
      query: ({ id }) => ({
        url: `/scout/jobs/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, { id }) => [{ type: 'ScoutJob', id }],
    }),
    getScoutJobs: builder.query({
      query: ({
        limit = 20,
        offset = 0,
      }: { limit?: number; offset?: number } = {}) => ({
        url: `/scout/jobs?limit=${limit}&offset=${offset}`,
        method: 'GET',
      }),
      providesTags: (result) => {
        const scoutJobs = Array.isArray(result?.data?.scoutJobs)
          ? result.data.scoutJobs
          : []
        return [
          ...scoutJobs.map((job: { id: string }) => ({
            type: 'ScoutJob' as const,
            id: job.id,
          })),
          { type: 'ScoutJob' as const, id: 'LIST' },
        ]
      },
    }),
    getScoutJobScouts: builder.query({
      query: ({
        scoutJobId,
        limit = 20,
        offset = 0,
      }: {
        scoutJobId: string
        limit?: number
        offset?: number
      }) => ({
        url: `/scout/jobs/${scoutJobId}/scouts?limit=${limit}&offset=${offset}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, { scoutJobId }) => [
        { type: 'ScoutBatch', id: scoutJobId },
      ],
    }),
    getRecruiterShortlist: builder.query({
      query: () => `recruiter/shortlist/`,
    }),
    updateJob: builder.mutation({
      query: ({ jobId, data }) => ({
        url: `/jobs/${jobId}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { jobId }) => [
        { type: 'RecruiterJob', id: jobId },
        { type: 'RecruiterJob', id: 'LIST' },
      ],
    }),
    deleteJob: builder.mutation({
      query: (jobId: string) => ({
        url: `/jobs/${jobId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, jobId) => [
        { type: 'RecruiterJob', id: jobId },
        { type: 'RecruiterJob', id: 'LIST' },
      ],
    }),
    fetchPersonalityQuestions: builder.query({
      query: (jobId: string) => ({
        url: `/questions?questionType=personality&jobId=${jobId}`,
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
  useGenJpPersonalityMutation,
  useDeletePersonalityQuestionMutation,
  useCreateJDMutation,
  useSearchTalentDbQuery,
  useUploadScoutCvBatchMutation,
  useGetCampaignNameQuery,
  useGetScoutJobsQuery,
  useGetScoutJobScoutsQuery,
  useGetRecruiterShortlistQuery,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useFetchPersonalityQuestionsQuery,
  useGetAiConfigQuery,
} = recruiterApi
