import cn from 'classnames'
import React from 'react'
import { MdCheck } from 'react-icons/md'

import styles from './WizardStepper.module.scss'

type WizardStepperStep = {
  label: string
}

type WizardStepperProps = {
  steps: WizardStepperStep[]
  currentIndex: number
}

export const WizardStepper: React.FC<WizardStepperProps> = ({
  steps,
  currentIndex,
}) => (
  <ol className={styles.stepper}>
    {steps.map((step, index) => {
      const isCompleted = index < currentIndex
      const isCurrent = index === currentIndex

      return (
        <li
          key={step.label}
          className={cn(styles.step, {
            [styles.completed]: isCompleted,
            [styles.current]: isCurrent,
          })}>
          {index > 0 && <span className={styles.connector} />}
          <span className={styles.circle}>
            {isCompleted ? <MdCheck /> : index + 1}
          </span>
          <span className={styles.label}>{step.label}</span>
        </li>
      )
    })}
  </ol>
)
