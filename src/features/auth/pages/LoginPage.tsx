import React, { useState } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'

import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { destinationAfterAuth } from '@/features/auth/utils/dashboardPath'

import { AuthLayout } from '../components/AuthLayout'
import { ForgotPasswordModal } from '../components/ForgotPasswordModal'
import { LoginForm } from '../components/LoginForm'

export const LoginPage = () => {
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false)
  const [searchParams] = useSearchParams()
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const userRole = useAuthStore((state) => state.user?.userRole)
  const nextPath = searchParams.get('next')

  if (isLoggedIn) {
    const destination = destinationAfterAuth(userRole, nextPath)
    return <Navigate to={destination} replace />
  }

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
