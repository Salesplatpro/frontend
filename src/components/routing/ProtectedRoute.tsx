import React, { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuthStore } from '@/features/auth/store/useAuthStore'
import {
  dashboardPathForRole,
  loginPathWithNext,
} from '@/features/auth/utils/dashboardPath'
import { notify } from '@/utils/toastNotifications'

interface ProtectedRouteProps {
  allowedRoles: string[]
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, isLoggedIn, token } = useAuthStore()
  const userRole = user?.userRole
  const location = useLocation()

  useEffect(() => {
    if (isLoggedIn && user && userRole && !allowedRoles.includes(userRole)) {
      notify('error', `You don't have access to this page as a ${userRole}`, {
        autoClose: 2000,
      })
    }
  }, [user, isLoggedIn, userRole, allowedRoles])

  if (!token) {
    const applyEntry = location.pathname.match(/^(\/apply\/[^/]+)/)
    const next = applyEntry
      ? applyEntry[1]
      : `${location.pathname}${location.search}`
    const loginTo = loginPathWithNext(next)
    return <Navigate to={loginTo} replace />
  }

  if (user && userRole && !allowedRoles.includes(userRole)) {
    return <Navigate to={dashboardPathForRole(userRole)} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
