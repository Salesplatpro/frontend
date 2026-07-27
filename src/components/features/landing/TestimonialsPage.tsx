import React from 'react'
import { Helmet } from 'react-helmet-async'

import { Testimonials } from '@/components/features/landing/landingPageComponents'

const TestimonialsPage = () => (
  <React.Fragment>
    <Helmet>
      <title>Testimonials — AuxHR</title>
      <meta
        name="description"
        content="Hear from hiring teams who've transformed their recruitment process with AuxHR."
      />
      <link rel="canonical" href="https://auxhr.com/testimonials" />
      <meta property="og:title" content="Testimonials — AuxHR" />
      <meta
        property="og:description"
        content="Hear from hiring teams who've transformed their recruitment process with AuxHR."
      />
      <meta property="og:url" content="https://auxhr.com/testimonials" />
      <meta property="og:type" content="website" />
    </Helmet>
    <Testimonials />
  </React.Fragment>
)

export default TestimonialsPage
