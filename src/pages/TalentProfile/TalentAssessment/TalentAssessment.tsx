import { Alert } from '@mui/material'
import Lottie from 'lottie-react'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { Bounce, toast } from 'react-toastify'

import animationData from '../../../assets/Animation - check.json'
import Loading from '../../../components/Loading/Loading'
import {
  useFetchPretestQuery,
  usePostPretestMutation,
} from '../../../redux/api/talent'
import { RootState } from '../../../redux/store/store'
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
      toast.error('DisplayError fetching questions', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
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
        toast.success(`${response.message}`, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
          transition: Bounce,
        })
        // toast.success(`${response.message} ${response.data.scorePercent}`)
      } else {
        toast.error(response.message || 'DisplayError submitting question', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
          transition: Bounce,
        })
      }
    } catch (error) {
      console.log(error)
      toast.error('DisplayError submitting quiz', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
      })
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
