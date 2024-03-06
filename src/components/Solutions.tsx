import React from 'react'
import Navbar from './Navbar'
import SolutionHeader from './solutions/SolutionHeader'
import QuoteSection from './QuoteSection'
import Footer from './Footer'
import SolutionContent from './solutions/SolutionContent'

const Solutions = () => {
  return (
    <>
      <Navbar/>
      <SolutionHeader/>
      <SolutionContent/>
      <QuoteSection/>
      <Footer/>
    </>
  )
}

export default Solutions