import React, { useEffect, useState } from 'react'
import './TalentQuiz.scss'
import { quizAnswer, roleQuestions } from '../../../api/api-communication'
import { useAuth } from '../../../context/contextHook'
import toast from 'react-hot-toast'
import { Question } from '../../../utils/types'
import Loading from '../../../components/Loading/Loading'

const TalentQuiz = () => {
  const auth = useAuth()
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState<{
    answers: { questionId: string; answer: string }[]
  }>({ answers: [] })

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const id = auth?.userInfo?.user?.profile?.role[0]?._id
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
        // Handle error (e.g., show a toast message)
        toast.error('Error fetching questions')
      }
    }

    fetchQuestions()
  }, [auth])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    questionId: string,
  ) => {
    const { value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      answers: [...prevData.answers, { questionId, answer: value }],
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const data = await quizAnswer(formData)
      if (data.status) {
        toast.success('Submitted successfully')
      } else {
        toast.error(data.message || 'Error submitting question')
      }
    } catch (error) {
      console.log(error)
      // Handle error (e.g., show a toast message)
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
                  name="answer"
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
