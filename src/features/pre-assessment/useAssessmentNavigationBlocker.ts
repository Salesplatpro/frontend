import { useEffect } from 'react'
import { useBlocker } from 'react-router-dom'

import { notify } from '@/utils/toastNotifications'

import { useAssessmentLockStore } from './lockStore'

export function useAssessmentNavigationBlocker() {
  const isLocked = useAssessmentLockStore((s) => s.isLocked)

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isLocked && currentLocation.pathname !== nextLocation.pathname,
  )

  useEffect(() => {
    if (blocker.state === 'blocked') {
      notify('info', 'Complete or submit your assessment to continue.', {
        autoClose: 2000,
      })
      blocker.reset()
    }
  }, [blocker])

  useEffect(() => {
    if (!isLocked) return
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [isLocked])

  return { isLocked }
}
