import React from 'react'

import { CheckBox } from '@/components/forms/CheckBox'

import styles from './WorkTypeCheckboxes.module.scss'

export const WORK_TYPE = {
  REMOTE: 'remote',
  HYBRID: 'hybrid',
  ONSITE: 'onSite',
} as const

export type WorkType = (typeof WORK_TYPE)[keyof typeof WORK_TYPE]

export const workModeNeedsLocation = (workMode: readonly string[]): boolean =>
  workMode.includes(WORK_TYPE.HYBRID) || workMode.includes(WORK_TYPE.ONSITE)

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

  return (
    <div
      className={styles.row}
      data-field={name}
      id={name}
      tabIndex={-1}
      aria-invalid={error ? true : undefined}>
      <CheckBox
        name={`${name}-remote`}
        value={WORK_TYPE.REMOTE}
        label="Remote"
        checked={value.includes(WORK_TYPE.REMOTE)}
        onChange={(event) => toggle(WORK_TYPE.REMOTE, event.target.checked)}
      />
      <CheckBox
        name={`${name}-hybrid`}
        value={WORK_TYPE.HYBRID}
        label="Hybrid"
        checked={value.includes(WORK_TYPE.HYBRID)}
        onChange={(event) => toggle(WORK_TYPE.HYBRID, event.target.checked)}
      />
      <CheckBox
        name={`${name}-onSite`}
        value={WORK_TYPE.ONSITE}
        label="On-site"
        checked={value.includes(WORK_TYPE.ONSITE)}
        onChange={(event) => toggle(WORK_TYPE.ONSITE, event.target.checked)}
      />
      {error && (
        <div id={`${name}-error`} className={styles.error} role="alert">
          {error}
        </div>
      )}
    </div>
  )
}
