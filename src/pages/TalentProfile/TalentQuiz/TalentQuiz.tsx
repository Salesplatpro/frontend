import './TalentQuiz.scss'

import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { quizAnswer, roleQuestions } from '../../../api/api-communication'
import Loading from '../../../components/Loading/Loading'
import { useAuth } from '../../../context/contextHook'
import { Question } from '../../../utils/types'

const TalentQuiz = () => {
  const auth = useAuth()
  const id = auth?.userInfo?.user?.profile?.role[0]?._id
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState<{
    roleId: string
    answers: { questionId: string; answer: string }[]
  }>({ roleId: id || '', answers: [] })

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        if (!id) throw new Error('Role ID not found')

        const response = await roleQuestions(id)
        if (response.status && response.data) {
          setLoading(false)
          setQuestions(response.data)
        } else {
          throw new Error('Invalid response')
        }
      } catch (error) {
        console.log(error)
        toast.error('Error fetching questions')
      }
    }

    fetchQuestions()
  }, [id])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    questionId: string,
  ) => {
    const { value } = e.target
    setFormData((prevData) => {
      const existingAnswerIndex = prevData.answers.findIndex(
        (answer) => answer.questionId === questionId,
      )

      let newAnswers = [...prevData.answers]

      if (existingAnswerIndex !== -1) {
        // Update existing answer
        newAnswers[existingAnswerIndex].answer = value
      } else {
        // Add new answer
        newAnswers.push({ questionId, answer: value })
      }

      return {
        ...prevData,
        answers: newAnswers,
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const data = await quizAnswer(formData)
      console.log(formData)
      if (data.status) {
        toast.success(`${data.message} ${data.data.scorePercent}`)
      } else {
        toast.error(data.message || 'Error submitting question')
      }
    } catch (error) {
      console.log(error)
      toast.error('Error submitting quiz')
    }
  }

  return (
    <div className="talentQuiz">
      <div className="quiz-container">
        <h2>Assessment</h2>
        {loading ? (
          <Loading />
        ) : (
          <form className="quiz" onSubmit={handleSubmit}>
            {questions.map((question, i) => (
              <div key={i}>
                <div className="quiz-question">
                  <h3>{i + 1}.</h3>
                  <h3>{question.question}</h3>
                </div>
                <input
                  type="text"
                  className="quiz-input"
                  name={`answer-${question._id}`}
                  onChange={(e) => handleChange(e, question._id)}
                  required
                />
              </div>
            ))}
            <button type="submit">Submit</button>
          </form>
        )}
      </div>
    </div>
  )
}

export default TalentQuiz
