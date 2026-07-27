import React from 'react'
import { Helmet } from 'react-helmet-async'

import CareerSection from './explore/CareerSection'
import Header from './explore/Header'

const Explore = () => {
  return (
    <React.Fragment>
      <Helmet>
        <title>Explore Careers — AuxHR</title>
        <meta
          name="description"
          content="Discover career opportunities and explore how AuxHR connects talent with the right roles."
        />
        <link rel="canonical" href="https://auxhr.com/explore" />
        <meta property="og:title" content="Explore Careers — AuxHR" />
        <meta
          property="og:description"
          content="Discover career opportunities and explore how AuxHR connects talent with the right roles."
        />
        <meta property="og:url" content="https://auxhr.com/explore" />
        <meta property="og:type" content="website" />
      </Helmet>
      <Header />
      <CareerSection />
    </React.Fragment>
  )
}

export default Explore
