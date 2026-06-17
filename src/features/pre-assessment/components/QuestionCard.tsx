import React from 'react'

import { AssessmentQuestion } from '../types'

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
    <div className="bg-white rounded-2xl border border-grey-200 p-6 w-full">
      <p className="text-sm font-semibold text-blue-600 font-raleway mb-4">
        Competency: {category}
      </p>

      <p className="text-[18px] font-semibold text-grey-900 leading-[150%] mb-6">
        {question.question}
      </p>

      <div className="flex flex-col gap-3">
        {question.options.map((option, i) => {
          const isSelected = selectedAnswer === option
          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelect(option)}
              className={`flex items-center gap-3 text-left px-4 py-3 rounded-xl border text-[15px] font-raleway font-medium transition-colors ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-grey-200 bg-grey-50 text-grey-800 hover:border-blue-300 hover:bg-blue-50'
              }`}>
              <div
                className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                  isSelected ? 'border-blue-500' : 'border-grey-300'
                }`}>
                {isSelected && (
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                )}
              </div>
              <span className="font-bold w-5 flex-shrink-0">{LETTERS[i]}.</span>
              <span>{option}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default QuestionCard
