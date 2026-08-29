import React from 'react'
import { Navigate, Outlet, useOutletContext } from 'react-router-dom'

import { Spinner } from '@/components/ui/Spinner'
import { useProfile } from '@/features/profile/hooks/useProfile'

interface RequireEmailVerifiedProps {
  redirectTo: string
}

const RequireEmailVerified: React.FC<RequireEmailVerifiedProps> = ({
  redirectTo,
}) => {
  const { profile, isLoading } = useProfile()
  const outletContext = useOutletContext()

  if (isLoading) {
    return <Spinner fullPage />
  }

  if (!profile?.emailVerifiedAt) {
    return <Navigate to={redirectTo} replace />
  }

  return <Outlet context={outletContext} />
}

export default RequireEmailVerified
