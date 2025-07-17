import React, { useState } from 'react'

import PricePlan from './Pricing/PricePlan'
import PricingHero from './Pricing/PricingHero'
import PricingNotification from './Pricing/PricingNotification'
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
