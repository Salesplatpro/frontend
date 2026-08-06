import React from 'react'

import {
  HowItWorks,
  ItsForYou,
  LandingHero,
  RecruitmentWorkflow,
  Statistics,
  Testimonials,
} from '@/components/features/landing/landingPageComponents'
import { howItWorksData } from '@/components/features/landing/landingPageComponents/utils'
import { useAuthRedirect } from '@/hooks/useAuthRedirect'

export const LandingPage = () => {
  useAuthRedirect()

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
