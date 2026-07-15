import { Alert } from '@mui/material'
import React from 'react'

import { Chart } from '@/components/ui/Chart'
import { Spinner } from '@/components/ui/Spinner'
import { WelcomeModal } from '@/features/auth/components/WelcomeModal'

import { useFetchDashboardQuery } from '../../../redux/api/recruiter'
import ApplicationTracker from './ApplicationTracker'
import styles from './Dashboard.module.scss'
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

  const stats = dashboardData?.data?.data

  const chartData = [
    { label: 'Campaigns', value: stats?.campaignCount ?? 0 },
    { label: 'Completed', value: stats?.completedCampaigns ?? 0 },
    { label: 'Applications', value: stats?.applicationsCount ?? 0 },
    { label: 'Shortlisted', value: stats?.shortlistCount ?? 0 },
  ]

  return (
    <div className={styles.container}>
      <ApplicationTracker infoData={stats} />

      <div className={styles.grid}>
        <Chart type="bar" title="Recruitment Overview" data={chartData} />
        <RecentApplications infoData={stats?.recentApplications} />
      </div>

      <RecentCompilation />
      <WelcomeModal />
    </div>
  )
}

export default Dashboard
