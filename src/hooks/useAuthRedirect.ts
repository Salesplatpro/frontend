// src/hooks/useAuthRedirect.ts
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuthStore } from '@/features/auth/store/useAuthStore'

export const useAuthRedirect = () => {
  const navigate = useNavigate()
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    if (!isLoggedIn) return
    const pendingJob = sessionStorage.getItem('pending_job_application')
    const redirectAfterLogin = sessionStorage.getItem('redirectAfterLogin')

    if (pendingJob) {
      sessionStorage.removeItem('pending_job_application')
      navigate(`/talentDashboard/job/${pendingJob}`)
    } else if (redirectAfterLogin) {
      sessionStorage.removeItem('redirectAfterLogin')
      navigate(redirectAfterLogin)
    } else {
      // Default dashboard redirect
      const dashboardPath =
        user?.userRole === 'recruiter'
          ? '/recruiterDashboard/dashboard'
          : user?.userRole === 'talent'
          ? '/talentDashboard'
          : '/adminDashboard/viewcandidates'
      navigate(dashboardPath)
    }
  }, [isLoggedIn])
}
