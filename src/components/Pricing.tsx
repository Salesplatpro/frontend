import React, { useState } from 'react'

import PricingHero from './Pricing/PricingHero'
import PricePlan from './Pricing/PricePlan'
import QuoteSection from './QuoteSection'
import PricingNotification from './Pricing/PricingNotification'

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
