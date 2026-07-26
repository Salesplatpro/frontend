import useSWR from 'swr'

import {
  fetchJobApplications,
  jobApplicationsKey,
} from '../services/applicationService'

export const useJobApplications = (jobId?: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    jobId ? jobApplicationsKey(jobId) : null,
    () => fetchJobApplications(jobId!),
  )

  return { data, error, isLoading, mutate }
}
