import React from 'react'
import { Link } from 'react-router-dom'

import { Heading } from '@/components/ui/Typography'

import { DataTable } from '../../../components'
import { ApplicationColumnRow, buildApplicationColumns } from './columns'
import styles from './RecentApplications.module.scss'

interface RecentApplicationsProps {
  infoData: ApplicationColumnRow[]
}

const columns = buildApplicationColumns()

const RecentApplications: React.FC<RecentApplicationsProps> = ({
  infoData,
}) => (
  <div>
    <div className={styles.header}>
      <Heading level={4}>Recent Applications</Heading>
      <Link to="allapplications" className={styles.viewAll}>
        View all
      </Link>
    </div>
    <DataTable
      columns={columns}
      data={infoData}
      ariaLabel="Recent applications"
    />
  </div>
)

export default RecentApplications
