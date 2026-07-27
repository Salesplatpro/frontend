import React from 'react'
import { Helmet } from 'react-helmet-async'

import QuoteSection from '@/components/features/landing/QuoteSection'

import SolutionContent from './solutions/SolutionContent'
import SolutionHeader from './solutions/SolutionHeader'

const Solutions = () => {
  return (
    <>
      <Helmet>
        <title>Solutions — AuxHR</title>
        <meta
          name="description"
          content="See how AuxHR's AI-driven solutions streamline recruitment for teams of every size."
        />
        <link rel="canonical" href="https://auxhr.com/solution" />
        <meta property="og:title" content="Solutions — AuxHR" />
        <meta
          property="og:description"
          content="See how AuxHR's AI-driven solutions streamline recruitment for teams of every size."
        />
        <meta property="og:url" content="https://auxhr.com/solution" />
        <meta property="og:type" content="website" />
      </Helmet>
      <SolutionHeader />
      <SolutionContent />
      <QuoteSection />
    </>
  )
}

export default Solutions
