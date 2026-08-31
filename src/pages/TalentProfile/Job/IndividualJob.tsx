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
  isStageComplete,
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

type SavedQuestion = {
  id: string
  question: string
  answer?: string | null
}

const parseStep = (value: string | null): PipelineStepId | null => {
  if (
    value === 'details' ||
    value === 'personality' ||
    value === 'personalized' ||
    value === 'cv_similarity'
  ) {
    return value
  }
  return null
}

const questionsHaveAnswers = (questions?: SavedQuestion[]) =>
  !!questions?.some((item) => (item.answer ?? '').trim().length > 0)

const StageReview = ({
  title,
  meta,
  questions,
}: {
  title: string
  meta?: string
  questions?: SavedQuestion[]
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

  const personalityDone = isStageComplete('personality', currentStage, stages)
  const personalizedDone = isStageComplete('personalized', currentStage, stages)

  const loadPersonality =
    resolvedStep === 'personality' ||
    (resolvedStep === 'details' && personalityDone)
  const loadPersonalized =
    resolvedStep === 'personalized' ||
    (resolvedStep === 'details' && personalizedDone)

  const { data: personalityData } = usePersonalityTestQuery(jobId, {
    skip: !jobId || !loadPersonality,
  })
  const { data: personalizedData } = usePersonalizedTestQuery(
    { jobId, talentId },
    {
      skip: !jobId || !talentId || !loadPersonalized,
    },
  )

  const personalityQuestions = personalityData?.data?.questions as
    | SavedQuestion[]
    | undefined
  const personalizedQuestions = (personalizedData?.data?.questions ??
    personalizedData?.data?.application?.questions) as
    | SavedQuestion[]
    | undefined

  const showPersonalityReview =
    personalityDone || questionsHaveAnswers(personalityQuestions)
  const showPersonalizedReview =
    personalizedDone || questionsHaveAnswers(personalizedQuestions)

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

  const submittedAnswers = (
    <>
      {showPersonalityReview && personalityQuestions?.length ? (
        <StageReview
          title="Personality — your submitted answers"
          meta={
            application?.mbtiType
              ? `Result: ${application.mbtiType}`
              : 'Saved. You can revisit these answers anytime.'
          }
          questions={personalityQuestions}
        />
      ) : null}
      {showPersonalizedReview && personalizedQuestions?.length ? (
        <StageReview
          title="Role assessment — your submitted answers"
          meta={
            application?.personalizedScore != null
              ? 'Submitted. Your recruiter can see how you scored on this stage.'
              : 'Saved. You can revisit these answers anytime.'
          }
          questions={personalizedQuestions}
        />
      ) : null}
    </>
  )

  return (
    <PageShell>
      {hasApplication && (
        <nav className={styles.crumbs} aria-label="Application stages">
          {crumbs.map((crumb, index) => {
            const enabled = canVisitStep({
              step: crumb.id,
              currentStage,
              stages,
            })
            const isCurrent = crumb.id === resolvedStep
            return (
              <React.Fragment key={crumb.id}>
                {index > 0 ? (
                  <span className={styles.crumbSep} aria-hidden>
                    /
                  </span>
                ) : null}
                <button
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
              </React.Fragment>
            )
          })}
        </nav>
      )}

      {resolvedStep === 'details' && (
        <>
          <JobDetailsView jobId={jobId} job={job} action={applyAction} />
          {hasApplication && submittedAnswers}
        </>
      )}

      {resolvedStep === 'personality' &&
        (showPersonalityReview ? (
          <StageReview
            title="Personality"
            meta={
              application?.mbtiType
                ? `Result: ${application.mbtiType}`
                : 'Your submitted answers are saved below.'
            }
            questions={personalityQuestions}
          />
        ) : (
          <PersonalityTest
            jobId={jobId}
            onComplete={() => void handleStageComplete()}
          />
        ))}

      {resolvedStep === 'personalized' &&
        talentId &&
        (showPersonalizedReview ? (
          <StageReview
            title="Role assessment"
            meta="Your submitted answers are saved below."
            questions={personalizedQuestions}
          />
        ) : (
          <PersonalizedTest
            jobId={jobId}
            talentId={talentId}
            onComplete={() => void handleStageComplete()}
          />
        ))}

      {resolvedStep === 'cv_similarity' && (
        <StageReview
          title="Application review"
          meta={
            application?.cvSimilarityScore != null ||
            currentStage === 'completed'
              ? 'This stage is complete. Your recruiter can review how your CV aligns with the role.'
              : currentStage === 'cv_similarity'
              ? 'We’re reviewing your application. You can keep browsing this job while that finishes.'
              : 'Not started'
          }
        />
      )}
    </PageShell>
  )
}

export default IndividualJob
