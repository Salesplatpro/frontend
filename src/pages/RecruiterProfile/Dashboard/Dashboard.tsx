import { Alert } from '@mui/material'
import React from 'react'

import { Spinner } from '@/components/ui/Spinner'
import { WelcomeModal } from '@/features/auth/components/WelcomeModal'

import { useFetchDashboardQuery } from '../../../redux/api/recruiter'
import ApplicationTracker from './ApplicationTracker'
import RecentApplications from './RecentApplications'
import RecentCompilation from './RecentCompilation'

const Dashboard = () => {
  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    error: dashboardError,
  } = useFetchDashboardQuery({})

  if (dashboardLoading)
    return (
      <>
        <Spinner fullPage />
        <WelcomeModal />
      </>
    )

  if (dashboardError)
    return (
      <>
        <Alert severity="error">Error Fetching Data</Alert>
        <WelcomeModal />
      </>
    )

  return (
    <div className="w-[80%] mx-auto mt-10">
      <div>
        <ApplicationTracker infoData={dashboardData?.data?.data} />
      </div>
      <div className="mt-10">
        <RecentApplications
          infoData={dashboardData?.data?.data?.recentApplications}
        />
      </div>
      <div className="mt-10 h-[300px]">
        <RecentCompilation />
      </div>
      <WelcomeModal />
    </div>
  )
}

export default Dashboard
