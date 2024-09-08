import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'

import Loading from '../../../components/Loading/Loading'
import {
  // useGeneratePersonalizedTestQuery,
  usePersonalityTestQuery,
  usePostPersonalityTestMutation,
  // usePostPersonalizedTestMutation,
} from '../../../redux/api/talent'

// Type definitions
interface FormData {
  jobId: string
  answers: { [key: string]: string }
}

interface Question {
  _id: string
  question: string
}

// interface PersonalityData {
//   data: {
//     questions: Question[]
//   }
// }

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

  const {
    data: personalityData,
    error: personalityError,
    isLoading: personalityLoading,
  } = usePersonalityTestQuery(jobId)

  useEffect(() => {
    if (personalityData) {
      const questions = personalityData.data
      if (questions) {
        setPersonalityQuestions(questions)
      }
    }
    if (personalityError) {
      toast.error('Error loading personality test data')
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
    try {
      const response = (await postAnswer(
        formData,
      ).unwrap()) as PostAnswerResponse
      if (response.status) {
        toast.success(`${response.message} ${response.data.scorePercent}%`)
      } else {
        toast.error(response.message || 'Error submitting question')
      }
      navigate(`/talentDashboard/applicationPipeline/${jobId}`)
    } catch (error) {
      console.error(error)
      toast.error('Error submitting quiz')
    }
  }

  if (personalityLoading) {
    return <Loading />
  }

  return (
    <div className="w-[70%] mx-auto mt-8">
      <h2 className="text-3xl text-[#101828] font-bold">Personality Test</h2>
      <p className="text-xl text-[#101828] font-medium mt-3">
        Welcome to your Personality test, you have the following Questions to
        answer in this stage.
      </p>
      <div className="md:mt-6 mt-2">
        <form onSubmit={handleSubmit}>
          <ul>
            {personalityQuestions.map((question, i) => (
              <div key={i} className="bg-[#F8F8F8] mb-6 p-4 rounded-2xl">
                <div className="flex items-center space-x-3 md:text-lg text-base text-[#101828] font-semibold">
                  <h3>{i + 1}.</h3>
                  <h3>{question.question}</h3>
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
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
              Submit
            </button>
          </ul>
        </form>
      </div>
    </div>
  )
}

export default PersonalityTest
