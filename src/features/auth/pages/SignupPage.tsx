import React from 'react'
import { useNavigate } from 'react-router-dom'

import { AuthLayout } from '../components/AuthLayout'
import { SignupForm } from '../components/SignupForm'

export const SignupPage = () => {
  const navigate = useNavigate()

  const handleSuccess = (
    lastName: string,
    userType: 'talent' | 'recruiter',
  ) => {
    const dashboardPath =
      userType === 'recruiter'
        ? '/recruiterDashboard/dashboard'
        : '/talentDashboard'
    navigate(dashboardPath, {
      state: { showWelcomeModal: true, welcomeName: lastName },
    })
  }

  return (
    <AuthLayout title="Create account" subtitle="Please enter your details.">
      <SignupForm onSuccess={handleSuccess} />
    </AuthLayout>
  )
}
