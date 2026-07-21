import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { getPostAuthRedirectPath } from '@/hooks/useAuthRedirect'

import { AuthLayout } from '../components/AuthLayout'
import { SignupForm } from '../components/SignupForm'

export const SignupPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const handleSuccess = (
    lastName: string,
    userType: 'talent' | 'recruiter',
  ) => {
    const redirectJobId = searchParams.get('redirectJobId')
    navigate(getPostAuthRedirectPath(userType, redirectJobId), {
      state: { showWelcomeModal: true, welcomeName: lastName },
    })
  }

  return (
    <AuthLayout title="Create account" subtitle="Please enter your details.">
      <SignupForm onSuccess={handleSuccess} />
    </AuthLayout>
  )
}
