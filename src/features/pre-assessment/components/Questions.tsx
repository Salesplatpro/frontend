import React from 'react'

import { usePreAssessmentStore } from '../store'
import { AssessmentQuestion } from '../types'
import QuestionCard from './QuestionCard'

interface QuestionsProps {
  questions: AssessmentQuestion[]
}

const Questions: React.FC<QuestionsProps> = ({ questions }) => {
  const answers = usePreAssessmentStore((s) => s.answers)
  const currentQuestionIndex = usePreAssessmentStore(
    (s) => s.currentQuestionIndex,
  )
  const setAnswer = usePreAssessmentStore((s) => s.setAnswer)

  const current = questions[currentQuestionIndex]
  if (!current) return null

  return (
    <QuestionCard
      question={current}
      index={currentQuestionIndex}
      total={questions.length}
      selectedAnswer={answers[current.questionId] ?? ''}
      onSelect={(answer) => setAnswer(current.questionId, answer)}
    />
  )
}

export default Questions
