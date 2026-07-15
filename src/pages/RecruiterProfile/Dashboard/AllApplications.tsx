import React from 'react'
import { useNavigate } from 'react-router-dom'

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
  const navigate = useNavigate()
  const { data, isLoading, error } = useFetchAllApplicationsQuery({})
  const applications: ApplicationRow[] = data?.data?.applications ?? []

  if (error) return <DisplayError message="Error loading applications" />

  return (
    <div className="lg:w-[90%] mx-auto">
      <div className="mb-4 flex items-center justify-between mt-8">
        <h4 className="text-lg text-[#000] font-semibold">Applications</h4>
      </div>
      <DataTable
        columns={columns}
        data={applications}
        isLoading={isLoading}
        ariaLabel="All applications"
      />
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="px-2 py-2 w-[185px] h-[48px] bg-blue-500 text-white font-raleway text-lg font-medium rounded hover:bg-blue-700 mt-6">
        Back
      </button>
    </div>
  )
}

export default AllApplications
