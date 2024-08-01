import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { usePostPersonalizedTestMutation } from '../../../redux/api/talent'

// Type definitions
interface PersonalizedQuestion {
  _id: string
  question: string
}

interface PersonalizedTestProps {
  personalizedQuestion: PersonalizedQuestion[]
  jobId: string
}

interface FormData {
  jobId: string
  answers: { [key: string]: string }
}

const PersonalizedTest: React.FC<PersonalizedTestProps> = ({
  personalizedQuestion,
  jobId,
}) => {
  const [postAnswer] = usePostPersonalizedTestMutation()
  const [formData, setFormData] = useState<FormData>({
    jobId: jobId || '',
    answers: {},
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const response = await postAnswer(formData).unwrap()
      console.log(formData)
      if (response.status) {
        toast.success(`${response.message} ${response.data.scorePercent}`)
      } else {
        toast.error(response.message || 'Error submitting question')
      }
    } catch (error) {
      console.error(error)
      toast.error('Error submitting quiz')
    }
  }

  return (
    <div>
      <div>
        <form onSubmit={handleSubmit}>
          <ul>
            {personalizedQuestion.map((question, i) => (
              <div key={i} className="bg-[#F8F8F8] mb-6 p-4 rounded-2xl">
                <div className="flex item-center space-x-3 md:text-lg text-base text-[#101828] font-semibold">
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

export default PersonalizedTest
