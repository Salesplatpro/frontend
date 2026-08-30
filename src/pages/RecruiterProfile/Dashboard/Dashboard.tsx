import { Alert } from '@mui/material'
import React from 'react'

import { Chart } from '@/components/ui/Chart'
import { Spinner } from '@/components/ui/Spinner'
import { WelcomeModal } from '@/features/auth/components/WelcomeModal'
import { EmailVerificationPanel } from '@/features/email-verification/components/EmailVerificationPanel'
import { EmailVerifiedModal } from '@/features/email-verification/components/EmailVerifiedModal'
import { useProfile } from '@/features/profile/hooks/useProfile'

import { useFetchDashboardQuery } from '../../../redux/api/recruiter'
import ActiveCompanyCard from './ActiveCompanyCard'
import ApplicationTracker from './ApplicationTracker'
import styles from './Dashboard.module.scss'
import RecentApplications from './RecentApplications'
import RecentCompilation from './RecentCompilation'

const Dashboard = () => {
  const { profile, isLoading: isProfileLoading } = useProfile()
  const isVerified = !!profile?.emailVerifiedAt
  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    error: dashboardError,
  } = useFetchDashboardQuery({}, { skip: !isVerified })

  if (isProfileLoading) {
    return <Spinner fullPage />
  }

  if (!isVerified) {
    return (
      <div className={styles.container}>
        <EmailVerificationPanel />
        <WelcomeModal />
        <EmailVerifiedModal />
      </div>
    )
  }

  if (dashboardLoading)
    return (
      <>
        <Spinner fullPage />
        <WelcomeModal />
        <EmailVerifiedModal />
      </>
    )

  if (dashboardError)
    return (
      <>
        <Alert severity="error">Error Fetching Data</Alert>
        <WelcomeModal />
        <EmailVerifiedModal />
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
      <ActiveCompanyCard organization={profile?.activeOrganization} />

      <ApplicationTracker infoData={stats} />

      <div className={styles.grid}>
        <Chart type="bar" title="Recruitment Overview" data={chartData} />
        <RecentApplications infoData={stats?.recentApplications} />
      </div>

      <RecentCompilation />
      <WelcomeModal />
      <EmailVerifiedModal />
    </div>
  )
}

export default Dashboard
