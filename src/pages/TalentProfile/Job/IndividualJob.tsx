import React, { useEffect, useMemo, useRef } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import {
  JobDetailsJob,
  JobDetailsView,
} from '@/components/features/jobs/JobDetailsView'
import { PageShell } from '@/components/layout/PageShell'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import PersonalityTest from '@/pages/TalentProfile/TalentAssessment/PersonalityTest'
import PersonalizedTest from '@/pages/TalentProfile/TalentAssessment/PersonalizedTest'
import {
  useApplyToJobMutation,
  useIndividualJobQuery,
  useJobApplicationQuery,
  useLazyCheckPrescreeningStageQuery,
  useLazyCvMatchQuery,
  usePersonalityTestQuery,
  usePersonalizedTestQuery,
} from '@/redux/api/talent'
import { notify } from '@/utils/toastNotifications'

import {
  type PipelineStepId,
  buildPipelineCrumbs,
  canVisitStep,
  firstRemainingStep,
} from './jobPipeline'
import styles from './JobWorkspace.module.scss'

type ApplicationRecord = {
  id?: string
  currentStage?: string
  stages?: Record<string, string> | null
  cvSimilarityScore?: number | null
  personalizedScore?: number | null
  mbtiType?: string | null
  talent?: { prescreeningScore?: number | null }
}

const parseStep = (value: string | null): PipelineStepId | null => {
  if (
    value === 'details' ||
    value === 'personality' ||
    value === 'personalized' ||
    value === 'prescreening' ||
    value === 'cv_similarity'
  ) {
    return value
  }
  return null
}

const StageReview = ({
  title,
  meta,
  questions,
}: {
  title: string
  meta?: string
  questions?: Array<{ id: string; question: string; answer?: string | null }>
}) => (
  <div className={styles.stagePanel}>
    <h2 className={styles.stageTitle}>{title}</h2>
    {meta ? <p className={styles.stageMeta}>{meta}</p> : null}
    {questions && questions.length > 0 && (
      <ul className={styles.qaList}>
        {questions.map((item, index) => (
          <li key={item.id} className={styles.qaItem}>
            <p className={styles.qaQuestion}>
              {index + 1}. {item.question}
            </p>
            <p className={styles.qaAnswer}>
              {item.answer?.trim() || 'No answer saved'}
            </p>
          </li>
        ))}
      </ul>
    )}
  </div>
)

