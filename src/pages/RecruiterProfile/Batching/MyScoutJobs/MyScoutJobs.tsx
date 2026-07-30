import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components'
import { PageHeaderTitle } from '@/components/layout/PageHeaderTitle'
import { ColumnDef, DataTable } from '@/components/ui/DataTable'
import { EmptyState } from '@/components/ui/EmptyState'
import { useGetScoutJobsQuery } from '@/redux/api/recruiter'

import { Pagination } from '../../MyJobPosts/Pagination'

interface ScoutJobRow {
  id: string
  name: string
  role?: { name: string } | null
  createdAt: string
}

const ROWS_PER_PAGE = 10

export const MyScoutJobs = () => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const { data, isLoading, isError } = useGetScoutJobsQuery({
    limit: 100,
    offset: 0,
  })

  const scoutJobs: ScoutJobRow[] = Array.isArray(data?.data?.scoutJobs)
    ? data.data.scoutJobs
    : []
  const startIndex = (page - 1) * ROWS_PER_PAGE
  const paginatedJobs = scoutJobs.slice(startIndex, startIndex + ROWS_PER_PAGE)

  const columns: ColumnDef<ScoutJobRow>[] = [
    {
      key: 'name',
      header: 'Campaign Name',
      render: (row) => row.name,
      sortAccessor: (row) => row.name,
    },
    {
      key: 'role',
      header: 'Role',
      render: (row) => row.role?.name ?? '—',
    },
    {
      key: 'createdAt',
      header: 'Created',
      hideBelow: 640,
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
      sortAccessor: (row) => row.createdAt,
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (row) => (
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              navigate(`/recruiterDashboard/scout/history/${row.id}`)
            }>
            View
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/recruiterDashboard/scout/${row.id}`)}>
            Scout
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="py-4 space-y-6">
      <div className="flex justify-between items-center">
        <PageHeaderTitle
          title="My Scout Jobs"
          description="Revisit past scouting campaigns or start a new one"
        />
        <Button
          variant="primary"
          onClick={() => navigate('/recruiterDashboard/scout/create-jd')}>
          Create New
        </Button>
      </div>

      {isError ? (
        <EmptyState
          title="Couldn't load your scout jobs"
          description="Something went wrong fetching your scouting history. Please try again."
        />
      ) : !isLoading && scoutJobs.length === 0 ? (
        <EmptyState
          title="No scout jobs yet"
          description="Create a scout job to start sourcing and scoring talent."
          action={
            <Button
              variant="primary"
              onClick={() => navigate('/recruiterDashboard/scout/create-jd')}>
              Create New
            </Button>
          }
        />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={paginatedJobs}
            isLoading={isLoading}
            getRowKey={(row) => row.id}
          />
          <Pagination
            totalItems={scoutJobs.length}
            itemsPerPage={ROWS_PER_PAGE}
            currentPage={page}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  )
}
