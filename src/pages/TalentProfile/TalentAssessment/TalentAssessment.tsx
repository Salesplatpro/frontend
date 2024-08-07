import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store/store'
import Loading from '../../../components/Loading/Loading'
import toast from 'react-hot-toast'
import { Question } from '../../../utils/types'
import {
  useFetchPretestQuery,
  usePostPretestMutation,
} from '../../../redux/api/talent'

const TalentAssessment = () => {
  const user = useSelector((state: RootState) => state.auth)
  const roleId = user?.user?.profile?.role[0]?._id

  const { data, error, isLoading } = useFetchPretestQuery(roleId)
  const [postAnswer] = usePostPretestMutation()
  const [questions, setQuestions] = useState<Question[]>([])
  const [formData, setFormData] = useState<{
    roleId: string
    answers: { [key: string]: string }
  }>({ roleId: roleId || '', answers: {} })

  useEffect(() => {
    if (data) {
      setQuestions(data.data)
      console.log(data.data)
    }
    if (error) {
      toast.error('Error fetching questions')
    }
  }, [data, error])

  if (!roleId) {
    return (
      <div>
        <h2>Please complete your profile creation</h2>
      </div>
    )
  }

  if (isLoading) return <Loading />

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
      console.log(error)
      toast.error('Error submitting quiz')
    }
  }

  return (
    <div>
      <div className="w-[70%] mx-auto">
        <h2 className="text-3xl text-[#101828] font-bold">
          Pre-Assessment Test
        </h2>
        <p className="text-xl text-[#101828] font-medium my-3">
          Welcome to your Assessment test, you have 15 Questions to answer in
          this stage.
        </p>

        <div className="md:mt-16 mt-8">
          <form onSubmit={handleSubmit} className="">
            <ul>
              {questions.map((question, i) => (
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
    </div>
  )
}

export default TalentAssessment
