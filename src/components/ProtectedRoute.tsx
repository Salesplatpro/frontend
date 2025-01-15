import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { Bounce } from 'react-toastify'

import { RootState } from '../redux/store/store'
import { notify } from '../utils/toastNotifications'

interface ProtectedRouteProps {
  allowedRoles: string[]
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const user = useSelector((state: RootState) => state.auth)
  const userRole = user.user.userRole
  const token = localStorage.getItem('token')

  useEffect(() => {
    console.log(userRole)
    if (user.isLoggedIn && user.user && !allowedRoles.includes(userRole)) {
      notify(
        'error',
        `You don't have access to this page as a ${user.user.userRole}`,
        { autoClose: 5000, transition: Bounce },
      )
    }
  }, [user, allowedRoles])

  if (!token) {
    return <Navigate to="/login" />
  }

  if (user.user && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" />
  }

  return <Outlet />
}

export default ProtectedRoute
