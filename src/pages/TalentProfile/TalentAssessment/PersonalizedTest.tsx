import React, { FormEvent, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Spinner } from '@/components/ui/Spinner'
import { getErrorMessage } from '@/utils/getErrorMessage'

import {
  useGeneratePersonalizedTestQuery,
  usePostPersonalizedTestMutation,
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

interface PostAnswerResponse {
  status: boolean
  message: string
  data: {
    scorePercent: number
  }
}

export type PersonalizedTestProps = {
  jobId?: string
  talentId?: string
  onComplete?: () => void
}

const PersonalizedTest: React.FC<PersonalizedTestProps> = ({
  jobId: jobIdProp,
  talentId: talentIdProp,
  onComplete,
}) => {
  const navigate = useNavigate()
  const { jobId: jobIdParam, talentId: talentIdParam } = useParams<{
    jobId: string
    talentId: string
  }>()
  const jobId = jobIdProp || jobIdParam
  const talentId = talentIdProp || talentIdParam
  const [personalizedQuestions, setPersonalizedQuestions] = useState<
    AssessmentQuestion[]
  >([])
  const [postAnswer] = usePostPersonalizedTestMutation()
  const [formData, setFormData] = useState<FormData>({
    jobId: jobId || '',
    answers: {},
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [waitTimedOut, setWaitTimedOut] = useState(false)
  const isValidTalentId = !!talentId && talentId !== 'undefined'

  const {
    data: personalizedData,
    error: personalizedError,
    isLoading: personalizedLoading,
    isFetching: personalizedFetching,
    refetch: refetchPersonalizedTest,
  } = useGeneratePersonalizedTestQuery(
    { jobId, talentId },
    { skip: !jobId || !isValidTalentId },
  )

  const questionsEmpty =
    !personalizedLoading &&
    !personalizedFetching &&
    !personalizedError &&
    personalizedQuestions.length === 0

  useEffect(() => {
    if (!questionsEmpty) {
      setWaitTimedOut(false)
      return
    }
    const id = setTimeout(() => setWaitTimedOut(true), GENERATION_TIMEOUT_MS)
    return () => clearTimeout(id)
  }, [questionsEmpty])

  useEffect(() => {
    if (!isValidTalentId) {
      notify(
        'error',
        'Unable to load your personalized test. Please try again.',
        {
          autoClose: 2000,
        },
      )
      navigate(`/talentDashboard/job/${jobId}`)
    }
  }, [isValidTalentId, jobId, navigate])

  useEffect(() => {
    if (personalizedData) {
      const questions =
        personalizedData.data.application?.questions ||
        personalizedData.data.questions
      if (questions) {
        setPersonalizedQuestions(questions)
      }
    }
    if (personalizedError) {
      notify('error', 'Error loading personalized test data', {
        autoClose: 2000,
      })
    }
  }, [personalizedData, personalizedError])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!allQuestionsAnswered(personalizedQuestions, formData.answers)) return
    setIsSubmitting(true)
    try {
      const response = (await postAnswer(
        formData,
      ).unwrap()) as PostAnswerResponse
      if (!response.status) {
        notify('error', response.message || 'Error submitting question', {
          autoClose: 2000,
        })
        return
      }
      if (onComplete) {
        await Promise.resolve(onComplete())
      } else {
        navigate(`/talentDashboard/job/${jobId}`)
      }
    } catch {
      notify('error', 'Error submitting quiz', {
        autoClose: 2000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (personalizedLoading) {
    return <Spinner fullPage />
  }

  if (personalizedError) {
    return (
      <AssessmentStatus
        error
        message={getErrorMessage(
          personalizedError,
          'Unable to load your personalized test.',
        )}
        actionLabel="Retry"
        onAction={() => void refetchPersonalizedTest()}
      />
    )
  }

  if (questionsEmpty) {
    if (waitTimedOut) {
      return (
        <AssessmentStatus
          message="Still preparing your assessment questions."
          actionLabel="Tap to retry"
          onAction={() => {
            setWaitTimedOut(false)
            void refetchPersonalizedTest()
          }}
        />
      )
    }
    return (
      <AssessmentStatus
        loading
        message="Preparing your assessment questions..."
      />
    )
  }

  return (
    <AssessmentForm
      variant="role"
      emoji="🎯"
      kicker="This role, your way"
      title="Show how you would do this job"
      lead="These questions are written for this role. Walk through what you would do — specifics beat slogans."
      questions={personalizedQuestions}
      answers={formData.answers}
      onChange={(questionId, value) =>
        setFormData((prev) => ({
          ...prev,
          answers: { ...prev.answers, [questionId]: value },
        }))
      }
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      placeholder="Describe what you would do…"
    />
  )
}

export default PersonalizedTest
