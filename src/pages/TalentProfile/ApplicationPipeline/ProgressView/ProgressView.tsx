import React, { useEffect, useState } from 'react'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import toast from 'react-hot-toast'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import Loading from '../../../../components/Loading/Loading'
import {
  useJobPipelineQuery,
  useLazyCvMatchQuery,
} from '../../../../redux/api/talent'
import ProgressHeader from './ProgressHeader'
import { Application } from '../../utils/type'
import { ErrorResponse } from '../../utils/type'
import ProgressItem from './ProgressItem'
import { getProgresses } from './progressUtils'
import ProgressError from './ProgressError'

const ProgressView: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>()
  const [jobProgress, setJobProgress] = useState<Application | null>(null)
  const navigate = useNavigate()
  const location = useLocation()

  const {
    data: applications,
    error: applicationError,
    isLoading: applicationLoading,
    refetch,
  } = useJobPipelineQuery(jobId || '')

  const [
    triggerCvMatch,
    { data: cvMatchData, error: cvMatchError, isLoading: cvMatchLoading },
  ] = useLazyCvMatchQuery()

  useEffect(() => {
    if (applications) {
      // toast.success(applications.message)
      const applicationData = applications.data?.application || null
      setJobProgress(applicationData)

      if (applicationData?.currentStage === 'cv_similarity') {
        triggerCvMatch(jobId)
      }
    }
    if (applicationError) {
      handleError(applicationError, 'Failed to load CV Match data')
    }
  }, [applications, applicationError, jobId, triggerCvMatch])

  useEffect(() => {
    if (cvMatchData) {
      toast.success('CV Match completed.')
      refetch()
    }

    if (cvMatchError) {
      handleError(cvMatchError, 'Failed to load CV Match data')
    }
  }, [cvMatchData, cvMatchError, refetch])

  const handleError = (error: any, defaultMessage: string) => {
    const errorMessage =
      (error?.data as ErrorResponse)?.message || defaultMessage
    toast.error(errorMessage)
    console.error('Error:', error)
  }

  if (applicationLoading || cvMatchLoading) return <Loading />

  if (!jobProgress) return <ProgressError error={applicationError} />

  const progresses = getProgresses(jobProgress)

  const homePage = () => {
    if (location.key !== 'default') {
      navigate(-1)
    } else {
      null
    }
  }

  const completedStages = progresses.filter(
    (progress) => progress.status === 'completed',
  ).length
  const totalStages = progresses.length
  const progressPercentage = Math.round((completedStages / totalStages) * 100)

  return (
    <div>
      <ProgressHeader
        progressPercentage={progressPercentage}
        jobProgress={jobProgress}
      />

      <div>
        <div className="max-w-[788px] space-y-2 mx-auto">
          {progresses.map((progress, i) => (
            <ProgressItem
              key={i}
              progress={progress}
              jobProgress={jobProgress}
              jobId={jobId}
            />
          ))}
        </div>
      </div>

      <div>
        <button
          onClick={homePage}
          className="my-14 ml-4 border-2 border-[#3C6FD4] px-[12px] py-[12.3px] rounded-xl cursor-pointer bg-[#3C6FD4] text-white shadow-custom font-raleway leading-[30px] text-[16px] font-medium hover:bg-[#3765c0] hover:text-white">
          Back to Homepage
        </button>
      </div>
    </div>
  )
}

export default ProgressView
