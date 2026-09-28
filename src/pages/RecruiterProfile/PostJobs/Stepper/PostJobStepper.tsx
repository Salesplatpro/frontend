import React from 'react'
import { FaCheck } from 'react-icons/fa6'

import styles from './PostJobStepper.module.scss'

export type PostJobStepId = 'start' | 'details' | 'screening' | 'review'

const STEPS: { id: PostJobStepId; title: string; description: string }[] = [
  { id: 'start', title: 'Start', description: 'Pick how to begin' },
  { id: 'details', title: 'Details', description: 'Describe the role' },
  { id: 'screening', title: 'Screening', description: 'Choose how to screen' },
  { id: 'review', title: 'Review', description: 'Check and publish' },
]

type PostJobStepperProps = {
  current: PostJobStepId
  /** Steps the recruiter may jump to; anything else renders as plain text. */
  onSelect?: (step: PostJobStepId) => void
  selectable?: PostJobStepId[]
}

export const PostJobStepper = ({
  current,
  onSelect,
  selectable = [],
}: PostJobStepperProps) => {
  const currentIndex = STEPS.findIndex((step) => step.id === current)

  return (
    <nav aria-label="Create a job progress" className={styles.stepper}>
      <ol className={styles.list}>
        {STEPS.map((step, index) => {
          const isDone = index < currentIndex
          const isCurrent = index === currentIndex
          const canSelect =
            !isCurrent && !!onSelect && selectable.includes(step.id)
          const itemClass = [
            styles.item,
            isDone ? styles.done : '',
            isCurrent ? styles.current : '',
          ]
            .filter(Boolean)
            .join(' ')

          const content = (
            <>
              <span className={styles.marker} aria-hidden>
                {isDone ? <FaCheck /> : index + 1}
              </span>
              <span className={styles.copy}>
                <span className={styles.title}>{step.title}</span>
                <span className={styles.description}>{step.description}</span>
              </span>
            </>
          )

          return (
            <li
              key={step.id}
              className={itemClass}
              aria-current={isCurrent ? 'step' : undefined}>
              {canSelect ? (
                <button
                  type="button"
                  className={styles.stepButton}
                  onClick={() => onSelect?.(step.id)}>
                  {content}
                </button>
              ) : (
                <span className={styles.stepStatic}>{content}</span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
