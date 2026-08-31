import React, { FormEvent, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Spinner } from '@/components/ui/Spinner'
import { getErrorMessage } from '@/utils/getErrorMessage'

import {
  useEnsurePersonalityQuestionsMutation,
  usePersonalityTestQuery,
  usePostPersonalityTestMutation,
} from '../../../redux/api/talent'
import { notify } from '../../../utils/toastNotifications'
import {
  allQuestionsAnswered,
  AssessmentForm,
  AssessmentQuestion,
  AssessmentStatus,
} from './AssessmentForm'

const GENERATION_TIMEOUT_MS = 60000

interface FormData {
  jobId: string
  answers: { [key: string]: string }
}

interface PostPersonalityResponse {
  status: boolean
  message: string
  data: {
    mbtiType?: string
    score?: string
    application?: { mbtiType?: string }
  }
}

export type PersonalityTestProps = {
  jobId?: string
  onComplete?: () => void
}

const PersonalityTest: React.FC<PersonalityTestProps> = ({
  jobId: jobIdProp,
  onComplete,
}) => {
  const navigate = useNavigate()
  const { jobId: jobIdParam } = useParams()
  const jobId = jobIdProp || jobIdParam
  const [personalityQuestions, setPersonalityQuestions] = useState<
    AssessmentQuestion[]
  >([])
  const [postAnswer] = usePostPersonalityTestMutation()
  const [formData, setFormData] = useState<FormData>({
    jobId: jobId || '',
    answers: {},
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [autoEnsureAttempted, setAutoEnsureAttempted] = useState(false)
  const [waitTimedOut, setWaitTimedOut] = useState(false)
  const [ensureError, setEnsureError] = useState<string | null>(null)

  const {
    data: personalityData,
    error: personalityError,
    isLoading: personalityLoading,
    refetch: refetchPersonalityTest,
  } = usePersonalityTestQuery(jobId)
  const [ensurePersonalityQuestions, { isLoading: isEnsuring }] =
    useEnsurePersonalityQuestionsMutation()

  const questionsEmpty =
    !personalityLoading && (personalityData?.data?.questions?.length ?? 0) === 0

  useEffect(() => {
    if (Array.isArray(personalityData?.data?.questions)) {
      setPersonalityQuestions(personalityData.data.questions)
    } else if (personalityError) {
      notify('error', 'Error loading personality test data', {
        autoClose: 2000,
      })
    }
  }, [personalityData, personalityError])

  const attemptGeneration = async () => {
    if (!jobId) return
    setEnsureError(null)
    try {
      await ensurePersonalityQuestions(jobId).unwrap()
      await refetchPersonalityTest()
    } catch (error) {
      setEnsureError(
        getErrorMessage(error, 'Unable to prepare your assessment'),
      )
    }
  }

  useEffect(() => {
    if (!questionsEmpty || autoEnsureAttempted) return
    setAutoEnsureAttempted(true)
    void attemptGeneration()
  }, [questionsEmpty, autoEnsureAttempted])

  useEffect(() => {
    if (!autoEnsureAttempted || !questionsEmpty) return
    const id = setTimeout(() => setWaitTimedOut(true), GENERATION_TIMEOUT_MS)
    return () => clearTimeout(id)
  }, [autoEnsureAttempted, questionsEmpty])

  const handleRetry = () => {
    setWaitTimedOut(false)
    void attemptGeneration()
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!allQuestionsAnswered(personalityQuestions, formData.answers)) return
    setIsSubmitting(true)
    try {
      const response = (await postAnswer(
        formData,
      ).unwrap()) as PostPersonalityResponse

      if (!response.status) {
        notify(
          'error',
          response.message || 'Error submitting personality test',
          { autoClose: 2000 },
        )
        return
      }
      if (onComplete) {
        await Promise.resolve(onComplete())
      } else {
        navigate(`/talentDashboard/job/${jobId}`)
      }
    } catch (error) {
      notify(
        'error',
        getErrorMessage(error, 'Error submitting personality test'),
        { autoClose: 3000 },
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (personalityLoading) {
    return <Spinner fullPage />
  }

  if (questionsEmpty) {
    if (ensureError) {
      return (
        <AssessmentStatus
          error
          message={ensureError}
          actionLabel="Retry"
          onAction={handleRetry}
        />
      )
    }
    if (waitTimedOut) {
      return (
        <AssessmentStatus
          message="Still preparing your assessment questions."
          actionLabel="Tap to retry"
          onAction={handleRetry}
        />
      )
    }
    return (
      <AssessmentStatus
        loading
        message={
          isEnsuring
            ? 'Preparing your assessment questions...'
            : 'Loading your assessment...'
        }
      />
    )
  }

  return (
    <AssessmentForm
      variant="personality"
      emoji="✨"
      kicker="Get to know you"
      title="How do you show up at work?"
      lead="A few short workplace scenarios. There are no wrong answers — write how you would actually handle them."
      questions={personalityQuestions}
      answers={formData.answers}
      onChange={(questionId, value) =>
        setFormData((prev) => ({
          ...prev,
          answers: { ...prev.answers, [questionId]: value },
        }))
      }
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      placeholder="Type your answer here…"
    />
  )
}

export default PersonalityTest
