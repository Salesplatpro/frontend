import useSWR from 'swr'

import { fetchPlanHistory } from '../services/planHistoryService'

export const planHistoryKey = (organizationId: string) =>
  `/organizations/${organizationId}/plan-history`

export const usePlanHistory = (organizationId?: string | null) => {
  const { data, error, isLoading, mutate } = useSWR(
    organizationId ? planHistoryKey(organizationId) : null,
    () =>
      organizationId
        ? fetchPlanHistory(organizationId).then((res) => res.data.history)
        : null,
    { revalidateOnFocus: false },
  )

  return { history: data ?? [], isLoading, error, refresh: mutate }
}
