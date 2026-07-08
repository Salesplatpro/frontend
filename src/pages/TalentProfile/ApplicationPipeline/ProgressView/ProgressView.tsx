import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Bounce } from 'react-toastify'

import { Spinner } from '@/components/ui/Spinner'

import cvmatchIcon from '../../../../assets/cvmatchIcon.webp'
import personalizedIcon from '../../../../assets/personalizedIcon.webp'
import pretestIcon from '../../../../assets/pretestIcon.webp'
import {
  useJobPipelineQuery,
  useLazyCvMatchQuery,
} from '../../../../redux/api/talent'
import { notify } from '../../../../utils/toastNotifications'
import { ErrorResponse } from '../../utils/type'
import { Application, Progress } from '../../utils/type'
import ProgressError from './ProgressError'
import ProgressHeader from './ProgressHeader'
import ProgressItem from './ProgressItem'

const getProgresses = (application: Application): Progress[] => {
  const stagesMapping = {
    prescreening: { icon: pretestIcon, title: 'Pre-Assessment' },
    cv_similarity: { icon: cvmatchIcon, title: 'CV-Matching' },
    personalized: { icon: personalizedIcon, title: 'Personalized Test' },
    personality: { icon: personalizedIcon, title: 'Personality Test' },
  }

  const progresses: Progress[] = []
  const stages = Object.keys(
    application.stages,
  ) as (keyof typeof stagesMapping)[]
  const currentStage = application.currentStage
  let currentStageFound = false

  stages.forEach((stage) => {
    if (stagesMapping[stage]) {
      let status
      if (stage === currentStage) {
        status = 'current'
        currentStageFound = true
      } else if (!currentStageFound) {
        status = 'completed'
      } else {
        status = 'awaiting'
      }
      progresses.push({
        icon: stagesMapping[stage].icon,
        title: stagesMapping[stage].title,
        status: status,
      })
    }
  })

  return progresses
}

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
      notify('success', 'CV Match completed.', {
        autoClose: 5000,
      })

      refetch()
    }

    if (cvMatchError) {
      handleError(cvMatchError, 'Failed to load CV Match data')
    }
  }, [cvMatchData, cvMatchError, refetch])

  const handleError = (error: any, defaultMessage: string) => {
    const errorMessage =
      (error?.data as ErrorResponse)?.message || defaultMessage

    notify('error', errorMessage, {
      autoClose: 5000,
      transition: Bounce,
    })

    console.error('Error:', error)
  }

  if (applicationLoading || cvMatchLoading) return <Spinner fullPage />

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
          className="my-14 ml-4 border-2 border-primary-strong px-[12px] py-[12.3px] rounded-xl cursor-pointer bg-primary-strong text-white shadow-custom font-raleway leading-[30px] text-[16px] font-medium hover:bg-[#3765c0] hover:text-white">
          Back to Homepage
        </button>
      </div>
    </div>
  )
}

export default ProgressView
