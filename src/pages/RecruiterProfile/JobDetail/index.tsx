import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'

import {
  JobDetailsJob,
  JobDetailsView,
} from '@/components/features/jobs/JobDetailsView'
import { Spinner } from '@/components/ui/Spinner'
import { useIndividualJobQuery } from '@/redux/api/talent'
import { notify } from '@/utils/toastNotifications'

import { JobStatusControl } from '../EditJob/JobStatusControl'

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

  return (
    <JobDetailsView
      jobId={jobId!}
      job={job}
      action={
        <>
          <Link to={`/recruiterDashboard/editJob/${jobId}`}>
            <button
              type="button"
              className="px-4 py-2 w-full bg-blue-500 text-white rounded-lg hover:bg-blue-700 font-raleway font-medium">
              Edit Job
            </button>
          </Link>
          <Link
            to={`/recruiterDashboard/singleJobPost/${jobId}`}
            state={{ jobName: job.role?.name, postedAt: job.createdAt }}>
            <button
              type="button"
              className="px-4 py-2 w-full bg-white text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-50 font-raleway font-medium">
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
