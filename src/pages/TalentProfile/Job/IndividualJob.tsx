import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Bounce } from 'react-toastify'

import {
  JobDetailsJob,
  JobDetailsView,
} from '@/components/features/jobs/JobDetailsView'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import {
  useAllJobApplicationsQuery,
  useIndividualJobQuery,
} from '@/redux/api/talent'
import { notify } from '@/utils/toastNotifications'
import { AllJobTypes } from '@/utils/types'

const IndividualJob = () => {
  const { jobId } = useParams()
  const { data, error, isLoading } = useIndividualJobQuery(jobId)
  const job: JobDetailsJob | undefined = data?.data?.job

  const { data: applicationsData } = useAllJobApplicationsQuery({})
  const isApplied = (
    applicationsData?.data?.applications as AllJobTypes[] | undefined
  )?.some((application) => application.job?.id === jobId)

  useEffect(() => {
    if (error) {
      notify('error', 'Error loading job post', {
        autoClose: 5000,
        transition: Bounce,
      })
    }
  }, [error])

  if (isLoading) return <Spinner fullPage />

  if (!job) return null

  return (
    <JobDetailsView
      jobId={jobId!}
      job={job}
      action={
        isApplied ? (
          <Link to={`/talentDashboard/applicationPipeline/${jobId}`}>
            <Button fullWidth variant="secondary">
              Applied ✓
            </Button>
          </Link>
        ) : (
          <Link to={`/talentDashboard/applicationPipeline/${jobId}`}>
            <Button fullWidth>Apply for this position</Button>
          </Link>
        )
      }
    />
  )
}

export default IndividualJob
