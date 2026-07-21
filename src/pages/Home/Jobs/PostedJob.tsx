import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  JobDetailsJob,
  JobDetailsView,
} from '@/components/features/jobs/JobDetailsView'
import { Spinner } from '@/components/ui/Spinner'
import { useAuthStore } from '@/features/auth/store/useAuthStore'

import { useIndividualJobQuery } from '../../../redux/api/talent'
import { notify } from '../../../utils/toastNotifications'

const PostedJob = () => {
  const { jobId } = useParams<{ jobId: string }>()
  const navigate = useNavigate()
  const { data, error, isLoading } = useIndividualJobQuery(jobId)
  const job: JobDetailsJob | undefined = data?.data?.job
  const { user, token } = useAuthStore()
  const userRole = user?.userRole || ''
  const isLoggedIn = !!token

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

    if (userRole === 'talent') {
      navigate(`/talentDashboard/job/${jobId}`)
    } else if (!isLoggedIn) {
      navigate(`/login?redirectJobId=${jobId}`)
    }
  }

  return (
    <JobDetailsView
      jobId={jobId!}
      job={job}
      action={
        <button
          type="button"
          onClick={handleApply}
          className="px-4 py-2 w-full bg-blue-500 text-white rounded-lg hover:bg-blue-700 font-raleway font-medium">
          Apply for this position
        </button>
      }
    />
  )
}

export default PostedJob
