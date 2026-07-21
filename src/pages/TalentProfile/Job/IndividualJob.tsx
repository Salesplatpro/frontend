import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Bounce } from 'react-toastify'

import {
  JobDetailsJob,
  JobDetailsView,
} from '@/components/features/jobs/JobDetailsView'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import {
  useAllJobApplicationsQuery,
  useApplyToJobMutation,
  useIndividualJobQuery,
} from '@/redux/api/talent'
import { notify } from '@/utils/toastNotifications'
import { AllJobTypes } from '@/utils/types'

const IndividualJob = () => {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const { data, error, isLoading } = useIndividualJobQuery(jobId)
  const job: JobDetailsJob | undefined = data?.data?.job

  const { data: applicationsData } = useAllJobApplicationsQuery({})
  const isApplied = (
    applicationsData?.data?.applications as AllJobTypes[] | undefined
  )?.some((application) => application.job?.id === jobId)

  const [applyToJob, { isLoading: applying }] = useApplyToJobMutation()

  useEffect(() => {
    if (error) {
      notify('error', 'Error loading job post', {
        autoClose: 5000,
        transition: Bounce,
      })
    }
  }, [error])

  const handleApply = async () => {
    if (isApplied || applying || !jobId) return
    try {
      await applyToJob(jobId).unwrap()
      navigate(`/talentDashboard/applicationPipeline/${jobId}`)
    } catch (err) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ||
        'Failed to apply for this job'
      notify('error', message, { autoClose: 5000, transition: Bounce })
    }
  }

  if (isLoading) return <Spinner fullPage />

  if (!job) return null

  return (
    <JobDetailsView
      jobId={jobId!}
      job={job}
      action={
        isApplied ? (
          <Button fullWidth variant="secondary" disabled>
            Applied ✓
          </Button>
        ) : (
          <Button fullWidth onClick={handleApply} loading={applying}>
            Apply for this position
          </Button>
        )
      }
    />
  )
}

export default IndividualJob
