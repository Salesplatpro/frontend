import React from 'react'
import { Link } from 'react-router-dom'

import { Heading } from '@/components/ui/Typography'

import { ColumnDef, DataTable } from '../../../components'
import { calculateDaysFromCreation } from '../../../utils'
import styles from './RecentApplications.module.scss'

interface ApplicationRow {
  applicantName: string
  prescreeningScore?: number
  cvSimilarityScore?: number
  dateApplied: string
}

interface RecentApplicationsProps {
  infoData: ApplicationRow[]
}

const columns: ColumnDef<ApplicationRow>[] = [
  {
    key: 'name',
    header: 'Applicant name',
    align: 'left',
    render: (row) => row.applicantName,
  },
  {
    key: 'prescreening',
    header: 'Pre screening',
    align: 'center',
    render: (row) => `${row.prescreeningScore ?? 'nill'}%`,
  },
  {
    key: 'cvMatch',
    header: 'CV match',
    align: 'center',
    render: (row) => `${row.cvSimilarityScore ?? 'nill'}%`,
  },
  {
    key: 'dateApplied',
    header: 'Date Applied',
    align: 'center',
    render: (row) => `${calculateDaysFromCreation(row.dateApplied)} days ago`,
  },
]

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
