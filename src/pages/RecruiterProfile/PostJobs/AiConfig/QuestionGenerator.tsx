import React from 'react'
import { FaPlus } from 'react-icons/fa6'
import { IoIosInformationCircle } from 'react-icons/io'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { Tooltip as ReactTooltip } from 'react-tooltip'

import styles from './QuestionGenerator.module.scss'
import { PersonalityQuestion } from './useGeneratedQuestion'

const PAIR_HELP: Record<string, string> = {
  EI: 'Extraversion vs Introversion — how the candidate recharges and collaborates at work. Candidates never see the dichotomy label.',
  SN: 'Sensing vs Intuition — detail vs pattern. Workplace scenarios, not theory questions.',
  TF: 'Thinking vs Feeling — how they decide under pressure with people and data.',
  JP: 'Judging vs Perceiving — structure vs flexibility in how they plan and ship work.',
}

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
  const tipId = `dichotomy-${pair}-tooltip`
  const countTipId = `dichotomy-${pair}-count-tooltip`

  return (
    <div className={styles.container}>
      <h3 className={styles.pairTitle}>
        Dichotomy pair {pair}
        <span
          className={styles.tooltipTrigger}
          data-tooltip-id={tipId}
          aria-label={PAIR_HELP[pair] ?? 'Personality dichotomy pair'}>
          <IoIosInformationCircle fontSize={18} />
        </span>
      </h3>
      <ReactTooltip
        id={tipId}
        content={PAIR_HELP[pair]}
        place="top"
        variant="info"
      />

      {!hasGenerated && (
        <div className={styles.countRow}>
          <label className={styles.countLabel} htmlFor={`count-${pair}`}>
            Number of questions to generate
            <span
              className={styles.tooltipTrigger}
              data-tooltip-id={countTipId}
              aria-label="How many workplace scenario questions to generate for this pair">
              <IoIosInformationCircle fontSize={16} />
            </span>
          </label>
          <ReactTooltip
            id={countTipId}
            content="How many workplace scenario questions to generate for this pair. Candidates answer a subset of the pool. Leave blank to skip this pair."
            place="top"
            variant="info"
          />
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
            <FaPlus /> Add {pair} question
          </>
        ) : (
          `Generate ${count || ''} ${pair} question${
            Number(count) === 1 ? '' : 's'
          }`
        )}
      </button>
    </div>
  )
}

export default QuestionGenerator
