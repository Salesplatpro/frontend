import * as React from 'react'
import { Link } from 'react-router-dom'

import { PageHeaderTitle } from '@/components/layout/PageHeaderTitle'
import { Button } from '@/components/ui/Button'
import { ColumnDef, DataTable } from '@/components/ui/DataTable'

import { useGetRecruiterShortlistQuery } from '../../../redux/api/recruiter'
import { capitalizeEachWord } from '../../../utils/CapitalizeWord'

interface ShortlistedApplication {
  id: string
  jobId: string
  status: string
  createdAt: string
  role?: { name: string } | null
  talent: { firstName: string; lastName: string }
}

export const Shortlist = () => {
  const { data, isLoading } = useGetRecruiterShortlistQuery({})

  const applications: ShortlistedApplication[] = Array.isArray(
    data?.data?.applications,
  )
    ? data.data.applications
    : []

  const columns: ColumnDef<ShortlistedApplication>[] = [
    {
      key: 'role',
      header: 'Role',
      render: (row) => capitalizeEachWord(row.role?.name ?? 'Unknown role'),
      sortAccessor: (row) => row.role?.name,
    },
    {
      key: 'talent',
      header: 'Talent Name',
      render: (row) => `${row.talent.firstName} ${row.talent.lastName}`,
      sortAccessor: (row) => `${row.talent.firstName} ${row.talent.lastName}`,
    },
    {
      key: 'status',
      header: 'Status',
      hideBelow: 768,
      render: (row) => capitalizeEachWord(row.status.replace(/_/g, ' ')),
    },
    {
      key: 'createdAt',
      header: 'Shortlisted On',
      hideBelow: 640,
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
      sortAccessor: (row) => row.createdAt,
    },
    {
      key: 'actions',
      header: '',
      align: 'center',
      render: (row) => (
        <Link to={`/recruiterDashboard/singleJobPost/${row.jobId}/${row.id}`}>
          <Button size="sm">Details</Button>
        </Link>
      ),
    },
  ]

  return (
    <div className="flex flex-col space-y-6">
      <PageHeaderTitle
        title="Shortlist"
        description="View shortlisted talents ready for the next stage"
      />
      <DataTable
        columns={columns}
        data={applications}
        isLoading={isLoading}
        getRowKey={(row) => row.id}
        ariaLabel="Shortlisted applications"
        emptyState={
          <div className="p-4 text-gray-500 text-center">
            No shortlisted applications yet
          </div>
        }
      />
    </div>
  )
}
