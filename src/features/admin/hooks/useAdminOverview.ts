import useSWR from 'swr'

import { fetchAdminOverview } from '../services/adminService'
import { OverviewRange } from '../types'

export const adminOverviewKey = (days: OverviewRange) =>
  `/admin/overview?days=${days}`

export const useAdminOverview = (days: OverviewRange) => {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    adminOverviewKey(days),
    () => fetchAdminOverview(days),
    { keepPreviousData: true, revalidateOnFocus: false },
  )

  return {
    overview: data,
    error,
    isLoading,
    isRefreshing: isValidating && !isLoading,
    retry: () => mutate(),
  }
}
