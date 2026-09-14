import React from 'react'

import styles from './WorkTypeCheckboxes.module.scss'

export const WORK_TYPE = {
  REMOTE: 'remote',
  HYBRID: 'hybrid',
  ONSITE: 'onSite',
} as const

export type WorkType = (typeof WORK_TYPE)[keyof typeof WORK_TYPE]

export const workModeNeedsLocation = (workMode: readonly string[]): boolean =>
  workMode.includes(WORK_TYPE.HYBRID) || workMode.includes(WORK_TYPE.ONSITE)

const OPTIONS: { value: WorkType; label: string }[] = [
  { value: WORK_TYPE.REMOTE, label: 'Remote' },
  { value: WORK_TYPE.HYBRID, label: 'Hybrid' },
  { value: WORK_TYPE.ONSITE, label: 'On-site' },
]

interface WorkTypeCheckboxesProps {
  value: WorkType[]
  onChange: (value: WorkType[]) => void
  error?: string
  name?: string
}

export const WorkTypeCheckboxes: React.FC<WorkTypeCheckboxesProps> = ({
  value,
  onChange,
  error,
  name = 'workType',
}) => {
  const toggle = (type: WorkType, checked: boolean) => {
    if (checked) {
      onChange([...value, type])
    } else {
      onChange(value.filter((item) => item !== type))
    }
  }

  const errorId = `${name}-error`

  return (
    <div
      className={styles.row}
      data-field={name}
      id={name}
      tabIndex={-1}
      role="group"
      aria-label="Work type"
      aria-describedby={error ? errorId : undefined}>
      {OPTIONS.map((option) => {
        const checked = value.includes(option.value)
        const inputId = `${name}-${option.value}`
        return (
          <label
            key={option.value}
            htmlFor={inputId}
            className={`${styles.option} ${
              checked ? styles.optionChecked : ''
            }`}>
            <input
              id={inputId}
              type="checkbox"
              name={name}
              value={option.value}
              checked={checked}
              className={styles.input}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? errorId : undefined}
              onChange={(event) => toggle(option.value, event.target.checked)}
            />
            <span>{option.label}</span>
          </label>
        )
      })}
      {error && (
        <div id={errorId} className={styles.error} role="alert">
          {error}
        </div>
      )}
    </div>
  )
}
