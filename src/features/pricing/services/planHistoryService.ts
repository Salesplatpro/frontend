import { httpClient } from '@/features/auth/services/httpClient'

import { PlanHistoryApiResponse } from '../types'

export const fetchPlanHistory = (organizationId: string) =>
  httpClient
    .get<PlanHistoryApiResponse>(
      `/organizations/${organizationId}/plan-history`,
    )
    .then((res) => res.data)
