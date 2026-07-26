import { createApi } from '@reduxjs/toolkit/query/react'

import { customBaseQuery } from '../../../utils/customBaseQuery'

export const talentApi = createApi({
  reducerPath: 'talentApi',
  baseQuery: customBaseQuery,
  tagTypes: ['Applications', 'Jobs'],
  endpoints: (builder) => ({
    fetchPretest: builder.query({
      query: (roleId) => ({
        url: `/questions?limit=20&offset=0&questionType=prescreening&roleId=${roleId}`,
        method: 'GET',
      }),
    }),
    postPretest: builder.mutation({
      query: (testAnswer) => ({
        url: `/questions/answer/prescreening`,
        method: 'POST',
        body: testAnswer,
      }),
    }),
    fetchJobs: builder.query({
      query: (params?: {
        roleId?: string
        experienceLevel?: string
        workMode?: string
        city?: string
        state?: string
        country?: string
        offset?: number
      }) => {
        const query = new URLSearchParams({
          limit: '10',
          offset: String(params?.offset ?? 0),
        })

        if (params?.roleId) query.set('roleId', params.roleId)
        if (params?.experienceLevel)
          query.set('experienceLevel', params.experienceLevel)
        if (params?.workMode) query.set('workMode', params.workMode)
        if (params?.city) query.set('city', params.city)
        if (params?.state) query.set('state', params.state)
        if (params?.country) query.set('country', params.country)

        return { url: `/jobs?${query.toString()}`, method: 'GET' }
      },
      providesTags: ['Jobs'],
    }),
    individualJob: builder.query({
      query: (jobId) => ({
        url: `/jobs/${jobId}`,
        method: 'GET',
      }),
      providesTags: ['Jobs'],
    }),
    applyToJob: builder.mutation({
      query: (jobId: string) => ({
        url: `/jobs/applications/${jobId}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Applications', 'Jobs'],
    }),
    jobApplication: builder.query({
      query: (applicationId) => ({
        url: `/applications/${applicationId}`,
        method: 'GET',
      }),
      providesTags: ['Applications'],
    }),
    cvMatch: builder.query({
      query: (jobId) => ({
        url: `/jobs/cv-similarity/${jobId}`,
        method: 'PATCH',
      }),
    }),
    checkPrescreeningStage: builder.query({
      query: (jobId) => ({
        url: `/jobs/prescreening-check/${jobId}`,
        method: 'PATCH',
      }),
    }),
    generatePersonalizedTest: builder.query({
      query: ({ jobId, talentId }) => ({
        url: `/questions/personalized`,
        method: 'POST',
        body: { jobId, talentId },
      }),
    }),
    postPersonalizedTest: builder.mutation({
      query: (testAnswer) => ({
        url: `/questions/answer/personalized`,
        method: 'POST',
        body: testAnswer,
      }),
    }),
    personalizedTest: builder.query({
      query: ({ jobId, talentId }) => ({
        url: `/questions?limit=20&offset=0&questionType=personalized&jobId=${jobId}&talentId=${talentId}`,
        method: 'GET',
      }),
    }),
    personalityTest: builder.query({
      query: (jobId) => ({
        // No fixed cap on the recruiter-configured question count per
        // dichotomy pair, so this must fetch well above any realistic total.
        url: `/questions?limit=200&offset=0&jobId=${jobId}&questionType=personality`,
        method: 'GET',
      }),
    }),
    postPersonalityTest: builder.mutation({
      query: (testAnswer) => ({
        url: `/questions/answer/personality`,
        method: 'POST',
        body: testAnswer,
      }),
    }),
    allJobApplications: builder.query({
      query: () => ({
        url: `/user/applications`,
        method: 'GET',
      }),
      providesTags: ['Applications'],
    }),
    getRole: builder.query({
      query: () => ({
        url: `/roles?limit=1000`,
        method: 'GET',
      }),
    }),
  }),
})

export const {
  useFetchPretestQuery,
  usePostPretestMutation,
  useFetchJobsQuery,
  useIndividualJobQuery,
  useApplyToJobMutation,
  useJobApplicationQuery,
  useLazyCvMatchQuery,
  useLazyCheckPrescreeningStageQuery,
  useGeneratePersonalizedTestQuery,
  usePostPersonalizedTestMutation,
  usePersonalityTestQuery,
  usePostPersonalityTestMutation,
  useAllJobApplicationsQuery,
  useGetRoleQuery,
} = talentApi
