import React from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import {
  JobDetailsJob,
  JobDetailsView,
} from '@/components/features/jobs/JobDetailsView'
import { PagePanel } from '@/components/layout/PagePanel'
import { PageShell } from '@/components/layout/PageShell'
import { Spinner } from '@/components/ui/Spinner'
import { useJobApplications } from '@/features/applications/hooks/useJobApplications'
import { useIndividualJobQuery } from '@/redux/api/talent'
import { SingleJobDetails } from '@/utils'

import { CandidateDossierPanel } from '../../RecruiterProfile/MyJobPosts/CandidateDossierPanel'
import { SingleJobTable } from '../../RecruiterProfile/MyJobPosts/SingleJobTable'

const AdminJobDetail = () => {
  const { jobId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()

  const { data: jobData, isLoading: isJobLoading } =
    useIndividualJobQuery(jobId)
  const job: JobDetailsJob | undefined = jobData?.data?.job

  const { data: applicationsData, isLoading: isApplicationsLoading } =
    useJobApplications(jobId)
  const applications = applicationsData?.data?.applications ?? []
  const jobAiConfig = applicationsData?.data?.aiConfig ?? null

  const openDossier = (item: SingleJobDetails) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('applicationId', item.id)
      return next
    })
  }

  const closeDossier = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.delete('applicationId')
      return next
    })
  }

  const dossierApplication = applications.find(
    (item) => item.id === searchParams.get('applicationId'),
  )

  if (dossierApplication) {
    return (
      <PageShell wide>
        <CandidateDossierPanel
          application={dossierApplication}
          jobAiConfig={jobAiConfig}
          onClose={closeDossier}
          readOnly
        />
      </PageShell>
    )
  }

  if (isJobLoading || isApplicationsLoading) return <Spinner fullPage />

  if (!job) return null

  return (
    <PageShell wide>
      <JobDetailsView jobId={jobId!} job={job} action={null} />

      <PagePanel title={`Applicants (${applications.length})`}>
        <SingleJobTable
          applications={applications}
          jobAiConfig={jobAiConfig}
          onOpenDossier={openDossier}
        />
      </PagePanel>
    </PageShell>
  )
}

export default AdminJobDetail
