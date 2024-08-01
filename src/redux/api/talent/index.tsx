import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { url } from 'inspector'

import { getToken } from '../../../utils/authUtils'

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
} = talentApi
