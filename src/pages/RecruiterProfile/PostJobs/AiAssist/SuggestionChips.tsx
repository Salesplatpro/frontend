import React, { useState } from 'react'
import { FaPlus } from 'react-icons/fa6'
import { HiOutlineSparkles } from 'react-icons/hi2'

import styles from './AiAssist.module.scss'
import {
  hasAiContext,
  JobAiContext,
  JobListField,
  useJobFieldAssist,
} from './useJobFieldAssist'

type SuggestionChipsProps = {
  field: JobListField
  current: string[]
  job: JobAiContext
  onAdd: (items: string[]) => void
  maxLength?: number
}

const LABELS: Record<JobListField, string> = {
  skills: 'Suggest skills',
  goals: 'Suggest goals',
}

export const SuggestionChips = ({
  field,
  current,
  job,
  onAdd,
  maxLength = 250,
}: SuggestionChipsProps) => {
  const { run, pendingKey } = useJobFieldAssist()
  const [suggestions, setSuggestions] = useState<string[]>([])
  const canRun = hasAiContext(job)
  const existing = new Set(current.map((item) => item.toLowerCase()))
  const visible = suggestions.filter(
    (item) => !existing.has(item.toLowerCase()) && item.length <= maxLength,
  )

  const load = async () => {
    const result = await run(field, { field, job })
    if (result?.suggestions) {
      setSuggestions(result.suggestions)
    }
  }

  return (
    <div className={styles.suggestions}>
      <button
        type="button"
        className={styles.chipButton}
        disabled={!canRun || pendingKey !== null}
        onClick={() => void load()}>
        <HiOutlineSparkles aria-hidden />
        {pendingKey ? 'Thinking…' : LABELS[field]}
      </button>
      {visible.length > 0 && (
        <ul className={styles.suggestionList} aria-label="AI suggestions">
          {visible.map((item) => (
            <li key={item}>
              <button
                type="button"
                className={styles.suggestion}
                onClick={() => onAdd([item])}
                aria-label={`Add ${item}`}>
                <FaPlus aria-hidden /> {item}
              </button>
            </li>
          ))}
          {visible.length > 1 && (
            <li>
              <button
                type="button"
                className={styles.addAll}
                onClick={() => onAdd(visible)}>
                Add all
              </button>
            </li>
          )}
        </ul>
      )}
      {!canRun && (
        <span className={styles.hint}>Pick a role first to use AI.</span>
      )}
    </div>
  )
}
