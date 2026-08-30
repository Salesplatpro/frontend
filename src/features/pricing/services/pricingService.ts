import { httpClient } from '@/features/auth/services/httpClient'

import { PricingApiResponse } from '../types'

export const PRICING_ENDPOINT = '/pricing'

export const fetchPricingCatalog = () =>
  httpClient.get<PricingApiResponse>(PRICING_ENDPOINT).then((res) => res.data)
