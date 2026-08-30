import React from 'react'
import { Navigate } from 'react-router-dom'

import {
  HowItWorks,
  ItsForYou,
  LandingHero,
  RecruitmentWorkflow,
  Statistics,
  Testimonials,
} from '@/components/features/landing/landingPageComponents'
import { howItWorksData } from '@/components/features/landing/landingPageComponents/utils'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { dashboardPathForRole } from '@/features/auth/utils/dashboardPath'

export const LandingPage = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const userRole = useAuthStore((state) => state.user?.userRole)

  if (isLoggedIn) {
    return <Navigate to={dashboardPathForRole(userRole)} replace />
  }

  return (
    <div style={{ overflowX: 'hidden' }}>
      <LandingHero />
      <RecruitmentWorkflow
        title="How it works"
        subTitle="Your Recruitment Workflow, Reinvented."
        data={howItWorksData}
      />
      <ItsForYou />
      <Statistics />
      <HowItWorks />
      <Testimonials />
    </div>
  )
}
