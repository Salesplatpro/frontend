import React from 'react'
import { Helmet } from 'react-helmet-async'

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
      <Helmet>
        <title>AuxHR — AI-Powered Recruitment Platform</title>
        <meta
          name="description"
          content="AuxHR reinvents your recruitment workflow with AI-driven candidate matching, assessments, and hiring pipelines."
        />
        <link rel="canonical" href="https://auxhr.com/" />
        <meta
          property="og:title"
          content="AuxHR — AI-Powered Recruitment Platform"
        />
        <meta
          property="og:description"
          content="AuxHR reinvents your recruitment workflow with AI-driven candidate matching, assessments, and hiring pipelines."
        />
        <meta property="og:url" content="https://auxhr.com/" />
        <meta property="og:type" content="website" />
      </Helmet>
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
