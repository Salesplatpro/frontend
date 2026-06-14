import React from 'react'
import { useNavigate } from 'react-router-dom'

import { AuthLayout } from '../components/AuthLayout'
import { SignupForm } from '../components/SignupForm'

const DASHBOARD_PATHS: Record<'talent' | 'recruiter', string> = {
  talent: '/talentDashboard',
  recruiter: '/recruiterDashboard/dashboard',
}

export const SignupPage = () => {
  const navigate = useNavigate()

  const handleSuccess = (
    lastName: string,
    userType: 'talent' | 'recruiter',
  ) => {
    navigate(DASHBOARD_PATHS[userType], {
      state: { showWelcomeModal: true, welcomeName: lastName },
    })
  }

  return (
    <AuthLayout title="Create account" subtitle="Please enter your details.">
      <SignupForm onSuccess={handleSuccess} />
    </AuthLayout>
  )
}
