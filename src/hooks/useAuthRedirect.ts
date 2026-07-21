// src/hooks/useAuthRedirect.ts
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { useAuthStore } from '@/features/auth/store/useAuthStore'

// Shared by useAuthRedirect (login) and SignupPage (signup) so both auth
// entry points land a share-link visitor back on their job instead of the
// generic role dashboard.
export const getPostAuthRedirectPath = (
  userRole: string | undefined,
  redirectJobId: string | null,
): string => {
  if (redirectJobId && userRole === 'talent') {
    return `/talentDashboard/job/${redirectJobId}?autoApply=true`
  }
  return userRole === 'recruiter'
    ? '/recruiterDashboard/dashboard'
    : userRole === 'talent'
    ? '/talentDashboard'
    : '/adminDashboard/viewcandidates'
}

export const useAuthRedirect = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    if (!isLoggedIn) return
    const redirectJobId = searchParams.get('redirectJobId')
    navigate(getPostAuthRedirectPath(user?.userRole, redirectJobId))
  }, [isLoggedIn])
}
