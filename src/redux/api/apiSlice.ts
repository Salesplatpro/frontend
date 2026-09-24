import { createApi } from '@reduxjs/toolkit/query/react'

import { customBaseQuery } from '../../utils/customBaseQuery'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: customBaseQuery,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    submitFeedback: builder.mutation({
      query: (data: { subject?: string; message: string }) => ({
        url: `/feedback`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
})

export const { useSubmitFeedbackMutation } = api
