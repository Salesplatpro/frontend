import React from 'react'

import { AssessmentQuestion } from '../types'
import styles from './QuestionCard.module.scss'

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

interface QuestionCardProps {
  question: AssessmentQuestion
  index: number
  total: number
  selectedAnswer: string
  onSelect: (answer: string) => void
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedAnswer,
  onSelect,
}) => {
  const category = question.category
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())

  return (
    <div className={styles.card}>
      <p className={styles.competency}>Competency: {category}</p>

      <p className={styles.question}>{question.question}</p>

      <div className={styles.options}>
        {question.options.map((option, i) => {
          const isSelected = selectedAnswer === option
          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelect(option)}
              className={`${styles.option} ${
                isSelected ? styles.optionSelected : ''
              }`}>
              <div
                className={`${styles.radio} ${
                  isSelected ? styles.radioSelected : ''
                }`}>
                {isSelected && <div className={styles.radioDot} />}
              </div>
              <span className={styles.letter}>{LETTERS[i]}.</span>
              <span>{option}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default QuestionCard
