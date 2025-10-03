import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Bounce } from 'react-toastify'

import Loading from '../../../components/Loading/Loading'
import {
  useGeneratePersonalizedTestQuery,
  usePostPersonalizedTestMutation,
} from '../../../redux/api/talent'
import { notify } from '../../../utils/toastNotifications'

// Type definitions
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

const PersonalizedTest: React.FC = () => {
  const navigate = useNavigate()
  const { jobId, talentId } = useParams<{ jobId: string; talentId: string }>()
  const [personalizedQuestions, setPersonalizedQuestions] = useState<
    Question[]
  >([])
  const [postAnswer] = usePostPersonalizedTestMutation()
  const [formData, setFormData] = useState<FormData>({
    jobId: jobId || '',
    answers: {},
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    data: personalizedData,
    error: personalizedError,
    isLoading: personalizedLoading,
  } = useGeneratePersonalizedTestQuery({ jobId, talentId })

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
        autoClose: 5000,
        transition: Bounce,
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
      notify('error', 'Error submitting quiz', {
        autoClose: 5000,
        transition: Bounce,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (personalizedLoading) {
    return <Loading />
  }

  return (
    <div className="lg:w-[70%] md:w-[80%] mx-auto mt-8">
      <div className="ml-8">
        <h2 className="text-[30px] font-raleway text-[#101828] font-bold">
          Personalized Test
        </h2>
        <p className="text-xl text-[#101828] font-medium mt-3 font-raleway">
          Welcome to your Personalized test, you have these Questions to answer
          in this stage.
        </p>
      </div>

      <div className="md:mt-6 mt-2">
        <form onSubmit={handleSubmit}>
          <ul>
            {personalizedQuestions.map((question, i) => (
              <div key={i} className="bg-[#F8F8F8] mb-6 p-4 rounded-2xl">
                <div className="flex justify-center items-start space-x-3 text-[#101828] font-raleway font-medium">
                  <h3 className="text-[18px] leading-[150%]">{i + 1}.</h3>
                  <h3 className="text-[17px] leading-[150%]">
                    {question.question}
                  </h3>
                </div>
                <textarea
                  className="w-full bg-white border border-[#D0D5DD] rounded-lg h-[93px] p-3 mt-4"
                  placeholder="Answer here"
                  name={`answer-${question._id}`}
                  onChange={(e) => handleChange(e, question._id)}
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
