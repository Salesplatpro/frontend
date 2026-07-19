import { createApi } from '@reduxjs/toolkit/query/react'

import { customBaseQuery } from '../../../utils/customBaseQuery'

export const talentApi = createApi({
  reducerPath: 'talentApi',
  baseQuery: customBaseQuery,
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
    fetchJob: builder.query({
      query: (roleId?: string) => {
        let url = `/jobs?limit=10&offset=0`
        if (roleId) url += `&roleId=${roleId}`
        return { url, method: 'GET' }
      },
    }),
    filterJob: builder.query({
      query: ({ roleId, experienceLevel, workMode, city, state, country }) => {
        let url = `/jobs?limit=10&offset=0`

        if (roleId) url += `&roleId=${roleId}`
        if (experienceLevel) url += `&experienceLevel=${experienceLevel}`
        if (workMode) url += `&workMode=${workMode}`
        if (city) url += `&city=${city}`
        if (state) url += `&state=${state}`
        if (country) url += `&country=${country}`

        return {
          url,
          method: 'GET',
        }
      },
    }),
    individualJob: builder.query({
      query: (jobId) => ({
        url: `/jobs/${jobId}`,
        method: 'GET',
      }),
    }),
    jobPipeline: builder.query({
      query: (jobId) => ({
        url: `/jobs/applications/${jobId}`,
        method: 'PATCH',
      }),
    }),
    cvMatch: builder.query({
      query: (jobId) => ({
        url: `/jobs/cv-similarity/${jobId}`,
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
        url: `/questions?limit=20&offset=0&jobId=${jobId}&questionType=personality`,
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
    }),
    getRole: builder.query({
      query: () => ({
        url: `/roles?limit=1000`,
        method: 'GET',
      }),
    }),
    getMessages: builder.query({
      query: () => ({
        url: `/messages`,
        method: 'GET',
      }),
    }),
    patchMessage: builder.mutation({
      query: ({ messageId, body }) => ({
        url: `/messages/${messageId}`,
        method: 'PATCH',
        body,
      }),
    }),
    getNotifications: builder.query({
      query: () => ({
        url: `/notifications`,
        method: 'GET',
      }),
    }),
  }),
})

export const {
  useFetchPretestQuery,
  usePostPretestMutation,
  useFetchJobQuery,
  useFilterJobQuery,
  useIndividualJobQuery,
  useJobPipelineQuery,
  useLazyCvMatchQuery,
  useGeneratePersonalizedTestQuery,
  usePostPersonalizedTestMutation,
  usePersonalityTestQuery,
  usePostPersonalityTestMutation,
  useAllJobApplicationsQuery,
  useGetRoleQuery,
  useGetMessagesQuery,
  usePatchMessageMutation,
} = talentApi
