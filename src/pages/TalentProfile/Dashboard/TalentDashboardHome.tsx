import React from 'react'

import { Card, Chart, ColumnDef, DataTable } from '@/components'
import { StatusBadge } from '@/components/ui/Badge'
import { Heading, Text } from '@/components/ui/Typography'
import { WelcomeModal } from '@/features/auth/components/WelcomeModal'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { getStatusBadge } from '@/pages/RecruiterProfile/getJobStatus'
import { calculateDaysFromCreation } from '@/utils'

import {
  MockApplication,
  mockRecentApplications,
  mockStats,
  mockStatusBreakdown,
} from './mockDashboardData'
import styles from './TalentDashboardHome.module.scss'

const columns: ColumnDef<MockApplication>[] = [
  {
    key: 'jobTitle',
    header: 'Job Title',
    render: (row) => row.jobTitle,
  },
  {
    key: 'status',
    header: 'Status',
    align: 'center',
    render: (row) => {
      const { backgroundColor, color } = getStatusBadge(row.status)
      return (
        <StatusBadge
          status={row.status.replace(/[-_]/g, ' ')}
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
    render: (row) => `${calculateDaysFromCreation(row.dateApplied)} days ago`,
  },
]

const TalentDashboardHome = () => {
  const user = useAuthStore((state) => state.user)

  const tiles = [
    {
      label: 'Applications Submitted',
      value: mockStats.applicationsSubmitted,
    },
    {
      label: 'Profile Completeness',
      value: `${mockStats.profileCompleteness}%`,
    },
    { label: 'Average Assessment Score', value: `${mockStats.averageScore}%` },
    { label: 'Shortlisted', value: mockStats.shortlisted },
  ]

  return (
    <div className={styles.container}>
      <div>
        <Heading level={2}>Welcome back, {user?.firstName}</Heading>
        <Text as="p" color="primary">
          Here&apos;s what&apos;s happening with your job search today.
        </Text>
      </div>

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
          data={mockStatusBreakdown}
        />
        <div>
          <Heading level={4} className={styles.tableTitle}>
            Recent Applications
          </Heading>
          <DataTable
            columns={columns}
            data={mockRecentApplications}
            getRowKey={(row) => row.id}
            ariaLabel="Recent applications"
          />
        </div>
      </div>

      <WelcomeModal />
    </div>
  )
}

export default TalentDashboardHome
