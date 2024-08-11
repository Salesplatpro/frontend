import React from 'react'

import CustomerHero from './customerStories/customerHero'
import Introduction from './customerStories/introduction'
import Footer from './Footer'
import HeroContainer from './HeroContainer'
import Navbar from './Navbar'
import QuoteSection from './QuoteSection'

const CustomerStories = () => {
  return (
    <div className="">
      <Navbar />
      <CustomerHero />
      <Introduction />
      <QuoteSection />
      <Footer />
    </div>
  )
}

export default CustomerStories
