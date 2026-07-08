import React, { useState } from 'react'

import { useAuthRedirect } from '@/hooks/useAuthRedirect'

import { AuthLayout } from '../components/AuthLayout'
import { ForgotPasswordModal } from '../components/ForgotPasswordModal'
import { LoginForm } from '../components/LoginForm'

export const LoginPage = () => {
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false)

  useAuthRedirect()

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
