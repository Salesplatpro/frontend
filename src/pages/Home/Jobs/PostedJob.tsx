import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  JobDetailsJob,
  JobDetailsView,
} from '@/components/features/jobs/JobDetailsView'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { useIndividualJobQuery } from '@/redux/api/talent'
import { notify } from '@/utils/toastNotifications'

import styles from './PostedJob.module.scss'

const PostedJob = () => {
  const { jobId } = useParams<{ jobId: string }>()
  const navigate = useNavigate()
  const { data, error, isLoading, refetch } = useIndividualJobQuery(jobId)
  const job: JobDetailsJob | undefined = data?.data?.job
  const errorStatus = (error as { status?: number } | undefined)?.status
  const jobNotFound = errorStatus === 404
  const jobLoadFailed = !!error && !jobNotFound
  const jobClosed = !!job && job.status !== 'active'

  if (isLoading) return <Spinner fullPage />

  if (jobNotFound || jobLoadFailed || jobClosed || !job) {
    return (
      <div className={styles.unavailable}>
        <h1 className={styles.title}>
          {jobLoadFailed
            ? "Couldn't load this job"
            : 'This job is no longer available'}
        </h1>
        <p className={styles.message}>
          {jobNotFound || !job
            ? "This job posting doesn't exist, is still a draft, or has been removed."
            : jobLoadFailed
            ? 'Something went wrong loading this job. Please try again.'
            : 'This job is no longer accepting applications.'}
        </p>
        {jobLoadFailed ? (
          <Button onClick={() => void refetch()}>Try again</Button>
        ) : (
          <Button onClick={() => navigate('/job')}>Browse open jobs</Button>
        )}
      </div>
    )
  }

  const handleApply = () => {
    if (!jobId) {
      notify('error', 'Invalid job ID')
      return
    }

    navigate(`/apply/${jobId}`)
  }

  return (
    <JobDetailsView
      jobId={jobId!}
      job={job}
      action={
        <button
          type="button"
          onClick={handleApply}
          className={styles.applyButton}>
          Apply for this position
        </button>
      }
    />
  )
}

export default PostedJob
