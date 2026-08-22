import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuthStore } from '@/features/auth/store/useAuthStore'

import { AuthLayout } from '../components/AuthLayout'
import { ForgotPasswordModal } from '../components/ForgotPasswordModal'
import { LoginForm } from '../components/LoginForm'

export const LoginPage = () => {
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false)
  const navigate = useNavigate()
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const userRole = useAuthStore((state) => state.user?.userRole)

  useEffect(() => {
    if (!isLoggedIn) return
    navigate(
      userRole === 'recruiter'
        ? '/recruiterDashboard/dashboard'
        : userRole === 'talent'
        ? '/talentDashboard'
        : '/adminDashboard/viewcandidates',
    )
  }, [isLoggedIn, userRole, navigate])

  return (
    <>
      <AuthLayout
        title="Login your account"
        subtitle="Please enter your details">
        <LoginForm onForgotPassword={() => setIsForgotPasswordOpen(true)} />
      </AuthLayout>

      {isForgotPasswordOpen && (
        <ForgotPasswordModal
          onClose={() => setIsForgotPasswordOpen(false)}
          email=""
        />
      )}
    </>
  )
}
