import { httpClient } from '@/features/auth/services/httpClient'

import { BillingInterval } from '../types'

export interface InitiatePaymentResponse {
  status: boolean
  message: string
  data: { link: string; reference: string; mode: string }
}

export const initiatePaidCheckout = (interval: BillingInterval) =>
  httpClient
    .post<InitiatePaymentResponse>('/payments', {
      planKey: 'paid',
      interval,
    })
    .then((res) => res.data)

export const verifyPaidCheckout = (reference: string) =>
  httpClient.post('/payments/verify', { reference }).then((res) => res.data)
