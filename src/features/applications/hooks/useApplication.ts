import useSWR from 'swr'

import {
  applicationKey,
  fetchApplication,
} from '../services/applicationService'

export const useApplication = (applicationId?: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    applicationId ? applicationKey(applicationId) : null,
    () => fetchApplication(applicationId!),
  )

  return { data, error, isLoading, mutate }
}
