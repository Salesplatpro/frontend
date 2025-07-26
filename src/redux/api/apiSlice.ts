import { createApi } from '@reduxjs/toolkit/query/react'

import { customBaseQuery } from '../../utils/customBaseQuery'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: customBaseQuery,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    talentReg: builder.mutation({
      query: (data) => ({
        url: `/auth/register`,
        method: 'POST',
        body: data,
      }),
    }),

    recruiterReg: builder.mutation({
      query: (data) => ({
        url: `/auth/register/recruiter`,
        method: 'POST',
        body: data,
      }),
    }),

    userLogin: builder.mutation({
      query: (data) => ({
        url: `/auth/login`,
        method: 'POST',
        body: data,
      }),
    }),

    forgotPassword: builder.mutation({
      query: (data) => ({
        url: `/auth/forgot-password`,
        method: 'POST',
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: `/auth/reset-password`,
        method: 'POST',
        body: data,
      }),
    }),

    pricingPlan: builder.query({
      query: () => ({
        url: `/plans`,
        method: 'GET',
      }),
    }),

    paymentInitiate: builder.mutation({
      query: (data) => ({
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
  }),
})

export const {
  useTalentRegMutation,
  useRecruiterRegMutation,
  useUserLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  usePricingPlanQuery,
  usePaymentInitiateMutation,
  useVerifyPaymentMutation,
} = api
