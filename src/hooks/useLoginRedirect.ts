// src/hooks/useLoginRedirect.ts
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { RootState } from '../redux/store/store'

export const useLoginRedirect = () => {
  const navigate = useNavigate()
  const { isLoggedIn, user } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (!isLoggedIn) return
    const pendingJob = sessionStorage.getItem('pending_job_application')

    if (pendingJob) {
      sessionStorage.removeItem('pending_job_application')
      navigate(`/talentDashboard/job/${pendingJob}`)
    } else {
      // Default dashboard redirect
      const dashboardPath =
        user?.userRole === 'recruiter'
          ? '/recruiterDashboard'
          : user?.userRole === 'talent'
          ? '/talentDashboard/talentProfile'
          : '/adminDashboard/viewcandidates'
      navigate(dashboardPath)
    }
  }, [isLoggedIn])
}
