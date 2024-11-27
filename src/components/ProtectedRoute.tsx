import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { Bounce, toast } from 'react-toastify'

import { RootState } from '../redux/store/store'

interface ProtectedRouteProps {
  allowedRoles: string[]
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const user = useSelector((state: RootState) => state.auth)
  const userRole = user.user.userRole

  useEffect(() => {
    console.log(userRole)
    if (user.isLoggedIn && user.user && !allowedRoles.includes(userRole)) {
      toast.error(
        `You don't have access to this page as a ${user.user.userRole}`,
        {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
          transition: Bounce,
        },
      )
    }
  }, [user, allowedRoles])

  if (!user.isLoggedIn) {
    return <Navigate to="/login" />
  }

  if (user.user && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" />
  }

  return <Outlet />
}

export default ProtectedRoute
