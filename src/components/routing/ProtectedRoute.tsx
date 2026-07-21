import React, { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { Bounce } from 'react-toastify'

import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { notify } from '@/utils/toastNotifications'

interface ProtectedRouteProps {
  allowedRoles: string[]
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, isLoggedIn, token } = useAuthStore()
  const userRole = user?.userRole

  useEffect(() => {
    if (isLoggedIn && user && userRole && !allowedRoles.includes(userRole)) {
      notify('error', `You don't have access to this page as a ${userRole}`, {
        autoClose: 2000,
        transition: Bounce,
      })
    }
  }, [user, isLoggedIn, userRole, allowedRoles])

  if (!token) {
    return <Navigate to="/login" />
  }

  if (user && userRole && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" />
  }

  return <Outlet />
}

export default ProtectedRoute
