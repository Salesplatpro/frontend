import React from 'react'

import { Card, Chart, ColumnDef, DataTable } from '@/components'
import { StatusBadge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { Heading, Text } from '@/components/ui/Typography'
import { WelcomeModal } from '@/features/auth/components/WelcomeModal'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { EmailVerificationPanel } from '@/features/email-verification/components/EmailVerificationPanel'
import { useProfile } from '@/features/profile/hooks/useProfile'
import { getStatusBadge } from '@/pages/RecruiterProfile/getJobStatus'
import { useAllJobApplicationsQuery } from '@/redux/api/talent'
import { calculateDaysFromCreation } from '@/utils'
import { AllJobTypes } from '@/utils/types'

import styles from './TalentDashboardHome.module.scss'

const RECENT_APPLICATIONS_LIMIT = 5

const formatStatusLabel = (status: string) =>
  status.replace(/[-_]/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())

const columns: ColumnDef<AllJobTypes>[] = [
  {
    key: 'jobTitle',
    header: 'Job Title',
    render: (row) => row.job?.role?.name ?? 'Unknown',
  },
  {
    key: 'status',
    header: 'Status',
    align: 'center',
    render: (row) => {
      const status = row.status ?? 'unknown'
      const { backgroundColor, color } = getStatusBadge(status)
      return (
        <StatusBadge
          status={formatStatusLabel(status)}
          backgroundColor={backgroundColor}
          color={color}
        />
      )
    },
  },
  {
    key: 'dateApplied',
    header: 'Date Applied',
    align: 'center',
    render: (row) => `${calculateDaysFromCreation(row.createdAt)} days ago`,
  },
]

const TalentDashboardHome = () => {
  const user = useAuthStore((state) => state.user)
  const { profile, isLoading: isProfileLoading } = useProfile()
  const isVerified = !!profile?.emailVerifiedAt
  const { data, isLoading } = useAllJobApplicationsQuery(
    {},
    { skip: !isVerified },
  )

  const applications: AllJobTypes[] = data?.data?.applications ?? []

  const shortlisted = applications.filter(
    (app) => app.status === 'shortlisted',
  ).length

  const statusCounts = applications.reduce<Record<string, number>>(
    (acc, app) => {
      const status = app.status ?? 'unknown'
      acc[status] = (acc[status] ?? 0) + 1
      return acc
    },
    {},
  )

  const statusBreakdown = Object.entries(statusCounts).map(
    ([status, value]) => ({
      label: formatStatusLabel(status),
      value,
    }),
  )

  const recentApplications = applications.slice(0, RECENT_APPLICATIONS_LIMIT)

  const tiles = [
    { label: 'Applications Submitted', value: applications.length },
    {
      label: 'Profile Completeness',
      value: `${profile?.profileCompletion?.percentage ?? 0}%`,
    },
    {
      label: 'Assessment Score',
      value:
        profile?.prescreeningScore != null
          ? `${profile.prescreeningScore}%`
          : '—',
    },
    { label: 'Shortlisted', value: shortlisted },
  ]

  if (isProfileLoading) {
    return <Spinner fullPage />
  }

  return (
    <div className={styles.container}>
      {isVerified ? (
        <>
          <div>
            <Heading level={2}>Welcome back, {user?.firstName}</Heading>
            <Text as="p" color="primary">
              Here&apos;s what&apos;s happening with your job search today.
            </Text>
          </div>

          {isLoading ? (
            <Spinner fullPage />
          ) : (
            <>
              <div className={styles.statsRow}>
                {tiles.map((tile) => (
                  <Card key={tile.label} className={styles.statTile}>
                    <Text size="fs-sm" color="secondary">
                      {tile.label}
                    </Text>
                    <Text size="fs-2xl" weight="bolder">
                      {tile.value}
                    </Text>
                  </Card>
                ))}
              </div>

              <div className={styles.grid}>
                <Chart
                  type="pie"
                  title="Applications by Status"
                  data={statusBreakdown}
                />
                <div>
                  <Heading level={4} className={styles.tableTitle}>
                    Recent Applications
                  </Heading>
                  <DataTable
                    columns={columns}
                    data={recentApplications}
                    getRowKey={(row) => row.id ?? ''}
                    ariaLabel="Recent applications"
                    emptyState={
                      <div className="py-8 text-center text-grey-500">
                        You haven&apos;t applied to any jobs yet.
                      </div>
                    }
                  />
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <EmailVerificationPanel />
      )}

      <WelcomeModal />
    </div>
  )
}

export default TalentDashboardHome
