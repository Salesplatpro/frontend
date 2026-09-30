import React from 'react'

import {
  type StepDef,
  Stepper,
} from '../../../../components/ui/Stepper/Stepper'

export type PostJobStepId = 'start' | 'details' | 'screening' | 'review'

const STEPS: StepDef<PostJobStepId>[] = [
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
}: PostJobStepperProps) => (
  <Stepper
    steps={STEPS}
    current={current}
    ariaLabel="Create a job progress"
    selectable={selectable}
    onSelect={onSelect}
  />
)
