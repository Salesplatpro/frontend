import React from 'react'

import PricingHero from './Pricing/PricingHero'
import PricePlan from './Pricing/PricePlan'
import QuoteSection from './QuoteSection'
import PricingNotification from './Pricing/PricingNotification'

const Pricing = () => {
  return (
    <div className="min-h-screen">
      <PricingHero />
      <PricePlan />
      <PricingNotification />
      <QuoteSection />
    </div>
  )
}

export default Pricing
