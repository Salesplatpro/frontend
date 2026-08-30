import { createApi } from '@reduxjs/toolkit/query/react'

import { customBaseQuery } from '../../utils/customBaseQuery'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: customBaseQuery,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    pricingPlan: builder.query({
      query: () => ({
        url: `/plans`,
        method: 'GET',
      }),
    }),

    paymentInitiate: builder.mutation({
      query: (data: {
        planKey?: string
        interval?: string
        planId?: string
      }) => ({
        url: `/payments`,
        method: 'POST',
        body: data,
      }),
    }),
    verifyPayment: builder.mutation({
      query: (data) => ({
        url: `/payments/verify`,
        method: 'POST',
        body: data,
      }),
    }),

    submitFeedback: builder.mutation({
      query: (data: { subject?: string; message: string }) => ({
        url: `/feedback`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
})

export const {
  usePricingPlanQuery,
  usePaymentInitiateMutation,
  useVerifyPaymentMutation,
  useSubmitFeedbackMutation,
} = api
