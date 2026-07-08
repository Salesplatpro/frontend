import React from 'react'
import { FaPlus } from 'react-icons/fa6'

import styles from './QuestionGenerator.module.scss'

type QuestionGeneratorProps = {
  pair: string
  generatedQuestion: string | null
  onGenerate: () => void
  onAddQuestion: () => void
  isLoading: boolean
}

const QuestionGenerator = ({
  pair,
  generatedQuestion,
  onGenerate,
  onAddQuestion,
  isLoading,
}: QuestionGeneratorProps) => (
  <div className={styles.container}>
    <h3 className={styles.pairTitle}>Dichotomy Pair {pair}</h3>
    <button
      type="button"
      onClick={onGenerate}
      className={styles.generateButton}
      disabled={isLoading}>
      {isLoading
        ? 'Loading...'
        : generatedQuestion
        ? `Regenerate ${pair}`
        : `Generate ${pair}`}
    </button>
    {generatedQuestion && (
      <div className={styles.previewCard}>
        <p className={styles.previewText}>{generatedQuestion}</p>
        <button
          type="button"
          onClick={onAddQuestion}
          className={styles.addButton}>
          <FaPlus /> Add {pair} Question
        </button>
      </div>
    )}
  </div>
)

export default QuestionGenerator
