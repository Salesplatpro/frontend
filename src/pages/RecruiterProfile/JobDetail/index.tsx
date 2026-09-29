import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'

import {
  JobDetailsJob,
  JobDetailsView,
} from '@/components/features/jobs/JobDetailsView'
import { StatCard, StatGrid } from '@/components/layout/PagePanel'
import { Spinner } from '@/components/ui/Spinner'
import { getStatusLabel } from '@/pages/RecruiterProfile/getJobStatus'
import { useIndividualJobQuery } from '@/redux/api/talent'
import { formatTimeAgo } from '@/utils'
import { notify } from '@/utils/toastNotifications'

import { JobStatusControl } from '../EditJob/JobStatusControl'
import styles from './JobDetail.module.scss'

const JobDetail = () => {
  const { jobId } = useParams()
  const { data, error, isLoading } = useIndividualJobQuery(jobId)
  const job: JobDetailsJob | undefined = data?.data?.job

  useEffect(() => {
    if (error) {
      notify('error', 'Error loading job post', {
        autoClose: 2000,
      })
    }
  }, [error])

  if (isLoading) return <Spinner fullPage />

  if (!job) return null

  const statusLabel = getStatusLabel(job.status ?? 'draft')

  return (
    <JobDetailsView
      jobId={jobId!}
      job={job}
      beforeBody={
        <div className={styles.recruiterSummary}>
          <StatGrid columns={3}>
            <StatCard
              label="Applicants"
              value={job.noOfApplicants ?? 0}
              caption="See View Applicants below to review them"
            />
            <StatCard label="Status" value={statusLabel} />
            <StatCard
              label="Posted"
              value={job.createdAt ? formatTimeAgo(job.createdAt) : '—'}
            />
          </StatGrid>
        </div>
      }
      action={
        <>
          <Link to={`/recruiterDashboard/editJob/${jobId}`}>
            <button
              type="button"
              className={`${styles.button} ${styles.editButton}`}>
              Edit Job
            </button>
          </Link>
          <Link
            to={`/recruiterDashboard/singleJobPost/${jobId}`}
            state={{ jobName: job.role?.name, postedAt: job.createdAt }}>
            <button
              type="button"
              className={`${styles.button} ${styles.viewButton}`}>
              View Applicants{' '}
              {job.noOfApplicants != null ? `(${job.noOfApplicants})` : ''}
            </button>
          </Link>
          <JobStatusControl
            jobId={jobId!}
            status={job.status ?? 'draft'}
            aiConfigId={job.aiConfigId ?? job.aiConfig?.id ?? null}
          />
        </>
      }
    />
  )
}

export default JobDetail
