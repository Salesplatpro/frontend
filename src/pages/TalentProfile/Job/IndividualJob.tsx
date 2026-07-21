import React, { useEffect, useRef } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import {
  JobDetailsJob,
  JobDetailsView,
} from '@/components/features/jobs/JobDetailsView'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import {
  useApplyToJobMutation,
  useIndividualJobQuery,
} from '@/redux/api/talent'
import { notify } from '@/utils/toastNotifications'

const IndividualJob = () => {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { data, error, isLoading } = useIndividualJobQuery(jobId)
  const job: JobDetailsJob | undefined = data?.data?.job
  const isApplied = !!job?.hasApplied

  const [applyToJob, { isLoading: applying }] = useApplyToJobMutation()

  useEffect(() => {
    if (error) {
      notify('error', 'Error loading job post', {
        autoClose: 2000,
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
      notify('error', message, { autoClose: 2000 })
    }
  }

  // Shared-link visitors land here with ?autoApply=true right after signup/
  // login — fire the same apply flow a manual click would, once, then drop
  // the query param so a refresh doesn't re-trigger it.
  const autoApplyRequested = searchParams.get('autoApply') === 'true'
  const autoApplyFired = useRef(false)

  useEffect(() => {
    if (!autoApplyRequested || autoApplyFired.current || !job || isApplied) {
      return
    }
    autoApplyFired.current = true
    navigate(`/talentDashboard/job/${jobId}`, { replace: true })
    handleApply()
  }, [autoApplyRequested, job, isApplied])

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
