import React from 'react'
import { Navigate } from 'react-router-dom'

import {
  CandidateExperience,
  CtaBanner,
  Faq,
  Hero,
  HiringScale,
  HiringTeams,
  HowItWorks,
  ImpactMetrics,
  WorkflowFeatures,
} from '@/components/features/landing/landingPageComponents'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { dashboardPathForRole } from '@/features/auth/utils/dashboardPath'

export const LandingPage = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const userRole = useAuthStore((state) => state.user?.userRole)

  if (isLoggedIn) {
    return <Navigate to={dashboardPathForRole(userRole)} replace />
  }

  return (
    <>
      <Hero />
      <HowItWorks />
      <WorkflowFeatures />
      <ImpactMetrics />
      <HiringTeams />
      <CandidateExperience />
      <HiringScale />
      <CtaBanner />
      <Faq />
    </>
  )
}
