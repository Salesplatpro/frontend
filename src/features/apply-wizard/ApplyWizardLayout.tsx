import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { NavigationLockOverlay } from '@/features/pre-assessment/components/NavigationLockOverlay'
import { useAssessmentNavigationBlocker } from '@/features/pre-assessment/useAssessmentNavigationBlocker'

import styles from './ApplyWizardLayout.module.scss'
import { WizardStepper } from './WizardStepper'

const WIZARD_STEPS = [
  { label: 'Sign Up', segment: 'signup' },
  { label: 'Verify Email', segment: 'verify' },
  { label: 'Profile', segment: 'profile' },
  { label: 'Prescreening', segment: 'prescreen' },
  { label: 'Apply', segment: 'details' },
]

const ApplyWizardLayout: React.FC = () => {
  const location = useLocation()
  const { isLocked } = useAssessmentNavigationBlocker()

  const currentSegment = location.pathname.split('/').filter(Boolean).pop()
  const currentIndex = Math.max(
    0,
    WIZARD_STEPS.findIndex((step) => step.segment === currentSegment),
  )

  return (
    <div className={styles.page}>
      <WizardStepper
        steps={WIZARD_STEPS.map(({ label }) => ({ label }))}
        currentIndex={currentIndex}
      />
      <div className={styles.content}>
        <Outlet />
        {isLocked && <NavigationLockOverlay />}
      </div>
    </div>
  )
}

export default ApplyWizardLayout
