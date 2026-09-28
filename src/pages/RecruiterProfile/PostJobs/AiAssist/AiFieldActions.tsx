import React, { useState } from 'react'
import { HiOutlineSparkles } from 'react-icons/hi2'

import { htmlToPlainText, plainTextToHtml } from '../utils/aiText'
import styles from './AiAssist.module.scss'
import {
  hasAiContext,
  JobAiContext,
  JobFieldAction,
  JobTextField,
  useJobFieldAssist,
} from './useJobFieldAssist'

const REWRITE_ACTIONS: { action: JobFieldAction; label: string }[] = [
  { action: 'regenerate', label: 'Rewrite' },
  { action: 'shorter', label: 'Shorter' },
  { action: 'detailed', label: 'More detail' },
  { action: 'friendlier', label: 'Friendlier' },
]

type AiFieldActionsProps = {
  field: JobTextField
  /** Current field value as editor HTML. */
  value: string
  job: JobAiContext
  onApply: (html: string) => void
  /** Label for the button shown while the field is empty. */
  writeLabel?: string
}

export const AiFieldActions = ({
  field,
  value,
  job,
  onApply,
  writeLabel = 'Write with AI',
}: AiFieldActionsProps) => {
  const { run, pendingKey } = useJobFieldAssist()
  const [previous, setPrevious] = useState<string | null>(null)
  const currentText = htmlToPlainText(value ?? '')
  const isEmpty = !currentText
  const canRun = hasAiContext(job)
  const isBusy = pendingKey !== null

  const handle = async (action: JobFieldAction) => {
    const result = await run(action, {
      field,
      action,
      currentText: isEmpty ? undefined : currentText,
      job,
    })
    if (result?.text) {
      setPrevious(value ?? '')
      onApply(plainTextToHtml(result.text))
    }
  }

  const undo = () => {
    if (previous === null) return
    onApply(previous)
    setPrevious(null)
  }

  const actions = isEmpty
    ? [{ action: 'regenerate' as const, label: writeLabel }]
    : REWRITE_ACTIONS

  return (
    <div className={styles.actions} role="group" aria-label="AI writing help">
      <span className={styles.actionsLabel} aria-hidden>
        <HiOutlineSparkles />
      </span>
      {actions.map(({ action, label }) => (
        <button
          key={action}
          type="button"
          className={styles.chipButton}
          disabled={!canRun || isBusy}
          onClick={() => void handle(action)}
          aria-busy={pendingKey === action || undefined}>
          {pendingKey === action ? 'Writing…' : label}
        </button>
      ))}
      {previous !== null && !isBusy && (
        <button type="button" className={styles.undoButton} onClick={undo}>
          Undo
        </button>
      )}
      {!canRun && (
        <span className={styles.hint}>Pick a role first to use AI.</span>
      )}
    </div>
  )
}
