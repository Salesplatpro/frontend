import React from 'react'
import Navbar from './components/Navbar'
import HeroContainer from './components/HeroContainer'
import MetricSection from './components/MetricSection'
import ServiceSection from './components/ServiceSection'
import FeaturedBrand from './components/FeaturedBrand'
import QuoteSection from './components/QuoteSection'
import Footer from './components/Footer'

const Home = () => {
  return (
    <React.Fragment>
      <div className=''>
        <Navbar/>
        <HeroContainer/>
        <MetricSection/>
        <ServiceSection/>
        <FeaturedBrand/>
        <QuoteSection/>
        <Footer/>
        {/* Home */}
      </div>
    </React.Fragment>
  )
}

export default Home