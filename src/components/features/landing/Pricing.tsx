import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'

import PricePlan from '@/pages/Pricing/PricePlan'
import PricingHero from '@/pages/Pricing/PricingHero'
import PricingNotification from '@/pages/Pricing/PricingNotification'

import QuoteSection from './QuoteSection'

const Pricing = () => {
  const [isFlipped, setIsFlipped] = useState(false)
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Pricing — AuxHR</title>
        <meta
          name="description"
          content="Simple, transparent pricing for recruiters and talent teams on AuxHR."
        />
        <link rel="canonical" href="https://auxhr.com/pricing" />
        <meta property="og:title" content="Pricing — AuxHR" />
        <meta
          property="og:description"
          content="Simple, transparent pricing for recruiters and talent teams on AuxHR."
        />
        <meta property="og:url" content="https://auxhr.com/pricing" />
        <meta property="og:type" content="website" />
      </Helmet>
      <PricingHero isFlipped={isFlipped} setIsFlipped={setIsFlipped} />
      <PricePlan isFlipped={isFlipped} setIsFlipped={setIsFlipped} />
      <PricingNotification />
      <QuoteSection />
    </div>
  )
}

export default Pricing
