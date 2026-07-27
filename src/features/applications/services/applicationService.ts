import { httpClient } from '@/features/auth/services/httpClient'
import { SingleJobDetails } from '@/utils/recruiterJobPostsTypes'

export type ApplicationDecision = 'rejected' | 'shortlisted'

export const applicationKey = (applicationId: string) =>
  `/applications/${applicationId}`

export const fetchApplication = (applicationId: string) =>
  httpClient
    .get(applicationKey(applicationId))
    .then((response) => response.data)

export const updateApplicationStatus = (
  applicationId: string,
  status: ApplicationDecision,
) =>
  httpClient
    .patch(`${applicationKey(applicationId)}/status`, { status })
    .then((response) => response.data)

export const regenerateVerdict = (applicationId: string) =>
  httpClient
    .post(`${applicationKey(applicationId)}/verdict`)
    .then((response) => response.data)

export const bulkUpdateApplicationStatus = (
  applicationIds: string[],
  status: ApplicationDecision,
) =>
  httpClient
    .patch('/applications/status', { applicationIds, status })
    .then((response) => response.data)

export const jobApplicationsKey = (jobId: string) =>
  `/jobs/applications/${jobId}`

export const fetchJobApplications = (jobId: string) =>
  httpClient
    .get<{ data: { applications: SingleJobDetails[] } }>(
      jobApplicationsKey(jobId),
    )
    .then((response) => response.data)
