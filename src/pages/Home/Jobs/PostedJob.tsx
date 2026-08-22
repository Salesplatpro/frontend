import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  JobDetailsJob,
  JobDetailsView,
} from '@/components/features/jobs/JobDetailsView'
import { Spinner } from '@/components/ui/Spinner'

import { useIndividualJobQuery } from '../../../redux/api/talent'
import { notify } from '../../../utils/toastNotifications'
import styles from './PostedJob.module.scss'

const PostedJob = () => {
  const { jobId } = useParams<{ jobId: string }>()
  const navigate = useNavigate()
  const { data, error, isLoading } = useIndividualJobQuery(jobId)
  const job: JobDetailsJob | undefined = data?.data?.job

  useEffect(() => {
    if (error) {
      notify('error', 'Error loading job post')
    }
  }, [error])

  if (isLoading) return <Spinner fullPage />

  if (!job) return null

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
