import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Spinner } from '@/components/ui/Spinner'
import { getErrorMessage } from '@/utils/getErrorMessage'

import {
  useGeneratePersonalizedTestQuery,
  usePostPersonalizedTestMutation,
} from '../../../redux/api/talent'
import { notify } from '../../../utils/toastNotifications'

// Mirrors the poll/timeout shape already proven in
// features/pre-assessment/hooks.ts.
const GENERATION_TIMEOUT_MS = 60000

// Type definitions
interface FormData {
  jobId: string
  answers: { [key: string]: string }
}

interface Question {
  id: string
  question: string
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
    Question[]
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

  // POST /questions/personalized is idempotent (returns existing questions if
  // already generated), so a plain refetch is a safe, real retry — no risk of
  // duplicate generation.
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

  // Check if all questions are answered
  const allAnswered =
    personalizedQuestions.length > 0 &&
    Object.keys(formData.answers).length === personalizedQuestions.length

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
      notify('error', 'DisplayError loading personalized test data', {
        autoClose: 2000,
      })

      console.error(personalizedError)
    }
  }, [personalizedData, personalizedError])

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
    console.log(formData.answers)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const response = (await postAnswer(
        formData,
      ).unwrap()) as PostAnswerResponse
      if (response.status) {
        notify(
          'success',
          `${response.message} ${response.data.scorePercent}%`,
          {
            autoClose: 2000,
          },
        )
        console.log(response.data.scorePercent)
      } else {
        notify(
          'error',
          response.message || 'DisplayError submitting question',
          {
            autoClose: 2000,
          },
        )
      }
      if (onComplete) {
        onComplete()
      } else {
        navigate(`/talentDashboard/job/${jobId}`)
      }
    } catch (error) {
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
      <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
        <p className="text-red-500 font-raleway text-center">
          {getErrorMessage(
            personalizedError,
            'Unable to load your personalized test.',
          )}
        </p>
        <button
          type="button"
          onClick={() => refetchPersonalizedTest()}
          className="px-4 py-2 rounded font-raleway font-medium bg-blue-500 text-white hover:bg-blue-700">
          Retry
        </button>
      </div>
    )
  }

  if (questionsEmpty) {
    if (waitTimedOut) {
      return (
        <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
          <p className="text-grey-700 font-raleway font-medium text-center">
            Still preparing your assessment questions.
          </p>
          <button
            type="button"
            onClick={() => {
              setWaitTimedOut(false)
              void refetchPersonalizedTest()
            }}
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
          Preparing your assessment questions...
        </p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-full px-4 lg:w-[70%] md:w-[80%] mx-auto mt-8 box-border">
      <div className="ml-0 sm:ml-8">
        <h2 className="text-2xl md:text-3xl font-raleway text-grey-900 font-bold">
          Personalized Test
        </h2>
        <p className="text-xl text-grey-900 font-medium mt-3 font-raleway">
          Welcome to your Personalized test, you have these Questions to answer
          in this stage.
        </p>
      </div>

      <div className="md:mt-6 mt-2">
        <form onSubmit={handleSubmit}>
          <ul>
            {personalizedQuestions.map((question, i) => (
              <div key={i} className="bg-grey-50 mb-6 p-4 rounded-2xl">
                <div className="flex justify-center items-start space-x-3 text-grey-900 font-raleway font-medium">
                  <h3 className="text-lg leading-[150%]">{i + 1}.</h3>
                  <h3 className="text-lg leading-[150%]">
                    {question.question}
                  </h3>
                </div>
                <textarea
                  className="w-full bg-white border border-grey-300 rounded-lg h-[93px] p-3 mt-4"
                  placeholder="Answer here"
                  name={`answer-${question.id}`}
                  onChange={(e) => handleChange(e, question.id)}
                  required
                />
              </div>
            ))}
            <button
              type="submit"
              disabled={!allAnswered} // Disable until all questions are answered
              className={`px-4 py-2 rounded font-raleway text-normal font-medium ${
                allAnswered
                  ? 'bg-blue-500 text-white hover:bg-blue-700'
                  : 'bg-gray-400 text-gray-700 cursor-not-allowed'
              }`}>
              {isSubmitting ? 'submitting' : 'submit'}
            </button>
          </ul>
        </form>
      </div>
    </div>
  )
}

export default PersonalizedTest
