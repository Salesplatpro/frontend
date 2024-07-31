import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getToken } from '../../../utils/authUtils'
import { url } from 'inspector'

export const talentApi = createApi({
  reducerPath: 'talentApi',
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
  tagTypes: ['Talent'],
  endpoints: (builder) => ({
    talentCreation: builder.mutation({
      query: (data) => ({
        url: `/user/profile`,
        method: 'POST',
        body: data,
      }),
    }),
    uploadCv: builder.mutation({
      query: (formData) => ({
        url: `/uploads`,
        method: 'POST',
        body: formData,
      }),
    }),
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
      query: (roleId) => ({
        url: `/jobs?roleId=${roleId}&limit=10&offset=0`,
        method: 'GET',
      }),
    }),
    filterJob: builder.query({
      query: ({ roleId, experienceLevel, remote, city, state, country }) => {
        let url = `/jobs?limit=10&offset=0`

        if (roleId) url += `&roleId=${roleId}`
        if (experienceLevel) url += `&experienceLevel=${experienceLevel}`
        if (remote) url += `&remote=${remote}`
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
    allJobApplications: builder.query({
      query: () => ({
        url: `/user/applications`,
        method: 'GET',
      }),
    }),
  }),
})

export const {
  useTalentCreationMutation,
  useUploadCvMutation,
  useFetchPretestQuery,
  usePostPretestMutation,
  useFetchJobQuery,
  useFilterJobQuery,
  useIndividualJobQuery,
  useJobPipelineQuery,
  useCvMatchQuery,
  useLazyPersonalizedTestQuery,
  useLazyGeneratePersonalizedTestQuery,
  usePostPersonalizedTestMutation,
  useLazyPersonalityTestQuery,
  useAllJobApplicationsQuery,
} = talentApi