const IndividualJob = () => {
  const { jobId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const talentId = useAuthStore((state) => state.user)?.id
  const {
    data,
    error,
    isLoading,
    refetch: refetchJob,
  } = useIndividualJobQuery(jobId)
  const job: JobDetailsJob | undefined = data?.data?.job
  const applicationId = job?.applicationId ?? undefined
  const { data: applicationResp, refetch: refetchApplication } =
    useJobApplicationQuery(applicationId, {
      skip: !applicationId,
      refetchOnMountOrArgChange: true,
    })
  const application = (applicationResp?.data?.application ??
    null) as ApplicationRecord | null

  const currentStage =
    application?.currentStage ?? job?.applicationStage ?? null
  const stages = application?.stages ?? job?.applicationStages ?? null
  const crumbs = useMemo(() => buildPipelineCrumbs(stages), [stages])
  const isComplete = currentStage === 'completed'
  const hasApplication = !!applicationId || !!currentStage

  const requestedStep = parseStep(searchParams.get('step'))
  const resolvedStep: PipelineStepId = (() => {
    if (!hasApplication) return 'details'
    if (
      requestedStep &&
      canVisitStep({ step: requestedStep, currentStage, stages })
    ) {
      return requestedStep
    }
    return firstRemainingStep(currentStage, stages)
  })()

  const [applyToJob, { isLoading: applying }] = useApplyToJobMutation()
  const [triggerCvMatch] = useLazyCvMatchQuery()
  const [triggerPrescreeningCheck] = useLazyCheckPrescreeningStageQuery()
  const cvMatchTriggeredFor = useRef<string | null>(null)
  const prescreeningTriggeredFor = useRef<string | null>(null)

  const reviewPersonality = resolvedStep === 'personality' && isComplete
  const reviewPersonalized = resolvedStep === 'personalized' && isComplete

  const { data: personalityData } = usePersonalityTestQuery(jobId, {
    skip: !jobId || resolvedStep !== 'personality' || !isComplete,
  })
  const { data: personalizedData } = usePersonalizedTestQuery(
    { jobId, talentId },
    {
      skip:
        !jobId || !talentId || resolvedStep !== 'personalized' || !isComplete,
    },
  )

  useEffect(() => {
    if (error) {
      notify('error', 'Error loading job post', { autoClose: 2000 })
    }
  }, [error])

  useEffect(() => {
    if (!applicationId || !jobId) return
    if (
      currentStage === 'cv_similarity' &&
      application?.cvSimilarityScore == null &&
      cvMatchTriggeredFor.current !== applicationId
    ) {
      cvMatchTriggeredFor.current = applicationId
      triggerCvMatch(jobId)
    }
    if (
      currentStage === 'prescreening' &&
      prescreeningTriggeredFor.current !== applicationId
    ) {
      prescreeningTriggeredFor.current = applicationId
      triggerPrescreeningCheck(jobId)
    }
  }, [
    application?.cvSimilarityScore,
    applicationId,
    currentStage,
    jobId,
    triggerCvMatch,
    triggerPrescreeningCheck,
  ])

  const setStep = (step: PipelineStepId) => {
    setSearchParams(step === 'details' ? {} : { step }, { replace: true })
  }

  const handleApply = async () => {
    if (isComplete || applying || !jobId) return
    try {
      const result = await applyToJob(jobId).unwrap()
      const nextApplication = result?.data?.application as
        | ApplicationRecord
        | undefined
      await refetchJob()
      await refetchApplication()
      const next = firstRemainingStep(
        nextApplication?.currentStage,
        nextApplication?.stages ?? stages,
      )
      setStep(next === 'details' ? 'details' : next)
    } catch (err) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ||
        'Failed to apply for this job'
      notify('error', message, { autoClose: 2000 })
    }
  }

  const handleStageComplete = async () => {
    await refetchJob()
    await refetchApplication()
  }

  if (isLoading) return <Spinner fullPage />
  if (!job || !jobId) return null

  const applyAction = isComplete ? (
    <Button fullWidth variant="secondary" disabled>
      Applied ✓
    </Button>
  ) : hasApplication ? null : (
    <Button fullWidth onClick={handleApply} loading={applying}>
      Apply for this position
    </Button>
  )

  return (
    <PageShell>
      {hasApplication && (
        <nav className={styles.crumbs} aria-label="Application stages">
          {crumbs.map((crumb) => {
            const enabled = canVisitStep({
              step: crumb.id,
              currentStage,
              stages,
            })
            const isCurrent = crumb.id === resolvedStep
            return (
              <button
                key={crumb.id}
                type="button"
                className={`${styles.crumb} ${
                  isCurrent
                    ? styles.crumbCurrent
                    : enabled
                    ? styles.crumbDone
                    : ''
                }`}
                disabled={!enabled}
                onClick={() => enabled && setStep(crumb.id)}>
                {crumb.label}
              </button>
            )
          })}
        </nav>
      )}

      {resolvedStep === 'details' && (
        <JobDetailsView jobId={jobId} job={job} action={applyAction} />
      )}

      {resolvedStep === 'personality' &&
        (reviewPersonality ? (
          <StageReview
            title="Personality"
            meta={
              application?.mbtiType
                ? `Result: ${application.mbtiType}`
                : undefined
            }
            questions={personalityData?.data?.questions}
          />
        ) : (
          <PersonalityTest
            jobId={jobId}
            onComplete={() => void handleStageComplete()}
          />
        ))}

      {resolvedStep === 'personalized' &&
        talentId &&
        (reviewPersonalized ? (
          <StageReview
            title="Personalized"
            meta={
              application?.personalizedScore != null
                ? `Score: ${application.personalizedScore}%`
                : undefined
            }
            questions={
              personalizedData?.data?.questions ??
              personalizedData?.data?.application?.questions
            }
          />
        ) : (
          <PersonalizedTest
            jobId={jobId}
            talentId={talentId}
            onComplete={() => void handleStageComplete()}
          />
        ))}

      {resolvedStep === 'prescreening' && (
        <StageReview
          title="Prescreening"
          meta={
            application?.talent?.prescreeningScore != null
              ? `Score: ${application.talent.prescreeningScore}%`
              : 'You already completed the global pre-assessment. Waiting for this job to accept that score.'
          }
        />
      )}

      {resolvedStep === 'cv_similarity' && (
        <StageReview
          title="CV match"
          meta={
            application?.cvSimilarityScore != null
              ? `Done — score ${application.cvSimilarityScore}%`
              : currentStage === 'cv_similarity'
              ? 'Running…'
              : 'Not started'
          }
        />
      )}
    </PageShell>
  )
}

export default IndividualJob
