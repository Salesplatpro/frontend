import React, { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

import { useProfile } from '@/features/profile/hooks/useProfile'
import { completeTour } from '@/features/profile/services/profileService'
import { useProfileStore } from '@/features/profile/store/useProfileStore'

import { ProductTour } from './ProductTour'
import { TOUR_STEPS, TourRole } from './tourSteps'
import { useTourStore } from './useTourStore'

const sessionKey = (role: TourRole) => `auxhr-tour-dismissed-${role}`

// sessionStorage can be unavailable (private mode, blocked storage).
const dismissedThisSession = (role: TourRole) => {
  try {
    return window.sessionStorage.getItem(sessionKey(role)) === '1'
  } catch {
    return false
  }
}

const rememberDismissed = (role: TourRole) => {
  try {
    window.sessionStorage.setItem(sessionKey(role), '1')
  } catch {
    // Nothing to do — the server flag is the real record.
  }
}

type ProductTourHostProps = {
  audience: TourRole
  /** The dashboard home page the first-run tour starts on. */
  homePath: string
  /** Holds the tour back, e.g. while the talent pre-assessment locks navigation. */
  blocked?: boolean
}

export const ProductTourHost = ({
  audience: role,
  homePath,
  blocked = false,
}: ProductTourHostProps) => {
  const location = useLocation()
  const { profile } = useProfile()
  const patchProfile = useProfileStore((state) => state.patchProfile)
  const active = useTourStore((state) => state.active)
  const start = useTourStore((state) => state.start)
  const stop = useTourStore((state) => state.stop)
  const autoStarted = useRef(false)

  const welcomeOpen = !!(
    location.state as { showWelcomeModal?: boolean } | null
  )?.showWelcomeModal
  const onHome = location.pathname.replace(/\/+$/, '') === homePath
  // Only an explicit null means "not done yet"; undefined means the API
  // didn't say, and older sessions must never be surprised by a tour.
  const needsTour =
    profile?.userRole === role && profile?.tourCompletedAt === null

  useEffect(() => {
    if (
      autoStarted.current ||
      active ||
      blocked ||
      welcomeOpen ||
      !onHome ||
      !needsTour ||
      dismissedThisSession(role)
    ) {
      return
    }
    autoStarted.current = true
    start(role, 'firstRun')
  }, [active, blocked, welcomeOpen, onHome, needsTour, role, start])

  useEffect(() => () => stop(), [stop])

  if (!active || active.role !== role) return null

  const handleClose = async () => {
    const isFirstRun = active.source === 'firstRun'
    stop()
    if (!isFirstRun) return
    rememberDismissed(role)
    try {
      const response = await completeTour()
      patchProfile({ tourCompletedAt: response.data.tourCompletedAt })
    } catch {
      // Kept dismissed for this session; the tour may show again next visit.
    }
  }

  return (
    <ProductTour steps={TOUR_STEPS[role]} onClose={() => void handleClose()} />
  )
}
