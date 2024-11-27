import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import { RootState } from '../redux/store/store'

export const MainLayout = () => {
  const user = useSelector((state: RootState) => state.auth)
  const userRole = user.user?.userRole
  const token = localStorage.getItem('token')

  if (token && user.isLoggedIn) {
    if (userRole === 'talent') return <Navigate to="/talentDashboard" replace />
    if (userRole === 'recruiter')
      return <Navigate to="/recruiterDashboard" replace />
  }

  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
