import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

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

export const LandingPage = () => {
  const navigate = useNavigate()
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const userRole = useAuthStore((state) => state.user?.userRole)

  useEffect(() => {
    if (!isLoggedIn) return
    navigate(
      userRole === 'recruiter'
        ? '/recruiterDashboard/dashboard'
        : userRole === 'talent'
        ? '/talentDashboard'
        : '/adminDashboard/viewcandidates',
    )
  }, [isLoggedIn, userRole, navigate])

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
