import React from 'react'

import { BackButton } from '@/components/ui/BackButton'

import { ColumnDef, DataTable, DisplayError } from '../../../components'
import { useFetchAllApplicationsQuery } from '../../../redux/api/recruiter'
import { calculateDaysFromCreation } from '../../../utils'

interface ApplicationRow {
  talent?: {
    firstName: string
    lastName: string
    profile: {
      prescreeningScore?: number
    }
  }
  cvSimilarityScore?: number
  createdAt: string
}

const columns: ColumnDef<ApplicationRow>[] = [
  {
    key: 'name',
    header: 'Applicant name',
    align: 'left',
    render: (row) =>
      `${row.talent?.firstName ?? ''} ${row.talent?.lastName ?? ''}`.trim(),
  },
  {
    key: 'prescreening',
    header: 'Pre screening',
    align: 'center',
    render: (row) => `${row.talent?.profile.prescreeningScore ?? 'nill'}%`,
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
    render: (row) => `${calculateDaysFromCreation(row.createdAt)} days ago`,
  },
]

const AllApplications: React.FC = () => {
  const { data, isLoading, error } = useFetchAllApplicationsQuery({})
  const applications: ApplicationRow[] = data?.data?.applications ?? []

  if (error) return <DisplayError message="Error loading applications" />

  return (
    <div className="lg:w-[90%] mx-auto mt-8">
      <BackButton />
      <div className="mb-4 flex items-center justify-between mt-4">
        <h4 className="text-lg text-[#000] font-semibold">Applications</h4>
      </div>
      <DataTable
        columns={columns}
        data={applications}
        isLoading={isLoading}
        ariaLabel="All applications"
      />
    </div>
  )
}

export default AllApplications
