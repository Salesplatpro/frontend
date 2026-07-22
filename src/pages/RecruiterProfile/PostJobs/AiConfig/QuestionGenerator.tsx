import React from 'react'
import { FaPlus } from 'react-icons/fa6'
import { RiDeleteBin6Line } from 'react-icons/ri'

import styles from './QuestionGenerator.module.scss'
import { PersonalityQuestion } from './useGeneratedQuestion'

type QuestionGeneratorProps = {
  pair: string
  questions: PersonalityQuestion[]
  count: string | number
  onCountChange: (count: string) => void
  onGenerate: () => void
  onRemove: (questionId: string) => void
  isLoading: boolean
  countError?: string
}

const QuestionGenerator = ({
  pair,
  questions,
  count,
  onCountChange,
  onGenerate,
  onRemove,
  isLoading,
  countError,
}: QuestionGeneratorProps) => {
  const hasGenerated = questions.length > 0

  return (
    <div className={styles.container}>
      <h3 className={styles.pairTitle}>Dichotomy Pair {pair}</h3>

      {!hasGenerated && (
        <div className={styles.countRow}>
          <label className={styles.countLabel} htmlFor={`count-${pair}`}>
            Number of questions to generate
          </label>
          <input
            id={`count-${pair}`}
            name={`count-${pair}`}
            type="number"
            min={1}
            value={count}
            onChange={(e) => onCountChange(e.target.value)}
            className={styles.countInput}
          />
        </div>
      )}
      {countError && <div className={styles.fieldError}>{countError}</div>}

      {hasGenerated && (
        <ul className={styles.questionsList}>
          {questions.map((q) => (
            <li key={q.id} className={styles.questionItem}>
              <span>{q.question}</span>
              <button
                type="button"
                className={styles.deleteButton}
                onClick={() => onRemove(q.id)}
                aria-label="Remove question">
                <RiDeleteBin6Line />
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={onGenerate}
        className={styles.generateButton}
        disabled={
          isLoading || (!hasGenerated && (!count || Number(count) < 1))
        }>
        {isLoading ? (
          'Loading...'
        ) : hasGenerated ? (
          <>
            <FaPlus /> Add {pair} Question
          </>
        ) : (
          `Generate ${count || ''} ${pair} Question${
            Number(count) === 1 ? '' : 's'
          }`
        )}
      </button>
    </div>
  )
}

export default QuestionGenerator
