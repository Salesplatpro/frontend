import useSWR from 'swr'

import { fetchOrganizationMembers } from '../services/organizationService'

export const organizationMembersKey = (organizationId: string) =>
  `/organizations/${organizationId}/members`

export const useOrganizationMembers = (organizationId: string | null) => {
  const { data, isLoading, mutate } = useSWR(
    organizationId ? organizationMembersKey(organizationId) : null,
    () =>
      organizationId
        ? fetchOrganizationMembers(organizationId).then(
            (res) => res.data.members,
          )
        : null,
  )

  return {
    members: data ?? [],
    isLoading,
    refresh: mutate,
  }
}
