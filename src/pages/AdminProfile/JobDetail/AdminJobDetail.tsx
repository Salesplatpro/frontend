import React from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import {
  Avatar,
  Button,
  ColumnDef,
  DataTable,
  EmptyState,
  MatchScoreRing,
  StatusBadge,
} from '@/components'
import {
  JobDetailsJob,
  JobDetailsView,
} from '@/components/features/jobs/JobDetailsView'
import { PagePanel } from '@/components/layout/PagePanel'
import { PageShell } from '@/components/layout/PageShell'
import { Spinner } from '@/components/ui/Spinner'
import { useJobApplications } from '@/features/applications/hooks/useJobApplications'
import { useIndividualJobQuery } from '@/redux/api/talent'
import { formatTimeAgo, SingleJobDetails } from '@/utils'

import { getStatusBadge } from '../../RecruiterProfile/getJobStatus'
import { CandidateDossierPanel } from '../../RecruiterProfile/MyJobPosts/CandidateDossierPanel'
import styles from './AdminJobDetail.module.scss'

const formatAbsoluteDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

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

  if (isJobLoading) return <Spinner fullPage />

  if (!job) return null

  const columns: ColumnDef<SingleJobDetails>[] = [
    {
      key: 'name',
      header: 'Candidate',
      render: (item) => (
        <div className={styles.nameCell}>
          <Avatar
            firstName={item.talent.firstName}
            lastName={item.talent.lastName}
          />
          <div>
            <div>
              {item.talent.firstName} {item.talent.lastName}
            </div>
            <div className={styles.nameEmail}>{item.talent.email}</div>
          </div>
        </div>
      ),
      sortAccessor: (item) =>
        `${item.talent.firstName} ${item.talent.lastName}`,
    },
    {
      key: 'status',
      header: 'Shortlist status',
      align: 'center',
      render: (item) => (
        <div className={styles.center}>
          <StatusBadge
            status={item.status}
            showDot
            {...getStatusBadge(item.status)}
          />
        </div>
      ),
      sortAccessor: (item) => item.status,
    },
    {
      key: 'aiMatch',
      header: 'AI Match',
      align: 'center',
      render: (item) => (
        <div className={styles.center}>
          <MatchScoreRing
            verdict={item.matchVerdict ?? null}
            averageScore={item.averageScore ?? null}
            cvSimilarityScore={item.cvSimilarityScore ?? null}
            failed={item.matchVerdictStatus === 'failed'}
            currentStage={item.currentStage}
          />
        </div>
      ),
    },
    {
      key: 'dateApplied',
      header: 'Date Applied',
      align: 'center',
      render: (item) => (
        <div>
          <div>{formatTimeAgo(item.createdAt)}</div>
          <div className={styles.dateSecondary}>
            {formatAbsoluteDate(item.createdAt)}
          </div>
        </div>
      ),
      sortAccessor: (item) => new Date(item.createdAt).getTime(),
    },
    {
      key: 'details',
      header: '',
      align: 'right',
      render: (item) => (
        <Button size="sm" variant="outline" onClick={() => openDossier(item)}>
          View details
        </Button>
      ),
    },
  ]

  return (
    <PageShell wide>
      <JobDetailsView jobId={jobId!} job={job} action={null} />

      <PagePanel title={`Applicants (${applications.length})`}>
        {applications.length === 0 && !isApplicationsLoading ? (
          <EmptyState
            title="No applicants yet"
            description="No talents have applied to this job."
          />
        ) : (
          <DataTable
            columns={columns}
            data={applications}
            isLoading={isApplicationsLoading}
            getRowKey={(item) => item.id}
            ariaLabel="Job applicants"
            onRowClick={openDossier}
          />
        )}
      </PagePanel>
    </PageShell>
  )
}

export default AdminJobDetail
