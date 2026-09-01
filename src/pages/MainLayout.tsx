import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

import {
  LandingFooter,
  LandingNavbar,
} from '@/components/features/landing/landingPageComponents'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { destinationAfterAuth } from '@/features/auth/utils/dashboardPath'

const AUTH_ENTRY_PATHS = new Set([
  '/',
  '/login',
  '/register',
  '/forgot-password',
])

export const MainLayout = () => {
  const location = useLocation()
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const userRole = useAuthStore((state) => state.user?.userRole)

  if (isLoggedIn && AUTH_ENTRY_PATHS.has(location.pathname)) {
    const destination = destinationAfterAuth(
      userRole,
      new URLSearchParams(location.search).get('next'),
    )
    return <Navigate to={destination} replace />
  }

  return (
    <>
      <LandingNavbar />
      <main className="mt-16">
        <Outlet />
      </main>
      <LandingFooter />
    </>
  )
}
