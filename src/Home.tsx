import React from 'react'

import FeaturedBrand from './components/FeaturedBrand'
import HeroContainer from './components/HeroContainer'
import MetricSection from './components/MetricSection'
import QuoteSection from './components/QuoteSection'
import ServiceSection from './components/ServiceSection'

const Home = () => {
  return (
    <React.Fragment>
      <div className="">
        <HeroContainer />
        <MetricSection />
        <ServiceSection />
        <FeaturedBrand />
        <QuoteSection />
      </div>
    </React.Fragment>
  )
}

export default Home
