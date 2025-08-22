import React from 'react'

import { LandingHero } from './components'
import FeaturedBrand from './components/FeaturedBrand'
import MetricSection from './components/MetricSection'
import QuoteSection from './components/QuoteSection'
import ServiceSection from './components/ServiceSection'

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
