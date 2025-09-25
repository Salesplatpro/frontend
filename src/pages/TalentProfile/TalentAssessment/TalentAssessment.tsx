import { Alert } from '@mui/material'
import Lottie from 'lottie-react'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { Bounce } from 'react-toastify'

import animationData from '../../../assets/Animation - check.json'
import Loading from '../../../components/Loading/Loading'
import {
  useFetchPretestQuery,
  usePostPretestMutation,
} from '../../../redux/api/talent'
import { RootState } from '../../../redux/store/store'
import { notify } from '../../../utils/toastNotifications'
import { Question } from '../../../utils/types'

const TalentAssessment = () => {
  const user = useSelector((state: RootState) => state.auth)
  const roleId = user?.user?.profile?.role[0]?._id
  const location = useLocation()
  const canRetakeAssessment = location.state?.canRetakeAssessment || false
  const { data, error, isLoading } = useFetchPretestQuery(roleId)
  const [postAnswer] = usePostPretestMutation()
  const [questions, setQuestions] = useState<Question[]>([])
  const [formData, setFormData] = useState<{
    roleId: string
    answers: { [key: string]: string }
  }>({ roleId: roleId || '', answers: {} })

  // Track whether all questions have been answered
  const allAnswered =
    questions.length > 0 &&
    Object.keys(formData.answers).length === questions.length

  useEffect(() => {
    if (data) {
      setQuestions(data.data)
      console.log(data.data)
    }
    if (error) {
      notify('error', 'DisplayError fetching questions', {
        autoClose: 5000,
        transition: Bounce,
      })
    }
  }, [data, error])

  if (!roleId) {
    return <Alert severity="info">Please complete your profile creation</Alert>
  }

  if (user.user.profile.prescreeningScore && !canRetakeAssessment) {
    return (
      <div className="flex justify-center items-center flex-col w-full h-full">
        <div>
          <Lottie
            animationData={animationData}
            loop={false}
            className="w-28 h-28 lg:w-44 lg:h-44 md:w-36 md:h-36"
          />
        </div>

        <h2 className="font-raleway font-semibold text-center text-lg lg:text-2xl md:text-xl text-[#4b4b4b] pt-4">
          You Have Taken The Test Already
        </h2>
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
        notify('success', `${response.message}`, {
          autoClose: 5000,
        })

        // toast.success(`${response.message} ${response.data.scorePercent}`)
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
    } catch (error) {
      console.log(error)

      notify('error', 'DisplayError submitting quiz', {
        autoClose: 5000,
        transition: Bounce,
      })
    }
  }

  return (
    <div>
      <div className="w-[70%] mx-auto">
        <h2 className="text-[30px]  text-[#101828] font-bold">
          Pre-Assessment Test
        </h2>
        <p className="text-xl font-raleway text-[#101828] font-medium my-3">
          Welcome to your Assessment test, you have 15 Questions to answer in
          this stage.
        </p>

        <div className="md:mt-16 mt-2">
          <form onSubmit={handleSubmit} className="">
            <ul>
              {questions.map((question, i) => (
                <div key={i} className="bg-[#F8F8F8] mb-6 p-4 rounded-2xl">
                  <div className="flex items-center justify-start space-x-3 text-[#101828] font-medium">
                    <h3 className="text-[18px] leading-[150%]">{i + 1}.</h3>
                    <h3 className="text-[18px] leading-[150%]">
                      {question.question}
                    </h3>
                  </div>

                  <textarea
                    className="w-full bg-white border border-[#D0D5DD] rounded-lg h-[100px] p-3 mt-3"
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
