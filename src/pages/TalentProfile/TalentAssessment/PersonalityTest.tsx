import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Bounce } from 'react-toastify'

import { Spinner } from '@/components/ui/Spinner'

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
  _id: string
  question: string
}

interface PostAnswerResponse {
  status: boolean
  message: string
  data: {
    scorePercent: number
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

  // Check if all questions are answered
  const personalityAnswered =
    personalityData?.data?.length > 0 &&
    Object.keys(formData.answers).length === personalityData?.data?.length

  useEffect(() => {
    if (personalityData?.data) {
      setPersonalityQuestions(personalityData.data)
    } else if (personalityError) {
      notify('error', 'Error loading personality test data', {
        autoClose: 5000,
        transition: Bounce,
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
            autoClose: 5000,
          },
        )
        console.log(response.data.scorePercent)
      } else {
        notify(
          'error',
          response.message || 'DisplayError submitting question',
          {
            autoClose: 5000,
            transition: Bounce,
          },
        )
      }
      navigate(`/talentDashboard/applicationPipeline/${jobId}`)
    } catch (error) {
      console.error(error)

      notify('error', 'DisplayError submitting quiz', {
        autoClose: 5000,
        transition: Bounce,
      })
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
              <div key={i} className="bg-grey-50 mb-6 p-4 rounded-2xl">
                <div className="flex justify-center items-start space-x-3 text-grey-900 font-raleway font-medium">
                  <h3 className="text-[18px] leading-[150%]">{i + 1}.</h3>
                  <h3 className="text-[17px] leading-[150%]">
                    {question.question}
                  </h3>
                </div>
                <textarea
                  className="w-full bg-white border border-grey-300 rounded-lg h-[93px] p-3 mt-4"
                  placeholder="Type your answer here ..."
                  name={`answer-${question._id}`}
                  onChange={(e) => handleChange(e, question._id)}
                  required
                />
              </div>
            ))}
            <button
              type="submit"
              disabled={!personalityAnswered} // Disable until all questions are answered
              className={`px-4 py-2 rounded font-raleway text-normal font-medium ${
                personalityAnswered
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

export default PersonalityTest
