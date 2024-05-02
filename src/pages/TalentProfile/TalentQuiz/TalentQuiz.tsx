import React, { useEffect, useState, useMemo } from 'react'
import './TalentQuiz.scss'
import { quizAnswer, roleQuestions } from '../../../api/api-communication'
import { useAuth } from '../../../context/contextHook'
import toast from 'react-hot-toast'

interface QuestionForm {
  answers: { questionId: string; answer: string }[]
}

interface Question {
  _id: string
  question: string
}

const TalentQuiz = () => {
  const auth = useAuth()
  const [questions, setQuestions] = useState<Question[]>([])
  const [formData, setFormData] = useState<QuestionForm>({ answers: [] })
  console.log(auth?.isLoggedIn)

  useEffect(() => {
    const fetchQuestions = async () => {
      const id = auth?.userInfo.user.profile.role[0]._id
      try {
        const response = await roleQuestions(id)
        if (response.status && response.data) {
          setQuestions(response.data)
        } else {
          throw new Error('Invalid')
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchQuestions()
  }, [auth])

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    questionId: string,
  ) => {
    const { value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      answers: [...(prevData.answers || []), { questionId, answer: value }],
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      console.log(formData)
      const data = await quizAnswer(formData)
      if (data.status) {
        toast.success('Submitted successfully')
      } else {
        toast.error(data.message || 'Error submitting question')
      }
      return data
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="talentQuiz">
      <div className="quiz-container">
        <h2>Quiz</h2>

        <form className="quiz" onSubmit={handleSubmit}>
          {useMemo(() => {
            return questions.map((question, i) => (
              <div key={i}>
                <div className="quiz-question">
                  <h4>{i + 1}.</h4>
                  <h4>{question.question}</h4>
                </div>
                <textarea
                  className="quiz-input"
                  name="answer"
                  onChange={(e) => handleChange(e, question._id)}
                  required
                />
              </div>
            ))
          }, [questions])}

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  )
}

export default TalentQuiz
