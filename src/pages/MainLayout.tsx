import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import {
  LandingFooter,
  LandingNavbar,
} from '@/components/features/landing/landingPageComponents'

export const MainLayout = () => {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <>
      {!isHome ? <LandingNavbar /> : null}
      <main className={isHome ? undefined : 'mt-16'}>
        <Outlet />
      </main>
      {!isHome ? <LandingFooter /> : null}
    </>
  )
}
