import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Bounce } from 'react-toastify'

import {
  JobDetailsJob,
  JobDetailsView,
} from '@/components/features/jobs/JobDetailsView'
import { Spinner } from '@/components/ui/Spinner'
import { useIndividualJobQuery } from '@/redux/api/talent'
import { notify } from '@/utils/toastNotifications'

const IndividualJob = () => {
  const { jobId } = useParams()
  const { data, error, isLoading } = useIndividualJobQuery(jobId)
  const job: JobDetailsJob | undefined = data?.data?.job

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
        <Link to={`/talentDashboard/applicationPipeline/${jobId}`}>
          <button
            type="button"
            className="px-4 py-2 w-full bg-blue-500 text-white rounded-lg hover:bg-blue-700 font-raleway font-medium">
            Apply for this position
          </button>
        </Link>
      }
    />
  )
}

export default IndividualJob
