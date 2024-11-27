import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

import { RootState } from '../redux/store/store'

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
      toast.error(
        `You don't have access to this page as a ${user.user.userRole}`,
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
