import React, { useState } from 'react'

import PricePlan from '@/pages/Pricing/PricePlan'
import PricingHero from '@/pages/Pricing/PricingHero'
import PricingNotification from '@/pages/Pricing/PricingNotification'

import QuoteSection from './QuoteSection'

const Pricing = () => {
  const [isFlipped, setIsFlipped] = useState(false)
  return (
    <div className="min-h-screen">
      <PricingHero isFlipped={isFlipped} setIsFlipped={setIsFlipped} />
      <PricePlan isFlipped={isFlipped} setIsFlipped={setIsFlipped} />
      <PricingNotification />
      <QuoteSection />
    </div>
  )
}

export default Pricing
