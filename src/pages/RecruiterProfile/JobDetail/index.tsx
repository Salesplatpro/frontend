import React, { useEffect } from 'react'
import { FiActivity, FiClock, FiUsers } from 'react-icons/fi'
import { useNavigate, useParams } from 'react-router-dom'

import {
  JobDetailsJob,
  JobDetailsView,
  JobFact,
  JobFacts,
} from '@/components/features/jobs/JobDetailsView'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { getStatusLabel } from '@/pages/RecruiterProfile/getJobStatus'
import { useIndividualJobQuery } from '@/redux/api/talent'
import { formatTimeAgo } from '@/utils'
import { notify } from '@/utils/toastNotifications'

import { JobStatusControl } from '../EditJob/JobStatusControl'

const JobDetail = () => {
  const { jobId } = useParams()
  const navigate = useNavigate()
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

  const applicants = job.noOfApplicants ?? 0

  return (
    <JobDetailsView
      jobId={jobId!}
      job={job}
      audience="recruiter"
      insights={
        <JobFacts>
          <JobFact icon={<FiUsers />} label="Applicants" value={applicants} />
          <JobFact
            icon={<FiActivity />}
            label="Status"
            value={getStatusLabel(job.status ?? 'draft')}
          />
          <JobFact
            icon={<FiClock />}
            label="Posted"
            value={job.createdAt ? formatTimeAgo(job.createdAt) : '—'}
          />
        </JobFacts>
      }
      action={
        <>
          <Button
            fullWidth
            onClick={() =>
              navigate(`/recruiterDashboard/singleJobPost/${jobId}`, {
                state: { jobName: job.role?.name, postedAt: job.createdAt },
              })
            }>
            View applicants ({applicants})
          </Button>
          <Button
            fullWidth
            variant="secondary"
            onClick={() => navigate(`/recruiterDashboard/editJob/${jobId}`)}>
            Edit job
          </Button>
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
