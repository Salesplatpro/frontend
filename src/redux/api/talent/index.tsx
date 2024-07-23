import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
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
  }),
})

export const {
  useTalentCreationMutation,
  useUploadCvMutation,
  useFetchPretestQuery,
  usePostPretestMutation,
} = talentApi
