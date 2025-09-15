import React from 'react'

import {
  HowItWorks,
  ItsForYou,
  LandingHero,
  RecruitmentWorkflow,
  Statistics,
  Testimonials,
} from './components'

export const LandingPage = () => (
  <div style={{ overflowX: 'hidden' }}>
    <LandingHero />
    <RecruitmentWorkflow />
    <ItsForYou />
    <Statistics />
    <HowItWorks />
    <Testimonials />
  </div>
)
