import React from 'react'

import FeaturedBrand from './components/FeaturedBrand'
import Footer from './components/Footer'
import HeroContainer from './components/HeroContainer'
import MetricSection from './components/MetricSection'
import Navbar from './components/Navbar'
import QuoteSection from './components/QuoteSection'
import ServiceSection from './components/ServiceSection'

const Home = () => {
  return (
    <React.Fragment>
      <div className="">
        <Navbar />
        <HeroContainer />
        <MetricSection />
        <ServiceSection />
        <FeaturedBrand />
        <QuoteSection />
        <Footer />
        {/* Home */}
      </div>
    </React.Fragment>
  )
}

export default Home
