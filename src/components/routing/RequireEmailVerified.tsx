import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { Spinner } from '@/components/ui/Spinner'
import { useProfile } from '@/features/profile/hooks/useProfile'

interface RequireEmailVerifiedProps {
  redirectTo: string
}

const RequireEmailVerified: React.FC<RequireEmailVerifiedProps> = ({
  redirectTo,
}) => {
  const { profile, isLoading } = useProfile()

  if (isLoading) {
    return <Spinner fullPage />
  }

  if (!profile?.emailVerifiedAt) {
    return <Navigate to={redirectTo} replace />
  }

  return <Outlet />
}

export default RequireEmailVerified
