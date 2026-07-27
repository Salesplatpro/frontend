import React from 'react'
import { Helmet } from 'react-helmet-async'

import CustomerHero from './customerStories/customerHero'
import Introduction from './customerStories/introduction'
import QuoteSection from './QuoteSection'

const CustomerStories = () => {
  return (
    <div className="">
      <Helmet>
        <title>Customer Stories — AuxHR</title>
        <meta
          name="description"
          content="See how companies are growing faster and hiring smarter with AuxHR."
        />
        <link rel="canonical" href="https://auxhr.com/customerstories" />
        <meta property="og:title" content="Customer Stories — AuxHR" />
        <meta
          property="og:description"
          content="See how companies are growing faster and hiring smarter with AuxHR."
        />
        <meta property="og:url" content="https://auxhr.com/customerstories" />
        <meta property="og:type" content="website" />
      </Helmet>
      <CustomerHero />
      <Introduction />
      <QuoteSection />
    </div>
  )
}

export default CustomerStories
