import React from 'react'
import { Outlet } from 'react-router-dom'

import { LandingNavbar } from '../components'
import Footer from '../components/Footer'

export const MainLayout = () => {
  return (
    <>
      <LandingNavbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
