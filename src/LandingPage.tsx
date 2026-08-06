import '@/components/features/landing/landingPageComponents/styles/landingArtifact.css'

import React, { useEffect } from 'react'

import {
  AccessSection,
  AudienceSection,
  CompaniesSection,
  HomeFaq,
  HomeFooter,
  HomeNavbar,
  HomeQuote,
  HowItWorks,
  LandingHero,
  ValuesSection,
} from '@/components/features/landing/landingPageComponents'
import { useAuthRedirect } from '@/hooks/useAuthRedirect'
import { ThemeProvider } from '@/theme'

const LandingContent = () => {
  useAuthRedirect()

  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (!hash) return
    window.setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }, [])

  return (
    <div className="landing-root">
      <HomeNavbar />
      <div className="wrap">
        <LandingHero />
        <CompaniesSection />
        <ValuesSection />
        <HowItWorks />
        <AudienceSection />
        <AccessSection />
        <HomeQuote />
        <HomeFaq />
        <HomeFooter />
      </div>
    </div>
  )
}

export const LandingPage = () => (
  <ThemeProvider>
    <LandingContent />
  </ThemeProvider>
)
