import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { Spinner } from '@/components/ui/Spinner'
import { useProfile } from '@/features/profile/hooks/useProfile'

const RequireActiveCompany: React.FC = () => {
  const { profile, isLoading } = useProfile()

  if (isLoading) {
    return <Spinner fullPage />
  }

  if (!profile?.activeOrganization) {
    return <Navigate to="/recruiterDashboard/company" replace />
  }

  return <Outlet />
}

export default RequireActiveCompany
