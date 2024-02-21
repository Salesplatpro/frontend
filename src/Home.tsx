import React from 'react'
import Navbar from './components/Navbar'
import HeroContainer from './components/HeroContainer'
import MetricSection from './components/MetricSection'
import ServiceSection from './components/ServiceSection'

const Home = () => {
  return (
    <React.Fragment>
      <div className=''>
        <Navbar/>
        <HeroContainer/>
        <MetricSection/>
        <ServiceSection/>
        {/* Home */}
      </div>
    </React.Fragment>
  )
}

export default Home