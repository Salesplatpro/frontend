import React, { useState } from 'react'

import { useLoginRedirect } from '@/hooks/useLoginRedirect'

import { AuthLayout } from '../components/AuthLayout'
import { ForgotPasswordModal } from '../components/ForgotPasswordModal'
import { LoginForm } from '../components/LoginForm'

export const LoginPage = () => {
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false)

  useLoginRedirect()

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
