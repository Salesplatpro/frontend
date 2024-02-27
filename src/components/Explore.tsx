import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import Header from './explore/Header'
import CareerSection from './explore/CareerSection'

const Explore = () => {
  return (
    <React.Fragment>
      <Navbar/>
      <Header/>
      <CareerSection/>
      <Footer/>
    </React.Fragment>
  )
}

export default Explore