import React from 'react'
import Navbar from './Navbar'
import HeroContainer from './HeroContainer'
import CustomerHero from './customerStories/customerHero'
import Footer from './Footer'
import QuoteSection from './QuoteSection'
import Introduction from './customerStories/introduction'


const CustomerStories = () => {
  return (
    <div className=''>
        <Navbar/>
        <CustomerHero />
        <Introduction />
        <QuoteSection/>
        <Footer/>
      </div>
  )
}

export default CustomerStories