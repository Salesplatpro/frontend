import React from 'react'
import { Link } from 'react-router-dom'

import { ColumnDef, DataTable } from '../../../components'
import { calculateDaysFromCreation } from '../../../utils'

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
    <div className="mb-4 flex items-center justify-between">
      <h4 className="text-lg text-[#000] font-semibold">Recent Applications</h4>
      <Link to="allapplications" className="text-base text-[primary]">
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
