import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { getToken } from '../../../utils/authUtils'
import { baseUrl } from '../../../utils/baseConfig'

export const talentApi = createApi({
  reducerPath: 'talentApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
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
    // fetch profile data
    fetchProfile: builder.query({
      query: () => ({
        url: `/user/me`,
        method: 'GET',
      }),
      providesTags: ['Talent'],
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: '/user/profile', // Assumes that the base URL is set up correctly in your API service
        method: 'PATCH',
        body: data,
      }),
      // Invalidates the 'Talent' cache, so other parts of the app can refetch updated data
      // invalidatesTags: ['Talent'],
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
  useTalentCreationMutation,
  useUploadCvMutation,
  useFetchProfileQuery, // This is correct
  useUpdateProfileMutation, // Add this if needed
  useFetchPretestQuery,
  usePostPretestMutation,
  useFetchJobQuery,
  useFilterJobQuery,
  useIndividualJobQuery,
  useJobPipelineQuery,
  useLazyCvMatchQuery,
  usePersonalizedTestQuery,
  useGeneratePersonalizedTestQuery,
  usePostPersonalizedTestMutation,
  usePersonalityTestQuery,
  usePostPersonalityTestMutation,
  useAllJobApplicationsQuery,
  useGetRoleQuery,
  useGetMessagesQuery,
  usePatchMessageMutation,
  useGetNotificationsQuery,
} = talentApi
