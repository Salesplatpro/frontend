import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { BackButton } from '@/components/ui/BackButton'
import { Button } from '@/components/ui/Button'
import { AllJobTypes } from '@/utils/types'

import resultIcon from '../../../../assets/CheckIcon.svg'
import cvmatchIcon from '../../../../assets/cvmatchIcon.webp'
import personalizedIcon from '../../../../assets/personalizedIcon.webp'
import {
  useAllJobApplicationsQuery,
  useJobApplicationQuery,
  useLazyCheckPrescreeningStageQuery,
  useLazyCvMatchQuery,
} from '../../../../redux/api/talent'
import { notify } from '../../../../utils/toastNotifications'
import { ErrorResponse } from '../../utils/type'
import { Application, Progress } from '../../utils/type'
import ProgressError from './ProgressError'
import ProgressHeader from './ProgressHeader'
import ProgressItem from './ProgressItem'
import ProgressSkeleton from './ProgressSkeleton'
import styles from './ProgressView.module.scss'

type StageKey = keyof Application['stages']

export const getProgresses = (application: Application): Progress[] => {
  const stagesMapping = {
    cv_similarity: { icon: cvmatchIcon, title: 'CV-Matching' },
    personalized: { icon: personalizedIcon, title: 'Personalized Test' },
    personality: { icon: personalizedIcon, title: 'Personality Test' },
  }

  // `application.stages` is a jsonb map of currentStage -> nextStage. Its key
  // iteration order is not guaranteed to match the pipeline's actual order, so
  // reconstruct the true order by walking the chain from its entry stage (the
  // one key that never appears as another stage's "next") rather than trusting
  // Object.keys() order.
  const stages = (application.stages ?? {}) as Record<StageKey, string>
  const stageKeys = Object.keys(stages) as StageKey[]
  const values = new Set(Object.values(stages))
  const entryStage = stageKeys.find((key) => !values.has(key))

  const orderedStages: StageKey[] = []
  let cursor = entryStage
  while (cursor && (cursor as string) !== 'completed') {
    orderedStages.push(cursor)
    cursor = stages[cursor] as StageKey
  }

  const progresses: Progress[] = []
  const currentStage = application.currentStage
  let currentStageFound = false

  // Status is computed for every stage in the real chain (including
  // 'prescreening', which has no display mapping below) so `currentStageFound`
  // stays accurate — only the push into `progresses` is gated on having a
  // mapping, keeping Pre-Assessment out of the visible pipeline without
  // corrupting the completed/awaiting status of the stages after it.
  orderedStages.forEach((stage) => {
    let status
    if (stage === currentStage) {
      status = 'current'
      currentStageFound = true
    } else if (!currentStageFound) {
      status = 'completed'
    } else {
      status = 'awaiting'
    }

    const mapping = (
      stagesMapping as Record<string, { icon: string; title: string }>
    )[stage]
    if (mapping) {
      // CV-matching and personalized-test scores are never shown to the talent —
      // only whether the stage is complete. The stage's own status badge already
      // renders "Completed"; no numeric result is surfaced here for those stages.
      let result: string | null = null
      if (
        stage === 'personality' &&
        status === 'completed' &&
        application.mbtiType
      ) {
        result = application.mbtiType
      }

      progresses.push({
        icon: mapping.icon,
        title: mapping.title,
        status: status,
        result,
      })
    }
  })

  // Once every assessment stage is done, add a terminal "Result" step that
  // reflects the recruiter's decision — `application.status` is tracked
  // independently of `currentStage`/`stages` and was never surfaced here before.
  if (currentStage === 'completed') {
    const resultStatus =
      application.status === 'shortlisted' || application.status === 'rejected'
        ? application.status
        : 'awaiting-decision'
    progresses.push({
      icon: resultIcon,
      title: 'Result',
      status: resultStatus,
    })
  }

  return progresses
}

