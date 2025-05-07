import React from 'react'

import PricingHero from './Pricing/PricingHero'
import PricePlan from './Pricing/PricePlan'
import QuoteSection from './QuoteSection'
import Footer from './Footer'

const Pricing = () => {
  return (
    <div className="min-h-screen">
      <PricingHero />
      <PricePlan />
      <QuoteSection />
    </div>
  )
}

export default Pricing
