import { Alert } from '@mui/material'
import React from 'react'

import Loading from '../../../components/Loading/Loading'
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

  if (dashboardLoading) return <Loading />

  if (dashboardError) return <Alert severity="error">Error Fetching Data</Alert>

  return (
    <div className="w-[80%] mx-auto mt-10">
      <div>
        <ApplicationTracker infoData={dashboardData.data.data} />
      </div>
      <div className="mt-10">
        <RecentApplications
          infoData={dashboardData.data.data.recentApplications}
        />
      </div>
      <div className="mt-10 h-[300px]">
        <RecentCompilation />
      </div>
    </div>
  )
}

export default Dashboard
