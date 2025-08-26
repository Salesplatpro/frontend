import React from 'react'
import { Outlet } from 'react-router-dom'

import { LandingFooter, LandingNavbar } from '../components'

export const MainLayout = () => {
  return (
    <>
      <LandingNavbar />
      <main>
        <Outlet />
      </main>
      <LandingFooter />
    </>
  )
}
