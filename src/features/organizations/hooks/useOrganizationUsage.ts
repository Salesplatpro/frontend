import useSWR from 'swr'

import { fetchOrganizationUsage } from '../services/organizationService'

export const organizationUsageKey = (organizationId: string) =>
  `/organizations/${organizationId}/usage`

export const useOrganizationUsage = (organizationId?: string | null) => {
  const { data, error, isLoading, mutate } = useSWR(
    organizationId ? organizationUsageKey(organizationId) : null,
    () =>
      organizationId
        ? fetchOrganizationUsage(organizationId).then((res) => res.data.usage)
        : null,
    { revalidateOnFocus: true },
  )

  return { usage: data ?? null, isLoading, error, refresh: mutate }
}
