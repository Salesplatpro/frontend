import React from 'react'
import { Link } from 'react-router-dom'

import { EmptyState } from '@/components/ui/EmptyState'
import { Heading } from '@/components/ui/Typography'

import { DataTable } from '../../../components'
import { ApplicationColumnRow, buildApplicationColumns } from './columns'
import styles from './RecentApplications.module.scss'

interface RecentApplicationsProps {
  infoData?: ApplicationColumnRow[]
  embed?: boolean
}

const columns = buildApplicationColumns()

const RecentApplications: React.FC<RecentApplicationsProps> = ({
  infoData,
  embed = false,
}) => (
  <div>
    {!embed && (
      <div className={styles.header}>
        <Heading level={4}>Recent Applications</Heading>
        <Link to="allapplications" className={styles.viewAll}>
          View all
        </Link>
      </div>
    )}
    <DataTable
      columns={columns}
      data={infoData ?? []}
      ariaLabel="Recent applications"
      emptyState={
        <EmptyState
          title="No applications yet"
          description="When candidates apply, they will appear here so you can review them quickly."
        />
      }
    />
  </div>
)

export default RecentApplications