const ProgressView: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>()
  const [jobProgress, setJobProgress] = useState<Application | null>(null)
  const navigate = useNavigate()
  const location = useLocation()

  const {
    data: applicationsData,
    error: applicationsError,
    isLoading: applicationsLoading,
  } = useAllJobApplicationsQuery({})
  const applicationId = (
    applicationsData?.data?.applications as AllJobTypes[] | undefined
  )?.find((application) => application.job?.id === jobId)?.id

  const {
    data: applicationResp,
    error: applicationError,
    isLoading: applicationLoading,
    refetch,
  } = useJobApplicationQuery(applicationId, { skip: !applicationId })

  const [
    triggerCvMatch,
    { data: cvMatchData, error: cvMatchError, isLoading: cvMatchLoading },
  ] = useLazyCvMatchQuery()

  const [
    triggerPrescreeningCheck,
    {
      data: prescreeningCheckData,
      error: prescreeningCheckError,
      isLoading: prescreeningCheckLoading,
    },
  ] = useLazyCheckPrescreeningStageQuery()

  useEffect(() => {
    if (applicationResp) {
      const applicationData = applicationResp.data?.application || null
      setJobProgress(applicationData)

      if (applicationData?.currentStage === 'cv_similarity') {
        triggerCvMatch(jobId)
      }
      if (applicationData?.currentStage === 'prescreening') {
        triggerPrescreeningCheck(jobId)
      }
    }
    if (applicationError) {
      handleError(applicationError, 'Failed to load application progress')
    }
  }, [
    applicationResp,
    applicationError,
    jobId,
    triggerCvMatch,
    triggerPrescreeningCheck,
  ])

  useEffect(() => {
    if (cvMatchData) {
      notify('success', 'CV Match completed.', {
        autoClose: 2000,
      })

      refetch()
    }

    if (cvMatchError) {
      handleError(cvMatchError, 'Failed to load CV Match data')
    }
  }, [cvMatchData, cvMatchError, refetch])

  useEffect(() => {
    if (prescreeningCheckData) {
      refetch()
    }

    if (prescreeningCheckError) {
      handleError(
        prescreeningCheckError,
        'Failed to check Pre-Assessment status',
      )
    }
  }, [prescreeningCheckData, prescreeningCheckError, refetch])

  const handleError = (error: any, defaultMessage: string) => {
    const errorMessage =
      (error?.data as ErrorResponse)?.message || defaultMessage

    notify('error', errorMessage, {
      autoClose: 2000,
    })

    console.error('Error:', error)
  }

  const stillResolvingApplication =
    applicationsLoading || (!applicationId && !applicationsError)

  if (
    stillResolvingApplication ||
    applicationLoading ||
    cvMatchLoading ||
    prescreeningCheckLoading
  )
    return <ProgressSkeleton />

  if (!jobProgress)
    return (
      <div className={styles.page}>
        <BackButton />
        <ProgressError error={applicationError || applicationsError} />
      </div>
    )

  const progresses = getProgresses(jobProgress)

  const homePage = () => {
    if (location.key !== 'default') {
      navigate(-1)
    } else {
      null
    }
  }

  const completedStatuses = ['completed', 'shortlisted', 'rejected']
  const completedStages = progresses.filter((progress) =>
    completedStatuses.includes(progress.status),
  ).length
  const totalStages = progresses.length
  const progressPercentage = Math.round((completedStages / totalStages) * 100)

  return (
    <div className={styles.page}>
      <BackButton />
      <ProgressHeader
        progressPercentage={progressPercentage}
        jobProgress={jobProgress}
      />

      <div className={styles.itemList}>
        {progresses.map((progress, i) => (
          <ProgressItem
            key={i}
            progress={progress}
            jobId={jobId}
            isLast={i === progresses.length - 1}
          />
        ))}
      </div>

      <div className={styles.footer}>
        <Button onClick={homePage}>Back to Homepage</Button>
      </div>
    </div>
  )
}

export default ProgressView
