import React from 'react'

import FeaturedBrand from '@/components/features/landing/FeaturedBrand'
import MetricSection from '@/components/features/landing/MetricSection'
import QuoteSection from '@/components/features/landing/QuoteSection'
import ServiceSection from '@/components/features/landing/ServiceSection'

const Home = () => {
  return (
    <React.Fragment>
      <div className="">
        {/*<HeroContainer />*/}
        <MetricSection />
        <ServiceSection />
        <FeaturedBrand />
        <QuoteSection />
      </div>
    </React.Fragment>
  )
}

export default Home
