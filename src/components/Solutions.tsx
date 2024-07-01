import React from 'react'

import Footer from './Footer'
import Navbar from './Navbar'
import QuoteSection from './QuoteSection'
import SolutionContent from './solutions/SolutionContent'
import SolutionHeader from './solutions/SolutionHeader'

const Solutions = () => {
  return (
    <>
      <Navbar />
      <SolutionHeader />
      <SolutionContent />
      <QuoteSection />
      <Footer />
    </>
  )
}

export default Solutions
