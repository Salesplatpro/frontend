import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Spinner } from '@/components/ui/Spinner'
import { getErrorMessage } from '@/utils/getErrorMessage'

import {
  useEnsurePersonalityQuestionsMutation,
  usePersonalityTestQuery,
  usePostPersonalityTestMutation,
} from '../../../redux/api/talent'
import { notify } from '../../../utils/toastNotifications'

// Mirrors the poll/timeout shape already proven in
// features/pre-assessment/hooks.ts — give generation a bounded window before
// telling the talent to retry, instead of leaving them on a spinner forever.
const GENERATION_TIMEOUT_MS = 60000

interface FormData {
  jobId: string
  answers: { [key: string]: string }
}

interface Question {
  id: string
  question: string
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

const PersonalityTest: React.FC = () => {
  const navigate = useNavigate()
  const { jobId } = useParams()
  const [personalityQuestions, setPersonalityQuestions] = useState<Question[]>(
    [],
  )
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

  const personalityAnswered =
    personalityData?.data?.questions?.length > 0 &&
    Object.keys(formData.answers).length ===
      personalityData?.data?.questions?.length

  const questionsEmpty =
    !personalityLoading && (personalityData?.data?.questions?.length ?? 0) === 0

  useEffect(() => {
    if (Array.isArray(personalityData?.data?.questions)) {
      setPersonalityQuestions(personalityData.data.questions)
    } else if (personalityError) {
      notify('error', 'Error loading personality test data', {
        autoClose: 2000,
      })

      console.error(personalityError)
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

  // Auto-trigger generation once, the moment we find no questions exist yet —
  // this is what makes retry possible at all (previously nothing but a
  // recruiter could generate personality questions).
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

  const handleChange = (
    e: ChangeEvent<HTMLTextAreaElement>,
    questionId: string,
  ) => {
    const { value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      answers: {
        ...prevData.answers,
        [questionId]: value,
      },
    }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const response = (await postAnswer(
        formData,
      ).unwrap()) as PostPersonalityResponse

      const mbtiType =
        response.data?.mbtiType ||
        response.data?.score ||
        response.data?.application?.mbtiType

      if (response.status && mbtiType) {
        notify(
          'success',
          `${response.message || 'Personality evaluated'}: ${mbtiType}`,
          { autoClose: 3000 },
        )
      } else if (response.status) {
        notify('success', response.message || 'Personality test submitted', {
          autoClose: 2000,
        })
      } else {
        notify(
          'error',
          response.message || 'Error submitting personality test',
          { autoClose: 2000 },
        )
      }
      navigate(`/talentDashboard/applicationPipeline/${jobId}`)
    } catch (error) {
      console.error(error)
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
        <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
          <p className="text-red-500 font-raleway text-center">{ensureError}</p>
          <button
            type="button"
            onClick={handleRetry}
            className="px-4 py-2 rounded font-raleway font-medium bg-blue-500 text-white hover:bg-blue-700">
            Retry
          </button>
        </div>
      )
    }
    if (waitTimedOut) {
      return (
        <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
          <p className="text-grey-700 font-raleway font-medium text-center">
            Still preparing your assessment questions.
          </p>
          <button
            type="button"
            onClick={handleRetry}
            className="px-4 py-2 rounded font-raleway font-medium bg-blue-500 text-white hover:bg-blue-700">
            Tap to retry
          </button>
        </div>
      )
    }
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
        <Spinner />
        <p className="text-grey-700 font-raleway font-medium">
          {isEnsuring
            ? 'Preparing your assessment questions...'
            : 'Loading your assessment...'}
        </p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-full px-4 lg:w-[70%] md:w-[80%] mx-auto mt-8 box-border">
      <div className="ml-0 sm:ml-8">
        <h2 className="text-2xl md:text-3xl text-grey-900 font-bold">
          Personality Test
        </h2>
        <p className="text-xl text-grey-900 font-medium mt-3 font-raleway">
          Welcome to your Personality test, you have the following Questions to
          answer in this stage.
        </p>
      </div>
      <div className="md:mt-6 mt-2">
        <form onSubmit={handleSubmit}>
          <ul>
            {personalityQuestions.map((question, i) => (
              <div
                key={question.id}
                className="bg-grey-50 mb-6 p-4 rounded-2xl">
                <div className="flex justify-center items-start space-x-3 text-grey-900 font-raleway font-medium">
                  <h3 className="text-lg leading-[150%]">{i + 1}.</h3>
                  <h3 className="text-lg leading-[150%]">
                    {question.question}
                  </h3>
                </div>
                <textarea
                  className="w-full bg-white border border-grey-300 rounded-lg h-[93px] p-3 mt-4"
                  placeholder="Type your answer here ..."
                  name={`answer-${question.id}`}
                  onChange={(e) => handleChange(e, question.id)}
                  required
                />
              </div>
            ))}
            <button
              type="submit"
              disabled={!personalityAnswered || isSubmitting}
              className={`px-4 py-2 rounded font-raleway text-normal font-medium ${
                personalityAnswered && !isSubmitting
                  ? 'bg-blue-500 text-white hover:bg-blue-700'
                  : 'bg-gray-400 text-gray-700 cursor-not-allowed'
              }`}>
              {isSubmitting ? 'Submitting…' : 'Submit'}
            </button>
          </ul>
        </form>
      </div>
    </div>
  )
}

export default PersonalityTest
