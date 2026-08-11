import useSWR from 'swr'

import {
  fetchMyOrganizations,
  MY_ORGANIZATIONS_ENDPOINT,
} from '../services/organizationService'

export const useMyOrganizations = () => {
  const { data, error, isLoading, mutate } = useSWR(
    MY_ORGANIZATIONS_ENDPOINT,
    fetchMyOrganizations,
  )

  return {
    organizations: data?.data?.organizations ?? [],
    isLoading,
    error,
    mutate,
  }
}
