import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Spinner } from '@/components/ui/Spinner'
import { getErrorMessage } from '@/utils/getErrorMessage'

import {
  usePersonalityTestQuery,
  usePostPersonalityTestMutation,
} from '../../../redux/api/talent'
import { notify } from '../../../utils/toastNotifications'

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

  const {
    data: personalityData,
    error: personalityError,
    isLoading: personalityLoading,
  } = usePersonalityTestQuery(jobId)

  const personalityAnswered =
    personalityData?.data?.questions?.length > 0 &&
    Object.keys(formData.answers).length ===
      personalityData?.data?.questions?.length

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

  return (
    <div className="lg:w-[70%] md:w-[80%] mx-auto mt-8">
      <div className="ml-8">
        <h2 className="text-3xl text-grey-900 font-bold">Personality Test</h2>
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
